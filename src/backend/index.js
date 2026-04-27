require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'GatorHall API is running!' });
});

app.use('/dorms', require('./routes/dorms.js'));
app.use('/auth', require('./routes/auth.js'));
app.use('/users', require('./routes/users.js'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});