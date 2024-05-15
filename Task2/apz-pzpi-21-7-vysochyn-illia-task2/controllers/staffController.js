const Storages = require("../models/Storages");
const Bookings = require("../models/Bookings");
const calculateHourDifference = require("../services/dateService");
const Clusters = require("../models/Clusters");

class staffController {
    async changePrice(request, response) {
        try {
            const {price, clusterId, storageId} = request.body;
            console.log(!price, !clusterId);
            if (!price || !clusterId) {
                return response.status(400).json({message: "Error: Some fields are empty"});
            }
            if (!storageId) {
                await Storages.updateMany({clusterId}, {price});
            } else {
                await Storages.findByIdAndUpdate(storageId, {price});
            }
            return response.status(201).json({message: 'Price changed successfully.'});
        } catch (error) {
            return response.status(500).json({message: "Failed to change price", error: error.message});
        }
    }

    async getStatistics(request, response) {
        try {
            const now = new Date();
            const thirtyDaysAgo = new Date(now);
            thirtyDaysAgo.setDate(now.getDate() - 30);
            const bookings = await Bookings.find({
                'rentalTime.from': {$gte: thirtyDaysAgo},
                'rentalTime.to': {$lte: now}
            });
            const statistics = {};
            for (const booking of bookings) {
                const storageId = booking.storageId.toString();
                const hours = calculateHourDifference(booking.rentalTime.from, booking.rentalTime.to);
                const earnings = booking.price * hours;

                if (!statistics[storageId]) {
                    statistics[storageId] = {rentedHours: 0, earnings: 0};
                }

                statistics[storageId].rentedHours += hours;
                statistics[storageId].earnings += earnings;
            }
            const clusters = await Clusters.find().populate('storages');

            for (const cluster of clusters) {
                cluster.storages.forEach(storage => {
                    const storageId = storage._id.toString();
                    if (statistics[storageId]) {
                        storage.statistics = statistics[storageId];
                    } else {
                        storage.statistics = { rentedHours: 0, earnings: 0 };
                    }
                });
            }
            return response.status(200).json({clusters});
        } catch (error) {
            return response.status(500).json({message: "Failed to get statistics", error: error.message});
        }
    }
}

module.exports = new staffController();