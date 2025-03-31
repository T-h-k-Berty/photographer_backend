const BASE_API = "/api"; // Base path for all API routes

const PATHS = {
  BASE: BASE_API,

  AUTH: {
    BASE: `${BASE_API}/auth`,
    REGISTER: `${BASE_API}/auth/register`,
    LOGIN: `${BASE_API}/auth/login`,
  },

  USERS: {
    BASE: `${BASE_API}/users`,
    GET_ALL_USERS: `${BASE_API}/users/all`, // ✅ Ensure this exists
    GET_USER_BY_ID: `${BASE_API}/users/:id`,
    UPDATE_USER: `${BASE_API}/users/:id/update`,
    DELETE_USER: `${BASE_API}/users/:id/delete`,
  },
};

module.exports = PATHS;
