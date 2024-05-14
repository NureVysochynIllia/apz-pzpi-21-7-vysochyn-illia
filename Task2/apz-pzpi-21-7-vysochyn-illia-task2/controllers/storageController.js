const Storages = require('../models/Storages');
const Volumes = require('../models/Volumes');
const Clusters = require("../models/Clusters");

class storageController {
    async addStorage(request, response) {
        try {
            const { number, isOpened, price, clusterId, height, width, length, unit } = request.body;
            if (!number || !isOpened || !price || !clusterId || !height || !width || !length || !unit) {
                return response.status(400).json({ message: "Error: Some fields are empty" });
            }
            const newStorage = new Storages({number, isOpened, price, clusterId});
            await newStorage.save();

            const newVolume = new Volumes({ height, width, length, unit, storageId: newStorage._id });
            await newVolume.save();

            return response.status(201).json({message: 'Storage created successfully.'});
        } catch (error) {
            return response.status(500).json({message: "Failed to create storage", error: error.message});
        }
    }

    async editStorage(request, response) {
        try {
            const {id} = request.params;
            const {number, isOpened, price, clusterId} = request.body;

            const storage = await Storages.findById(id);
            if (!storage) {
                return response.status(404).json({message: "Storage not found."});
            }
            if (number) storage.number = number;
            if (isOpened !== undefined) storage.isOpened = isOpened;
            if (price) storage.price = price;
            if (clusterId) storage.clusterId = clusterId;
            await storage.save();

            const volume = await Volumes.findOne({ storageId: storage._id });
            if (!volume) {
                return response.status(404).json({ message: "Volume not found." });
            }
            const { height, width, length, unit } = request.body;
            if (height) volume.height = height;
            if (width) volume.width = width;
            if (length) volume.length = length;
            if (unit) volume.unit = unit;

            await volume.save();
            return response.status(200).json({message: "Storage updated successfully."});
        } catch (error) {
            return response.status(500).json({message: "Failed to update storage.", error: error.message});
        }
    }

    async deleteStorage(request, response) {
        try {
            const {id} = request.params;
            await Storages.deleteOne({ _id: id })
            await Volumes.deleteOne({ storageId: id });
            return response.status(200).json({message: "Storage deleted successfully."});
        } catch (error) {
            return response.status(500).json({message: "Failed to delete storage.", error: error.message});
        }
    }
    async getStorages(request, response){
        try {
            const storages = await Storages.find();
            return response.status(200).json(storages);
        } catch (error) {
            return response.status(500).json({ message: "Failed to delete cluster.", error: error.message });
        }
    }
}

module.exports = new storageController();