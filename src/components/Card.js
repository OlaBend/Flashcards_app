import React, { useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { GrEdit } from "react-icons/gr";
import EditCard from "./EditCard";
import "./Card.css";
import axios from "axios";
import PropTypes from "prop-types";

const Card = ({
  card,
  deck,
  deleteCard,
  updateCard,
  setDeck,
  userDecks,
  setUserDecks,
  selectedDeck,
  setSelectedDeck,
  index,
}) => {
  console.log("deck:", deck); 
  console.log("deck.content:", deck.content);

  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [frontText, setFrontText] = useState(card.front);
  const [backText, setBackText] = useState(card.back);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      const updatedCard = {front: frontText, back: backText};
      const updatedDeckContent = Array.isArray(deck.content) ? [...deck.content] : [];

      updatedDeckContent[index] = updatedCard;
  
      const updatedDeck = {...deck, content: updatedDeckContent};
      setDeck(updatedDeck);
  
      const updatedUserDecks = userDecks.map(d => d.id === deck.id ? updatedDeck : d);
  
      setUserDecks(updatedUserDecks); 
      setSelectedDeck(updatedDeck);
      // Updates the card in the backend
      await axios.put(`http://localhost:5000/decks/${deck.id}`, updatedDeck);

      setEditMode(false); 
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };
  
  const handleDeleteClick = async () => {
     
    if (!Array.isArray(deck.content)) {
      console.error('Deck content is not an array or is undefined');
      return;
    }

    const updatedDeckContent = deck.content.filter((_, i) => i !== index);
    const updatedDeck = {...deck, content: updatedDeckContent};
    setDeck(updatedDeck);

    const updatedUserDecks = userDecks.map(d => d.id === deck.id ? updatedDeck : d);

    setUserDecks(updatedUserDecks);
    setSelectedDeck(updatedDeck);

     //Updates the deck in the backend after deleting the card
    await axios.put(`http://localhost:5000/decks/${deck.id}`, updatedDeck);
  };

  return (
    <div className="card">
      {editMode ? (
        <div className="card-edit-mode">
          <textarea value={frontText} onChange={(e) => setFrontText(e.target.value)} />
          <textarea value={backText} onChange={(e) => setBackText(e.target.value)} />
          <button onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <div className="card-view-mode">
          <div className="card-front">{card.front}</div>
          <div className="card-back">{card.back}</div>
          <div className="button-container">
            <button onClick={handleEditClick}><GrEdit /></button>
            <button onClick={handleDeleteClick}><FaTrashCan /></button>
          </div>
        </div>
      )}
    </div>
  );
}

Card.propTypes = {
  card: PropTypes.object.isRequired,
  deck: PropTypes.object.isRequired,
  setDeck: PropTypes.func.isRequired,
  userDecks: PropTypes.array.isRequired,
  setUserDecks: PropTypes.func.isRequired,
  selectedDeck: PropTypes.object.isRequired,
  setSelectedDeck: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
};

export default Card;