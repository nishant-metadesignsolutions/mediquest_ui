// Navbar2.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EventDetailsProvider, useAllEventsData } from '../context/EventDetailsProvider';
import './Navbar2.css';

const Navbar2 = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { allEvents, loading } = useAllEventsData();
  const accEvent = allEvents[1];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = () => {
    setIsOpen(false); // Close the menu when a menu item is clicked
  };

  return (
    <>
      <div className="navbar2-banner-img">
        <img src={`https://mediquest.codenula.com${accEvent.event_banner[0].url}`} alt="" />
      </div>
      <nav className="navbar2">
        <div className="navbar2-toggle" onClick={toggleMenu}>
          &#9776;
        </div>
        <div className={`navbar2-menu ${isOpen ? 'show' : ''}`}>
          <Link
            to="#"
            className={`navbar2-link ${selectedItem === '/' ? 'selected' : ''}`}
            onClick={() => {
              setSelectedItem('/');
              setIsOpen(false);
            }}
          >
            HOME
          </Link>
          <Link
            to="#"
            className={`navbar2-link ${selectedItem === '/chairpersons' ? 'selected' : ''}`}
            onClick={() => {
              setSelectedItem('/chairpersons');
              setIsOpen(false);
            }}
          >
            FACULTY
          </Link>
          <Link
            to="#"
            className={`navbar2-link ${selectedItem === '/faculty' ? 'selected' : ''}`}
            onClick={() => {
              setSelectedItem('/faculty');
              setIsOpen(false);
            }}
          >
            CHAIR PERSONS
          </Link>
          <Link
            to="/events/7#scientfic-program"
            className={`navbar2-link ${selectedItem === '/scientificprogram' ? 'selected' : ''}`}
            onClick={() => {
              setSelectedItem('/scientificprogram');
              setIsOpen(false);
            }}
          >
            SCIENTFIC PROGRAM
          </Link>
          <Link
            to="/events/7#venue"
            className={`navbar2-link ${selectedItem === '/venue' ? 'selected' : ''}`}
            onClick={() => {
              setSelectedItem('/venue');
              setIsOpen(false);
            }}
          >
            VENUE
          </Link>
          <Link
            to="#"
            className={`navbar2-link ${selectedItem === '/aboutus' ? 'selected' : ''}`}
            onClick={() => {
              setSelectedItem('/aboutus');
              setIsOpen(false);
            }}
          >
            ABOUT US
          </Link>
          <Link
            to="#"
            className={`navbar2-link ${selectedItem === '/contactus' ? 'selected' : ''}`}
            onClick={() => {
              setSelectedItem('/contactus');
              setIsOpen(false);
            }}
          >
            CONTACT US
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar2;
