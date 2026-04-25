const express = require('express');
const app = express();

app.use(express.json());

const dorms = [
    { id: 1, name: 'Hume Hall' },
    { id: 2, name: 'Beaty Towers' },
    { id: 3, name: 'Jennings Hall' },
];

app.get('/', (req, res) => {
    res.json({ message: 'GatorHall API is running!' });
});

app.get('/dorms', (req, res) => {
    res.json(dorms);
});

app.get('/dorms/:id/reviews', (req, res) => {
    const dormID = req.params.id;
    res.json({ dormID, reviews: [] });
});

app.listen(3000, () => {
    console.log('Server running on port 3000!');
});