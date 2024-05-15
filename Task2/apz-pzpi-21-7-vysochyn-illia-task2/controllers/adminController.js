const Users = require("../models/Users");
const path = require("path");
const fs = require("fs");
const Bookings = require("../models/Bookings");
const Clusters = require("../models/Clusters");
const Storages = require("../models/Storages");
const Volumes = require("../models/Volumes");
const rootFolderPath = path.join(__dirname, '../backups/');
class adminController {
    async getUsers(request, response) {
        try {
            const users = await Users.find();
            const usersResp = users.map(user=>{return {username:user.username, role:user.role, email:user.email, _id:user._id}});
            return response.status(201).json({users: usersResp});
        } catch (error) {
            return response.status(500).json({message: "Failed to get users", error: error.message});
        }
    }
    async changeRole(request, response) {
        try {
            const {userId, role} = request.body;
            if (!userId || !role || (role!=='admin' && role!=='staff' && role!=='user')) {
                return response.status(400).json({message: "Error: Some fields are empty"});
            }
            await Users.findByIdAndUpdate(userId,{role:role});
            return response.status(201).json({message: 'Role changed successfully.'});
        } catch (error) {
            return response.status(500).json({message: "Failed to change role", error: error.message});
        }
    }
    async importDatabase(request, response) {
        try {
            const backups = fs.readdirSync(rootFolderPath);
            const sortedBackups = backups
                .sort((a, b) => {
                    const aDate = a.slice(0,13)
                    const bDate = b.slice(0,13)
                    return bDate - aDate;
                });
            const rawData = JSON.parse(fs.readFileSync(rootFolderPath+sortedBackups[0]))
            await Users.deleteMany({});
            await Bookings.deleteMany({});
            await Clusters.deleteMany({});
            await Storages.deleteMany({});
            await Volumes.deleteMany({});
            for(const data of rawData.users) {
                const newUser = new Users(data)
                await newUser.save();
            }
            for(const data of rawData.bookings) {
                const newBooking = new Bookings(data)
                await newBooking.save();
            }
            for(const data of rawData.clusters) {
                const newCluster = new Clusters(data)
                await newCluster.save();
            }
            for(const data of rawData.storages) {
                const newStorage = new Storages(data)
                await newStorage.save();
            }
            for(const data of rawData.volumes) {
                const newVolume = new Volumes(data)
                await newVolume.save();
            }
            return response.status(201).json({message: 'Database imported successfully.'});
        } catch (error) {
            console.log(error)
            return response.status(500).json({message: "Failed to import database", error: error.message});
        }
    }
    async exportDatabase(request, response) {
        try {
            const bookings = await Bookings.find();
            const clusters = await Clusters.find();
            const storages = await Storages.find();
            const volumes = await Volumes.find();
            const users = await Users.find();
            const exportData = {
                bookings,
                clusters,
                storages,
                volumes,
                users
            }
            const currentDate = new Date();
            const filePath = path.join(rootFolderPath, currentDate.getTime()+'.json');
            fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
            return response.status(200).json({message: 'Data exported successfully.', filePath});
        } catch (error) {
            return response.status(500).json({message: "Failed to export database", error: error.message});
        }
    }
}
module.exports = new adminController();