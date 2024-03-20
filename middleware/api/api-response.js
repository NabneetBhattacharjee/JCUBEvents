/**
 * Sends API response in JSON format
 * @param {*} res
 * @param {any} data
 * @param {String} msg
 * @param {Boolean} success
 * @param {Number} status
 */
export const jsonResponse = (res, data, msg, success = true, status = 200) => {
  return res.status(status).json({
    success,
    data,
    msg,
  });
};
