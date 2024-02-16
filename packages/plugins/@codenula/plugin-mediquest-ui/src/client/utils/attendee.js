import { COLLECTION_AUTH_TOKEN } from '../../myvars';
export async function createAttendee(orderId, stateAndCity, formValues, formData) {
  try {
    const attendeeURL = 'https://mediquest.codenula.com/api/attendees:create';
    const requestBody = {
      cityId: formValues.countryId == 'India' ? stateAndCity.cityId : null,
      stateId: formValues.countryId == 'India' ? stateAndCity.stateId : null,
      paymentsAttemptedId: formValues.paymentsAttemptedId || null,
      Attendee_country: formValues.countryId || null,
      countryId: stateAndCity.countryId || null,
      country_code: stateAndCity.country_code || null,
      attendee_last_name: formValues.last_name || null,
      attendee_email: formValues.email_id || null,
      attendee_address: formValues.address || null,
      attendee_salutation: formValues.salutation || null,
      attendee_alternate_email: formValues.alternate_email || null,
      attendee_qualifications: formValues.qualification || [],
      attendee_pincode: formValues.pincode || null,
      attendee_alternate_mobile_no: formValues.alternate_mobile_number || null,
      eventId: formData.eventId,
      attendee_first_name: formValues.first_name || null,
      attendee_date_of_birth: formValues.date_of_birth || null,
      attendee_gender: formValues.gender || null,
      attendee_gender_others: formValues.gender == 'other' ? formValues.gender_others : null,
      attendee_years_of_practise: formValues.no_of_yrs_in_practice || null,
      attendee_affiliated_institution: formValues.affiliated_institution || null,
      attendee_hospital: formValues.hospital || null,
      attendee_profession: formValues.profession || null,
      attendee_practise_description: formValues.description_of_practice || null,
      attendee_practise_description_others:
        formValues.description_of_practice == 'Others' ? formValues.description_of_practice_others : null,
      attendee_areas_of_interest: formValues.areas_of_interest || [],
      attendee_contact_number: formValues.contact_number || null,
      paymentStatus: 'Pending',
      razorpay_order_id: orderId || null,
      other_state: formValues.countryId != 'India' ? formValues.stateId : null,
      other_city: formValues.countryId != 'India' ? formValues.cityId : null,
    };

    const createAttendeeResponse = await fetch(attendeeURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: COLLECTION_AUTH_TOKEN,
      },
      body: JSON.stringify(requestBody),
    });

    if (!createAttendeeResponse.ok) {
      // Handle non-OK responses here
      throw new Error(`Failed to create attendee. Status: ${createAttendeeResponse.status}`);
    }

    const attendeeData = await createAttendeeResponse.json();
    return attendeeData.data.id;
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error('Error creating attendee:', error);
    // You might want to do some error handling or show a user-friendly error message here
    throw error;
  }
}
