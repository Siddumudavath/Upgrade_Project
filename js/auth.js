// auth.js - Admin authentication logic

// Hard-coded admin credentials as per requirements
const ADMIN_EMAIL = "admin@upgrad.com";
const ADMIN_PASSWORD = "12345";

/**
 * Validates login form and authenticates the admin.
 * On success: sets session flag and redirects to events page.
 * On failure: shows alert with error message.
 */
function adminLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  // Basic presence check
  if (!email || !password) {
    alert("Please fill in both email and password.");
    return;
  }

  // Credential match
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // Mark session as authenticated
    sessionStorage.setItem("adminLoggedIn", "true");
    window.location.href = "events.html";
  } else {
    alert("Invalid email or password. Please try again.");
  }
}

/**
 * Checks whether the admin session is active.
 * Returns true if logged in, false otherwise.
 */
function isAdminLoggedIn() {
  return sessionStorage.getItem("adminLoggedIn") === "true";
}

/**
 * Logs the admin out by clearing the session and redirecting to login.
 */
function logoutAdmin() {
  sessionStorage.removeItem("adminLoggedIn");
  window.location.href = "login.html";
}
