import { Plugin } from '@nocobase/client';
import './assets2/css/main.min.css';
import './assets2/css/external.css';
import Navbar from './Components/Navbar';
import About from './Pages/About';
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
import { Home2 } from './Pages/Home2';
import { EventDetailsProvider } from './context/EventDetailsProvider';
import { LocationDetailsProvider } from './context/LocationDetailsProvider';
import React from 'react';

export class PluginMediquestUiClient extends Plugin {
  async afterAdd() {
    // await this.app.pm.add()
  }

  async beforeLoad() {}

  // You can get and modify the app instance here
  async load() {
    console.log(this.app);
    // this.app.addComponents({})
    // this.app.addScopes({})
    // this.app.addProvider()
    // this.app.addProviders()
    // this.app.router.add()
    this.app.addComponents({ Navbar });
    this.app.router.add('/about', {
      path: '/about',
      element: <About />,
    });
    this.app.router.add('login', {
      path: '/login',
      element: <Login />,
    });
    this.app.router.add('/events/:eventId', {
      path: '/events/:eventId',
      element: <EventDetails />,
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
    this.app.addProviders([EventDetailsProvider, LocationDetailsProvider]);
  }
}

export default PluginMediquestUiClient;
