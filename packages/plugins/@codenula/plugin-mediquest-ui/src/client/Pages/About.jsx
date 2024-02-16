import React, { useMemo } from 'react';
import { useAllEventsData } from '../context/EventDetailsProvider';
import Loader from '../Components/Loader';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import StyledText from '../Components/StyledText';
import '../assets2/css/main.min.css';
import '../assets2/css/external.css';

export default () => {
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
                  <h2 className="text-blue">{accEvent ? accEvent.about_title : ''}</h2>
                </div>
                <StyledText htmlContent={accEvent ? accEvent.event_about : ''} />
              </div>
            </div>
          </section>

          <Footer footerData={footerDetails ? footerDetails : ''} />
        </>
      )}
    </>
  );
};
