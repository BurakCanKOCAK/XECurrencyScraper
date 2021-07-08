//Currency.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//schema
var Currency = new Schema({
    from_to: {
        type: String,
        unique: true,
        index: true,
        required: true
    },
    value: {
        type: String
    },
    last_update: {
        type: Date,
        default: Date.now
    },

}, {
    collection: 'XECurrencyValues'
});

module.exports = mongoose.model('CurrencyModel', Currency);