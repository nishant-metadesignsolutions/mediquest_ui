import React from 'react';
import './PricingCard.css';

const PricingCard = (props) => {
  return (
    <div className="cardPrice">
      <div className="card-detailsPrice">
        <h2 className="event-titlePrice">{props.arr.title}</h2>
        <h2 className="event-categoryPrice">{props.arr.category}</h2>
        <h1 className="event-price">
          <span className="rupees">₹</span>
          {props.arr.price}
        </h1>
        <p className="event-daysPrice">{props.arr.days}</p>
        <div className="button">
          <a href={props.arr.linkTo} className="select-button-card">
            Select
          </a>
        </div>
        <hr />
        <div className="reg-detail">{props.arr.regDetail}</div>
      </div>
    </div>
  );
};
export default PricingCard;
