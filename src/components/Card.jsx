import React from "react";
import Tilt from "react-parallax-tilt";
export function Card({ card, flip, handleClick, index }) {
  const [loaded, setLoaded] = React.useState(false);

  const cardImg = (
    <img src={card.image} draggable={false} onLoad={() => setLoaded(true)} />
  );
  const cardBG = React.useMemo(() => (
    <img src="/card-back.png" draggable={false} />
  ));

  return (
    <Tilt className="card-container">
      <div
        className={`card ${
          flip ? "hideCards" : loaded ? "showCards" : "hideCards"
        }`}
        id={`card-${index}`}
      >
        <div className="card-inner">
          <div
            className="card-front"
            key={`${card.code}-front`}
            onClick={() => handleClick(card.code)}
          >
            {cardImg}
          </div>
          <div className="card-back" key={`${card.code}-back`}>
            {cardBG}
          </div>
        </div>
      </div>
    </Tilt>
  );
}

export function CardElements({
  animateStart = true,
  cards,
  flip,
  handleClick,
}) {
  const cardsEls =
    cards &&
    cards
      .slice(0, 5)
      .map((card, index) => (
        <Card
          card={card}
          key={card.code}
          flip={flip}
          index={index}
          handleClick={handleClick}
        />
      ));

  return <div className="cards-wrapper">{cardsEls}</div>;
}
