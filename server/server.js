const express = require('express'); // Importing the express module
const mongoose = require('mongoose'); // Importing mongoose for MongoDB interaction
const cors = require('cors'); // Importing CORS middleware for handling cross-origin requests
require('dotenv').config(); // Loading environment variables from .env file
const answerRoutes = require('./routes/answerRoutes'); // Importing answer routes

const app = express(); // Creating an instance of an Express application

//middleware
app.use(cors()); // Using CORS middleware to allow cross-origin requests
app.use(express.json()); // Middleware to parse JSON request bodies

//sample route
app.get('/', (req, res) => {
    res.send('API is running');
});

//use answer routes
app.use('/api/answer', answerRoutes); // Mounting the answer routes at /api/answer

//connect to MongoDB
mongoose.connect(process.env.MONGO_URI)

.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

//start server
const PORT = process.env.PORT || 5000; // Setting the port to either the environment variable or default to 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Logging the server start message
});

