const Storages = require("../models/Storages");
const Bookings = require("../models/Bookings");
const Clusters = require("../models/Clusters");
const Volumes = require("../models/Volumes");
const WebSocket = require('ws');
const getDistance = require("../services/gpsService");
const Users = require("../models/Users");
const calculateHourDifference = require("../services/dateService");
const {translateCluster} = require("../services/translateService");

class rentController {
    async getAvailableClusters(request, response){
        try{
            const { height, width, length, city, priceFrom, priceTo, type, name, from, to } = request.query;
            const language = request.headers.lang;
            let storageQuery = {};
            if (height || width || length) {
                const volumeQuery = {};
                if (height) volumeQuery.height = height;
                if (width) volumeQuery.width = width;
                if (length) volumeQuery.length = length;
                const volumes = await Volumes.find(volumeQuery);
                const storageIds = volumes.map(volume => volume.storageId);
                storageQuery._id = { $in: storageIds };
            }

            if (priceFrom || priceTo) {
                storageQuery.price = {};
                if (priceFrom) storageQuery.price.$gte = priceFrom;
                if (priceTo) storageQuery.price.$lte = priceTo;
            }

            const freeStorages = await Storages.find(storageQuery);
            const freeStorageIds = freeStorages.map(storage => storage._id);
            let availableStorageIds;
            if(to && from) {
                const bookingQuery = {
                    storageId: {$in: freeStorageIds},
                    $or: [
                        {'rentalTime.from': {$gte: new Date(to)}},
                        {'rentalTime.to': {$lte: new Date(from)}}
                    ]
                };

                const bookings = await Bookings.find(bookingQuery);
                const bookedStorageIds = bookings.map(booking => booking.storageId);
                availableStorageIds = freeStorageIds.filter(id => !bookedStorageIds.includes(id));
            }
            else{
                availableStorageIds = freeStorageIds;
            }
            const availableStorages = await Storages.find({_id: { $in: availableStorageIds } })
            let clusterQuery = { _id: { $in: availableStorages.map(storage => storage.clusterId) } };
            if (city) clusterQuery.city = city;
            if (type) clusterQuery.type = type;
            if (name) clusterQuery.name = name;
            const availableClusters = await Clusters.find(clusterQuery);
            const clusterResp = await Promise.all(availableClusters.map(cluster=> translateCluster(cluster, language)))
            return response.status(200).json({availableClusters:clusterResp});
        } catch (error) {
            console.log(error)
            return response.status(500).json({ message: "Failed to fetch available clusters.", error: error.message });
        }
    }
    async getNearestCluster(request, response) {
        try {
            const { latitude, longitude } = request.query;
            if (!latitude || !longitude) {
                return response.status(400).json({ message: "Latitude or longitude is missing." });
            }
            const clusters = await Clusters.find();
            clusters.sort((a, b) => {
                const distA = getDistance(latitude, longitude, a.location.coordinates[1], a.location.coordinates[0]);
                const distB = getDistance(latitude, longitude, b.location.coordinates[1], b.location.coordinates[0]);
                return distA - distB;
            });
            const nearestCluster = clusters[0];
            return response.status(200).json({ nearestCluster });
        } catch (error) {
            return response.status(500).json({message: "Failed to find nearest cluster.", error: error.message});
        }
    }
    async rentStorage(request, response) {
        try {
            const { storageId, from, to } = request.body;
            if (!storageId || !from || !to) {
                return response.status(400).json({ message: "Some fields are empty." });
            }
            const user = await Users.findOne({username:request.user.username});
            const storage = await Storages.findById(storageId);
            if(!storage){
                return response.status(404).json({ message: "Storage not found." });
            }
            const time = calculateHourDifference(from,to);
            if(user.balance<storage.price*time){
                return response.status(404).json({ message: "Not enough money on balance. You need: "+(storage.price*time-user.balance) });
            }
            const existingBookings = await Bookings.find({ storageId: storageId });
            for (const booking of existingBookings) {
                const bookingFrom = new Date(booking.rentalTime.from);
                const bookingTo = new Date(booking.rentalTime.to);
                const newFrom = new Date(from);
                const newTo = new Date(to);

                if ((newFrom >= bookingFrom && newFrom < bookingTo) || (newTo > bookingFrom && newTo <= bookingTo)) {
                    return response.status(400).json({ message: "booking conflicts with existing booking." });
                }
            }
            user.balance = user.balance - storage.price*time;
            await user.save();
            const newBooking = new Bookings({
                rentalTime: { from, to },
                storageId,
                userId:user._id,
                price:storage.price*time
            });
            await newBooking.save();

            return response.status(201).json({ message: 'Storage rented successfully.' });
        } catch (error) {
            return response.status(500).json({message: "Failed to rent storage.", error: error.message});
        }
    }
    async getActiveBookings(request, response) {
        try {
            const user = await Users.findOne({username:request.user.username});
            const now = new Date();
            const bookings = await Bookings.find({
                userId: user._id,
                'rentalTime.to': { $gte: now },
                'rentalTime.from':{ $lte: now }
            }).populate('storageId')
            return response.status(201).json({bookings});
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Failed to find active bookings.", error: error.message});
        }
    }
    async getAllBookings(request, response) {
        try {
            const user = await Users.findOne({username:request.user.username});
            const bookings = await Bookings.find({
                userId: user._id,
            }).populate({
                path: 'storageId',
                select: '-isOpened'
            })
            return response.status(201).json({bookings});
        } catch (error) {
            return response.status(500).json({message: "Failed to find bookings.", error: error.message});
        }
    }
    async isStorageBooked(request, response) {
        try{
            const {id} = request.params;
            const bookings = await Bookings.find({storageId: id})
            for(const booking of bookings) {
                if((await booking).rentalTime.to > new Date()){
                    return response.status(201).json(true);
                }
            }
            return response.status(201).json(false);
        }catch (error) {
            return response.status(500).json({ message: "Failed to find storage status", error: error.message });
        }
    }
    async openStorage(request, response) {
        try {
            const { bookingId } = request.body;
            if (!bookingId) {
                return response.status(400).json({ message: "Error: booking ID is required." });
            }
            const user = await Users.findOne({username:request.user.username});
            const booking = await Bookings.findById(bookingId)
            if (!booking || !booking.userId.equals(user._id)) {
                return response.status(404).json({ message: "booking not found." });
            }
            const now = new Date();
            if (now < new Date(booking.rentalTime.from) || now > new Date(booking.rentalTime.to)) {
                return response.status(400).json({ message: "booking has not started yet or has already ended." });
            }
            const storage = await Storages.findById(booking.storageId);
            if (!storage) {
                return response.status(404).json({ message: "Storage not found" });
            }

            storage.isOpened = !storage.isOpened;

            await storage.save();

            const ws = new WebSocket('ws://localhost:5000');
            ws.on('open', function open() {
                ws.send(JSON.stringify({ storageId: storage._id }));
                ws.close();
            });

            return response.status(201).json({ message: 'Storage status changed successfully.' });
        } catch (error) {
            return response.status(500).json({ message: "Failed to change storage status", error: error.message });
        }
    }
}
module.exports = new rentController();