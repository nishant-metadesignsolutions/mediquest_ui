import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../assets2/css/main.min.css';
import '../assets2/css/external.css';
import { RAZORPAY_API_KEY } from '../../myvars.js';
import Loader from '../Components/Loader';
import { getAllMessages } from '../utils/message_templates';
import StyledText from '../Components/StyledText';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { useAllEventsData } from '../context/EventDetailsProvider';
import { getCountry, getCountryCode } from '../utils/getData';
import { getPaymentCategories } from '../utils/getData';

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

const RegistrationCompletePage = () => {
  const [coupon, setCoupon] = useState('');
  const navigate = useNavigate();
  const { eventId, formValues, amtToPay, netAmt, attendeeId, orderId } = useParams();
  const decodedFormValues = JSON.parse(decodeURIComponent(formValues));
  const registrationFee = parseFloat(netAmt);
  const registrationFeeToBePaid = parseFloat(amtToPay);
  // const allFormValues = JSON.parse(formValues);
  const allFormValues = decodedFormValues;
  const [myLoader, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);
  const [messages, setMessages] = useState([]);
  const [paymentOption, setPaymentOption] = useState('');
  const [payment, setPayment] = useState([]);
  const [charges, setCharges] = useState({});
  const { allEvents, loading, footerDetails } = useAllEventsData();
  const totalTime = 6 * 60; // 6 minutes * 60 seconds/minute
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const accEvent = useMemo(() => {
    // Select the event you want to use
    return allEvents[1];
  }, [allEvents]);
  const displayRazorpay = async (amt, orderId) => {
    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    setLoading(true);

    if (!res) {
      alert('You are offline...Failed to load page');
      return;
    }

    const options = {
      key: RAZORPAY_API_KEY,
      currency: allFormValues.countryId == 'India' ? 'INR' : 'USD',
      order_id: orderId,
      amount: amt * 100,
      name: 'Mediquest',
      description: 'Event ticket booking',
      timeout: 300,
      callback_url: `http://localhost:15000/api/razorPay:verifyPayment?eventId=${eventId}&formValues=${formValues}&attendeeId=${attendeeId}&orderId=${orderId}`,
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on('payment.failed', async function (response) {
      if (response) {
        paymentObject.close();
        setLoading(true);
        const reqBody = {
          orderId: orderId,
          attendeeId: attendeeId,
          eventId: eventId,
        };
        const country = await getCountry();
        const countryCode = await getCountryCode(allFormValues.countryId, country);
        const mobNo = countryCode + allFormValues.contact_number;
        const failedPayment = await fetch('http://localhost:15000/api/razorPay:paymentFailed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqBody),
        }).then(
          navigate(
            `/events/${eventId}/payment-failed/${response.error.metadata.payment_id}/${formValues}/${parseInt(
              attendeeId,
            )}/${amtToPay}/${mobNo}`,
          ),
        );
      }
      // console.log(response);
    });
    setTimeout(() => {
      paymentObject.on('payment.authorized', async function (response) {
        if (response) {
          paymentObject.close();
          setLoading(true);
          const data = await response.json();
          console.log('Payment Pending', data);
          navigate(`/payment-pending`);
        }
        // console.log(response);
      });
    }, 7000);
  };
  const updateTimer = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval); // Clear the interval when timeLeft reaches 0 or below
          // navigate(`/home2`);
          return 0; // Set timeLeft to 0 to prevent negative values
        } else {
          return prevTime - 1; // Decrement timeLeft by 1 second
        }
      });
    }, 1000); // Update every second

    return () => clearInterval(timerInterval); // Cleanup function to clear the interval
  }, []);

  useEffect(() => {
    (async () => {
      const paymentCategories = await getPaymentCategories();
      setPayment(paymentCategories);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (payment && payment.length > 0) {
        setCharges({
          serviceCharge:
            payment && payment.length > 0 && allFormValues.countryId == 'India'
              ? payment[0].service_rupees
              : payment[0].service_dollars,
          transactionCharge:
            payment && payment.length > 0 && allFormValues.countryId == 'India'
              ? payment[0].transaction_rupees
              : payment[0].transaction_dollars,
        });
      }
    })();
  }, [payment]);

  useEffect(() => {
    if (paymentOption === 'razorpay' && orderId !== null && orderId !== undefined && orderId !== '') {
      displayRazorpay(parseInt(amtToPay), orderId);
    }
  }, [amtToPay, orderId, paymentOption]);

  useEffect(() => {
    if (
      allFormValues.discountCouponId !== null &&
      allFormValues.discountCouponId !== undefined &&
      allFormValues.discountCouponId !== '' &&
      registrationFee !== registrationFeeToBePaid
    ) {
      setCoupon(allFormValues.discountCouponId);
    }
  }, [allFormValues.discountCouponId, coupon, registrationFee, registrationFeeToBePaid]);

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const data = await getAllMessages();
        console.log(data);
        setMessages(data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [eventId]);
  useEffect(() => {
    if (accEvent && messages && payment && charges) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [accEvent, messages, payment]);

  const handleProceedToPay = () => {
    if (parseInt(amtToPay) === 0) {
      navigate(
        `/events/${eventId}/payment-successful/${orderId}/${allFormValues.first_name}/${
          allFormValues.email_id
        }/${parseInt(attendeeId)}/${amtToPay}/${allFormValues.contact_number}`,
      );
    } else {
      const encodedFormValues = encodeURIComponent(JSON.stringify(allFormValues));
      navigate(
        `/events/${eventId}/register/payment/${encodedFormValues}/${registrationFeeToBePaid}/${parseInt(
          attendeeId,
        )}/${orderId}`,
      );
    }
  };

  return (
    <>
      {myLoader && loading && <Loader />}
      {!myLoader && !loading && !popup && (
        <>
          <Navbar />
          <div className="registration-complete-container">
            <>
              <section className="outer-box">
                <div className="container">
                  <div className="mg-b-40 text-red1 text-center">
                    <p>{`Page will expire in ${updateTimer()}`}</p>
                  </div>
                  <div className="thankyou text-center">
                    <StyledText
                      className="messages-displayed"
                      htmlContent={messages.length > 0 ? messages[0].description : ''}
                    />
                  </div>
                  <div className="btn-holder text-center" style={{ marginTop: '2%' }}>
                    <button className="btn btn-yellow btn-lg" onClick={() => setPopup(true)}>
                      PROCEED TO PAY
                    </button>
                  </div>
                </div>
              </section>
            </>
          </div>
          <Footer footerData={footerDetails} />
        </>
      )}
      {!myLoader && !loading && popup && (
        <>
          <Navbar />

          <div className="registration-complete-container">
            <section className="outer-box">
              <div className="container">
                <div className="payment-summary">
                  <div className="payment-page text-center mg-b-80">
                    <div className="mg-b-40 text-red1">
                      <p>{`Page will expire in ${updateTimer()}`}</p>
                    </div>
                    <div className="heading-section mg-b-80">
                      <h2>Kindly select your payment option below to proceed further</h2>
                    </div>
                    <div className="btn-holder">
                      <button className="btn btn-blue btn-xl" onClick={() => setPaymentOption('razorpay')}>
                        Razorpay
                      </button>
                    </div>
                  </div>
                  <div className="heading-section text-center mg-b-20">
                    <h3>Payment Summary</h3>
                  </div>
                  <div className="payment-table-wrap table-wrap">
                    <div className="payment-table table">
                      <div className="thead text-center">
                        <div className="tr">
                          <div className="th">Description</div>
                          <div className="th">
                            {allFormValues.countryId == 'India' ? 'Amount (INR)' : 'Amount (USD)'}
                          </div>
                        </div>
                      </div>
                      <div className="tbody">
                        <div className="tr">
                          <div className="td">
                            Registration fee <small>({allFormValues.paymentId})</small> <br/>
                            <small style={{ fontSize: '14px' }}>(Exclusive of taxes)</small>
                          </div>
                          <div className="td">
                            {allFormValues.countryId == 'India'
                              ? registrationFee.toFixed(2)
                              : `$ ${registrationFee.toFixed(2)}`}
                          </div>
                        </div>
                        <div className="tr">
                          <div className="td">
                            <small>{payment ? payment[0].additional_charge_one_title : ''}</small>
                          </div>
                          <div className="td">
                            {allFormValues.countryId == 'India'
                              ? `+ ${((parseInt(registrationFee) * parseInt(charges.serviceCharge)) / 100).toFixed(2)}`
                              : `+  $ ${((parseInt(registrationFee) * parseInt(charges.serviceCharge)) / 100).toFixed(2)}`}
                          </div>
                        </div>
                        <div className="tr">
                          <div className="td">
                            <small>{payment ? payment[0].additional_charge_two_title : ''}</small>
                          </div>
                          <div className="td">
                            {allFormValues.countryId == 'India'
                              ? `+ ${((parseInt(registrationFee) * parseInt(charges.transactionCharge)) / 100).toFixed(2)}`
                              : `+  $ ${((parseInt(registrationFee) * parseInt(charges.transactionCharge)) / 100).toFixed(
                                  2,
                                )}`}
                            {}
                          </div>
                        </div>
                        <div className="tr">
                          <div className="td text-red1">
                            <small>
                              {allFormValues.discountCouponId ? `Coupon - (${allFormValues.discountCouponId})` : ''}
                            </small>
                          </div>
                          <div className="td text-red1">
                            {allFormValues.discountCouponId
                              ? `- ${
                                  allFormValues.countryId == 'India'
                                    ? (registrationFee - registrationFeeToBePaid).toFixed(2)
                                    : `$ ${(registrationFee - registrationFeeToBePaid).toFixed(2)}`
                                }`
                              : ''}
                          </div>
                        </div>
                        <div className="tr">
                          <div className="td">Amount to pay</div>
                          <div className="td">
                            {allFormValues.countryId == 'India'
                              ? registrationFeeToBePaid.toFixed(2)
                              : `$ ${registrationFeeToBePaid.toFixed(2)}`}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="btn-holder text-center mg-t-80">
                      <button className="btn btn-yellow btn-lg" onClick={() => setPaymentOption('razorpay')}>
                        MAKE PAYMENT
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <Footer footerData={footerDetails} />
        </>
      )}
    </>
  );
};

export default RegistrationCompletePage;
