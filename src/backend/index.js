require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'GatorHall API is running!' });
});

app.use('/dorms', require('./routes/dorms.js'));
app.use('/auth', require('./routes/auth.js'));

app.listen(3000, () => {
    console.log('Server running on port 3000!');
});