const cheerio = require('cheerio');
const axios = require('axios');
var mongoose = require('mongoose');

// Values for fetching data
var from = "PLN";
var to = "USD";

// Adress for scraping
const url = `https://www.xe.com/currencyconverter/convert/?Amount=1&From=` + from + `&To=` + to;

// MongoDB settings
const mongoUri = 'mongodb://localhost';
const XECurrencyDB = '/XECurrencyDB';

// MongoDB Connection
mongoose.connect(mongoUri + XECurrencyDB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(':: Mongo Connected ::');
    })
    .catch(err => {
        console.error('!! Mongo connection error !! :', err.stack);
        process.exit(1);
    });


//Schema
var CurrencyModel = require('./models/Currency');


const fetchData = (from, to) => {
    axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data);
            let title = $("form");
            const value = title.children('div').next().children('div').children('p').next().text();
            const tempArr = value.split(" ");
            console.log(tempArr[0]);

            var query = { 'from_to': from + '_' + to };
            CurrencyModel.findOne(query, function (err, dbItem) {
                if (dbItem) {
                    dbItem.value = tempArr[0];
                    dbItem.last_update = Date.now();
                    dbItem.save()
                        .then(dbItem => {
                            console.log('currency value updated...');
                        })
                        .catch(err => {
                            console.log('error while putting updated data...');
                        });
                }
                else {
                    var newDbItem = new CurrencyModel({ 'from_to': from + '_' + to, value: tempArr[0] });
                    newDbItem.save()
                        .then(newDbItem => {
                            console.log('currency value created...');
                        })
                        .catch(err => {
                            console.log('error while saving new data...');
                        });
                }
            });

        });
}


fetchData(from, to);


