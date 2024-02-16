import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EventDetailsProvider, useAllEventsData } from '../context/EventDetailsProvider';
import Loader from '../Components/Loader';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import StyledText from '../Components/StyledText';
import '../assets2/css/main.min.css';
import '../assets2/css/external.css';

export const ContactUs = () => {
  const { allEvents, loading, footerDetails } = useAllEventsData();
  const accEvent = useMemo(() => {
    // Select the event you want to use
    return allEvents[1];
  }, [allEvents]);
  return (
    <>
      {loading && <Loader />}
      {!loading && accEvent && footerDetails && (
        <>
          <Navbar />
          <section className="outer-box">
            <div className="container">
              <div className="content-wrapper">
                <div className="heading-section text-center mg-b-40">
                  <h2 className="text-blue">Contact Us</h2>
                </div>
                <div className="column-row">
                  <div className="column">
                    <p>
                      <strong>Address</strong> <br />
                      <StyledText htmlContent={accEvent ? accEvent.companyAddress : ''} />
                    </p>
                  </div>
                  <div className="column">
                    <p>
                      <strong>Email</strong> <br />
                      <a href={`mailto:${accEvent.event_email}`}>{accEvent.event_email}</a>
                    </p>
                    <p>
                      {
                        <>
                          <strong>Phone</strong> <br /> {accEvent.event_contact}
                        </>
                      }
                    </p>
                    <p>
                      <strong>Website</strong> <br />
                      <a href={accEvent.event_contact_web} target="_blank" className="website" rel="noreferrer">
                        {accEvent.event_contact_web}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Footer footerData={footerDetails ? footerDetails : ''} />
        </>
      )}
    </>
  );
};
