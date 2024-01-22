import React from 'react';
import './NumericPadModal.css';

const NumericKeypadModal = ({ onKeyPress }) => {
  const buttons = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="keypad-modal">
      {buttons.map((number) => (
        <button className="keypad-button-modal" key={number} onClick={() => onKeyPress(number)}>
          {number}
        </button>
      ))}
    </div>
  );
};

export default NumericKeypadModal;