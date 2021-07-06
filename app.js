const cheerio = require('cheerio');
const axios = require('axios');
const url = `https://www.xe.com/currencyconverter/convert/?Amount=1&From=EUR&To=PLN`;


const fetchData = () => {
    axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data);
            let title = $("form");
            const value = title.children('div').next().children('div').children('p').next().text();
            const tempArr = value.split(" ");
            console.log(tempArr[0]);
        })
        .catch(err => {
            console.log(err);
        });
}


fetchData();


