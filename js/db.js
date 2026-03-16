// db.js - IndexedDB wrapper for Upgrad EMS

const DB_NAME = "UpgradEMS";
const DB_VERSION = 1;
const STORE_NAME = "events";

// Seed data to pre-populate on first load
const SEED_EVENTS = [
  {
    id: "101",
    name: "Dev Tech",
    category: "Tech & Innovations",
    date: "2026-03-04",
    time: "15:15",
    url: "https://upgrad.com/events/dev-tech"
  },
  {
    id: "102",
    name: "MCT Summit",
    category: "Tech & Innovations",
    date: "2026-03-09",
    time: "14:15",
    url: "https://upgrad.com/events/mct-summit"
  },
  {
    id: "103",
    name: "Client Summit",
    category: "Industrial Event",
    date: "2026-03-17",
    time: "15:00",
    url: "https://upgrad.com/events/client-summit"
  }
];

/**
 * Opens (or creates) the IndexedDB database.
 * Returns a Promise that resolves with the db instance.
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Called only when db is created for the first time or version upgrades
    request.onupgradeneeded = function (e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = function (e) {
      const db = e.target.result;
      resolve(db);
    };

    request.onerror = function (e) {
      reject(e.target.error);
    };
  });
}

/**
 * Seeds initial events into the DB if no records exist yet.
 */
async function seedEventsIfEmpty() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const countReq = store.count();

  countReq.onsuccess = async function () {
    if (countReq.result === 0) {
      const writeTx = db.transaction(STORE_NAME, "readwrite");
      const writeStore = writeTx.objectStore(STORE_NAME);
      SEED_EVENTS.forEach(evt => writeStore.put(evt));
    }
  };
}

/**
 * Retrieves all events from IndexedDB.
 * Returns a Promise resolving to an array of event objects.
 */
async function getAllEvents() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Adds a new event record. Rejects if ID already exists.
 */
async function addEventToDB(eventObj) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    // add() fails if key already exists (unlike put which overwrites)
    const req = store.add(eventObj);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Deletes an event by its ID string.
 */
async function deleteEventFromDB(eventId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(eventId);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Retrieves a single event by ID.
 */
async function getEventById(eventId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(eventId);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

// Seed on script load
seedEventsIfEmpty();
