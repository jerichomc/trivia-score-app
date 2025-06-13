const mongoose = require('mongoose');

//Tracks the teams round progression and total score
const ProgressSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true, // this field is required
        unique: true, // each team should have a unique progress record
        trim: true // remove whitespace from the beginning and end
    },
    currentRound: {
        type: Number,
        default: 1, // start at round 1
    }, 
    totalScore: {
        type: Number,
        default: 0 // start with a score of 0
    }
});

module.exports = mongoose.model('Progress', ProgressSchema); // export the model so it can be used in other files