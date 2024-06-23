import React, { useState } from 'react';

const NewCard = ({ onSaveCard }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const handleSave = () => {
    const newCard = { front, back };
    onSaveCard(newCard);
    setFront('');
    setBack('');
  };

  return (
    <div>
      <h2>Add new card</h2>
      <div>
        <label>
          Front:
          <input type="text" value={front} onChange={(e) => setFront(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Back:
          <input type="text" value={back} onChange={(e) => setBack(e.target.value)} />
        </label>
      </div>
      <button onClick={handleSave}>Save Card</button>
    </div>
  );
};

export default NewCard;
