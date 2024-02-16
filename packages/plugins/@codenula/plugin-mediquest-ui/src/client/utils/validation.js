export function validatePhoneNumber() {
  if (document.getElementById('phoneNumber')) {
    const phoneNumberInput = document.getElementById('phoneNumber');
    const phoneNumberError = document.getElementById('phoneNumber-error');

    // Phone Number Validation
    const phoneNumberPattern = /^[0-9]{10}$/;
    if (!phoneNumberPattern.test(phoneNumberInput.value)) {
      phoneNumberError.textContent = 'Enter a valid 10-digit phone number';
      return false;
    } else {
      phoneNumberError.textContent = '';
    }
  }

  return true;
}

export function validatePhoneNumberInternational() {
  if (document.getElementById('phoneNumber')) {
    const phoneNumberInput = document.getElementById('phoneNumber');
    const phoneNumberError = document.getElementById('phoneNumber-error');

    // Phone Number Validation
    const phoneNumberPattern = /^\+?[0-9\s-]{10,15}$/;
    if (!phoneNumberPattern.test(phoneNumberInput.value)) {
      phoneNumberError.textContent = 'Enter a valid phone number';
      return false;
    } else {
      phoneNumberError.textContent = '';
    }
  }

  return true;
}

export function validateEmail() {
  if (document.getElementById('email')) {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');

    // Email Validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(emailInput.value)) {
      emailError.textContent = 'Enter a valid email address';
      return false;
    } else {
      emailError.textContent = '';
    }
  }

  return true;
}

export function validatePincodeInternational() {
  if (document.getElementById('pincode')) {
    const pincodeInput = document.getElementById('pincode');
    const pincodeError = document.getElementById('pincode-error');

    // Pincode Validation
    const pincodePattern = /^[0-9a-zA-Z\s-]{3,10}$/;
    if (!pincodePattern.test(pincodeInput.value)) {
      pincodeError.textContent = 'Enter a valid postal code';
      return false;
    } else {
      pincodeError.textContent = '';
    }
  }

  return true;
}

export function validatePincode() {
  if (document.getElementById('pincode')) {
    const pincodeInput = document.getElementById('pincode');
    const pincodeError = document.getElementById('pincode-error');

    // Pincode Validation
    const pincodePattern = /^[0-9]{6}$/;
    if (!pincodePattern.test(pincodeInput.value)) {
      pincodeError.textContent = 'Enter a valid 6-digit pincode';
      return false;
    } else {
      pincodeError.textContent = '';
    }
  }

  return true;
}

export function validateCoupon(isCoupon) {
  if (document.getElementById('coupon')) {
    const couponInput = document.getElementById('coupon');
    const couponError = document.getElementById('coupon-error');

    // Coupon Validation
    if (!isCoupon) {
      couponError.textContent = 'Please enter a valid coupon';
      return false;
    } else if (!couponInput.textContent) {
      couponError.textContent = '';
    } else {
      couponError.textContent = '';
    }

    return true;
  }
}
