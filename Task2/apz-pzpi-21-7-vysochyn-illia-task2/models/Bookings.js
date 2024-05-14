const mongoose = require('mongoose');

const bookingsSchema = new mongoose.Schema({
    rentalTime: {
        from:{
            type:Date,
            required:true,
        },
        to:{
            type:Date,
            required:true,
        }
    },
    price:{ type: Number, required: true },
    storageId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Storages' },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
});

const Bookings = mongoose.model('Bookings', bookingsSchema);
module.exports = Bookings;