import UserService from "../../services/UserService";
import { jsonResponse } from "../../middleware/api/api-response";
import { badRequest } from "../../middleware/api/errors";
import envConfig from "../../config/env";

/**
 * Register a new owner
 * @param {*} req
 * @param {*} res
 */
export const createOwner = async (req, res) => {
  if (req.matchedData.owner_code !== envConfig.app.owner_code) {
    return badRequest(res, null, "Invalid code");
  }

  await UserService.assingOwnerRole(req.user);

  return jsonResponse(res, true, "Success");
};
