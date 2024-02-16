import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { COLLECTION_AUTH_TOKEN } from '../../myvars';
import Loader from '../Components/Loader';
import { EventDetailsProvider, useAllEventsData } from '../context/EventDetailsProvider';
import '../assets2/css/main.min.css';
import '../assets2/css/external.css';
import { getAllMessages } from '../utils/message_templates';
import StyledText from '../Components/StyledText';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
// import './PaymentFailurePage.css';

const PaymentFailurePage = () => {
  const navigate = useNavigate();
  const { eventId, transactionId, formValues, attendeeId, amount, mobNo } = useParams();
  const [myLoader, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const { allEvents, loading, footerDetails } = useAllEventsData();
  const decodedFormValues = JSON.parse(decodeURIComponent(formValues));

  const accEvent = useMemo(() => {
    // Select the event you want to use
    return allEvents[1];
  }, [allEvents]);
  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const data = await getAllMessages();
        setMessages(data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [eventId]);
  useEffect(() => {
    if (accEvent && messages) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [accEvent, messages]);

  useEffect(() => {
    if (!accEvent) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [accEvent]);

  const handleTryAgain = () => {
    // Add logic to redirect the user to the payment page or the previous step in the process
    navigate(-1); // Update the path as needed
  };
  return (
    <>
      {myLoader && loading && <Loader />}
      {!myLoader && !loading && (
        <>
          <Navbar />
          <section className="outer-box">
            <div className="container">
              <div className="transaction-summary">
                <div className="transaction-page mg-b-80">
                  <StyledText htmlContent={messages.length > 0 ? messages[2].description : ''} />
                </div>
                <div className="btn-holder text-center mg-b-80">
                  <button className="btn btn-yellow btn-lg" onClick={handleTryAgain}>
                    Try Again
                  </button>
                </div>
                <div className="heading-section mg-b-20">
                  <h3>Failed transaction Summary</h3>
                </div>
                <div className="transaction-table-wrap table-wrap">
                  <div className="transaction-table table">
                    <div className="tbody">
                      <div className="tr">
                        <div className="td">Registration Id</div>
                        <div className="td">Name</div>
                        <div className="td">{decodedFormValues.countryId == 'India' ? 'Amount (INR)' : 'Amount (USD)'}</div>
                      </div>
                      <div className="tr">
                        <div className="td">--</div>
                        <div className="td">{`${decodedFormValues.first_name} ${' '} ${decodedFormValues.last_name}`}</div>
                        <div className="td text-red1">{amount}</div>
                      </div>
                      <div className="tr">
                        <div className="td">Transaction Id</div>
                        <div className="td">Email</div>
                        <div className="td">Mobile</div>
                      </div>
                      <div className="tr">
                        <div className="td text-red1">{transactionId}</div>
                        <div className="td">{decodedFormValues.email_id}</div>
                        <div className="td">+{mobNo}</div>
                      </div>
                    </div>
                  </div>
                  <div className="btn-holder text-center mg-t-80">
                    <button className="btn btn-blue btn-lg" onClick={() => window.print()}>
                      PRINT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Footer footerData={footerDetails} />
        </>
      )}
    </>
  );
};

export default PaymentFailurePage;
