const mongoose = require('mongoose');

const WeatherSchema = mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    lon: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    clouds: {
        type: String,
        required: false
    },
    temp: {
        type: Number,
        required: true
    },
    visibility: {
        type: Number,
        required: false
    },
    wind: {
        type: Number,
        required: false
    },
    id: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Weather', WeatherSchema);