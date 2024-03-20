
export const pages = {
  get home() {
    return "/";
  },

  get auth() {
    return {
      signup: "/auth/signup",
      login: "/auth/login",
      logout: "/auth/logout",
    };
  },

  get user() {
    return {
      events: "/user/events",
    };
  },

  get api() {
    return {
      owner: "/api/owner",
    };
  },

  get events() {
    return {
      store: "/events", // POST
      create: "/events/create",
      dashboard: "/events/dashboard",
      item(id) {
        return {
          show: `/events/${id}`, // GET
          update: `/events/${id}`, // POST
          delete: `/events/${id}/delete`, // POST
          edit: `/events/${id}/edit`, // GET
          registrations: `/events/${id}/registrations`, // GET
          createRegistration: `/events/${id}/registrations/create`, // GET
          storeRegistration: `/events/${id}/registrations/store`, // POST
          cancelRegistration: `/events/${id}/registrations/cancel`, // POST
          exportRegistrations: `/events/${id}/registrations/export`,
        };
      },
    };
  },

  get errors() {
    return {
      forbidden: "/errors/forbidden",
    };
  },

  search: "/search",
};

/**
 * Event types
 */
export const eventTypes = {
  free: "FREE",
  paid: "PAID",
};

/**
 * Application roles
 */
export const roles = {
  user: "USER",
  owner: "OWNER",
  admin: "ADMIN",
};
