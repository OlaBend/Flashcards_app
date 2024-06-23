import React, { useState, useEffect } from "react";
import { GiRapidshareArrow } from "react-icons/gi";
import correct from "./correct.png";
import incorrect from "./incorrect.png";
import "./QuizCard.css";
import PropTypes from 'prop-types';

const QuizCard = ({
  selectedDeck,
  questionNumber,
  setQuestionNumber,
  cardSide,
  setCardSide,
  knowItCards,
  setKnowItCards,
  dontKnowItCards,
  setDontKnowItCards,
}) => {

  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [mode, setMode] = useState('learn');
  const [finishTest, setFinishTest] = useState(false);

  const currentCard = selectedDeck.content[questionNumber];

  const flipCard = () => {
    setCardSide(cardSide === 'front' ? 'back' : 'front');
  };

  const checkUserAnswer = () => {
    if (mode === 'quiz') {
      if (userAnswer.toLowerCase() === currentCard.back.toLowerCase()) {
        setIsCorrect(true);
        setKnowItCards([...knowItCards, currentCard]);
      } else {
        setIsCorrect(false);
        setDontKnowItCards([...dontKnowItCards, currentCard]);
      }
      setIsAnswered(true);
    } else {
      setIsAnswered(false);
    }
  };

  const nextQuestion = () => {
    setIsAnswered(false);
    setIsCorrect(null);
    setUserAnswer("");
    setCardSide('front');
    if (questionNumber < selectedDeck.content.length - 1) {
      setQuestionNumber(questionNumber + 1);
    } else {
      setFinishTest(true);
      alert(`Quiz completed! Known: ${knowItCards.length}, Wrong: ${dontKnowItCards.length}`);
    }
  };

  if (questionNumber >= selectedDeck.content.length) {
    return (
      <div className="quiz-complete">
        <h2>Quiz Complete!</h2>
        <p>Cards you know: {knowItCards.length}</p>
        <p>Cards you don't know: {dontKnowItCards.length}</p>
      </div>
    );
  };

  return (
    <div className="quiz-card">
      <div className="card-content" onClick={flipCard}>
        {cardSide === 'front' ? currentCard.front : currentCard.back}
      </div>
      <div className="quiz-controls">
        <div>
          <label>
            <input
              type="radio"
              value="learn"
              checked={mode === 'learn'}
              onChange={() => setMode('learn')}
            />
            Learn Mode
          </label>
          <label>
            <input
              type="radio"
              value="quiz"
              checked={mode === 'quiz'}
              onChange={() => setMode('quiz')}
            />
            Quiz Mode
          </label>
        </div>
        {isAnswered ? (
          <>
            {mode === 'quiz' ? (
              <>
                <p>{isCorrect ? 'Correct!' : "Incorrect!"}</p>
                <img src={isCorrect ? correct : incorrect} alt={isCorrect ? "Correct" : "Incorrect"} />
              </>
            ) : null}
            <button onClick={nextQuestion}>Next</button>
          </>
        ) : (
          <>
            {mode === 'quiz' ? (
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer"
              />
            ): null}
            <button onClick={checkUserAnswer}>{mode === 'quiz' ? "Submit" : "I know this"}</button>
            {mode === 'learn' ? (
              <button onClick={checkUserAnswer}>I don't know this</button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

QuizCard.propTypes = {
  selectedDeck: PropTypes.object.isRequired,
  questionNumber: PropTypes.number.isRequired,
  setQuestionNumber: PropTypes.func.isRequired,
  cardSide: PropTypes.string.isRequired,
  setCardSide: PropTypes.func.isRequired,
  knowItCards: PropTypes.array.isRequired,
  setKnowItCards: PropTypes.func.isRequired,
  dontKnowItCards: PropTypes.array.isRequired,
  setDontKnowItCards: PropTypes.func.isRequired,
};

export default QuizCard;