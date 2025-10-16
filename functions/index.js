const functions = require("firebase-functions");
const express = require("express");
const app = express();

// your routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/players', require('./routes/players'));

exports.api = functions.https.onRequest(app);
