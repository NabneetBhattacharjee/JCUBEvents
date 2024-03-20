import { roles } from "../config/app";
import User from "../models/User";

/**
 * Service handler for the User model
 */
export default class UserService {
  /**
   * Check if a user with given email exists
   * @param {String} email
   */
  static async checkUserByEmail(email) {
    return await User.findOne({ email });
  }

  /**
   * Store a new user to the database
   * @param {object} userData
   */
  static async createUser(userData) {
    const { name, email, phone, password } = userData;

    const user = await new User({
      name,
      email,
      phone,
      password: await User.hashPassword(password),
    }).save();

    return user;
  }

  /**
   * Assign the "**OWNER**" role to the provided user
   * @param {object} user
   */
  static async assingOwnerRole(user) {
    return await User.findOneAndUpdate(
      { _id: user.id },
      { $set: { role: roles.owner } },
      { upsert: true, new: true }
    );
  }
}
