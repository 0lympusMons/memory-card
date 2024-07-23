import React from "react";
import { fetchDeckID, drawCards, setHighScore } from "./api";
import { CardElements } from "./components/Card";
import { shuffleArray, toggleDarkMode } from "./utils";
import Loading from "./components/LoadingScreen";
import Result from "./components/Result";
import { Link } from "react-router-dom";
import { UserContext } from "./App";
import { getHighScore } from "./api";
import { getAuth } from "firebase/auth";
export const AppContext = React.createContext();

export default function Game() {
  const [currentUser, setCurrentUser] = React.useContext(UserContext);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [cards, setCards] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [flip, setFlip] = React.useState(false);
  const [showResult, setShowResult] = React.useState(false);
  const [fetchingNewDeck, setFetchingNewDeck] = React.useState(false);
  const [shuffle, setShuffle] = React.useState(true);
  const score = React.useRef(0);

  function handleClick(card) {
    const selectCard = (card) => {
      const cardExists = card.selected;

      if (!cardExists) {
        card.selected = true;
      }

      return cardExists;
    };

    if (!flip) {
      setFlip(true);

      const cardAlreadySelected = selectCard(card);

      if (cardAlreadySelected) {
        setShowResult(true);

        if (loggedIn) setHighScore(currentUser.uid, score.current);
      }

      if (!cardAlreadySelected) {
        score.current++;

        if (score.current % 10 === 0) {
          const fetching = async () => {
            setFetchingNewDeck(true);
            setShuffle(false);
            await getNewDeck();
            setShuffle(true);
            setFetchingNewDeck(false);
          };

          fetching();
        } else {
          setTimeout(() => {
            if (shuffle) setCards((prev) => shuffleCards(prev));
          }, 500);
        }

        setTimeout(() => {
          setFlip(false);
        }, 1000);
      }
    }
  }

  function shuffleCards(cardsToShuffle) {
    let allCardsSelected = !fetchingNewDeck;
    let shuffledCards;
    do {
      shuffledCards = shuffleArray(cardsToShuffle);
      const conditionsMet = shuffledCards
        .slice(0, 5)
        .every((card) => card.selected);
      allCardsSelected = conditionsMet;
    } while (allCardsSelected);

    return shuffledCards;
  }

  async function getNewDeck() {
    try {
      setCards(null);
      setLoading(true);
      const DECK_ID = await fetchDeckID();
      const newCards = await drawCards(DECK_ID);
      setCards(newCards);
      setFlip(false);

      return 1;
    } catch (error) {
      console.error("Failed to start new game:", error);

      return 0;
    } finally {
      setLoading(false);
    }
  }

  async function startNewGame() {
    setShowResult(false);
    toggleDarkMode(false);
    score.current = 0;
    await getNewDeck();
  }

  React.useEffect(() => {
    const auth = getAuth();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        setLoggedIn(true);
      } else {
        setCurrentUser(null);
        setLoggedIn(false);
      }
    });

    return unsubscribe;
  }, []);

  React.useEffect(() => {
    startNewGame();
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <Header />

      <div className="game-screen">
        {showResult ? (
          <AppContext.Provider value={{ startNewGame }}>
            <Result hasWon={false} />
          </AppContext.Provider>
        ) : (
          <>
            <Stats score={score.current} userUID={currentUser?.uid} />
            {
              <CardElements
                cards={cards}
                flip={flip}
                handleClick={handleClick}
              />
            }
          </>
        )}
      </div>
    </>
  );
}

function Header() {
  return (
    <header>
      <h1 className="game-title">MEMORY CARD</h1>
      <nav>
        <Link to="/" className="nav-buttons">
          MENU
        </Link>
      </nav>
    </header>
  );
}

function Stats({ score, userUID }) {
  const [allTimeBest, setAllTimeBest] = React.useState(0);
  if (userUID)
    getHighScore(userUID).then((x) => {
      setAllTimeBest(x);
    });

  return (
    <div className="stats-wrapper">
      <h2 className="stats">Score: {score}</h2>
      {userUID ? (
        <>
          <h2 className="stats">All time best: {allTimeBest}</h2>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
