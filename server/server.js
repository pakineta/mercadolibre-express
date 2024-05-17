const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/items', async (req, res) => {
    try {
        const { q } = req.query; // Obtener el parámetro 'search' de la URL
        const response = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${q}&limit=4`);
        
        const data = {
            categories: response.data["filters"].find(filter => filter["id"] === "category")["values"].map(value => value["path_from_root"].map(path => path["name"])),
            items: response.data["results"].map(result=> ({
                id: result["id"],
                title: result["title"],
                price: {
                    currency: result["currency_id"],
                    amount: Math.floor(result["price"]),
                    decimals: Math.floor((result["price"]-Math.floor(result["price"]))*100),
                },
                picture: result["thumbnail"],
                condition: result["attributes"].find(attribute=> attribute["id"] === "ITEM_CONDITION")["value_name"],
                free_shipping: result["shipping"]["free_shipping"],
                seller: result["seller"]["nickname"]
            }))
        }
        res.json(data);
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const itemResponse = (await axios.get(`https://api.mercadolibre.com/items/${id}`))["data"];
        const descriptionResponse = (await axios.get(`https://api.mercadolibre.com/items/${id}/description`))["data"];
        const sellerResponse = (await axios.get(`https://api.mercadolibre.com/users/${itemResponse["seller_id"]}`))["data"];
        console.log(sellerResponse);
        const data = {
            id: itemResponse["id"],
            title: itemResponse["title"],
            price: {
                currency: itemResponse["currency_id"],
                amount: Math.floor(itemResponse["price"]),
                decimals: Math.floor((itemResponse["price"]-Math.floor(itemResponse["price"]))*100),
            },
            picture: itemResponse["thumbnail"],
            condition: itemResponse["attributes"].find(attribute=> attribute["id"] === "ITEM_CONDITION")["value_name"],
            free_shipping: itemResponse["shipping"]["free_shipping"],
            seller: sellerResponse["nickname"],
            description: descriptionResponse["plain_text"]
        }
        res.json(data);
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.listen(5000, () => {
    console.log('Server running on port 5000');
});
