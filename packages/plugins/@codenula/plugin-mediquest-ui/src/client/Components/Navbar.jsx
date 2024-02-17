// Navbar.js
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAllEventsData } from '../context/EventDetailsProvider';
import '../assets2/css/main.min.css';
import '../assets2/css/external.css';
import Loader from './Loader';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { allEvents, loading } = useAllEventsData();
  const [myLoader, setMyLoader] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState('');
  const accEvent = allEvents[1];

  const handleToggleMenu = () => {
    var target = document.querySelector('.header-navbar .menu-list');
    if (target.classList.contains('show')) {
      target.classList.remove('show');
    } else {
      target.classList.add('show');
    }
  };

  useEffect(() => {
    if (accEvent) {
      setMyLoader(false);
    }
  }, [accEvent]);
  const handleScroll = () => {
    setScrolled(window.scrollY > 400);
  };

  useEffect(() => {
    if (scrolled) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  }, [scrolled]);
  // className="active"
  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
  };
  return (
    <>
      {myLoader && <Loader />}
      {!myLoader && (
        <>
          <header className={`header-cntr ${scrolled ? 'scrolled' : ''}`}>
            <div className="media-holder">
              <Link to="/home2" className="logo">
                <img src={accEvent ? `https://mediquest.codenula.com${accEvent.event_banner[0].url}` : ''} alt="" />
              </Link>
            </div>
          </header>

          <section className={`menu-box`}>
            <div className="container">
              <div className="menu-toggle">
                <button className="btn-toggle" onClick={handleToggleMenu}>
                  <i className="fa fa-bars" aria-hidden="true"></i>
                </button>
              </div>
              <nav className="header-navbar">
                <ul className="menu-list">
                  <li className={activeMenuItem === 'home' ? 'active' : ''}>
                    <a href="/home2" onClick={() => handleMenuItemClick('home')}>
                      Home
                    </a>
                  </li>
                  <li className={activeMenuItem === 'faculty' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuItemClick('faculty')}>
                      Faculty
                    </a>
                    <div className="submenu">
                      <ul>
                        <li>
                          <a href="#chairPersons" onClick={() => handleMenuItemClick('chairpersons')}>
                            Chair Persons
                          </a>
                        </li>
                        <li>
                          <a href="#internationalFaculty" onClick={() => handleMenuItemClick('faculty')}>
                            International Faculty
                          </a>
                        </li>
                        <li>
                          <a href="#nationalFaculty" onClick={() => handleMenuItemClick('faculty')}>
                            National Faculty
                          </a>
                        </li>
                      </ul>
                    </div>
                  </li>
                  <li className={activeMenuItem === 'chairpersons' ? 'active' : ''}>
                    <a href="/home2#program-info-box" onClick={() => handleMenuItemClick('chairpersons')}>
                      Chair Persons
                    </a>
                  </li>
                  <li className={activeMenuItem === 'scientficprogram' ? 'active' : ''}>
                    <a href="/events/7#scientfic-program" onClick={() => handleMenuItemClick('scientficprogram')}>
                      Scientific Program
                    </a>
                  </li>
                  <li className={activeMenuItem === 'venue' ? 'active' : ''}>
                    <a href="/events/7#venue" onClick={() => handleMenuItemClick('venue')}>
                      Venue
                    </a>
                  </li>
                  <li className={activeMenuItem === 'aboutus' ? 'active' : ''}>
                    <a href="/about" onClick={() => handleMenuItemClick('aboutus')}>
                      ABOUT US
                    </a>
                  </li>
                  <li className={activeMenuItem === 'contactus' ? 'active' : ''}>
                    <a href="/contact-us" onClick={() => handleMenuItemClick('contactus')}>
                      Contact US
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Navbar;
