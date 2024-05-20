const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/items', async (req, res) => {
    try {
        const { q } = req.query;
        const response = await axios.get(`https://api.mercadolibre.com/sites/MLA/search?q=${q}&limit=4`);

        const filters = response.data["filters"] || [];
        const categoryFilter = filters.find(filter => filter["id"] === "category");

        const data = {
            categories: categoryFilter
                ? categoryFilter["values"].map(value => value["path_from_root"].map(path => path["name"]))
                : [],
            items: (response.data["results"] || []).map(result => ({
                id: result["id"],
                title: result["title"],
                price: {
                    currency: result["currency_id"],
                    amount: Math.floor(result["price"]),
                    decimals: Math.floor((result["price"] - Math.floor(result["price"])) * 100),
                },
                picture: result["thumbnail"],
                condition: (result["attributes"] || []).find(attribute => attribute["id"] === "ITEM_CONDITION")?.["value_name"] || 'Unknown',
                free_shipping: result["shipping"]?.["free_shipping"] || false,
                seller: result["seller"]?.["nickname"] || 'Unknown'
            }))
        };
        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/api/items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const itemResponse = (await axios.get(`https://api.mercadolibre.com/items/${id}`)).data;
        const descriptionResponse = (await axios.get(`https://api.mercadolibre.com/items/${id}/description`)).data;
        const sellerResponse = (await axios.get(`https://api.mercadolibre.com/users/${itemResponse["seller_id"]}`)).data;
        const categoryResponse = (await axios.get(`https://api.mercadolibre.com/categories/${itemResponse["category_id"]}`)).data;
        console.log(categoryResponse);

        const data = {
            id: itemResponse["id"],
            title: itemResponse["title"],
            price: {
                currency: itemResponse["currency_id"],
                amount: Math.floor(itemResponse["price"]),
                decimals: Math.floor((itemResponse["price"] - Math.floor(itemResponse["price"])) * 100),
            },
            picture: itemResponse["thumbnail"],
            condition: (itemResponse["attributes"] || []).find(attribute => attribute["id"] === "ITEM_CONDITION")?.["value_name"] || 'Unknown',
            free_shipping: itemResponse["shipping"]?.["free_shipping"] || false,
            seller: sellerResponse["nickname"],
            description: descriptionResponse["plain_text"] || 'No description available',
            categories: categoryResponse['path_from_root'].map(path => path['name'])
        };
        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});

