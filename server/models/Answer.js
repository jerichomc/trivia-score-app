const mongoose = require('mongoose');

//this schema defines on answer to a question
const answerSchema = new mongoose.Schema({
    teamName: {
        type: String, // the name of the team that answered
        required: true, // this field is required
        trim: true // remove whitespace from the beginning and end
    }, 
    round: {
        type: Number, // the round number of the question
        required: true // this field is required
    }, 
    questionNumber: {
        type: Number, // the question number in the round
        required: true, // this field is required
        min: 1,
        max: 11
    },
    answerText: {
        type: String,
        required: false, // this field is not required
        default: '' // default value is an empty string
    },
    pointsAwarded: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Answer', answerSchema); // export the model so it can be used in other files