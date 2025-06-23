function getDate(today, daysToAdd, includeDay = true) {

  let newDate = new Date(today);
  newDate.setDate(newDate.getDate() + daysToAdd);

  let year = newDate.getFullYear();
  let  month = String(newDate.getMonth() + 1).padStart(2, '0');
  let day = String(newDate.getDate()).padStart(2, '0');

  return includeDay ? `${year}-${month}-${day}` : `${year}-${month}`;
}

function initializeForm() {
  let shippingStateSelection = document.getElementById("shippingState");
  let billingStateSelection = document.getElementById("billingState");

  shippingStateSelection.innerHTML = '<option value="">Select State</option>';
  billingStateSelection.innerHTML = '<option value="">Select State</option>';

  let states = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut", "Delaware","Florida","Georgia",
    "Hawaii","Idaho","Illinois","Indiana","Iowa", "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
    "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada", "New Hampshire","New Jersey","New Mexico","New York",
    "North Carolina", "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island", "South Carolina","South Dakota",
    "Tennessee","Texas","Utah","Vermont", "Virginia","Washington","West Virginia","Wisconsin","Wyoming"];

  states.forEach(state => {
    let optionS = document.createElement("option");
    optionS.value = state;
    optionS.textContent = state;
    shippingStateSelection.appendChild(optionS);

    let optionB = document.createElement("option");
    optionB.value = state;
    optionB.textContent = state;
    billingStateSelection.appendChild(optionB);
  })

  let today = new Date()
  let preferredDelivery = document.getElementById("delivDate");
  preferredDelivery.value = getDate(today, 5);
  preferredDelivery.min = getDate(today, 2);
  preferredDelivery.max = getDate(today, 30);

  let expiration = document.getElementById("expirationMonth");
  expiration.value = getDate(today, 30);
  expiration.min = getDate(today, -365);
  expiration.max = getDate(today, 365);
}

function updateBilling() {
    let sameAsShipping = document.getElementById("same");

    let shippingFirstInput = document.getElementById("shippingFirst");
    let billingFirstInput = document.getElementById("billingFirst");

    let shippingLastInput = document.getElementById("shippingLast");
    let billingLastInput = document.getElementById("billingLast");

    let shippingAddress= document.getElementById("shippingHome");
    let billingAddress = document.getElementById("billingHome");

    let shippingCityInput = document.getElementById("shippingCity");
    let billingCityInput = document.getElementById("billingCity");

    let shippingZipCode = document.getElementById("shippingZip");
    let billingZipCode = document.getElementById("billingZip");

    let shippingStateSelection = document.getElementById("shippingState");
    let billingStateSelection = document.getElementById("billingState");

    if (sameAsShipping.checked) {
      billingFirstInput.value = shippingFirstInput.value;
      billingLastInput.value = shippingLastInput.value;
      billingAddress.value = shippingAddress.value;
      billingCityInput.value = shippingCityInput.value;
      billingZipCode.value = shippingZipCode.value;
      billingStateSelection.selectedIndex = shippingStateSelection.selectedIndex;
    } else {
      billingFirstInput.value = "";
      billingLastInput.value = "";
      billingAddress.value = "";
      billingCityInput.value = "";
      billingZipCode.value = "";
      billingStateSelection.selectedIndex = 0;

    }
  }

function validateControl(control, name, length) {
  let value = control.value;
  if (!validLength(value, length)) {
    return false;
  } 
    
  if (!validNumber(value)) {
    return false;
  } else {
    return true;
  }
}

function validateCreditCard(control) {
  let value = control.value;
  let cleaned = value.replace(/\s+/g,"");
  let firstDigit = cleaned.charAt(0);

  if (!validNumber(cleaned)) {
    return false;
  }
  
  if (!(/^[3-6]/.test(cleaned))) {
    return false;
  }
      
  switch(firstDigit) {
    case '3':
      return validLength(cleaned, 15);
    case '4':
      return validLength(cleaned, 16);
    case '5':
    case '6':
      return validLength(cleaned, 16);
    default:
      return false;
  }
}

function validateDate(control) {
  let value = control.value;

  let today = new Date();
  let currentMonth = getDate(today, 0, false);

  return value > currentMonth;
}

function validateEmail(control) {
  let value = control.value.trim();
  let email = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return email.test(value);

}

function validateForm() {
  let phoneInput = document.getElementById("phone");
  let emailInput = document.getElementById("email");
  let zipInput = document.getElementsByName("zip");
  let stateSelection = document.getElementsByName("state")
  let cardInput = document.getElementById("card");
  let cvvInput = document.getElementById("cvv");
  let dateSelection = document.getElementById("expiration");

  let errorsExist = false;

  phoneInput.style.borderColor = "";
  phoneInput.title = "";

  emailInput.style.borderColor = "";
  emailInput.title = "";

  for (let input of zipInput) {
    input.style.borderColor = "";
    input.title = "";
  }

  for (let selection of stateSelection) {
    selection.style.borderColor = "";
    selection.title = "";
  }

  cardInput.style.borderColor = "";
  cardInput.title = "";

  cvvInput.style.borderColor = "";
  cvvInput.title = "";

  dateSelection.style.borderColor = "";
  dateSelection.title = "";

  if (!validatePhone(phoneInput)) {
    phoneInput.style.borderColor = "Red";
    phoneInput.title = "Your phone number must be exactly 10 digits long.";

    errorsExist = true;
  }

  if (!validateEmail(emailInput)) {
    emailInput.style.borderColor = "Red";
    emailInput.title = "A valid email looks something like this: name@domain.com";

    errorsExist = true;
  }

  for (input of zipInput) {
    if (!validateControl(input, "Zip Code", 5)) {
      input.style.borderColor = "Red";
      input.title = "Zip Code must be exactly 5 digits.";

      errorsExist = true;
    }
  }

  for (selection of stateSelection) {
    if (!validateState(selection)) {
      selection.style.borderColor = "Red";
      selection.title = "Please select a state.";

      errorsExist = true;
    }
  }

  if (!validateCreditCard(cardInput)) {
    cardInput.style.borderColor = "Red";
    cardInput.title = "Please enter a number starting with 3-6 and containing 15-16 digits.";
    errorsExist = true;
  }

  if (!validateControl(cvvInput, "CVV Code", 3)) {
    cvvInput.style.borderColor = "Red";
    cvvInput.title = "CVV Code must be exactly 3 digits.";
    
    errorsExist = true;
  }

  if (!validateDate(dateSelection)) {
    dateSelection.style.borderColor = "Red";
    dateSelection.title = "Card is expired.";
    errorsExist = true;
  }

  if (errorsExist == true) {
    alert("One or more errors exist. Please try again.");
    return false;
  }

  alert("Payment Submitted");
  return true;
}

function validatePhone(control) {
  let value = control.value;

  cleaned = value.replace(/\D/g, '');

  if (!validNumber(cleaned)) {
    return false;
  }

  if (!validLength(cleaned, 10)) {
    return false;
  }

  return true;
}

function validateState(control) {
  return control.selectedIndex !== 0;
}

function validLength(value, length) {
  return value.length === length;
}

function validNumber(value) {

  return /^[1-9]\d*$/.test(value.trim());
}