// register.js - Handles Event Registration page

/**
 * Reads the eventId from the URL query string and
 * fetches the corresponding event from IndexedDB to display.
 */
async function loadEventDetails() {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("eventId");

  if (!eventId) {
    alert("No event selected. Redirecting to home.");
    window.location.href = "index.html";
    return;
  }

  try {
    const evt = await getEventById(eventId);
    if (!evt) {
      alert("Event not found. Redirecting to home.");
      window.location.href = "index.html";
      return;
    }

    // Populate the Event Details section
    document.getElementById("regEventId").textContent = evt.id;
    document.getElementById("regEventName").textContent = evt.name;
    document.getElementById("regEventCategory").textContent = evt.category;
    document.getElementById("regEventDate").textContent = evt.date;
    document.getElementById("regEventTime").textContent = evt.time;
  } catch (err) {
    console.error("Error fetching event:", err);
    alert("Something went wrong. Please try again.");
  }
}

/**
 * Validates participant input and shows success alert on submit.
 */
function registerParticipant() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("partEmail").value.trim();

  // Validate required fields
  if (!firstName || !lastName || !email) {
    alert("Please fill in all participant details.");
    return;
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  alert("You are successfully registered to this event!");
  // Clear form after successful registration
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
  document.getElementById("partEmail").value = "";
}

document.addEventListener("DOMContentLoaded", loadEventDetails);
