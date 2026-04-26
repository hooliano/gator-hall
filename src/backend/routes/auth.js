const prisma = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router();

router.post('/register', async (req, res) => {
    try {
        const display_name = req.body.display_name;
        const user_email = req.body.email;
        const password = req.body.password;

        // Ensure all parameters are filled
        if (!display_name || !user_email || !password) {
            return res.status(400).json({ error: 'Must fill all required fields.' });
        }

        // Ensure a ufl.edu email was used to register
        if (!user_email.endsWith('@ufl.edu')) {
            return res.status(400).json({ error: 'Must use a UFL email.' });
        }

        // Check if email is a duplicate
        const duplicate_email = await prisma.user.findUnique({
            where: { email: user_email },
        });

        if (duplicate_email) {
            return res.status(400).json({ error: 'Email already registered with an account.' });
        }

        // Hash the password
        const hashed_password = await bcrypt.hash(password, 10);

        // Create user account
        const created_user = await prisma.user.create({
            data: {
                displayName: display_name,
                email: user_email,
                password: hashed_password,
            },
        });

        // Create and send JWT token
        const auth_token = jwt.sign({ email: user_email, userId: created_user.id }, process.env.JWT_SECRET, { expiresIn: '7 days' });

        res.status(201).json({ token: auth_token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const login_email = req.body.email;
        const login_password = req.body.password;

        // Search database for user with matching email
        const attempted_user = await prisma.user.findUnique({
            where: { email: login_email },
        });

        // Verifies account was found and password matches
        if (!attempted_user) {
            return res.status(404).json({ error: 'Account not found.' });
        }

        const matched_passwords = await bcrypt.compare(login_password, attempted_user.password);
        if (!matched_passwords) {
            return res.status(401).json({ error: 'Password is incorrect.' });
        }

        const auth_token = jwt.sign({ email: login_email, userId: attempted_user.id }, process.env.JWT_SECRET, { expiresIn: '7 days' });
        res.status(200).json({ token: auth_token });
    }
    catch (error) {
        res.status(500).json({ error: 'Something went wrong.' });
    }
});

module.exports = router