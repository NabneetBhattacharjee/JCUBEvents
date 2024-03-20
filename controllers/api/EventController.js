import EventService from "../../services/EventService";
import StudentService from "../../services/StudentService";

import { jsonResponse } from "../../middleware/api/api-response";
import { badRequest } from "../../middleware/api/errors";

/**
 * Add a student to the event registration list
 * @param {*} req
 * @param {*} res
 */
export const addRegistration = async (req, res) => {
  const student_id = req.body.student_id;
  const event_id = req.params.id;
  const user_id = req.user.id;

  const student = await StudentService.findById(student_id);

  if (!student) {
    return badRequest(res, null, "Student with that id not found");
  } else if (student.reg_event?.equals(req.params.id)) {
    return badRequest(res, null, "You cannot register for an event twice");
  }

  await StudentService.addRegistration(student_id, event_id);

  await EventService.addEventRegistration(event_id, student_id, user_id);

  return jsonResponse(res, null, "Success");
};
