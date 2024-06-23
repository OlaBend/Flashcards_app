import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import SideBar from "./containers/SideBar";
import "./App.css";
import axios from "axios";

function App() {
  const [userDecks, setUserDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [addQuestionsView, setAddQuestionsView] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [cardSide, setCardSide] = useState("front");
  const [knowItCards, setKnowItCards] = useState([]);
  const [dontKnowItCards, setDontKnowItCards] = useState([]);
  const [deck, setDeck]= useState({});

  // fetches decks from the server
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('http://localhost:5000/decks');
      setUserDecks(result.data);
    }
    fetchData();
  }, []);

  // persists decks to API
  useEffect(() => {
    if (userDecks.length > 0) {
      userDecks.forEach(async (deck) => {
        const { _id, ...updateData} = deck;
        await axios.put(`http://localhost:5000/decks/${deck._id}`, updateData);
      });
    }
  }, [userDecks]);

  //creates a new deck and adds it to the user deck list
  const createNewDeck = async () => {
    const newDeck = {
      //id: userDecks.length > 0 ? Math.max(...userDecks.map(deck => deck.id)) + 1 : 0,
      data: { name: "Click title area to name your new deck" },
      content: [],
    };
    const result = await axios.post('http://localhost:5000/decks', newDeck);
    setUserDecks([...userDecks, result.data]);
  };

  // Creates a new card, and adds it to the selected deck
  const addCard = async () => {
    const newCard = { front: "Front Side", back: "Back Side" };

    const updatedDeck = {
      ...selectedDeck,
      content: [...selectedDeck.content, newCard],
    };

    setSelectedDeck(updatedDeck);

    const updatedDecks = userDecks.map((deck) => deck._id === selectedDeck._id ? updatedDeck : deck);

    setUserDecks(updatedDecks);

    await axios.post(`http://localhost:5000/decks/${selectedDeck._id}/cards`, newCard);
  };

  // Removes the selected card from the selected deck
  const deleteCard = async (index) => {

    const updatedDeck = {
      ...selectedDeck,
      content: selectedDeck.content.filter((_, i) => i !== index),
    };

    setSelectedDeck(updatedDeck);

    const updatedDecks = userDecks.map(deck => deck._id === selectedDeck._id ? updatedDeck : deck);

    setUserDecks(updatedDecks);

    await axios.put(`http://localhost:5000/decks/${selectedDeck._id}`, updatedDeck);
  };

  //Updates the selected card in the selected deck
  const updateCard = async (index, front, back) => {

    const updatedDeck = {
      ...selectedDeck,
      content: selectedDeck.content.map((card, i) => i === index ? {front, back} : card),
    };
    setSelectedDeck(updatedDeck);

    const updatedDecks = userDecks.map(deck => deck._id === selectedDeck._id ? updatedDeck : deck);

    setUserDecks(updatedDecks);

    await axios.put(`http://localhost:5000/decks/${selectedDeck._id}`, updatedDeck);
  };

  // Removes the selected deck from deck list state: userDecks
  const removeDeck = async (deck) => {
    const updatedDecks = userDecks.filter(d => d._id !== deck._id);
    setUserDecks(updatedDecks);

    await axios.delete(`http://localhost:5000/decks/${deck._id}`);
  };

  //updates name of the deck
  const updateDeckName = async (id, name) => {
    const updatedDecks = userDecks.map(deck => deck._id === id ? {...deck, data: {...deck.data, name}} : deck);
    setUserDecks(updatedDecks);
    await axios.put(`http://localhost:5000/decks/${id}/name`, {name});
  };

  //quiz 
  const startQuiz = () => {
    setQuizMode(true);
    setQuestionNumber(0);
    const shuffledDeck = {...selectedDeck, content: shuffleArray(selectedDeck.content)};
    setSelectedDeck(shuffledDeck);
  };

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  return (
    <div className="App">
      <SideBar
        userDecks={userDecks}
        setUserDecks={setUserDecks}
        removeDeck={removeDeck}
        createNewDeck={createNewDeck}
        setAddQuestionsView={setAddQuestionsView}
        selectedDeck={selectedDeck}
        setSelectedDeck={setSelectedDeck}
        updateDeckName={updateDeckName}
      />
      <HomePage
        deck={deck}
        setDeck={setDeck}
        userDecks={userDecks}
        setUserDecks={setUserDecks}
        selectedDeck={selectedDeck}
        setSelectedDeck={setSelectedDeck}
        addQuestionsView={addQuestionsView}
        setAddQuestionsView={setAddQuestionsView}
        addCard={addCard}
        deleteCard={deleteCard}
        updateCard={updateCard}
        quizMode={quizMode}
        setQuizMode={setQuizMode}
        questionNumber={questionNumber}
        setQuestionNumber={setQuestionNumber}
        cardSide={cardSide}
        setCardSide={setCardSide}
        startQuiz={startQuiz}
        knowItCards={knowItCards}
        setKnowItCards={setKnowItCards}
        dontKnowItCards={dontKnowItCards}
        setDontKnowItCards={setDontKnowItCards}
      />
    </div>
  );
}

export default App;