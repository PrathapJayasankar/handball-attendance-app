const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Player = require('../models/Player');

// @route    GET api/players
// @desc     Get all players
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
        const players = await Player.find().sort({ jerseyNumber: 1 });
        res.json(players);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/players
// @desc     Add a new player
// @access   Private (only coach/captain can add)
router.post('/', auth, async (req, res) => {
    // Optional: check user role: if (req.user.role !== 'coach' && req.user.role !== 'captain') ...
    const { name, jerseyNumber, position, profileColor } = req.body;
    try {
        let player = await Player.findOne({ jerseyNumber });
        if (player) {
            return res.status(400).json({ msg: 'Player with that jersey number already exists' });
        }

        const newPlayer = new Player({
            name,
            jerseyNumber,
            position,
            profileColor
        });
        const savedPlayer = await newPlayer.save();
        res.json(savedPlayer);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/players/:id/color
// @desc     Update player profile color
// @access   Private (only coach/captain can change)
router.put('/:id/color', auth, async (req, res) => {
    // Optional: check user role
    const { profileColor } = req.body;
    try {
        let player = await Player.findById(req.params.id);
        if (!player) return res.status(404).json({ msg: 'Player not found' });

        player.profileColor = profileColor;
        await player.save();
        res.json(player);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/players/:id
// @desc     Delete a player
// @access   Private (only coach/captain)
router.delete('/:id', auth, async (req, res) => {
    // Optional: check user role
    try {
        let player = await Player.findById(req.params.id);
        if (!player) return res.status(404).json({ msg: 'Player not found' });

        await Player.deleteOne({ _id: req.params.id }); // Use deleteOne
        res.json({ msg: 'Player removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;