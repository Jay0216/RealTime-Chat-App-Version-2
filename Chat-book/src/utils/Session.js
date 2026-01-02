export function getActiveUser() {
  let activeUid = sessionStorage.getItem("activeUserId");

  const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");

  // Fallback: if no active tab user, use the last logged-in user
  if (!activeUid && sessions.length > 0) {
    activeUid = sessions[sessions.length - 1].uid;
    sessionStorage.setItem("activeUserId", activeUid); // restore for this tab
  }

  return sessions.find((s) => s.uid === activeUid) || null;
}

