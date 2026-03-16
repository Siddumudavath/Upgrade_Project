// home.js - Loads and renders events on the Home page

/**
 * Builds a Bootstrap card for a single event (Home view).
 * Card shows basic event info and a Register button.
 */
function buildHomeCard(evt) {
  return `
    <div class="col-md-4 col-sm-6 event-card">
      <div class="card p-3 h-100">
        <h6 class="fw-semibold">${evt.name}</h6>
        <p class="mb-1 small"><strong>Category:</strong> ${evt.category}</p>
        <p class="mb-1 small"><strong>Date:</strong> ${evt.date}</p>
        <p class="mb-2 small"><strong>Time:</strong> ${evt.time}</p>
        <button
          class="btn btn-primary btn-sm w-100 mt-auto"
          onclick="goToRegister('${evt.id}')">
          Register
        </button>
      </div>
    </div>
  `;
}

/**
 * Redirects participant to the registration page, passing the event ID.
 */
function goToRegister(eventId) {
  window.location.href = `register.html?eventId=${eventId}`;
}

/**
 * Fetches all events from IndexedDB and renders them as cards.
 */
async function loadHomeEvents() {
  const container = document.getElementById("homeEventCards");
  try {
    const events = await getAllEvents();
    if (events.length === 0) {
      container.innerHTML = '<p class="text-muted">No upcoming events at the moment.</p>';
      return;
    }
    container.innerHTML = events.map(buildHomeCard).join("");
  } catch (err) {
    console.error("Error loading events:", err);
    container.innerHTML = '<p class="text-danger">Failed to load events.</p>';
  }
}

// Initialise on page load
document.addEventListener("DOMContentLoaded", loadHomeEvents);
