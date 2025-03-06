require('dotenv').config();
const express = require('express');
const movieRoutes = require('./routes/movies');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: 'http://localhost:3001', // Allow requests from frontend
    methods: ['GET', 'POST'], // Allowed methods
    allowedHeaders: ['Content-Type'], // Allowed headers
}));

app.use(express.json());
app.set('maxHttpHeaderSize', 16384);
app.use('/movies', movieRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));