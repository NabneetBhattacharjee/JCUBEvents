import Student from "../models/Student";

/**
 * Service handler for the Student model
 */
export default class StudentService {
  /**
   * Find a single student record by id
   * @param {String} id
   */
  static async findById(id) {
    return await Student.findById(id);
  }

  /**
   * Get all students registered to the event with the provided event id
   * @param {String} eventId
   */
  static async findRegistered(eventId) {
    return await Student.find(
      {
        reg_active: true,
        reg_event: eventId,
      },
      "-reg_active"
    ).lean();
  }

  /**
   * Add an active registration status for this student
   * @param {String} studentId
   * @param {String} eventId
   */
  static async addRegistration(studentId, eventId) {
    return await Student.findOneAndUpdate(
      { _id: studentId },
      {
        $set: {
          reg_active: true,
          reg_event: eventId,
        },
      }
    );
  }

  /**
   * Remove active event registration for this student
   * @param {String} studentId
   */
  static async removeRegistration(studentId) {
    return await Student.findOneAndUpdate(
      { _id: studentId },
      {
        $set: {
          reg_active: false,
          reg_event: undefined,
        },
      }
    );
  }
}
