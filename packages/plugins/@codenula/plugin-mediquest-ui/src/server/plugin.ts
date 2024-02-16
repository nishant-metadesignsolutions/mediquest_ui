import { InstallOptions, Plugin } from '@nocobase/server';
import cors from '@koa/cors';
import fetch from 'node-fetch';
import crypto from 'crypto';
import https from 'https';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { COLLECTION_AUTH_TOKEN, RAZORPAY_API_KEY, RAZORPAY_API_SECRET } from '../myvars';
import { sendEmail, sendSMS } from '../client/utils/sms';
import { getCountry, getCountryCode } from '../client/utils/getData';

const getOrderDetails = async (orderID) => {
  const data = await fetch('http://localhost:15000/api/razorPay:getOrder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ order_id: orderID }),
  });

  const res = await data.json();
  const allPayment = res.data.items;
  const lastPayment = allPayment[allPayment.length - 1];
  return lastPayment;
};
async function updatePaymentStatusFailed(paymentAttempted, attendeeId) {
  const attendeeUpdateURL = `https://mediquest.codenula.com/api/attendees:update?filterByTk=${parseInt(attendeeId)}`;
  const updatePayment = await fetch(attendeeUpdateURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: COLLECTION_AUTH_TOKEN,
    },
    body: JSON.stringify({ paymentStatus: 'Failed', paymentsAttemptedId: paymentAttempted }),
  });
  const res = await updatePayment.json();
  console.log(res);
  return res.data[0].id;
}
async function updatePaymentStatusFailedFromRazorpay(orderId, paymentAttempted) {
  const attendeeURL = `https://mediquest.codenula.com/api/attendees:update?filter={"razorpay_order_id":${orderId}}`;
  const updatePayment = await fetch(attendeeURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: COLLECTION_AUTH_TOKEN,
    },
    body: JSON.stringify({ paymentStatus: 'Failed', paymentsAttemptedId: paymentAttempted }),
  });
  const res = await updatePayment.json();
  console.log(res);
  return res.data[0].id;
}
async function updatePaymentStatusSuccess(paymentAttempted, attendeeId) {
  const attendeeUpdateURL = `https://mediquest.codenula.com/api/attendees:update?filterByTk=${parseInt(attendeeId)}`;
  const updatePayment = await fetch(attendeeUpdateURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: COLLECTION_AUTH_TOKEN,
    },
    body: JSON.stringify({ paymentStatus: 'Completed', paymentsAttemptedId: paymentAttempted }),
  });
  const res = await updatePayment.json();
  console.log(res);
  return res.data[0].id;
}
async function updatePaymentStatusSuccessFromRazorpay(orderId, paymentAttempted) {
  const attendeeURL = `https://mediquest.codenula.com/api/attendees:update?filter={"razorpay_order_id":${orderId}}`;
  const updatePayment = await fetch(attendeeURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: COLLECTION_AUTH_TOKEN,
    },
    body: JSON.stringify({ paymentStatus: 'Completed', paymentsAttemptedId: paymentAttempted }),
  });
  const res = await updatePayment.json();
  console.log(res);
  return res.data[0].id;
}
async function createPaymentAttempted(body) {
  const paymentAttemptedURL = 'https://mediquest.codenula.com/api/paymentsAttempted:create';
  const requestBody = {
    payment_id: body.id,
    payment_status: body.status,
    payment_amount: body.amount / 100,
    payment_date: new Date(),
    order_id: body.order_id,
  };
  const createPayment = await fetch(paymentAttemptedURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: COLLECTION_AUTH_TOKEN,
    },
    body: JSON.stringify(requestBody),
  });
  const res = await createPayment.json();
  console.log(res);
  return res.data;
}
async function updatePaymentStatusPending(orderId, paymentAttempted) {
  const attendeeURL = `https://mediquest.codenula.com/api/attendees:update?filter={"razorpay_order_id":${orderId}}`;
  const updatePayment = await fetch(attendeeURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: COLLECTION_AUTH_TOKEN,
    },
    body: JSON.stringify({ paymentsAttemptedId: paymentAttempted }),
  });
  const res = await updatePayment.json();
  console.log(res);
  return res.data[0].id;
}

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587, // port for secure SMTP
  secure: false,
  auth: {
    user: 'info@mediquest.in',
    pass: 'b5YtcfG6yqB21mVx',
  },
});

const mailOptions = {
  from: 'info@accasia2024.in',
  to: 'nishant@metadesignsolutions.co.uk',
  subject: 'mediquest',
  text: 'hello from mediquest',
};

export class PluginMediquestUiServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.resource({
      name: 'razorPay',
      actions: {
        async createOrder(ctx, next) {
          const data = ctx.request.body;
          const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${btoa(`${RAZORPAY_API_KEY}:${RAZORPAY_API_SECRET}`)}`,
            },
            body: JSON.stringify({
              amount: parseInt(data.amtToPay) * 100,
              currency: data.currency,
            }),
          };
          await fetch('https://api.razorpay.com/v1/orders', requestOptions)
            .then((response) => response.json())
            .then((data) => (ctx.body = data))
            .catch((error) => console.error('Error:', error));
          next();
        },
        async getOrder(ctx, next) {
          const data = ctx.request.body;
          const requestOptions = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${btoa(`${RAZORPAY_API_KEY}:${RAZORPAY_API_SECRET}`)}`,
            },
          };
          await fetch(`https://api.razorpay.com/v1/orders/${data.order_id}/payments`, requestOptions)
            .then((response) => response.json())
            .then((data) => (ctx.body = data))
            .catch((error) => console.error('Error:', error));
          next();
        },
        async verifyPayment(ctx, next) {
          // const body = await ctx.response;
          const response = await ctx.request.body;
          const queryParams = ctx.action.params;
          const eventId = queryParams.eventId;
          const attendeeId = queryParams.attendeeId;
          const orderId = queryParams.orderId;
          const formValues = JSON.parse(decodeURIComponent(queryParams.formValues));

          const res = await getOrderDetails(response.razorpay_order_id);
          if (res.status == 'captured') {
            const paymentAttempted = await createPaymentAttempted(res);
            const attendeeId = await updatePaymentStatusSuccess(paymentAttempted.id, queryParams.attendeeId);
            const country = await getCountry();
            const countryCode = await getCountryCode(formValues.countryId, country);
            const mobNo = countryCode + formValues.contact_number;
            if (formValues.countryId == 'India') {
              await sendSMS(mobNo, parseInt(attendeeId));
            }
            await sendEmail(formValues.email_id, parseInt(attendeeId));
            ctx.redirect(
              `http://localhost:15000/events/${eventId}/payment-successfull/${paymentAttempted.payment_id}/${
                queryParams.formValues
              }/${parseInt(attendeeId)}/${res.amount}/${mobNo}`,
            );
          }
        },
        async paymentFailed(ctx, next) {
          const body = ctx.request.body;
          const orderId = body.orderId;
          const res = await getOrderDetails(orderId);

          const paymentAttempted = await createPaymentAttempted(res);
          const attendeeId = await updatePaymentStatusFailed(paymentAttempted.id, body.attendeeId);
          // if (body.attendeeId) {
          //   ctx.body = `http://localhost:15000/events/${body.eventId}/payment-failed/${parseInt(body.attendeeId)}`;
          //   ctx.redirect(`http://localhost:15000/events/${body.eventId}/payment-failed/${parseInt(body.attendeeId)}`);
          // }
        },
        async paymentAuthorizedWebhook(ctx, next) {
          const response = await ctx.request.body;
          const res = await getOrderDetails(response.razorpay_order_id);

          const paymentAttempted = await createPaymentAttempted(res);
          const attendeeId = await updatePaymentStatusPending(response.razorpay_order_id, paymentAttempted.id);
        },
        async paymentCapturedWebhook(ctx, next) {
          const response = await ctx.request.body;
          const res = await getOrderDetails(response.razorpay_order_id);

          const paymentAttempted = await createPaymentAttempted(res);
          const attendeeId = await updatePaymentStatusSuccessFromRazorpay(
            response.razorpay_order_id,
            paymentAttempted.id,
          );
        },
        async paymentFailedWebhook(ctx, next) {
          const response = await ctx.request.body;
          const res = await getOrderDetails(response.razorpay_order_id);

          const paymentAttempted = await createPaymentAttempted(res);
          const attendeeId = await updatePaymentStatusFailedFromRazorpay(
            response.razorpay_order_id,
            paymentAttempted.id,
          );
        },
      },
    });
    this.app.resource({
      name: 'send',
      actions: {
        async sms(ctx, next) {
          const { mobile_no, event_name, attendeeId } = ctx.request.body;
          const customAxios = axios.create({
            httpsAgent: new https.Agent({
              secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
              // Other options if needed
            }),
          });

          const requestOptions = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Accept: '*/*',
              'Accept-Encoding': 'gzip, deflate, br',
            },
          };

          const fullUrl = `https://enterprise.smsgupshup.com/GatewayAPI/rest?msg=Hello%20Doctor,%20Thank%20you%20for%20registering%20for%20ASN%20Kidney%20Week%20Highlights%20India.%20Your%20Registration%20id%20is%20ASN000${attendeeId},%20Mediquest%20Healthcom.&v=1.1&userid=2000175249&password=YGm7VMjuG&maskk=MQEVNT&send_to=${mobile_no}&msg_type=text&method=sendMessage`;
          ctx.body = fullUrl;
          try {
            // Use the customAxios instance in the fetch request
            const response = await customAxios.get(fullUrl, requestOptions);

            // Process the response as needed
            console.log(response.data);
          } catch (error) {
            // Handle errors
            console.error('Error:', error.message);
          }

          // const obj = {
          //   mobile_no,
          //   event_name,
          //   attendeeId,
          // };
          // ctx.body = obj;
        },
        async email(ctx, next) {
          try {
            const { email, attendeeId } = ctx.request.body;
            const mailOptions = {
              from: 'info@accasia2024.in',
              to: email,
              subject: 'ACC ASIA 2024',
              text: `You've been registered for ACC Asia 2024 program. Your attendee id is: ACC000${attendeeId}`,
            };
            const sendMail = await transporter.sendMail(mailOptions);
            ctx.body = 'email sent!';
          } catch (err) {
            ctx.body = err;
          }
        },
      },
    });

    this.app.acl.allow('razorPay', 'createOrder');
    this.app.acl.allow('razorPay', 'getOrder');
    this.app.acl.allow('razorPay', 'verifyPayment');
    this.app.acl.allow('razorPay', 'paymentFailed');
    this.app.acl.allow('razorPay', 'paymentAuthorizedWebhook');
    this.app.acl.allow('razorPay', 'paymentCapturedWebhook');
    this.app.acl.allow('razorPay', 'paymentFailedWebhook');
    this.app.acl.allow('send', 'sms');
    this.app.acl.allow('send', 'email');
    // this.app.acl.allow('create', 'createAllStates');
    // this.app.acl.allow('create', 'createAllCities');

    this.app.resourcer.use(
      cors({
        origin: () => '*',
      }),
    );
  }

  async install() {}

  async afterEnable() {}

  async afterDisable() {}

  async remove() {}
}

export default PluginMediquestUiServer;
