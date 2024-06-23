const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  front: String,
  back: String,
});

const DeckSchema = new mongoose.Schema({
  data: {name: String},
  content: [CardSchema],
});

module.exports = mongoose.model('Deck', DeckSchema);