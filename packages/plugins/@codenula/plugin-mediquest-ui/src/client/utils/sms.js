import fetch from 'node-fetch';

export async function sendSMS(mobile_no, attendeeId) {
  try {
    const body = {
      mobile_no: mobile_no,
      attendeeId: attendeeId,
    };
    await fetch('http://localhost:15000/api/send:sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw err;
  }
}
export async function sendEmail(email, attendeeId) {
  try {
    const body = {
      email: email,
      attendeeId: attendeeId,
    };
    await fetch('http://localhost:15000/api/send:email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw err;
  }
}
