
const ownerModalForm = document.getElementById("ownerModalForm");
const ownerCode = document.getElementById("owner_code");
const loadingEl = document.querySelector(".loading");
const ownerAlert = document.querySelector(".owner-alert");

/**
 * Function to handle adding owner role to user
 * @param {*} event
 */
const addOwner = async (event) => {
  event.preventDefault();

  // Update form state
  if (!ownerAlert.classList.contains("d-none")) {
    ownerAlert.classList.add("d-none");
  }

  const code = ownerCode.value;
  // Check if empty
  if (!code.trim()) return alert("Please enter owner code");

  // POST to /api/owner
  loadingEl.classList.toggle("d-none");

  // eslint-disable-next-line no-undef
  const { status, msg } = await fetcher("owner", { owner_code: code }, "POST");

  ownerAlert.innerText = msg;
  ownerAlert.classList.toggle("d-none");

  if (status === 200) {
    ownerAlert.classList.toggle("alert-success");
    ownerAlert.innerText += "\nReloading in 2seconds";

    setTimeout(() => (window.location.href = "/"), 2000);
  } else {
    ownerAlert.classList.toggle("alert-danger");
  }

  loadingEl.classList.toggle("d-none");
};

// Handle Owner Access Registration (if form exists)
ownerModalForm && ownerModalForm.addEventListener("submit", addOwner);
