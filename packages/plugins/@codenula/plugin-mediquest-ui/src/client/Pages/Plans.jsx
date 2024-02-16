import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import PricingCard from '../Components/PricingCard';
import './Plans.css';

import { useRequest } from '@nocobase/client';

const obj1 = {
  title: 'Non-Residential',
  category: 'Registration Category 1:',
  price: '5,000',
  days: 'Valid for 7 days',
  regDetail: 'Conference Registration + travel',
};

const obj2 = {
  title: 'Non-Residential',
  category: 'Registration Category 2',
  price: '10,000',
  days: 'Valid for 7 days',
  regDetail: '',
};

const obj3 = {
  title: 'Residential Registration',
  category: 'Category 1:',
  price: '15,000',
  days: 'Valid for 7 days',
  regDetail: 'Conference Registration + 1 night stay and travel',
};

const obj4 = {
  title: 'Residential Registration',
  category: 'Category 2:',
  price: '25,000',
  days: 'Valid for 7 days',
  regDetail: 'Conference Registration + 2 night stay and travel',
};

var fName;
export default () => {
  const [loading, setLoading] = useState(true);
  const useFetchData = async () => {
    try {
      // const res = await useRequest({ url: 'test:get?filterByTk=1' });

      const res = await useRequest('/test:get?filterByTk=1');

      if (res.data) {
        try {
          // Check if res.data is already an object
          const responseData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          if (responseData) {
            setLoading(false);
            console.log(responseData.data.firstName);
            fName = responseData.data.firstName;
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      } else {
        console.error('No data received from the request.');
      }
    } catch (error) {
      console.error('Error in request:', error);
    }
  };
  // useEffect(() => {
  //   useFetchData();
  // }, [loading]);

  useFetchData();

  return (
    <>
      <Navbar />
      <div className="section">
        <div className="heading">Choose your pricing plan</div>
        <div className="plans">
          <div className="plan-row">
            <PricingCard arr={obj1} />
            <PricingCard arr={obj2} />
            <PricingCard arr={obj3} />
          </div>
          <div className="plan-row">
            <PricingCard arr={obj4} />
          </div>
        </div>
        <div>
        </div>
      </div>

      <Footer />
    </>
  );
};
