const mongoose = require('mongoose');

const clustersSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    city: { type: String, required: true },
    type: {type: String, required: true},
    workTime: {
        from: {
            type: String,
            validate: {
                validator: function (v) {
                    if (!v) {
                        return true;
                    }
                    return /([01]?[0-9]|2[0-3]):[0-5][0-9]/.test(v);
                },
                message: (props) => `${props.value} is not valid time!`,
            },
            required: true
        },
        to: {
            type: String,
            validate: {
                validator: function (v) {
                    if (!v) {
                        return true;
                    }
                    return /([01]?[0-9]|2[0-3]):[0-5][0-9]/.test(v);
                },
                message: (props) => `${props.value} is not valid time!`,
            },
            required: true
        },
    },
});

const Clusters = mongoose.model('Clusters', clustersSchema);
module.exports = Clusters;