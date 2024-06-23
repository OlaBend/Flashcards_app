import { FaPlus, FaTrashAlt } from "react-icons/fa";
import Deck from "../components/deckModel";
import IconBar from "./IconBar";
import Card from "../components/Card";
import "./SideBar.css";
import PropTypes from "prop-types";
import React from "react";

const SideBar = ({
  userDecks,
  removeDeck,
  createNewDeck,
  setSelectedDeck,
  updateDeckName,
}) => {
  return (
    <div className="sidebar">
      <div className="deck-list">
        {userDecks.map((deck, index) => (
          <div key={index} className="deck-item">
            <input
              className="deck-title"
              value={deck.data.name}
              onChange={(e) => updateDeckName(deck.id, e.target.value)}
            />
            <div className="deck-buttons">
              <button className="deck-button" onClick={() => removeDeck(deck)}><FaTrashAlt /></button>
              <button className="deck-button" onClick={() => setSelectedDeck(deck)}>Select</button>
            </div>
          </div>
        ))}
      </div>
      <button className="new-deck-button" onClick={createNewDeck}>
        <FaPlus />
        New Deck
      </button>
    </div>
  );
};

SideBar.propTypes = {
  userDecks: PropTypes.array.isRequired,
  removeDeck: PropTypes.func.isRequired,
  createNewDeck: PropTypes.func.isRequired,
  setSelectedDeck: PropTypes.func.isRequired,
  updateDeckName: PropTypes.func.isRequired,
};

export default SideBar;
