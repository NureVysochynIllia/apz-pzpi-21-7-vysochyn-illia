const Storages = require("../models/Storages");
const Bookings = require("../models/Bookings");
const calculateHourDifference = require("../services/dateService");
const Clusters = require("../models/Clusters");
const {translateCluster} = require("../services/translateService");

class staffController {
    async changePrice(request, response) {
        try {
            const {price, clusterId, storageId} = request.body;
            console.log(!price, !clusterId);
            if (!price || !clusterId) {
                return response.status(400).json({message: "Some fields are empty."});
            }
            if (!storageId) {
                await Storages.updateMany({clusterId}, {price});
            } else {
                await Storages.findByIdAndUpdate(storageId, {price});
            }
            return response.status(201).json({message: 'Price changed successfully.'});
        } catch (error) {
            return response.status(500).json({message: "Failed to change price.", error: error.message});
        }
    }

    async getStatistics(request, response) {
        try {
            const language = request.headers.lang;
            const now = new Date();
            const threeMonthAgo = new Date(now);
            threeMonthAgo.setMonth(now.getMonth() - 3);
            const bookings = await Bookings.find({
                'rentalTime.from': {$gte: threeMonthAgo},
            });
            const statistics = {};
            for (const booking of bookings) {
                const storageId = booking.storageId.toString();
                const hours = calculateHourDifference(booking.rentalTime.from, booking.rentalTime.to);
                const earnings = booking.price;

                if (!statistics[storageId]) {
                    statistics[storageId] = {rentedHours: 0, earnings: 0};
                }

                statistics[storageId].rentedHours += hours;
                statistics[storageId].earnings += earnings;
            }
            let clusters = await Clusters.find();
            clusters = await Promise.all(clusters.map(cluster=>translateCluster(cluster,language)));
            let clusterResp = []
            for (let i = 0; i < clusters.length; i++) {
                const storages = await Storages.find({clusterId: clusters[i]._id})
                clusterResp.push({
                    _id: clusters[i]._id,
                    name: clusters[i].name,
                    city: clusters[i].city,
                    type: clusters[i].type,
                    storages: storages.map(storage=>{
                        const storageId = storage._id.toString();
                        if (statistics[storageId]) {
                            storage.statistics = statistics[storageId];
                        } else {
                            storage.statistics = { rentedHours: 0, earnings: 0 };
                        }
                        return {
                            statistics:storage.statistics,
                            number: storage.number,
                        }
                    })
                });
            }
            return response.status(200).json({clusters:clusterResp});
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Failed to get statistics.", error: error.message});
        }
    }
}

module.exports = new staffController();