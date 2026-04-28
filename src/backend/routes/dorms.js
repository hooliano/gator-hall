const router = require('express').Router();
const prisma = require('../db.js');
const authMiddleware = require('../middleware/auth.js');

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

            include: {
                user: {
                    select: { displayName: true }
                }
            }
        });

        // Return the reviews for dorm
        res.json(reviews);
    }
    catch (error) {
        // Return 500 error code
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

router.post('/:id/reviews', authMiddleware, async (req, res) => {
    try {
        const review_body = req.body.review_body;
        const rating = parseFloat(req.body.rating);
        const userId = req.user.userId;
        const dormId = parseInt(req.params.id);

        // Makes sure review content is all valid
        if (!review_body) {
            return res.status(400).json({ error: 'Missing body text of review.' });
        }

        if (isNaN(rating)) {
            return res.status(400).json({ error: 'Rating must be a float.' });
        }

        if (rating < 0 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 0-5.' });
        }

        if (rating % 0.5 != 0) {
            return res.status(400).json({ error: 'Rating must be in increments of 0.5.' });
        }

        // Checks if user already posted a review for this dorm
        const prev_review = await prisma.review.findFirst({
            where: { dormId: dormId, userId: userId }
        });

        if (prev_review) {
            return res.status(409).json({ error: 'User already reviewed this dorm.' });
        }

        const new_review = await prisma.review.create({
            data: {
                body: review_body,
                rating: rating,
                userId: userId,
                dormId: dormId,
            },
            include: {
                user: true
            }
        });

        res.status(201).json({ review: new_review });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

router.delete('/:id/reviews/:reviewId', authMiddleware, async (req, res) => {
    try {
        const attempting_userId = req.user.userId;
        const reviewId = parseInt(req.params.reviewId);

        const review_to_del = await prisma.review.findFirst({
            where: { id: reviewId }
        });

        if (!review_to_del) {
            return res.status(404).json({ error: 'Review not found.' })
        }

        if (review_to_del.userId !== attempting_userId) {
            return res.status(403).json({ error: 'Requested user does not have permission.' });
        }

        const deletedReview = await prisma.review.delete({
            where: { id: reviewId }
        });

        res.status(200).json({ review: deletedReview });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

router.patch('/:id/reviews/:reviewId', authMiddleware, async (req, res) => {
    try {
        const updated_body = req.body.review_body;
        const updated_rating = parseFloat(req.body.rating);
        const reviewId = parseInt(req.params.reviewId);
        const attempted_user_id = req.user.userId;

        const data = {};
        let changes_made = false;


        // Fetch the review and ensure proper permissions
        const review_to_upd = await prisma.review.findUnique({
            where: { id: reviewId }
        });
        if (!review_to_upd) {
            return res.status(404).json({ error: 'Review not found.' });
        }
        if (review_to_upd.userId !== attempted_user_id) {
            return res.status(403).json({ error: 'Requested user does not have permission.' });
        }


        // Ensure valid parameters and that changes are made
        if (req.body.review_body === undefined && req.body.rating === undefined) {
            return res.status(400).json({ error: 'Something must be updated.' });
        }

        if (req.body.review_body !== undefined) {
            data.body = updated_body;
            if (data.body !== review_to_upd.body) { changes_made = true; }
        }

        if (req.body.rating !== undefined) {
            if (isNaN(updated_rating)) {
                return res.status(400).json({ error: 'Rating must be a float.' });
            }

            if (updated_rating < 0 || updated_rating > 5) {
                return res.status(400).json({ error: 'Rating must be between 0-5.' });
            }

            if (updated_rating % 0.5 != 0) {
                return res.status(400).json({ error: 'Rating must be in increments of 0.5.' });
            }

            data.rating = updated_rating;
            if (data.rating !== review_to_upd.rating) { changes_made = true; }
        }

        if (!changes_made) {
            return res.status(400).json({ error: 'Something must be updated.' });
        }

        const updated_review = await prisma.review.update({
            where: { id: reviewId },

            data
        })

        res.status(200).json({ review: updated_review });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

module.exports = router


