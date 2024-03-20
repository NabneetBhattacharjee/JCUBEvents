import EventService from "../services/EventService";

/**
 * Get the events that this user has registered for
 * @param {*} req
 * @param {*} res
 */
export const events = async (req, res) => {
  const user = req.user;
  const events = await EventService.getUserEvents(user);

  res.render("user/events", { events });
};
