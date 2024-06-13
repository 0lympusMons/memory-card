import cardBack from "../public/card-back.png";
import Tilt from "react-parallax-tilt";
export default function Card({ card, flip, handleClick }) {
  const cardImg = <img width={"100px"} src={card.image} />;
  const cardBG = <img width={"100px"} src="/card-back.png" alt="" />;

  return (
    <Tilt className={`card-container ${flip ? "hideCards" : "showCards"}`}>
      <div className="card-inner">
        <div
          className="card-front card"
          key={card.code}
          onClick={() => handleClick(card.code)}
        >
          {cardImg}
        </div>
        <div className="card-back card" key={card.code}>
          {cardBG}
        </div>
      </div>
    </Tilt>
  );
}
