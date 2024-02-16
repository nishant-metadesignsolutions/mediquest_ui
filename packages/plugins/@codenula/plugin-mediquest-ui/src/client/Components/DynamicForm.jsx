import React, { useState, useEffect, useMemo, useRef } from 'react';
import { COLLECTION_AUTH_TOKEN } from '../../myvars.js';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader.jsx';
import { Popup } from './Popup.jsx';
import '../assets2/css/main.min.css';
import '../assets2/css/external.css';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { sendEmail, sendSMS } from '../utils/sms.js';
import { useAllEventsData } from '../context/EventDetailsProvider';
import { useAllLoactionData } from '../context/LocationDetailsProvider.jsx';
import { getPaymentCategories, getCountryCode, getAllCoupons } from '../utils/getData.js';
import { createOrder } from '../utils/payment.js';
import { updateCoupon } from '../utils/coupon.js';
import { createAttendee } from '../utils/attendee.js';
import {
  validatePhoneNumber,
  validatePhoneNumberInternational,
  validateEmail,
  validatePincodeInternational,
  validatePincode,
  validateCoupon,
} from '../utils/validation.js';
import StyledText from './StyledText.jsx';

const formDesign = [
  { fields: ['salutation', 'first_name', 'last_name'], style: 'form-row2' },
  { fields: ['gender', 'gender_others', 'date_of_birth'], style: 'form-row3' },
  { fields: ['qualification', 'profession', 'no_of_yrs_in_practice'], style: 'form-row2' },
  {
    fields: ['description_of_practice', 'description_of_practice_others', 'affiliated_institution'],
    style: 'form-row3',
  },
  { fields: ['address', 'pincode'], style: 'form-row2' },
  { fields: ['countryId', 'stateId', 'cityId'], style: 'form-row3' },
  { fields: ['contact_number', 'email_id'], style: 'form-row3' },
  { fields: ['areas_of_interest'], style: '' },
  { fields: ['paymentId'], style: '' },
  { fields: ['discountCouponId'], style: 'form-row2' },
];

export const DynamicForm = ({ formData }) => {
  const [city, setCity] = useState([]);
  const [state, setState] = useState([]);
  const [country, setCountry] = useState([]);
  const [payment, setPayment] = useState([]);
  const [allDiscount, setDiscount] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [lloading, setLoading] = useState(false);
  const [event, setEvent] = useState({});
  const [filteredCities, setFilteredCities] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const formRef = useRef(null);
  const { allEvents, loading, footerDetails } = useAllEventsData();
  const { countryList, stateList, cityList, loadingLocation } = useAllLoactionData();
  const [initialFormValues, setInitialFormValues] = useState({});
  const [isFormEdited, setFormEdited] = useState(false);
  const accEvent = useMemo(() => {
    // Select the event you want to use
    return allEvents[1];
  }, [allEvents]);
  console.log(accEvent);
  if (accEvent) {
    console.log(accEvent.important_note);
  }
  useEffect(() => {
    (async () => {
      try {
        const eventURL = `https://mediquest.codenula.com/api/event:get?filterByTk=${parseInt(
          formData.eventId,
        )}&pageSize=1000`;
        const eventData = await fetch(eventURL, {
          method: 'GET',
          headers: {
            Authorization: COLLECTION_AUTH_TOKEN,
          },
        });
        const myData = await eventData.json();
        setEvent(myData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setEvent({}); // or handle the error appropriately
      }
    })();
  }, [formData.eventId]);

  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      try {
        if (formData.cityId !== null && formData.cityId !== undefined && formData.cityId !== '') {
          setCity(cityList);
        }

        if (formData.stateId !== null && formData.stateId !== undefined && formData.stateId !== '') {
          setState(stateList);
        }

        if (formData.countryId !== null && formData.countryId !== undefined && formData.countryId !== '') {
          setCountry(countryList);
        }

        if (formData.paymentId !== null && formData.paymentId !== undefined && formData.paymentId !== '') {
          const paymentCategories = await getPaymentCategories();
          setPayment(paymentCategories);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [formData.cityId, formData.stateId, formData.countryId, formData.paymentId]);
  useEffect(() => {
    const fetchStates = async () => {
      const stId = await getStateAndCityId();
      var curCountry;
      country.forEach((c) => {
        if (c.id == stId.countryId) {
          curCountry = c;
        }
      });

      const stateItems = [];
      state.forEach((s) => {
        if (s.countryId == curCountry.id) {
          stateItems.push(s);
        }
      });

      setFilteredStates(stateItems);
    };
    const fetchCities = async () => {
      const stId = await getStateAndCityId();
      var curState;
      state.forEach((s) => {
        if (s.id == stId.stateId) {
          curState = s;
        }
      });

      const cityItems = [];
      city.forEach((c) => {
        if (c.stateId == curState.id) {
          cityItems.push(c);
        }
      });

      setFilteredCities(cityItems);
    };
    if (formValues.countryId && formValues.countryId == 'India') {
      fetchStates();
    }
    if (formValues.countryId && formValues.countryId == 'India' && formValues.stateId) {
      fetchCities();
    }
  }, [formValues, city, state, country]);
  const fieldsToIgnore = ['updatedById', 'createdById', 'createdAt', 'updatedAt', 'eventId', 'paymentCategory', 'id'];
  const no_of_yrs_in_practice = ['0-5', '5-10', '10-15', '15-20', '20-25', '25+'];
  const getStateAndCityId = async () => {
    const stateAndCity = {
      countryId: '',
      country_code: '',
      stateId: '',
      cityId: '',
    };
    if (formValues.cityId) {
      city.forEach((c) => {
        if (
          c.city_name ==
          formValues.cityId.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
            return a.toUpperCase();
          })
        ) {
          stateAndCity.cityId = c.id;
        }
      });
    }

    if (formValues.stateId) {
      state.forEach((s) => {
        if (s.state_name == formValues.stateId) {
          stateAndCity.stateId = s.id;
        } else if (
          s.state_name ==
          formValues.stateId.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
            return a.toUpperCase();
          })
        ) {
          stateAndCity.stateId = s.id;
        }
      });
    }

    if (formValues.countryId) {
      country.forEach((s) => {
        if (s.country_name == formValues.countryId) {
          stateAndCity.countryId = s.id;
          stateAndCity.country_code = s.country_code;
        } else if (
          s.country_name ==
          formValues.countryId.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
            return a.toUpperCase();
          })
        ) {
          stateAndCity.countryId = s.id;
          stateAndCity.country_code = s.country_code;
        }
      });
    }
    return stateAndCity;
  };
  const handleInputChange = (event) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [event.target.name]: event.target.value,
    }));
    // Mark the form as edited when there's an input change
    setFormEdited(true);
  };
  const renderInputField = (key, value) => {
    const handleInputChange = (event) => {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        [key]: event.target.value,
      }));
    };
    const handleCheckboxChange = (event) => {
      setFormValues((prevFormValues) => {
        const currentValue = prevFormValues[key] || [];
        const updatedValues = event.target.checked
          ? [...currentValue, event.target.value]
          : currentValue.filter((item) => item !== event.target.value);

        return {
          ...prevFormValues,
          [key]: updatedValues,
        };
      });
    };
    const handleRadioChange = (event) => {
      setFormValues((prevFormValues) => ({
        ...prevFormValues,
        [key]: event.target.value,
      }));
    };
    if (fieldsToIgnore.includes(key)) {
      return null;
    }
    if (key === 'no_of_yrs_in_practice') {
      // Render dropdown for stateId
      return (
        <div className="form-col">
          <div key={key} className="form-group">
            <label>{key.toUpperCase().replace(/_/g, ' ')}:</label>
            <div className="textbox-inner">
              <select className="form-control" onChange={handleInputChange}>
                <option value={''}>Please Select</option>
                {no_of_yrs_in_practice.map((yearOfPractice) => (
                  <option key={yearOfPractice} value={yearOfPractice} style={{ width: '500px' }}>
                    {yearOfPractice.toUpperCase().replace(/_/g, ' ')} years
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      );
    } else if (key === 'date_of_birth' && value !== null && value !== undefined && value !== '') {
      // Render multiple select checkbox for arrays
      return (
        <div className="form-col">
          <div className="form-group" key={key}>
            <label>{key.toUpperCase().replace(/_/g, ' ')}:</label>
            <div className="textbox-inner">
              <input className="form-control" type="date" name={key} id={key} onChange={handleInputChange} />
            </div>
          </div>
        </div>
      );
    } else if (key === 'profession' && Array.isArray(value) && value.length > 0) {
      // Render multiple select checkbox for arrays
      // style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
      return (
        <div className="form-col">
          <div key={key} className="form-group">
            <label>{key.toUpperCase().replace(/_/g, ' ')}:</label>
            <div className="textbox-inner" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {value.map((item) => (
                <label
                  key={item}
                  style={{
                    fontSize: '10px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: '15px',
                    marginLeft: '10px',
                  }}
                >
                  <input
                    type="radio"
                    className="form-control"
                    name={`${key}-radio-group`}
                    value={item}
                    onChange={handleRadioChange}
                    style={{
                      width: '14px',
                      height: '14px',
                      marginRight: '10px',
                    }}
                  />
                  <span>{item.toUpperCase().replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    } else if (key === 'gender' && Array.isArray(value) && value.length > 0) {
      // Render multiple select checkbox for arrays
      return (
        <>
          <div className="form-col">
            <div className="form-group" key={key}>
              <label>{key.toUpperCase().replace(/_/g, ' ')}:</label>
              <div className="textbox-inner">
                <select className="form-control" onChange={handleInputChange}>
                  <option value={''}>Please Select</option>
                  {value.map((currValue) => (
                    <option key={currValue} value={currValue}>
                      {currValue.toUpperCase().replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </>
      );
    } else if (key === 'gender_others') {
      return (
        <>
          <div className="form-col">
            <div className="form-group" key={key}>
              <label style={{ fontStyle: 'italic' }}>Others:</label>
              <div className="textbox-inner">
                <input
                  className="form-control"
                  type="text"
                  onChange={handleInputChange}
                  disabled={formValues.gender !== 'other'}
                />
              </div>
            </div>
          </div>
        </>
      );
    } else if (key === 'description_of_practice' && Array.isArray(value) && value.length > 0) {
      return (
        <>
          <div className="form-col">
            <div className="form-group" key={key}>
              <label>{key.toUpperCase().replace(/_/g, ' ')}:</label>
              <div className="textbox-inner">
                <select className="form-control" onChange={handleInputChange}>
                  <option value={''}>Please Select</option>
                  {value.map((currValue) => (
                    <option key={currValue} value={currValue}>
                      {currValue.toUpperCase().replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </>
      );
    } else if (key === 'description_of_practice_others') {
      // Render multiple select checkbox for arrays
      // const isDescriptionOfPracticeOther = formValues.description_of_practice === 'Others';
      return (
        <>
          <div className="form-col">
            <div className="form-group" key={key}>
              <label style={{ fontStyle: 'italic' }}>Others:</label>
              <div className="textbox-inner">
                <input
                  className="form-control"
                  type="text"
                  onChange={handleInputChange}
                  disabled={formValues.description_of_practice !== 'Others'}
                />
              </div>
            </div>
          </div>
        </>
      );
    } else if (key === 'countryId' && Array.isArray(country) && country.length > 0) {
      // Render dropdown for stateId
      return (
        <div className="form-col">
          <div className="form-group" key={key}>
            <label>COUNTRY: {<span style={{ color: 'red' }}>*</span>}</label>
            <div className="textbox-inner">
              <select className="form-control" onChange={handleInputChange} required>
                <option value={''}>Please Select</option>
                {country.map((countryItem) => (
                  <option key={countryItem.country_name} value={countryItem.country_name}>
                    {countryItem.country_name.toUpperCase().replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      );
    } else if (key === 'stateId' && Array.isArray(state) && state.length > 0) {
      // Render dropdown for stateId
      return (
        <div className="form-col">
          <div className="form-group" key={key}>
            <label>STATE: {formValues.countryId == 'India' && <span style={{ color: 'red' }}>*</span>}</label>
            <div className="textbox-inner">
              {formValues.countryId == 'India' && (
                <select className="form-control" onChange={handleInputChange} required>
                  <option value={''}>Please Select</option>
                  {formValues.countryId &&
                    filteredStates.map((stateItem) => (
                      <option key={stateItem.country_name} value={stateItem.state_name}>
                        {stateItem.state_name.toUpperCase().replace(/_/g, ' ')}
                      </option>
                    ))}
                </select>
              )}
              {formValues.countryId !== 'India' && (
                <input className="form-control" type="text" onChange={handleInputChange} />
              )}
            </div>
          </div>
        </div>
      );
    } else if (key === 'cityId' && Array.isArray(city) && city.length > 0) {
      return (
        <div className="form-col">
          <div className="form-group" key={key}>
            <label>CITY: {<span style={{ color: 'red' }}>*</span>}</label>
            <div className="textbox-inner">
              {formValues.countryId == 'India' && (
                <select className="form-control" onChange={handleInputChange} required>
                  <option value={''}>Please Select</option>
                  {formValues.countryId &&
                    formValues.stateId &&
                    filteredCities.map((cityItem) => (
                      <option key={cityItem.city_name} value={cityItem.city_name}>
                        {cityItem.city_name.toUpperCase().replace(/_/g, ' ')}
                      </option>
                    ))}
                </select>
              )}
              {formValues.countryId != 'India' && (
                <input className="form-control" type="text" onChange={handleInputChange} required />
              )}
            </div>
          </div>
        </div>
      );
    } else if (key !== 'paymentId' && Array.isArray(value) && value.length > 0) {
      // Render multiple select checkbox for arrays
      return (
        <div className="form-col">
          <div className="form-group" key={key}>
            <label>{key.toUpperCase().replace(/_/g, ' ')}:</label>
            <div className="textbox-inner" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {value.map((item) => (
                <label
                  key={item}
                  style={{
                    fontSize: '10px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginRight: '15px',
                  }}
                >
                  <input
                    type="checkbox"
                    className="form-control"
                    value={item}
                    style={{ width: '14px', height: '14px', marginLeft: '8px' }}
                    onChange={handleCheckboxChange}
                  />
                  <span>{item.toUpperCase().replace(/_/g, ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );
    } else if (key === 'paymentId') {
      // Render multiple select checkbox for arrays
      return (
        <div className="form-col">
          <div className="form-group" key={key}>
            <div className="category-tables">
              <h3>Select a Category {<span style={{ color: 'red' }}>*</span>}</h3>
              <div className="table-overflow">
                <table className="tables" style={{ minWidth: '700px' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '40%' }}>
                        {' '}
                        {/* Adjust width for the category column */}
                        <p className="bolds">Category</p>
                      </th>
                      <th style={{ width: '20%' }}>
                        {' '}
                        {/* Adjust width for the Early Bird Rate column */}
                        <p>Early Bird Rate</p>
                        <p className="subtext">Till 16th May, 2024</p>
                      </th>
                      <th style={{ width: '20%' }}>
                        {' '}
                        {/* Adjust width for the Advance Rate column */}
                        <p>Advance Rate</p>
                        <p className="subtext">Till 9th Aug, 2024</p>
                      </th>
                      <th style={{ width: '20%' }}>
                        {' '}
                        {/* Adjust width for the Regular column */}
                        <p>Regular</p>
                        <p className="subtext">Spot Registration</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payment.map((item) => (
                      <tr key={item.category_name}>
                        <td className="gray">
                          <label
                            style={{
                              display: 'flex',
                              alignItems: 'center', // Align items vertically centered
                              marginLeft: '10px',
                            }}
                          >
                            <input
                              type="radio"
                              className="form-control"
                              name={`${key}-radio-group`}
                              value={item.category_name}
                              onChange={handleRadioChange}
                              style={{
                                width: '24px', // Fixed width for the radio button
                                height: '24px', // Fixed height for the radio button
                                marginRight: '12px', // Add spacing between radio button and text
                              }}
                              required
                            />
                            <p
                              className="bolds"
                              style={{
                                // maxWidth: '450px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.category_name.toUpperCase().replace(/_/g, ' ')}
                            </p>
                          </label>
                        </td>
                        <td className="pink">
                          <p>{formValues.countryId == 'India' ? item.early_bird_inr : `$ ${item.payment_amount}`}</p>
                        </td>
                        <td className="yellow">
                          <p>{formValues.countryId == 'India' ? item.advanced_rate_inr : `$ ${item.advanced_rate}`}</p>
                        </td>
                        <td className="white">
                          <p>{formValues.countryId == 'India' ? item.regular_rate_inr : `$ ${item.regular_rate}`}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (key === 'discountCouponId') {
      // Render input field for non-empty values
      return (
        <div className="form-col">
          <div className="form-group" key={key}>
            <label>If you have a coupon, kindly enter it here.</label>
            <div className="textbox-inner">
              <input className="form-control" type="text" onChange={handleInputChange} id="coupon" />
              <div id="coupon-error" style={{ color: 'red' }}></div>
            </div>
          </div>
        </div>
      );
    } else if (key === 'email_id') {
      // Render input field for email
      return (
        <div className="form-col">
          <div className="form-group" key={key}>
            <label>
              {key.toUpperCase().replace(/_/g, ' ')}: {<span style={{ color: 'red' }}>*</span>}
            </label>
            <div className="textbox-inner">
              <input className="form-control" type="text" onChange={handleInputChange} id="email" required />
              <div id="email-error" style={{ color: 'red' }}></div>
            </div>
          </div>
        </div>
      );
    } else if (key === 'contact_number') {
      // Render input field for mobile number
      return (
        <>
          <div className="form-col">
            <div className="form-group">
              <label>COUNTRY CODE</label>
              <div className="textbox-inner">
                <input
                  type="text"
                  className="form-control country-code"
                  value={formValues.countryId ? `+ ${getCountryCode(formValues.countryId, country)}` : ''}
                  disabled
                  style={{ maxWidth: '85%', marginRight: '7px' }}
                />
              </div>
            </div>
          </div>
          <div className="form-col">
            <div className="form-group" key={key}>
              <label>
                {key.toUpperCase().replace(/_/g, ' ')}: {<span style={{ color: 'red' }}>*</span>}
              </label>
              <div className="textbox-inner">
                <div className="contact-info">
                  <span>
                    <span>
                      <input
                        className="form-control"
                        type="text"
                        onChange={handleInputChange}
                        id="phoneNumber"
                        required
                      />
                    </span>
                  </span>
                </div>
                <div id="phoneNumber-error" style={{ color: 'red' }}></div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (key === 'first_name' || key === 'last_name') {
      // Render input field for non-empty values
      return (
        <div className="form-col">
          <div className="form-group" key={key}>
            <label>
              {key.toUpperCase().replace(/_/g, ' ')}: {<span style={{ color: 'red' }}>*</span>}
            </label>
            <div className="textbox-inner">
              <input className="form-control" type="text" onChange={handleInputChange} required />
            </div>
          </div>
        </div>
      );
    } else if (key === 'pincode') {
      // Render input field for non-empty values
      return (
        <div className="form-col">
          <div className="form-group" key={key}>
            <label>
              {key.toUpperCase().replace(/_/g, ' ')}: {<span style={{ color: 'red' }}>*</span>}
            </label>
            <div className="textbox-inner">
              <div>
                <span>
                  <span>
                    <input className="form-control" type="text" onChange={handleInputChange} id="pincode" required />
                  </span>
                </span>
              </div>
              <div id="pincode-error" style={{ color: 'red' }}></div>
            </div>
          </div>
        </div>
      );
    } else if (value !== null && value !== undefined && value !== '') {
      // Render input field for non-empty values
      return (
        <div className="form-col">
          <div className="form-group" key={key}>
            <label>{key.toUpperCase().replace(/_/g, ' ')}:</label>
            <div className="textbox-inner">
              <input className="form-control" type="text" onChange={handleInputChange} />
            </div>
          </div>
        </div>
      );
    } else {
      // Skip rendering for blank or null values
      return null;
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const allCoupon = await getAllCoupons();
        if (JSON.stringify(allDiscount) !== JSON.stringify(allCoupon)) {
          setDiscount(allCoupon);
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, [allDiscount]);
  var amtToPay;
  const handleSubmit = async (event) => {
    event.preventDefault();
    formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    async () => setLoading(true);
    // await updateCoupon(2, 49).then(console.log('yes coupon updated: pleack check!!'));

    // Check email and phone number validations
    if (!validateEmail()) {
      return;
    } else if (
      formValues.countryId != 'India' &&
      (!validatePhoneNumberInternational() || !validatePincodeInternational())
    ) {
      return;
    } else if (formValues.countryId == 'India' && (!validatePhoneNumber() || !validatePincode())) {
      return;
    }
    if (!event.target.checkValidity()) {
      // If not valid, the browser will show required field messages
      return;
    }
    setInitialFormValues(formValues);
    setFormEdited(true);

    var myC = 'Invalid Code';
    //   console.log(payment);
    if (
      formValues.discountCouponId !== null &&
      formValues.discountCouponId !== undefined &&
      formValues.discountCouponId !== ''
    ) {
      allDiscount.forEach((i) => {
        if (
          i.coupon_code == formValues.discountCouponId &&
          new Date(i.coupon_validity) >= new Date() &&
          i.coupon_user_count > 0
        ) {
          myC = i;
        }
      });

      if (myC !== 'Invalid Code') {
        validateCoupon(true);
      } else {
        validateCoupon(false);
        return;
      }
    }
    setTimeout(() => {
      setLoading(false);
      setPopupOpen(true);
    }, 1000);
    // Add your logic to handle the form submission
  };

  const closePopup = () => {
    setPopupOpen(false);
    // Reset form edited state
    setFormEdited(false);
  };

  const onVerifiedAndSubmit = async () => {
    var toPay;
    var amtToPay = 0;
    var netAmt;

    setFormEdited(false);
    const curDate = new Date();
    let serviceCharge;
    let transactionCharge;
    payment.forEach((i) => {
      if (i.category_name == formValues.paymentId) {
        if (curDate <= new Date(i.early_bird_date)) {
          if (formValues.countryId == 'India') {
            toPay = i.early_bird_inr;
            serviceCharge = i.service_rupees;
            transactionCharge = i.transaction_rupees;
          } else {
            toPay = i.payment_amount;
            serviceCharge = i.service_dollars;
            transactionCharge = i.transaction_dollars;
          }
        } else if (curDate > new Date(i.early_bird_date) && curDate <= new Date(i.advanced_date)) {
          if (formValues.countryId == 'India') {
            toPay = i.advanced_rate_inr;
            serviceCharge = i.service_rupees;
            transactionCharge = i.transaction_rupees;
          } else {
            toPay = i.advanced_rate;
            serviceCharge = i.service_dollars;
            transactionCharge = i.transaction_dollars;
          }
        } else {
          if (formValues.countryId == 'India') {
            toPay = i.regular_rate_inr;
            serviceCharge = i.service_rupees;
            transactionCharge = i.transaction_rupees;
          } else {
            toPay = i.regular_rate;
            serviceCharge = i.service_dollars;
            transactionCharge = i.transaction_dollars;
          }
        }
        if (toPay) {
          amtToPay = toPay;
          netAmt = toPay;
          return;
        }
      }
    });
    toPay = parseInt(toPay) + (parseInt(toPay) * parseInt(serviceCharge)) / 100; // adding service charge
    toPay = parseInt(toPay) + (parseInt(toPay) * parseInt(transactionCharge)) / 100; // adding transaction charge
    amtToPay = toPay;
    if (formValues.discountCouponId) {
      const myC = allDiscount.find((i) => i.coupon_code == formValues.discountCouponId);
      if (myC && new Date(myC.coupon_validity) >= new Date() && myC.coupon_user_count > 0) {
        amtToPay =
          parseInt(toPay) -
          Math.min(myC.coupon_max_amount, parseInt((parseInt(toPay) * parseInt(myC.coupon_discount_percentage)) / 100));
        const newCount = parseInt(myC.coupon_user_count) - 1;
        for (let i = 0; i < allDiscount.length; i++) {
          if (allDiscount[i].coupon_code == myC.coupon_code) {
            allDiscount[i].coupon_user_count = parseInt(allDiscount[i].coupon_user_count) - 1;
          }
        }
        await updateCoupon(parseInt(myC.id), parseInt(newCount));
      }
    }
    const currency = formValues.countryId == 'India' ? 'INR' : 'USD';
    const orderId = await createOrder(parseInt(amtToPay), currency);
    const curOrderId = orderId.id;
    const stateAndCity = await getStateAndCityId();
    const attendeeId = await createAttendee(curOrderId, stateAndCity, formValues, formData);
    const eventId = formData.eventId;

    const formValuesString = encodeURIComponent(JSON.stringify(formValues));
    const navigatePath = `/events/${eventId}/registered/${formValuesString}/${amtToPay}/${netAmt}/${parseInt(
      attendeeId,
    )}/${curOrderId}`;
    const mobileNo = `${getCountryCode(formValues.countryId, country) + formValues.contact_number}`;
    if (formValues.countryId == 'India') {
      await sendSMS(mobileNo, parseInt(attendeeId));
    }
    await sendEmail(formValues.email_id, parseInt(attendeeId));
    navigate(navigatePath);
    setPopupOpen(false);
  };
  
  if (!event || loading || loadingLocation) {
    return <Loader />;
  }

  return (
    <>
      {lloading || (loading && <Loader />)}
      {!lloading && (
        <>
          <Navbar />
          <section className="form-box">
            <form
              className="container"
              style={isPopupOpen ? { display: 'none' } : { display: 'block' }}
              ref={formRef}
              onSubmit={handleSubmit}
            >
              <h2>{event.registration_instruction}</h2>
              <h2 className="form-heads">Registration form</h2>

              {formDesign.map((row, rowIndex) => (
                <div key={rowIndex} className={`form-row ${row.style}`}>
                  {row.fields.map((eachField, fieldIndex) => {
                    const fieldValue = formData[eachField];
                    // Check if the field exists in formData and is not empty
                    if (fieldValue !== undefined && fieldValue !== '') {
                      return renderInputField(eachField, fieldValue, handleInputChange, isFormEdited);
                    }
                    return null;
                  })}
                </div>
              ))}

              {/* Display fields in formData that are not covered by formDesign */}
              {Object.keys(formData).map((key) => {
                if (!formDesign.some((row) => row.fields.includes(key))) {
                  const shouldRender = renderInputField(key, formData[key], handleInputChange, isFormEdited);
                  return (
                    shouldRender !== null && (
                      <div key={key} className="form-row">
                        {shouldRender}
                      </div>
                    )
                  );
                }
                return null;
              })}

              <div className="registration-btns">
                <button className="btn btn-yellow btn-lg" type="submit">
                  PROCEED
                </button>
              </div>
              <div className="important-notes-list">
                <StyledText htmlContent={accEvent.important_note} />
              </div>
            </form>
          </section>

          {isPopupOpen && (
            <Popup
              formValues={formValues}
              onClose={closePopup}
              onVerifiedAndSubmit={onVerifiedAndSubmit}
              formDesign={formDesign}
              formData={formData}
              event={accEvent}
            />
          )}
          <Footer footerData={footerDetails} />
        </>
      )}
    </>
  );
};

export default DynamicForm;
