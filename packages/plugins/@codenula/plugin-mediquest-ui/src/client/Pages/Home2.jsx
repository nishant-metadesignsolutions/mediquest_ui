import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EventDetailsProvider, useAllEventsData } from '../context/EventDetailsProvider';
import Loader from '../Components/Loader';
import Navbar from '../Components/Navbar';
import Hero from '../Components/Hero';
import Footer from '../Components/Footer';
import StyledText from '../Components/StyledText';
import EventCard from '../Components/EventCard';
import { Venue } from '../Components/Venue';
import { getVenue } from '../utils/getData';
import '../assets2/css/main.min.css';
import '../assets2/css/external.css';
// import './Home2.css';
import arrowDown from '../assets2/images/arrow-down.svg';

export const Home2 = () => {
  const { allEvents, loading, footerDetails } = useAllEventsData();
  const [venueDetail, setVenueDetail] = useState([]);
  // const accEvent = allEvents[1];
  const accEvent = useMemo(() => {
    // Select the event you want to use
    return allEvents[1];
  }, [allEvents]);
  console.log(accEvent);
  useEffect(() => {
    (async function () {
      if (accEvent) {
        const data = await getVenue(accEvent.venue[0].id);
        setVenueDetail(data);
      }
    })();
  }, [accEvent]);
  console.log(footerDetails);
  console.log(venueDetail);

  if (loading) {
    return <Loader />;
  } else if (Object.keys(allEvents).length === 0) {
    // Render something when allEvents is an empty object
    return <Loader />;
  } else {
    // Render something when allEvents has data
    return (
      <>
        {loading && <Loader />}
        {!loading && (
          <>
            <div>
              <Navbar />
            </div>
            <div>
              <Hero />
            </div>
            <section className="program-overview-box">
              <div className="container">
                <h3>{accEvent.program_overview_title}</h3>
                <StyledText htmlContent={accEvent.event_overview} />
                <div className="pro-btns">
                  <Link to="#">
                    <button className="btn btn-yellow withimg">
                      Know More <img src={arrowDown} alt="" />
                    </button>
                  </Link>
                </div>
              </div>
            </section>

            <section id="program-info-box" className="program-info-box">
              <div className="container">
                <h2>{accEvent.information_title}</h2>
                <EventCard key={accEvent.id} event={accEvent} />
              </div>
            </section>
            <Venue key={accEvent.id} event={accEvent} venue={venueDetail} />
            <Footer footerData={footerDetails} />
          </>
        )}
      </>
    );
  }
};
