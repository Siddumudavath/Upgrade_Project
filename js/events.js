// events.js - Admin Events Management page logic

/**
 * Route guard: redirect to login if admin is not authenticated.
 * Called immediately when this script loads.
 */
(function guardRoute() {
  if (sessionStorage.getItem("adminLoggedIn") !== "true") {
    alert("Unauthorized access. Please log in first.");
    window.location.href = "login.html";
  }
})();

/**
 * Builds a Bootstrap card for a single event (Admin view).
 * Includes Join Event link and Delete button.
 */
function buildAdminCard(evt) {
  return `
    <div class="col-md-4 col-sm-6 event-card" id="card-${evt.id}">
      <div class="card p-3 h-100">
        <h6 class="fw-semibold">${evt.name}</h6>
        <p class="mb-1 small"><strong>ID:</strong> ${evt.id}</p>
        <p class="mb-1 small"><strong>Category:</strong> ${evt.category}</p>
        <p class="mb-1 small"><strong>Date:</strong> ${evt.date}</p>
        <p class="mb-2 small"><strong>Time:</strong> ${evt.time}</p>
        <a href="${evt.url}" target="_blank" class="btn btn-primary btn-sm mb-2">Join Event</a>
        <button class="btn btn-danger btn-sm" onclick="removeEvent('${evt.id}')">Delete</button>
      </div>
    </div>
  `;
}

/**
 * Loads all events from IndexedDB and renders them.
 */
async function loadAllEvents() {
  const container = document.getElementById("adminEventCards");
  try {
    const events = await getAllEvents();
    if (events.length === 0) {
      container.innerHTML = '<p class="text-muted">No events found.</p>';
      return;
    }
    container.innerHTML = events.map(buildAdminCard).join("");
  } catch (err) {
    console.error("Error loading events:", err);
    container.innerHTML = '<p class="text-danger">Failed to load events.</p>';
  }
}

/**
 * Reads form fields, validates them, and adds a new event to IndexedDB.
 */
async function addEvent() {
  const id = document.getElementById("evtId").value.trim();
  const name = document.getElementById("evtName").value.trim();
  const category = document.getElementById("evtCategory").value;
  const date = document.getElementById("evtDate").value;
  const time = document.getElementById("evtTime").value;
  const url = document.getElementById("evtUrl").value.trim();

  // Field-level validation
  if (!id || !name || !category || !date || !time || !url) {
    alert("Please fill in all event fields before adding.");
    return;
  }

  // URL format check
  try {
    new URL(url); // throws if invalid
  } catch {
    alert("Please enter a valid Event URL (include http:// or https://).");
    return;
  }

  const newEvent = { id, name, category, date, time, url };

  try {
    await addEventToDB(newEvent);
    alert("Event added successfully!");
    // Clear form inputs
    ["evtId", "evtName", "evtDate", "evtTime", "evtUrl"].forEach(
      fId => (document.getElementById(fId).value = "")
    );
    document.getElementById("evtCategory").selectedIndex = 0;
    loadAllEvents();
  } catch (err) {
    // IndexedDB add() rejects if key (id) already exists
    if (err && err.name === "ConstraintError") {
      alert("An event with this ID already exists. Please use a unique ID.");
    } else {
      console.error("Error adding event:", err);
      alert("Failed to add event. Please try again.");
    }
  }
}

/**
 * Deletes an event from IndexedDB and removes its card from the DOM.
 */
async function removeEvent(eventId) {
  const confirmed = confirm("Are you sure you want to delete this event?");
  if (!confirmed) return;

  try {
    await deleteEventFromDB(eventId);
    // Remove the card element without a full page reload
    const cardEl = document.getElementById(`card-${eventId}`);
    if (cardEl) cardEl.remove();
  } catch (err) {
    console.error("Error deleting event:", err);
    alert("Failed to delete event. Please try again.");
  }
}

/**
 * Searches events by the selected field and value.
 * Filters are case-insensitive substring matches.
 */
async function searchEvents() {
  const field = document.getElementById("searchField").value;
  const value = document.getElementById("searchValue").value.trim().toLowerCase();

  if (!value) {
    alert("Please enter a search value.");
    return;
  }

  try {
    const allEvents = await getAllEvents();
    const filtered = allEvents.filter(evt => {
      const fieldValue = (evt[field] || "").toLowerCase();
      return fieldValue.includes(value);
    });

    const container = document.getElementById("adminEventCards");
    if (filtered.length === 0) {
      container.innerHTML = '<p class="text-muted">No events match your search.</p>';
    } else {
      container.innerHTML = filtered.map(buildAdminCard).join("");
    }
  } catch (err) {
    console.error("Error searching events:", err);
    alert("Search failed. Please try again.");
  }
}

// Load events when page is ready
document.addEventListener("DOMContentLoaded", loadAllEvents);
