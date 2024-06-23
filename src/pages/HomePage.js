import React, { useEffect, useState } from 'react';
import QuizCard from "../components/QuizCard";
import Card from '../components/Card';
import "./HomePage.css";
import PropTypes from "prop-types";

const HomePage =({
  quizMode,
  setQuizMode,
  selectedDeck,
  setSelectedDeck,
  questionNumber,
  setQuestionNumber,
  cardSide,
  setCardSide,
  deleteCard,
  knowItCards,
  setKnowItCards,
  dontKnowItCards,
  setDontKnowItCards,
  updateCard,
  startQuiz,
  addCard,
  deck,
  setDeck,
  userDecks,
  setUserDecks,
  updateDeckName,
}) => {

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (selectedDeck) {
      setName(selectedDeck.data.name);
    }
  }, [selectedDeck]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    setSelectedDeck({...selectedDeck, data: {...selectedDeck.data, name: e.target.value}});
  };

  const handleSaveName = () => {
    if (selectedDeck && selectedDeck._id) {
      updateDeckName(selectedDeck._id, name);
    }
  };

  if(!selectedDeck) {
    return <div className='homepage'>Select a deck to get started!</div>;
  }

  const handleEditToggle = () => setEditMode(!editMode);

  const handleSaveCard = (index, front, back) => {
    updateCard(index, front, back);
    setEditMode(false);
  }

  const handleAddCard = async (newCard) => {
    const savedCard = await addCard(newCard);
    const updatedDeck = {...deck, content: [...deck.content, savedCard]};
    setDeck(updatedDeck);

    const updatedUserDecks = userDecks.map(d => d.id === deck.id ? updatedDeck : d);
    setUserDecks(updatedUserDecks);
    setSelectedDeck(updatedDeck);
  };

  return (
    <div className='homepage'>
      <div className='deck-title'>
        {selectedDeck && (
          <input
            type='text'
            value={name}
            onChange={handleNameChange}
            onBlur={handleSaveName}
            className='deck-title-input'
          />
        )}
      </div>
      <button onClick={handleAddCard}>Add Card</button>
      {quizMode ? (
        <QuizCard
        selectedDeck={selectedDeck}
        questionNumber={questionNumber}
        setQuestionNumber={setQuestionNumber}
        cardSide={cardSide}
        setCardSide={setCardSide}
        knowItCards={knowItCards}
        setKnowItCards={setKnowItCards}
        dontKnowItCards={dontKnowItCards}
        setDontKnowItCards={setDontKnowItCards}
      />
      ) : (
        <div className='cards-list'>
          {selectedDeck.content.map((card, index) => (
            <Card
              key={index}
              index={index}
              card={card}
              editMode={editMode}
              setEditMode={setEditMode}
              handleSaveCard={handleSaveCard}
              handleDeleteCard={() => deleteCard(index)}
              deck={deck}
              setDeck={setDeck}
              userDecks={userDecks}
              setUserDecks={setUserDecks}
              selectedDeck={selectedDeck}
              setSelectedDeck={setSelectedDeck}
            />
          ))}
          <button onClick={startQuiz}>Start Quiz</button>
          <button onClick={handleEditToggle}>
            {editMode ? "Save changes" : "Edit Cards"}
          </button>
        </div>
      )}
    </div>
  );
};

  HomePage.propTypes = {
    userDecks: PropTypes.array,
    quizMode: PropTypes.bool,
    setQuizMode: PropTypes.func,
    selectedDeck: PropTypes.object,
    setSelectedDeck: PropTypes.func,
    questionNumber: PropTypes.number,
    setQuestionNumber: PropTypes.func,
    cardSide: PropTypes.string,
    setCardSide: PropTypes.func,
    deleteCard: PropTypes.func,
    knowItCards: PropTypes.array,
    setKnowItCards: PropTypes.func,
    dontKnowItCards: PropTypes.array,
    setDontKnowItCards: PropTypes.func,
    updateCard: PropTypes.func,
    startQuiz: PropTypes.func,
    addCard: PropTypes.func,
    deck: PropTypes.object,
    setDeck: PropTypes.func,
    updateDeckName: PropTypes.func,
  };

export default HomePage;