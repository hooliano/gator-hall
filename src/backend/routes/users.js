const router = require('express').Router();
const prisma = require('../db.js');
const authMiddleware = require('../middleware/auth.js');

router.get('/:id/reviews', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        const attempted_user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!attempted_user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const user_reviews = await prisma.review.findMany({
            where: { userId: userId },

            include: {
                dorm: {
                    select: { name: true }
                }
            }
        });

        res.json({
            user: attempted_user,
            reviews: user_reviews
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

module.exports = router