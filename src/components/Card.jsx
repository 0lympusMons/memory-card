import React from "react";
import Tilt from "react-parallax-tilt";
import { animate, motion, stagger, useAnimate } from "framer-motion";
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

  const motionCards = cardsEls.map((card, index) => {
    return (
      <motion.div className="motion-card-container" key={index}>
        {card}
      </motion.div>
    );
  });

  const [scope, animate] = useAnimate();
  const allCards = Array.from(document.querySelectorAll(".card-container"));
  const rotateAllCards = allCards.map((card, index) => {
    const zIndex = [0, 1, 5, 2, 3];
    return [
      `#card-${index}`,
      { rotate: index * 5 - 10, originY: 100 },
      { duration: 0.1 },
    ];
  });
  if (animateStart) {
    // eslint-disable-next-line no-inner-declarations
    async function animation() {
      await animate(".motion-card-container", { position: "absolute" });
      await animate(scope.current, { y: ["100vh", "50vh"] }, { duration: 1 });
      await animate(rotateAllCards);

      console.log(rotateAllCards);
    }

    animation();
  }

  return (
    <motion.div ref={scope} className="cards-wrapper">
      {motionCards}
    </motion.div>
  );
}
