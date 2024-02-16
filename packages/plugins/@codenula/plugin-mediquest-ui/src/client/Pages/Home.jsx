import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import './Home.css';
import EventCard from '../Components/EventCard';
import LC from '../Assets/LC.webp';
import Infodata from '../Assets/Infodata.webp';
import Stat_Kings from '../Assets/Stat_Kings.webp';
import Up_Prime from '../Assets/Up_Prime.webp';
import eCard1 from '../Assets/eCard1.webp';
import eCard2 from '../Assets/eCard2.webp';
import eCard3 from '../Assets/eCard3.webp';
// import { AllEventData } from '../index.tsx';

const allEvents = [
  {
    id: 1,
    title: 'International Event-3',
    startDate: 'Feb 17, 2024',
    endDate: 'Feb 18, 2024',
    date: 'Feb 17, 2024 - Feb 18, 2024',
    plansAvailable: '4 Plans Available',
    linkTo: '#',
    myImg: eCard1,
  },

  {
    id: 2,
    title: 'International Event-2',
    date: 'Feb 17, 2024 - Feb 18, 2024',
    plansAvailable: '3 Plans Available',
    linkTo: '#',
    myImg: eCard2,
  },

  {
    id: 3,
    title: 'International Event-1',
    date: 'Feb 17, 2024 - Feb 18, 2024',
    plansAvailable: '3 Plans Available',
    linkTo: '#',
    myImg: eCard3,
  },
];

export default () => {
  return (
    <>
      <Navbar />
      <div className="background-div">
        <h1 className="main-heading">Welcome to Mediquest Events!</h1>
        <div className="details">
          Mediquest Events (MQE) is India's leading medical events platform that provides access to the world of
          interactive conferences and educational events for Indian and emerging market medical professionals.
        </div>
        <div className="details">
          Mediquest conducts flagship events in the South Asian region for well over three decades and has presented new
          and insightful programs and conferences for continuing medical education learning such as the Cardiovascular
          Symposium, Endocrine Summit India, Best of ADA and many others, thereby providing educational opportunities
          via global faculty engagement for local HCP participants.
        </div>
      </div>

      <div className="aboutUs">
        <div className="about-heading">About Us</div>
        <div className="about-details">
          Mediquest conducts flagship events in the South Asian region for well over three decades and has presented new
          and insightful programs and conferences for continuing medical education learning such as the Cardiovascular
          Symposium, Endocrine Summit India, Best of ADA and many others, thereby providing educational opportunities
          via global faculty engagement for local HCP participants.
        </div>
        <div className="knowMore">
          <Link to="#">
            <button className="know-more-button">
              Know More <i className="arrow right"></i>
            </button>
          </Link>
        </div>
      </div>

      <div className="our-events">
        <div className="our-events-heading">Our Events</div>
        {/* {AllEventData.map((event) => (
          <EventCard key={event.id} event={event} className="our-events-card" />
        ))} */}
      </div>

      <div className="our-service">
        <div className="our-service-heading">Our Services</div>
        <div className="services">
          <div className="services-div">
            <div className="background-container">
              <div className="large-number">01</div>
              <div className="text-above">Event</div>
              <div className="text-above2">Registration</div>
            </div>

            <div className="background-container">
              <div className="large-number" style={{ color: 'rgb(236, 219, 255)' }}>
                02
              </div>
              <div className="text-above">Travel</div>
              <div className="text-above2">Arrangements</div>
            </div>

            <div className="background-container">
              <div className="large-number" style={{ color: 'rgb(212,237,238)' }}>
                03
              </div>
              <div className="text-above">Hotel</div>
              <div className="text-above2">Bookings</div>
            </div>
          </div>
        </div>
        <div className="reserve-service">
          <Link to="#">
            <button className="reserve-button" disabled={false}>
              Reserve My Spot
            </button>
          </Link>
          {/* <a href="#" className="reserve-button">
            Reserve My Spot
          </a> */}
        </div>
      </div>

      <div className="knowledge-partners">
        <div className="knowledge-partners-heading">Knowledge partners</div>
        <div className="knowledge-partners-icons">
          <img src={LC} alt="LC-icon" />
          <img src={Infodata} alt="infodata-icon" />
          <img src={Stat_Kings} alt="starKings-icon" />
          <img src={Up_Prime} alt="Up_Prime-icons" />
        </div>
      </div>

      <Footer />
    </>
  );
};
