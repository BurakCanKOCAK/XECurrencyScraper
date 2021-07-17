const cheerio = require('cheerio');
const axios = require('axios');
var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var morgan = require('morgan')
var cors = require('cors');
require('dotenv').config();

// ===================================================
// Const values

// Values for fetching data
const currencyData = require('./CurrencyData.json');

// ===================================================

//server configuration
var currencyAPIPath = '/api';

// Routes and Backend Functionalities
var currencyAPIRoutes = require('./routes/CurrencyRoutes');

// App Instance
var app = express();
app.use(cors());
app.use(morgan('tiny'));
app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());

// Attach Routes
app.use(currencyAPIPath, currencyAPIRoutes);

// Execute App
app.listen(process.env.SERVER_PORT, () => {
    console.log(':: Server is running on -> ' + 'http://localhost:' + process.env.SERVER_PORT + ' ::');
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_DB_CONN, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(':: Mongo Connected ::');
    })
    .catch(err => {
        console.error('!! Mongo connection error !! :', err.stack);
        process.exit(1);
    });

// Functions
const fetchAllData = async () => {
    let countCur = process.env.COUNT_CUR;
    for (let i = 0; i < countCur; i++) {
        for (let j = 0; j < countCur; j++) {
            if (i != j) {
                const from = currencyData[i].currency;
                const to = currencyData[j].currency;
                const val = await scrapeData(await urlBuilder(from, to));
                axios.patch('http://localhost:8485/api/', {
                    "from_to": from + "_" + to,
                    "value": await val
                }).catch(err => console.log(err));
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    }

}

const scrapeData = async (scrapeUrl) => {
    const response = await axios.get(scrapeUrl)
    const $ = cheerio.load(await response.data);
    const title = await $("form");
    const value = await title.children('div').next().children('div').children('p').next().text();
    const valueArr = await value.split(" ");
    return valueArr[0];

}

const urlBuilder = async (from, to) => {
    return `https://www.xe.com/currencyconverter/convert/?Amount=1&From=` + from + `&To=` + to;
}


function periodicFetchService() {
    fetchAllData();
    console.log("============== Data Fetched =====================");
    setTimeout(periodicFetchService, 1800000);
}

periodicFetchService();


