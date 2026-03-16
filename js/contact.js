// contact.js - Contact Us form logic

/**
 * Validates the Contact Us form and shows a success alert on submit.
 */
function submitContact() {
  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const description = document.getElementById("contactDesc").value.trim();

  // Required fields check
  if (!name || !email || !description) {
    alert("Please fill in all fields before submitting.");
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  alert("Your query has been submitted successfully! We will get back to you soon.");

  // Reset form fields
  document.getElementById("contactName").value = "";
  document.getElementById("contactEmail").value = "";
  document.getElementById("contactDesc").value = "";
}
