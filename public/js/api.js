const axios = window.axios;

const baseUrl = "http://localhost:4000/api/";

// Configure axios to work with our API
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

/**
 * Fetch API data
 * @param {String} url
 * @param {*} apiData
 * @param {String} method
 */
// eslint-disable-next-line no-unused-vars
const fetcher = async (url, apiData = null, method = "GET") => {
  try {
    const result = await axios({
      url: baseUrl + url,
      data: apiData,
      method,
      credentials: "include",
    });

    // Axios stores api response in a data object.
    return {
      data: result.data.data,
      status: result.data.status || result.status,
      msg: result.data.msg || result.statusText,
      failed: !result.data.success || result.status > 399,
    };
  } catch (error) {
    // Error out of 2xx range
    if (error.response) {
      return {
        data: error.response.data,
        status: error.response.status,
        msg: error.response.data.msg || error.response.statusText,
        failed: true,
      };
    }

    // Error as a result of no response
    if (error.request) {
      return {
        data: error.request,
        status: 500,
        msg: "ERROR: No response was received from this request!",
        failed: true,
      };
    }

    // Unknown Error
    return {
      data: null,
      status: 500,
      msg: "ERROR: This request could not be completed due to unknown error!",
      failed: true,
    };
  }
};
