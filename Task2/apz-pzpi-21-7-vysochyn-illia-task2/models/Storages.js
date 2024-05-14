const mongoose = require('mongoose');

const storagesSchema = new mongoose.Schema({
    number: { type: String, required: true},
    isOpened: { type: Boolean, required: true },
    price: { type: Number, required: true},
    clusterId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Clusters' },
});

const Storages = mongoose.model('Storages', storagesSchema);
module.exports = Storages;