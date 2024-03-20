/**
 * Extract form values from form element
 * @param {HTMLFormElement} e
 * @returns {object}
 */
// eslint-disable-next-line no-unused-vars
const extractFormData = (e) => {
  let data = {};

  const formData = new FormData(e.target);
  for (const item of formData.entries()) data[item[0]] = item[1];

  return data;
};
