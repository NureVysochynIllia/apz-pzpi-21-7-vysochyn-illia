const mongoose = require('mongoose');

const volumesSchema = new mongoose.Schema({
    height: { type: Number, required: true},
    width: { type: Number, required: true },
    length: { type: Number, required: true },
    unit: { type: String, required: true },
    storageId: { type: mongoose.Schema.Types.ObjectId, unique:true, required: true, ref: 'Storages' },
});

const Volumes = mongoose.model('Volumes', volumesSchema);
module.exports = Volumes;