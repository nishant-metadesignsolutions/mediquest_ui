import { Plugin } from '@nocobase/client';
import React from 'react';
// import { Home } from './Pages/Home';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import './assets2/css/main.min.css';
import './assets2/css/external.css';
// import jQueryJsSrc from './assets2/js/jquery.js';
// import customJsSrc from './assets2/js/custom.js';
import Navbar from './Components/Navbar';
import Home from './Pages/Home'; // Import your components for different routes
import AllEvents from './Pages/AllEvents';
import About from './Pages/About';
import Plans from './Pages/Plans';
import Login from './Pages/Login';
import PaymentPage from './Pages/PaymentPage';
import EventDetails from './Pages/EventDetails';
import { RegistrationForm } from './Pages/RegistrationForm';
import { PolicyPage } from './Pages/PolicyPage';
import { ContactUs } from './Pages/ContactUs';
import RegistrationCompletePage from './Pages/RegistrationCompletePage';
import PaymentSuccessPage from './Pages/PaymentSuccessPage';
import PaymentFailurePage from './Pages/PaymentFailurePage';
import PaymentPendingPage from './Pages/PaymentPendingPage';
import { COLLECTION_AUTH_TOKEN } from '../myvars.js';
import { Home2 } from './Pages/Home2';
import { EventDetailsProvider } from './context/EventDetailsProvider';

// (function () {
//   const script1 = document.createElement('script');
//   script1.src = jQueryJsSrc;
//   script1.async = true;
//   document.body.appendChild(script1);
// })();
// (function () {
//   const script2 = document.createElement('script');
//   script2.src = customJsSrc;
//   script2.async = true;
//   document.body.appendChild(script2);
// })();

const AllEventsUrl =
  'https://mediquest.codenula.com/api/event:list?appends%5B%5D=event_banner&appends%5B%5D=event_card_image&pageSize=10000';
const AllEvent = await fetch(AllEventsUrl, {
  method: 'GET',
  headers: {
    Authorization: COLLECTION_AUTH_TOKEN,
  },
});
const AllEventDataJSON = await AllEvent.json();
// console.log(AllEventData.data);
export const AllEventData = AllEventDataJSON.data;

export class MediquestUiClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    // console.log(this.app);
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
    // add route
    this.app.addComponents({ Navbar });
    this.app.router.add('home', {
      path: '/home',
      element: <Home />,
    });
    this.app.router.add('allEvenets', {
      path: '/allEvents',
      element: <AllEvents />,
    });
    this.app.router.add('/about', {
      path: '/about',
      element: <About />,
    });
    this.app.router.add('plans', {
      path: '/plans',
      element: <Plans />,
    });
    this.app.router.add('login', {
      path: '/login',
      element: <Login />,
    });
    this.app.router.add('/events/:eventId', {
      path: '/events/:eventId',
      element: <EventDetails events={AllEventData} />,
    });
    this.app.router.add(`/events/:eventId/register`, {
      path: '/events/:eventId/register',
      element: <RegistrationForm />,
    });
    this.app.router.add(`/events/:eventId/register/payment/:formValues/:amtToPay/:attendeeId/:orderId`, {
      path: '/events/:eventId/register/payment/:formValues/:amtToPay/:attendeeId/:orderId',
      element: <PaymentPage />,
    });
    this.app.router.add(`/events/:eventId/registered/:formValues/:amtToPay/:netAmt/:attendeeId/:orderId`, {
      path: '/events/:eventId/registered/:formValues/:amtToPay/:netAmt/:attendeeId/:orderId',
      element: <RegistrationCompletePage />,
    });
    this.app.router.add(`/events/:eventId/payment-successfull/:transactionId/:formValues/:attendeeId/:amount/:mobNo`, {
      path: '/events/:eventId/payment-successfull/:transactionId/:formValues/:attendeeId/:amount/:mobNo',
      element: <PaymentSuccessPage />,
    });
    this.app.router.add(`/events/:eventId/payment-failed/:transactionId/:formValues/:attendeeId/:amount/:mobNo`, {
      path: '/events/:eventId/payment-failed/:transactionId/:formValues/:attendeeId/:amount/:mobNo',
      element: <PaymentFailurePage />,
    });
    this.app.router.add(`/payment-pending`, {
      path: '/payment-pending',
      element: <PaymentPendingPage />,
    });
    // this.app.router.remove(`/`);
    this.app.router.add(`/home2`, {
      path: '/home2',
      element: <Home2 />,
    });
    this.app.router.add(`/policies`, {
      path: '/policies',
      element: <PolicyPage />,
    });
    this.app.router.add(`/contact-us`, {
      path: '/contact-us',
      element: <ContactUs />,
    });
    this.app.addProvider(EventDetailsProvider);
  }
}

export default MediquestUiClient;
