const Storages = require('../models/Storages');
const Volumes = require('../models/Volumes');
const {getOtherMeasurement} = require("../services/sizeService");

class storageController {
    async addStorage(request, response) {
        try {
            const { number, price, clusterId, height, width, length, unit } = request.body;
            if (!number ||  !price || !clusterId || !height || !width || !length || !unit) {
                return response.status(400).json({ message: "Some fields are empty" });
            }
            const newStorage = new Storages({number, isOpened:true, price, clusterId});
            await newStorage.save();

            const newVolume = new Volumes({ height, width, length, unit, storageId: newStorage._id });
            await newVolume.save();

            return response.status(201).json({message: 'Storage created successfully.'});
        } catch (error) {
            return response.status(500).json({message: "Failed to create storage.", error: error.message});
        }
    }

    async editStorage(request, response) {
        try {
            const {id} = request.params;
            const {number, price, clusterId} = request.body;

            const storage = await Storages.findById(id);
            if (!storage) {
                return response.status(404).json({message: "Storage not found."});
            }
            if (number) storage.number = number;
            storage.isOpened = true;
            if (price) storage.price = price;
            if (clusterId) storage.clusterId = clusterId;
            await storage.save();
            return response.status(200).json({message: "Storage updated successfully."});
        } catch (error) {
            return response.status(500).json({message: "Failed to update storage.", error: error.message});
        }
    }

    async deleteStorage(request, response) {
        try {
            const {id} = request.params;
            await Storages.deleteOne({ _id: id })
            await Volumes.deleteMany({ storageId: id });
            return response.status(200).json({message: "Storage deleted successfully."});
        } catch (error) {
            return response.status(500).json({message: "Failed to delete storage.", error: error.message});
        }
    }
    async getStorages(request, response){
        try {
            const storages = await Storages.find();
            const storagesResp = [];
            for (let i = 0; i < storages.length; i++) {
                const volumeInfo = await Volumes.find({ storageId: storages[i]._id });
                storagesResp.push({
                    _id: storages[i]._id,
                    number:storages[i].number,
                    isOpened: storages[i].isOpened,
                    price:storages[i].price,
                    clusterId:storages[i].clusterId,
                    volumes:volumeInfo.map(volumeInfo=>{return {
                        height:volumeInfo.height,
                        width:volumeInfo.width,
                        length:volumeInfo.length,
                        unit:volumeInfo.unit
                    }}),
                });
            }
            return response.status(200).json(storagesResp);
        } catch (error) {
            return response.status(500).json({ message: "Failed to get cluster.", error: error.message });
        }
    }
    async addVolume(request,response){
        try{
            const {unit, storageId} = request.body;
            if(!unit || !storageId) {
                return response.status(400).json({ message: "Some fields are missing." });}
            const volume = await Volumes.findOne({ storageId: storageId, unit: unit });
            if (volume) {
                return response.status(400).json({ message: "Volume already exist found." });
            }
            const volumeSim = await Volumes.findOne({ storageId: storageId });
            const {height, width, length} = getOtherMeasurement(volumeSim, unit)
            const newVolume = new Volumes({ height, width, length, unit, storageId });
            await newVolume.save();
            return response.status(200).json({message: "Volume created successfully.", newVolume});
        } catch (error) {
            return response.status(500).json({ message: "Failed to add volume.", error: error.message });
        }
    }
    async editVolume(request,response){
        try{
            const {unit, storageId} = request.body;
            const volume = await Volumes.findOne({ storageId: storageId, unit: unit });
            if (!volume) {
                return response.status(404).json({ message: "Volume not found." });
            }
            const { height, width, length} = request.body;
            if (height) volume.height = height;
            if (width) volume.width = width;
            if (length) volume.length = length;
            await volume.save();
            const volumes = await Volumes.find({ storageId: storageId});
            for (const volumeUndone of volumes) {
                const {height, width, length} = getOtherMeasurement(volume, volumeUndone.unit)
                volumeUndone.height = height;
                volumeUndone.length = length;
                volumeUndone.width = width;
                volumeUndone.save()
            }


            return response.status(200).json({message: "Volume updated successfully."});
        } catch (error) {
            return response.status(500).json({ message: "Failed to edit volume.", error: error.message });
        }
    }
}

module.exports = new storageController();