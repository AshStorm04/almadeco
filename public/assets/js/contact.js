// Initialize EmailJS
(function () {
  emailjs.init("1uuImA0pc65_m8NWu");
})();

const form = document.getElementById("contactForm");
const responseMsg = document.getElementById("formResponse");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^(?:21\d{8}|231\d{7}|241[0-7]\d{6}|(?:222[1-4,6-9]|223[1-8]|224[1-7]|225[1-4]|226[1-8]|227[1-5]|228[1-9]|229[1-9]|232[1-5,7]|233[1-3]|234[13]|235[1-3]|237[1-7]|238[124-6]|239[1-7,9]|242[1-8]|243[1-4]|244[1345]|246[1-5,7-8]|249[1-5]|251\d|252[1-4]|253[1-5]|254[124]|255[1-6]|259[1-4]|261\d|262[1-6]|263[1245]|264[1-7]|265[1,3-9]|266[1-6]|267[14]|268[1-5]|269[1-6]|271\d|272[1-5]|273[1-6]|274[1-4,6-7]|275[1-5,7]|276[135]|279[125-7]|281\d|283[1-4]|284[1-4]|289[1-5,7])\d{6}|69(?:0|3|4|5|7|8|9)\d{7})$/;// ===== Helper Functions =====

function normalizePhone(phone) {
  // Remove spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-()]/g, "");

  // Remove +30 if present
  if (cleaned.startsWith("+30")) {
    cleaned = cleaned.substring(3);
  }

  return cleaned;
}

function setError(input, message) {
  const errorDiv = document.getElementById(input.id + "Error");

  input.classList.add("input-error");
  input.classList.remove("input-valid");
  input.setAttribute("aria-invalid", "true");

  errorDiv.textContent = message;
}

function setValid(input) {
  const errorDiv = document.getElementById(input.id + "Error");

  input.classList.remove("input-error");
  input.classList.add("input-valid");
  input.setAttribute("aria-invalid", "false");

  errorDiv.textContent = "";
}

function validateName() {
  const value = form.name.value.trim();

  // Check if empty
  if (!value) {
    setError(form.name, "Το όνομα είναι υποχρεωτικό.");
    return false;
  }

  // Check if it contains at least one space not at the start or end
  if (!/\S+\s+\S+/.test(value)) {
    setError(form.name, "Παρακαλώ εισάγετε όνομα και επώνυμο χωρισμένα με κενό.");
    return false;
  }

  setValid(form.name);
  return true;
}

function validateEmail() {
  const value = form.email.value.trim();
  if (!emailPattern.test(value)) {
    setError(form.email, "Παρακαλώ εισάγετε έγκυρο email.");
    return false;
  }
  setValid(form.email);
  return true;
}

function validatePhone() {
  const rawValue = form.phone.value.trim();

  if (!rawValue) {
    setError(form.phone, "Το τηλέφωνο είναι υποχρεωτικό.");
    return false;
  }

  const normalized = normalizePhone(rawValue);

  if (!phonePattern.test(normalized)) {
    setError(
      form.phone,
      "Εισάγετε έγκυρο ελληνικό αριθμό (π.χ. 6931234567 ή +30 693 123 4567)."
    );
    return false;
  }

  setValid(form.phone);
  return true;
}

function validateMessage() {
  const value = form.message.value.trim();
  if (!value) {
    setError(form.message, "Το μήνυμα είναι υποχρεωτικό.");
    return false;
  }
  setValid(form.message);
  return true;
}

function validateConsent() {
  const errorDiv = document.getElementById("consentError");

  if (!form.consent.checked) {
    errorDiv.textContent = "Πρέπει να αποδεχτείτε τους όρους.";
    return false;
  }

  errorDiv.textContent = "";
  return true;
}

// ===== Real-Time Validation =====

form.name.addEventListener("input", validateName);
form.email.addEventListener("input", validateEmail);
form.phone.addEventListener("input", validatePhone);
form.phone.addEventListener("input", function () {
  this.value = this.value.replace(/[^\d+\-\s()]/g, "");
});
form.message.addEventListener("input", validateMessage);
form.consent.addEventListener("change", validateConsent);

// ===== Submit =====

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const isValid =
    validateName() &&
    validateEmail() &&
    validatePhone() &&
    validateMessage() &&
    validateConsent();

  if (!isValid) {
    const firstInvalid = form.querySelector(".input-error");
    if (firstInvalid) firstInvalid.focus();
    responseMsg.textContent = "Υπάρχουν σφάλματα στη φόρμα.";
    responseMsg.style.color = "red";
    return;
  }

  responseMsg.style.color = "black";
  responseMsg.textContent = "Αποστολή...";

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: normalizePhone(form.phone.value.trim()),
    message: form.message.value.trim(),
    consent: "Συμφώνησε"
  };

  emailjs.send("service_5byce3q", "template_r942y7r", formData)
    .then(() => {
      responseMsg.textContent = "Το μήνυμα στάλθηκε επιτυχώς!";
      responseMsg.style.color = "green";
      form.reset();
      document.querySelectorAll("input, textarea").forEach(el => {
        el.classList.remove("input-valid");
        el.removeAttribute("aria-invalid");
      });
    })
    .catch(() => {
      responseMsg.textContent = "Σφάλμα αποστολής. Δοκιμάστε ξανά.";
      responseMsg.style.color = "red";
    });
});