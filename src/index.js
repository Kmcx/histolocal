require('dotenv').config();
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Default Route
app.get('/', (req, res) => {
    res.send('Histolocal Backend API is running!');
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
