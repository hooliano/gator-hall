const router = require('express').Router();
const prisma = require('../db.js');

router.get('/', async (req, res) => {
    try {
        const dorms = await prisma.dorm.findMany();
        res.json(dorms);
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

router.get('/:id/reviews', async (req, res) => {
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

module.exports = router


