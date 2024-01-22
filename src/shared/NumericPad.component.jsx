import React from 'react';
import './NumericPad.css';

const NumericKeypad = ({ onKeyPress }) => {
  const buttons = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="keypad">
      {buttons.map((number) => (
        <button className="keypad-button" key={number} onClick={() => onKeyPress(number)}>
          {number}
        </button>
      ))}
    </div>
  );
};

export default NumericKeypad;