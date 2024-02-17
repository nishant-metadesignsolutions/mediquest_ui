import { useMemo } from 'react';
import { useAllEventsData } from '../context/EventDetailsProvider';
import Loader from '../Components/Loader';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import StyledText from '../Components/StyledText';
import '../assets2/css/main.min.css';
import '../assets2/css/external.css';

export const PolicyPage = () => {
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
          <section className="outer-box policy-page">
            <div className="content-wrapper" id="termsConditions">
              <div className="container">
                <div className="heading-section text-center mg-b-40">
                  <h2 className="text-blue">{accEvent ? accEvent.TnC_title : ''}</h2>
                </div>
                <StyledText htmlContent={accEvent ? accEvent.terms_conditions : ''} />
              </div>
            </div>
            <div className="content-wrapper" id="privacyPolicy">
              <div className="container">
                <div className="heading-section text-center mg-b-40">
                  <h2 className="text-blue">{accEvent ? accEvent.privacy_title : ''}</h2>
                </div>
                <StyledText htmlContent={accEvent ? accEvent.privacy_policy : ''} />
              </div>
            </div>
            <div className="content-wrapper" id="cancellationsRefunds">
              <div className="container">
                <div className="heading-section text-center mg-b-40">
                  <h2 className="text-blue">{accEvent ? accEvent.cancellation_title : ''}</h2>
                </div>
                <StyledText htmlContent={accEvent ? accEvent.cancellation_refunds : ''} />
              </div>
            </div>
          </section>

          <Footer footerData={footerDetails ? footerDetails : ''} />
        </>
      )}
    </>
  );
};
