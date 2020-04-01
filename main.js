const express = require('express');
const app = express();
const genPort = require('./libs/gen-port');
const request = require('request');

const port = genPort.getFreePort();
const host = '127.0.0.1';
const url = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';

let productLastID = 0;

const products = [
    {
        "id" : ++productLastID,
        "name" : "apple",
        "units" : "kg",
        "quantity" : 10,
        "price" : 20
    },
    {
        "id" : ++productLastID,
        "name" : "orange",
        "units" : "kg",
        "quantity" : 30,
        "price" : 40
    }
]

// MIDDLEWARE 

app.use(express.json());

// GET

app.get('/', (req, res) => {
    res.send('WELCOME To SHOP');
});

app.get('/api/v1/products/', (req, res) => {
    res.send(products);
});

app.get('/api/v1/products/:id',(req, res) => {
    const product = products.find(product => {
        if (product.id === +req.params.id) {
            return true;
        }
    });

    if (!product) return res.status(404).send('product with this id was not find');

    res.send(product);
});

app.get('/api/v1/products/:id/usd', (req, res) => {
    
    const product = products.find(product => {
        if (product.id === +req.params.id) {
            return true;
        }
    });

    if (!product) return res.status(404).send('product with this id was not find');

    request(url, (_res, _req, body) => {
        //console.log(body);
        const USD = JSON.parse(body).find(currency => {
            if (currency.ccy === 'USD') return true;
        });
        //console.log(USD);
        //res.send((product.price / USD.sale) +'-price in usd');

        const price = (product.price / USD.sale) +'-price in usd';
        res.send(price);
    });    
});

// POST

app.post('/api/v1/products/', (req, res) => {
    console.log(req.body);

    const {name, units, quantity, price} = req.body;

    const product = {
        id: ++productLastID,
        name: name,
        units: units,
        quantity: quantity,
        price: price
    };

    products.push(product);
    
    res.status(200).send('product was added succesfully');
});

// PUT

app.put('/api/v1/products/:id', (req, res) => {
    const product = products.find(product => {
        if (product.id === +req.params.id) {
            return true;
        }
    });

    if (!product) return res.status(404).send('product with this id was not find');

    const {name, units, quantity, price} = req.body;

    product.name = name;
    product.units = units;
    product.quantity = quantity;
    product.price = price;

    res.status(200).send('product was updated succesfully');
});

// DELETE

app.delete('/api/v1/products/:id', (req, res) => {
    const product = products.find(product => {
        if (product.id === +req.params.id) {
            return true;
        }
    });

    if (!product) return res.status(404).send('product with this id was not find');

    const index = products.indexOf(product);

    products.splice(index,1);

    res.status(200).send('product was removed succesfully');
});


app.listen(port, host, () => {
    console.log(`start listening on port ${port}`);
})