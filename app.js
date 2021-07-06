const cheerio = require('cheerio');
const axios = require('axios');
const url = `https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=PLN`;


const fetchData = () => {
    axios.get(url)
        .then(response => {
            let $ = cheerio.load(response.data);
            let title = $("form");
            title.children().each(function (i, item) {
                if (i == 1) {
                    item.children().each(function (j, el) {
                        if (j == 1) {
                            console.log(el.text());
                        }
                    });
                }
            });
            //console.log(divTag.text());
        })
        .catch(err => {
            console.log(err);
        });
}


fetchData();


