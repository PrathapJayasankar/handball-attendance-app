const mongoose = require('mongoose');
const PlayerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    jerseyNumber: { type: Number, unique: true, required: true },
    position: { type: String, default: 'Unassigned' },
    profileColor: { type: String, default: '#007bff' }, // Default blue color
    dateAdded: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Player', PlayerSchema);