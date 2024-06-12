import React from "react";
import { fetchDeckID, drawCards } from "./api";
import Card from "./Card";
import { shuffleArray } from "./utils";
import Loading from "./LoadingScreen";

function App() {
  const [deckID, setDeckID] = React.useState();
  const [cards, setCards] = React.useState();
  const [selectedCards, setSelectedCards] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [score, setScore] = React.useState(0);

  const [flip, setFlip] = React.useState(false);

  function selectCard(card) {
    const cardExists = selectedCards.includes(card);

    if (cardExists) {
      console.log(card);
      console.log("exists!");
      startNewGame();
    }

    if (!cardExists) {
      setScore((prev) => prev + 1);
      setSelectedCards((prev) => [...prev, card]);
      setCards((prev) => shuffleCards(prev));
    }
  }

  function handleClick(card) {
    // if (flip == false) {
    setFlip((prev) => !prev);
    selectCard(card);

    setTimeout(() => {
      setFlip(false);
    }, 1000);
    // }
  }

  const shuffledCards = React.useMemo(() => {
    if (cards && cards[0] != null) {
      return shuffleArray(cards);
    }
    return [];
  }, [cards]);

  function shuffleCards() {
    return shuffleArray(cards).slice(0, 5);
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

  async function startNewGame() {
    setLoading(true);
    setDeckID(null);
    setCards(null);
    setSelectedCards([]);
    setScore(0);
    try {
      const deckID = await fetchDeckID();
      setDeckID(deckID);

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
      <h1> {score}</h1>
      <div className="cards-wrapper">{cardsEls}</div>
    </>
  );
}

export default App;
