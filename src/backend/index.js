require('dotenv').config();
const express = require('express');
const app = express();

const prisma = require('./db');

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'GatorHall API is running!' });
});

app.get('/dorms', async (req, res) => {
    const dorms = await prisma.dorm.findMany();
    res.json(dorms);
});

app.get('/dorms/:id/reviews', async (req, res) => {
    try {
        // Fetch the requested Dorm by ID
        const dormID = req.params.id;

        // Ensure the requested dorm is real.
        const dormFound = await prisma.dorm.findUnique({
            where: { id: parseInt(dormID) },
        });

        // Return 404 if dorm requested is not in database
        if (!dormFound) {
            return res.status(404).json({ error: 'Dorm not found.' });
        }
        // Fetch reviews for the requested dorm
        const reviews = await prisma.review.findMany({
            where: { dormId: parseInt(dormID) },
        });

        // Return the reviews for dorm
        res.json(reviews);
    }
    catch (error) {
        // Return 500 error code
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000!');
});