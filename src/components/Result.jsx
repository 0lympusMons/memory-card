import React from "react";
import { AppContext } from "../Game";
import { toggleDarkMode } from "../utils";

export default function Result({ hasWon = false }) {
  // todo save top score to local storage
  toggleDarkMode(true);
  const { score, startNewGame } = React.useContext(AppContext);

  if (hasWon) {
    return (
      <div className="result">
        <h1 className="result--text">You won!</h1>
        <div className="result--buttons-wrapper">
          <button
            onClick={() => {
              startNewGame();
              console.log("You lost!");
            }}
          >
            Restart
          </button>

          <button
            onClick={() => {
              startNewGame();
              console.log("You lost!");
            }}
          >
            Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="result">
      <h1 className="result--text">You lost!</h1>

      <div className="result--buttons-wrapper">
        <button
          onClick={() => {
            startNewGame();
            console.log("You lost!");
          }}
        >
          Restart
        </button>
      </div>
    </div>
  );
}
