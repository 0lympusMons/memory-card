import React from "react";
import { fetchDeckID, drawCards } from "./api";
import Card from "./components/Card";
import { shuffleArray } from "./utils";
import Loading from "./LoadingScreen";
import Result from "./components/Result";

export const AppContext = React.createContext();

function App() {
  const [cards, setCards] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [flip, setFlip] = React.useState(false);
  const [showResult, setShowResult] = React.useState(false);
  const [hasWon, setHasWon] = React.useState(true);
  const selectedCards = React.useRef([]);
  const score = React.useRef(0);

  const Context = {
    setCards,
    setLoading,
    selectedCards,
    score,
    startNewGame,
  };

  function selectCard(card) {
    const cardExists = selectedCards.current.includes(card);

    if (cardExists) {
      // startNewGame();
      setHasWon(false);
      setShowResult(true);
    }

    if (!cardExists) {
      score.current++;
      const newSelectedCards = [...selectedCards.current, card];
      selectedCards.current = newSelectedCards;
    }
  }

  function handleClick(card) {
    if (flip == false) {
      setFlip(true);

      selectCard(card);

      setTimeout(() => {
        setCards((prev) => shuffleCards(prev));
      }, 900);

      setTimeout(() => {
        setFlip(false);
      }, 1000);
    }
  }

  const cardsEls =
    cards &&
    cards
      .slice(0, 5)
      .map((card) => (
        <Card
          card={card}
          key={card.code}
          flip={flip}
          handleClick={handleClick}
        />
      ));

  function shuffleCards() {
    return shuffleArray(cards);
  }

  async function startNewGame() {
    setLoading(true);
    setCards(null);
    setHasWon(false);
    setShowResult(false);
    selectedCards.current = [];
    score.current = 0;
    try {
      const deckID = await fetchDeckID();

      const cards = await drawCards(deckID);
      setCards(cards);
    } catch (error) {
      console.error("Failed to start new game:", error);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    startNewGame();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {hasWon || showResult ? (
        <AppContext.Provider value={Context}>
          <Result hasWon={hasWon} />
        </AppContext.Provider>
      ) : (
        ""
      )}
      <h1> {score.current}</h1>
      <div className="cards-wrapper">{cardsEls}</div>
    </>
  );
}

export default App;
