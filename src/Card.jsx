import cardBack from "../public/card-back.png";
import Tilt from "react-parallax-tilt";
export default function Card({ card, flip, handleClick }) {
  const cardImg = <img width={"100px"} src={card.image} />;

  return (
    <Tilt
      tiltReverse
      reset
      glareEnable={card.shiny || true}
      glareMaxOpacity={0.4}
      glareColor={card.shiny ? "#f1b818" : "#fff"}
      glarePosition="all"
      className={`card-container ${flip ? "back" : "front"}`}
    >
      <div className="card-inner">
        <div className="card-front">
          <button
            className="card"
            data-shiny={card.shiny}
            onClick={() => handleClick(card.code)}
          >
            {card.shiny && <div className="shiny-symbol" />}

            <img
              src={card.image}
              alt={card.name}
              className="card-image"
              draggable="false"
            />
            <p className="card-name">
              <span className="name">{card.name}</span>
            </p>
          </button>
        </div>
        <div className="card-back">
          <img
            width={"100px"}
            src={"/card-back.png"}
            alt="pokemon card back"
            className="back"
          />
        </div>
      </div>
    </Tilt>
  );
}
