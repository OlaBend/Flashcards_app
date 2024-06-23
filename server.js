const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
require("dotenv").config();
const Deck = require("./src/components/deckModel.js");


const app = express();
const PORT = process.env.PORT || 5000;
const mongodbURL = process.env.MONGODB_URL;

app.use(cors());
app.use(express.json());

mongoose
  .connect(mongodbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Cannot connect to MongoDB", err);
  });

app.get("/decks", async (req, res) => {
  const decks = await Deck.find();
  res.send(decks);
});

app.post("/decks", async (req, res) => {
  const deck = new Deck(req.body);
  await deck.save();
  res.send(deck);
});

app.put("/decks/:id", async (req, res) => {

  try {
    if(req.body._id) {
      return res.status(400).send('Cannot update field _id');
    }
    const deck = await Deck.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    
    if(!deck) {
      return res.status(404).send('Deck not found');
    }

    res.send(deck);
  } catch (error) {
    res.status(500).send('Error updating deck:', error.message);
  }
});

app.put("/decks/:id/name", async (req, res) => {

  try {
    const deck = await Deck.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { 'data.name': req.body.name } },
      { new: true, runValidators: true }
    );

    if(!deck) {
      return res.status(404).send('Deck not found');
    }
    res.send(deck);
  } catch (error) {
    res.status(500).send('Error updating deck name:', error.message);
  }
});

app.post("/decks/:id/cards", async (req, res) => {
  try {
    const deck = await Deck.findOneAndUpdate(
      { _id: req.params.id },
      { $push: {content: req.body} },
      { new: true, runValidators: true }
    );

    if (!deck) {
      return res.status(404).send('Deck not found');
    }

    res.send(deck);
  } catch (error) {
    console.error('Error adding card:', error);
    res.status(500).send({error: 'Error adding card'});
  }
});

app.delete("/decks/:id", async (req, res) => {

  try {
    const deck = await Deck.findOneAndDelete({ _id: req.params.id });

    if (!deck) {
      return res.status(404).send('Deck not found');
    }
    res.send({ message: "Deck deleted" });
  } catch (error) {
    res.status(500).send('Error deleting deck:', error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
