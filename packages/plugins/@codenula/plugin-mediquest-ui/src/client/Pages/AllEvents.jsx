import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import './AllEvents.css';
import MonPetitTonneau from '../Assets/MonPetitTonneau.webp';
import EventCard from '../Components/EventCard';

export default () => {
 

  return (
    <>
      <Navbar />
      <div className="hero">
        <div className="hero-image-div">
          <img src={MonPetitTonneau} alt="MonPetitTonneau-img" className="hero-image" />
        </div>
        <div className="hero-details">
          <h1 className="hero-heading">Who We Are</h1>
          <h3 className="hero-sub">
            Mediquest Events (MQE) is India’s leading medical events platform that provides access to the world of
            interactive conferences and educational events for Indian and emerging market medical professionals.
          </h3>
          <p className="hero-basic">
            We conducts flagship events in the South Asian region for well over three decades and has presented new and
            insightful programs and conferences for continuing medical education learning such as the Cardiovascular
            Symposium, Endocrine Summit India, Best of ADA and many others, thereby providing educational opportunities
            via global faculty engagement for local HCP participants.
          </p>
        </div>
      </div>

      <div className="our-events">
        <div className="our-events-heading">Our Events</div>
        {/* {AllEventData.map((event) => (
          <EventCard key={event.id} event={event} className="our-events-card" />
        ))} */}
      </div>

      {/* <Footer /> */}
    </>
  );
};
