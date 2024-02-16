import fetch from 'node-fetch';

export async function createOrder(ToPay, currency) {
  const data = await fetch('http://localhost:15000/api/razorPay:createOrder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amtToPay: ToPay, currency: currency }),
  })
    .then(async (response) => await response.json())
    .then((data) => {
      console.log(data.data);
      return data.data;
    })
    .catch((error) => console.error('Error:', error));
  return data;
}
