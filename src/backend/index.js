require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://sprightly-mousse-2d751b.netlify.app'
    ],
    credentials: true
}));

app.get('/', (req, res) => {
    res.json({ message: 'GatorHall API is running!' });
});

app.use('/dorms', require('./routes/dorms.js'));
app.use('/auth', require('./routes/auth.js'));
app.use('/users', require('./routes/users.js'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});