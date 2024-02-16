import { COLLECTION_AUTH_TOKEN } from '../../myvars';
import fetch from 'node-fetch';

export async function getCity() {
  const cityURL = `https://mediquest.codenula.com/api/test_cities:list?pageSize=1000`;
  const cityData = await fetch(cityURL, {
    method: 'GET',
    headers: {
      Authorization: COLLECTION_AUTH_TOKEN,
    },
  });
  const myData = await cityData.json();
  var cityNames = [];
  await myData.data.map((i) => {
    cityNames.push(i);
  });
  return cityNames;
}

export async function getState() {
  const stateURL = `https://mediquest.codenula.com/api/test_states:list?pageSize=1000`;
  const stateData = await fetch(stateURL, {
    method: 'GET',
    headers: {
      Authorization: COLLECTION_AUTH_TOKEN,
    },
  });
  const myData = await stateData.json();
  var stateNames = [];
  await myData.data.map((i) => {
    stateNames.push(i);
  });
  return stateNames;
}

export async function getCountry() {
  const countryURL = `https://mediquest.codenula.com/api/test_countries:list?pageSize=100000`;
  const countryData = await fetch(countryURL, {
    method: 'GET',
    headers: {
      Authorization: COLLECTION_AUTH_TOKEN,
    },
  });
  const myData = await countryData.json();
  var countryNames = [];
  await myData.data.map((i) => {
    countryNames.push(i);
  });
  return countryNames;
}

export function getCountryCode(countryId, country) {
  var countryObj;
  country.forEach((c) => {
    if (c.country_name == countryId) {
      countryObj = c;
    }
  });
  const countryCode = countryObj.country_code;
  return countryCode;
}

export async function getPaymentCategories() {
  const paymentURL = `https://mediquest.codenula.com/api/payment_category:list?pageSize=1000`;
  const paymentData = await fetch(paymentURL, {
    method: 'GET',
    headers: {
      Authorization: COLLECTION_AUTH_TOKEN,
    },
  });
  const myData = await paymentData.json();
  var paymentCategories = [];
  await myData.data.map((i) => {
    const paymentOption = {
      category_name: i.category_name,
      payment_amount: i.payment_amount,
      early_bird_date: i.early_bird_date,
      early_bird_inr: i.early_bird_inr,
      advanced_date: i.advanced_date,
      advanced_rate: i.advanced_rate,
      advanced_rate_inr: i.advanced_rate_inr,
      regular_date: i.regular_date,
      regular_rate: i.regular_rate,
      regular_rate_inr: i.regular_rate_inr,
      service_dollars: i.service_dollars,
      service_rupees: i.service_rupees,
      transaction_dollars: i.transaction_dollars,
      transaction_rupees: i.transaction_rupees,
      additional_charge_one_title: i.additional_charge_one_title,
      additional_charge_two_title: i.additional_charge_two_title,
    };
    paymentCategories.push(paymentOption);
  });
  return paymentCategories;
}

export async function getAllCoupons() {
  try {
    const couponURL = 'https://mediquest.codenula.com/api/discount_coupon:list?pageSize=1000';
    const discountData = await fetch(couponURL, {
      method: 'GET',
      headers: {
        Authorization: COLLECTION_AUTH_TOKEN,
      },
    });
    const myData = await discountData.json();
    var allCoupon = [];
    myData.data.map((i) => {
      allCoupon.push(i);
    });
    return allCoupon;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

export async function getFooter() {
  const footerURL = `https://mediquest.codenula.com/api/footer:get?appends%5B%5D=company_logo&filterByTk=1`;
  const footerData = await fetch(footerURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: COLLECTION_AUTH_TOKEN,
    },
  });
  const data = await footerData.json();
  return data.data;
}
export async function getVenue(id) {
  const footerURL = `https://mediquest.codenula.com/api/event_master_venue:get?appends%5B%5D=country&appends%5B%5D=state&appends%5B%5D=city&appends%5B%5D=faculty&appends%5B%5D=agenda&appends%5B%5D=venue_images&filterByTk=${parseInt(
    id,
  )}`;
  const venueData = await fetch(footerURL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: COLLECTION_AUTH_TOKEN,
    },
  });
  const data = await venueData.json();
  return data.data;
}
export async function getAgendaDetails(id) {
  try {
    const agendaURL = `https://mediquest.codenula.com/api/event_master_agenda:get?appends%5B%5D=agenda_pdf&filterByTk=${id}`;
    const agendaData = await fetch(agendaURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: COLLECTION_AUTH_TOKEN,
      },
    });
    if (!agendaData.ok) {
      throw new Error('Failed to fetch agenda details');
    }
    const data = await agendaData.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching agenda details:', error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}
