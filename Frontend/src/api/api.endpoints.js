// src/api/api.endpoints.js
const API = {
  // AUTH
  GOOGLE_LOGIN: "/api/v1/auth/google",
  ME: "/api/v1/auth/me",
  LOGOUT: "/api/v1/auth/logout",

  // USER
  COMPLETE_PROFILE: "/api/v1/users/complete-profile",
  PROFILE: "/api/v1/users/me",
  UPDATE_PHOTO: "/api/v1/users/update-photo",

  // PROPERTIES
  ALL_PROPERTIES: "/api/v1/properties",
  PROPERTY_CREATE: "/api/v1/properties",
  PROPERTY_SINGLE: (id) => `/api/v1/properties/${id}`,
  PROPERTY_UPDATE: (id) => `/api/v1/properties/${id}`,
  PROPERTY_DELETE: (id) => `/api/v1/properties/${id}`,
  USER_PROPERTIES: (userId) => `/api/v1/properties/user/${userId}`,

  // SEARCH
  SEARCH_PROPERTIES: "/api/v1/search/properties",

  // WISHLIST
  WISHLIST: "/api/v1/wishlist",
  WISHLIST_TOGGLE: (id) => `/api/v1/wishlist/toggle/${id}`,
  WISHLIST_REMOVE: (id) => `/api/v1/wishlist/${id}`,
};

export default API;
