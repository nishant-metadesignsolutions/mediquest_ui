import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { AccordionItem } from '../Components/Accordion';
import Loader from '../Components/Loader';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Venue } from '../Components/Venue';
import { getVenue } from '../utils/getData';
import StyledText from '../Components/StyledText';
import { EventPageHero } from '../Components/EventPageHero';
import { useAllEventsData } from '../context/EventDetailsProvider';

import '../assets2/css/main.min.css';
import '../assets2/css/external.css';
import { getAgendaDetails } from '../utils/getData';

export default () => {
  const { eventId } = useParams();
  const { allEvents, loading, footerDetails } = useAllEventsData();
  const [myLoader, setLoader] = useState(true);
  const [agenda, setAgenda] = useState({});
  const [venueDetail, setVenueDetail] = useState([]);
  const accEvent = useMemo(() => {
    // Select the event you want to use
    return allEvents[1];
  }, [allEvents]);

  useEffect(() => {
    (async function () {
      if (accEvent && accEvent.venue.length > 0) {
        const data = await getVenue(accEvent.venue[0].id);
        setVenueDetail(data);
      }
    })();
  }, [accEvent]);

  useEffect(() => {
    const fetchAgenda = async () => {
      if (allEvents && allEvents.length > 1) {
        try {
          const data = await getAgendaDetails(allEvents[1].agenda[0].id);
          console.log(data);
          setAgenda(data);
          setLoader(false);
        } catch (error) {
          console.error('Error fetching agenda:', error);
          // Handle error
        }
      }
    };

    fetchAgenda();
  }, [allEvents]);
  return (
    <>
      {myLoader && loading && <Loader />}
      {!myLoader && !loading && (
        <>
          <Navbar />
          <EventPageHero />
          <section className="attend-box">
            <div className="container">
              <h2>{accEvent ? accEvent.objective_title : ''}</h2>
              <StyledText htmlContent={accEvent ? accEvent.event_objectives : ''} />
            </div>
          </section>
          <section className="goal-box">
            <div className="">
              <AccordionItem
                title={accEvent ? accEvent.target_audience_title : ''}
                content={accEvent ? accEvent.event_audience : ''}
              />
              <div id="scientfic-program">
                <AccordionItem
                  title={accEvent ? accEvent.scientific_program_title : ''}
                  content={agenda ? agenda.agenda_description : ''}
                  pdfLink={agenda ? `https://mediquest.codenula.com${agenda.agenda_pdf[0].url}` : ''}
                />
              </div>
            </div>
          </section>
          <div id="venue">
            <Venue key={accEvent.id} event={accEvent} venue={venueDetail} />
          </div>

          <Footer footerData={footerDetails ? footerDetails : ''} />
        </>
      )}
    </>
  );
};
