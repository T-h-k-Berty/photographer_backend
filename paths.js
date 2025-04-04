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
    GET_ALL_USERS: `${BASE_API}/users/all`,
    GET_USER_BY_ID: `${BASE_API}/users/:id`,
    UPDATE_USER: `${BASE_API}/users/:id/update`,
    DELETE_USER: `${BASE_API}/users/:id/delete`,
    GET_PHOTOGRAPHERS: `${BASE_API}/users/photographers`,
    RATE_PHOTOGRAPHER: `${BASE_API}/users/rate/:photographerId`,
  },
};

module.exports = PATHS;
