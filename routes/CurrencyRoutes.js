var express = require('express');
var app = express();
var router = express.Router();

//Schema
var CurrencyModel = require('../models/Currency');

// Get All Currency Records
router.route('/all').get(function (req, res) {
    CurrencyModel.find({}, function (err, item) {
        if (item) {
            console.log(item);
        } else {
            console.log(err);
        }
    });
});

// Get Specific Currency Value
router.route('/:from_to').get(function (req, res) {
    var query = { 'from_to': req.params.from_to.toUpperCase() };
    CurrencyModel.findOne(query, function (err, curr) {
        if (curr) {
            res.status(200).json(curr);
        } else {
            res.status(404).send("Not found");
        }
    });
});

// PATCH - Create or Update Specific ToDo
router.route('/').patch(function (req, res) {
    newCurrObj = CurrencyModel(req.body);
    console.log(newCurrObj.from_to);
    console.log(newCurrObj.value);
    var query = { 'from_to': newCurrObj.from_to };
    CurrencyModel.findOne(query, function (err, dbItem) {
        if (dbItem) {
            dbItem.value = newCurrObj.value;
            dbItem.last_update = Date.now();
            dbItem.save()
                .then(dbItem => {
                    console.log('currency value updated...');
                    res.status(200);
                })
                .catch(err => {
                    console.log('error while putting updated data...');
                    res.status(500);
                });
        }
        else {
            newCurrObj.save()
                .then(newCurrObj => {
                    console.log('currency value created...');
                    res.status(201);
                })
                .catch(err => {
                    console.log('error while saving new data...');
                    res.status(500);
                });
        }
    });
});


module.exports = router;