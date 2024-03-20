
const registerForm = document.getElementById("event-register-form");
const cancelForm = document.getElementById("event-cancel-form");
const studentIdEl = document.getElementById("student_id");
const eventIdEl = document.getElementById("event_id");
const registerLoadingEl = document.querySelector(".register-loading");
const registerAlertEl = document.querySelector(".register-alert");


async function addRegistration(event) {
  event.preventDefault();

  // Update form state
  if (!registerAlertEl.classList.contains("d-none")) {
    registerAlertEl.classList.add("d-none");
  }

  const student_id = studentIdEl.value;
  const event_id = eventIdEl.value;

  // Check if empty
  if (!student_id.trim()) return alert("Please enter student id");

  registerLoadingEl.classList.toggle("d-none");

  // POST to /events/:id/registrations
  // eslint-disable-next-line no-undef
  const { status, msg } = await fetcher(
    "events/" + event_id + "/registrations",
    { student_id },
    "POST"
  );

  registerAlertEl.innerText = msg;
  registerAlertEl.classList.toggle("d-none");

  if (status === 200) {
    registerAlertEl.classList.toggle("alert-success");
    registerAlertEl.innerText += "\nReloading in 2 seconds";

    setTimeout(() => (window.location.href = `/events/${event_id}`), 2000);
  } else {
    registerAlertEl.classList.toggle("alert-danger");
  }

  registerLoadingEl.classList.toggle("d-none");
}

/**
 * Prompt to cancel event registration
 */
function cancelRegistration(event) {
  event.preventDefault();

  if (window.confirm("Cancel event registration?")) {
    return cancelForm.submit();
  }
  return false;
}

// Handle Event Registration (if form exists)
registerForm && registerForm.addEventListener("submit", addRegistration);
cancelForm && cancelForm.addEventListener("submit", cancelRegistration);
