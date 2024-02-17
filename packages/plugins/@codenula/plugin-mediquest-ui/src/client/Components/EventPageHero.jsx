import { useMemo, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAllEventsData } from '../context/EventDetailsProvider';
import Loader from './Loader';
import StyledText from '../Components/StyledText';
import '../assets2/css/main.min.css';
import '../assets2/css/external.css';

export const EventPageHero = () => {
  const { allEvents, loading, footerDetails } = useAllEventsData();
  const accEvent = useMemo(() => {
    // Select the event you want to use
    return allEvents[1];
  }, [allEvents]);

  // Define calculateCountdown before using it in useState
  const calculateCountdown = useCallback(() => {
    const now = new Date();
    const difference = new Date(accEvent.event_date) - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  }, [accEvent]);

  // State for countdown
  const [countdown, setCountdown] = useState({});

  useEffect(() => {
    // Set countdown initially
    setCountdown(calculateCountdown());

    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    // Clean up timer
    return () => clearInterval(timer);
  }, [calculateCountdown]);
  const allMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const event_start_date = `${new Date(accEvent.event_date).getDate()} ${
    allMonths[new Date(accEvent.event_date).getMonth()]
  }`;
  const event_end_date = `${new Date(accEvent.event_end_date).getDate()} ${
    allMonths[new Date(accEvent.event_date).getMonth()]
  }`;
  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <>
          <section className="acc-box acc-new-box">
            <div className="container">
              <h1 className="heading80">{accEvent.event_title}</h1>
              <p className="headssub">{accEvent.event_subtitle}</p>
              <div className="acc-new-row">
                <div className="acc-new-left">
                  <div className="acc-list-outer">
                    <ul className="acc-list">
                      <li className="timer-text">
                        <span style={{ fontSize: '28px', paddingBottom: '7px' }}>{countdown.days}</span>
                        <span className="days" style={{ fontSize: '28px' }}>
                          Days
                        </span>
                      </li>
                      <li>
                        <span style={{ fontSize: '28px', paddingBottom: '7px' }}>{countdown.hours}</span>
                        <span className="days" style={{ fontSize: '28px' }}>
                          Hours
                        </span>
                      </li>
                      <li>
                        <span className="redtext" style={{ fontSize: '28px', paddingBottom: '7px' }}>
                          {countdown.minutes}
                        </span>
                        <span className="days redtext" style={{ fontSize: '28px' }}>
                          Minutes
                        </span>
                      </li>
                      <li>
                        <span className="redtext" style={{ fontSize: '28px', paddingBottom: '7px' }}>
                          {countdown.seconds}
                        </span>
                        <span className="days redtext" style={{ fontSize: '28px' }}>
                          Seconds
                        </span>
                      </li>
                    </ul>
                  </div>
                  {/* <div className="acc-btns">
                    <a href="" className="btn btn-yellow">
                      RESERVE YOUR SPOT
                    </a>
                  </div> */}
                  <Link className="acc-btns" to={`/events/${parseInt(7)}/register`}>
                    <button className="btn btn-yellow btn-lg">RESERVE YOUR SPOT</button>{' '}
                  </Link>
                </div>
                <div className="acc-new-right">
                  <img
                    src={accEvent ? `https://mediquest.codenula.com${accEvent.event_card_image[0].url}` : ''}
                    alt=""
                  />
                </div>
              </div>

              <div className="acc-new-details">
                <StyledText className="text30" htmlContent={accEvent ? accEvent.event_overview : ''} />
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};
