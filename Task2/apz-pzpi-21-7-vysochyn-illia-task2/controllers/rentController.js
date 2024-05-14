const Storages = require("../models/Storages");
const Bookings = require("../models/Bookings");
const Clusters = require("../models/Clusters");
const Volumes = require("../models/Volumes");
const getDistance = require("../services/gpsService");
const Users = require("../models/Users");
const {calculateHourDifference} = require("../services/dateService");

class rentController {
    async getAvailableClusters(request, response){
        try{
            const { height, width, length, city, priceFrom, priceTo, type, name, from, to } = request.query;
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
            if(!to || !from) {
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

            let clusterQuery = { storages: { $in: availableStorageIds } };
            if (city) clusterQuery.city = city;
            if (type) clusterQuery.type = type;
            if (name) clusterQuery.name = name;

            const availableClusters = await Clusters.find(clusterQuery).populate('storage');
            return response.status(200).json({ availableClusters});
        } catch (error) {
            return response.status(500).json({ message: "Failed to fetch available clusters.", error: error.message });
        }
    }
    async getNearestCluster(request, response) {
        try {
            const { latitude, longitude } = request.query;
            if (!latitude || !longitude) {
                return response.status(400).json({ message: "Error: Latitude or longitude is missing." });
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
            return response.status(500).json({message: "Failed to find nearest cluster", error: error.message});
        }
    }
    async rentStorage(request, response) {
        try {
            const { storageId, from, to } = request.body;
            if (!storageId || !from || !to) {
                return response.status(400).json({ message: "Error: Some fields are empty" });
            }
            const user = await Users.findOne({username:request.user.username});
            const storage = await Storages.findById(storageId);
            if(!storage){
                return response.status(404).json({ message: "Error: Storage not found" });
            }
            const time = calculateHourDifference(from,to);
            if(user.balance<storage.price*time){
                return response.status(404).json({ message: "Error: Not enough money on balance" });
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
            return response.status(500).json({message: "Failed to X", error: error.message});
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
            return response.status(500).json({message: "Failed to find bookings", error: error.message});
        }
    }
    async getAllBookings(request, response) {
        try {
            const user = await Users.findOne({username:request.user.username});
            const bookings = await Bookings.find({
                userId: user._id,
            })
            return response.status(201).json({bookings});
        } catch (error) {
            return response.status(500).json({message: "Failed to find bookings", error: error.message});
        }
    }
    async openStorage(request, response) {
        try {
            const { bookingId } = request.body;
            if (!bookingId) {
                return response.status(400).json({ message: "Error: Booking ID is required" });
            }
            const user = await Users.findOne({username:request.user.username});
            const booking = await Bookings.findById(bookingId)
            if (!booking || booking.userId!==user._id) {
                return response.status(404).json({ message: "Booking not found" });
            }
            const now = new Date();
            if (now < new Date(booking.rentalTime.from) || now > new Date(booking.rentalTime.to)) {
                return response.status(400).json({ message: "Error: Booking has not started yet or has already ended" });
            }
            const storage = await Storages.findById(booking.storageId);
            if (!storage) {
                return response.status(404).json({ message: "Storage not found" });
            }

            storage.isOpened = !storage.isOpened;

            await storage.save();

            const ws = new WebSocket('ваш_адрес_веб-сокету');
            ws.on('open', function open() {
                ws.send(JSON.stringify({ storageId: storageId }));
                ws.close();
            });

            return response.status(201).json({ message: 'Storage status changed successfully.' });
        } catch (error) {
            return response.status(500).json({ message: "Failed to change storage status", error: error.message });
        }
    }
}
module.exports = new rentController();