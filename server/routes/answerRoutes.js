const express = require('express');
const router = express.Router();
const Answer = require('../models/Answer');
const Progress = require('../models/Progress');

//POST /api/answer - submit 11 answers at once
router.post('/', async (req, res) => {
  const { teamName, round, answers } = req.body;

  if (!teamName || !round || !Array.isArray(answers) || answers.length !== 11) {
    return res.status(400).json({ error: 'Missing teamName, round, or 11 answers' });
  }

  try {
    //  get current progress for the team
    const existingProgress = await Progress.findOne({ teamName });

    // Block if they're repeating a round or trying to go backwards
    if (existingProgress && round <= existingProgress.currentRound) {
      return res.status(400).json({ error: `You've already submitted Round ${round}. Please wait for the host to start the next round.
` });
    }

    // Block if they try to skip ahead more than 1 round
    if (existingProgress && round > existingProgress.currentRound + 1) {
      return res.status(400).json({ error: `You cannot skip ahead to round ${round}. Please submit round ${existingProgress.currentRound + 1} first.` });
    }

    // Create 11 Answer documents
    const answerDocs = answers.map((ans, index) => ({
      teamName,
      round,
      questionNumber: index + 1,
      answerText: ans,
    }));

    await Answer.insertMany(answerDocs);

    // Update or create team progress
    const progress = await Progress.findOneAndUpdate(
      { teamName },
      {
        teamName,
        currentRound: round,
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Answers submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while submitting answers' });
  }
});

//GET /api/answers?round=1 - get all answers for a round
router.get('/', async (req, res) => {
    const { round } = req.query;

    if (!round) {
        return res.status(400).json({ error: 'Round Number is required'})
    }

    try {
        //get all answers for the specified round
        const answers = await Answer.find({ round: Number(round) });

        //group answers by team name
        const grouped = {};

        answers.forEach(answer => {
            const team = answer.teamName;
            if (!grouped[team]) {
                grouped[team] = [];
            }
            grouped[team].push({
                questionNumber: answer.questionNumber,
                answerText: answer.answerText,
                pointsAwarded: answer.pointsAwarded
            });
        });

        //sort answers for each team by question number
        Object.keys(grouped).forEach(team => {
            grouped[team].sort((a, b) => a.questionNumber - b.questionNumber);
        });
        res.json(grouped);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error while fetching answers' });
    }
});

module.exports = router;