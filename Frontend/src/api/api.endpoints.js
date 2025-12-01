const API = {
  // AUTH
  GOOGLE_LOGIN: "/auth/google",
  ME: "/auth/me",
  LOGOUT: "/auth/logout",

  // USER
  COMPLETE_PROFILE: "/users/complete-profile",
  PROFILE: "/users/me",
  UPDATE_PHOTO: "/users/update-photo",

  // PROPERTIES
  ALL_PROPERTIES: "/properties",
  PROPERTY_CREATE: "/properties",
  PROPERTY_SINGLE: (id) => `/properties/${id}`,
  PROPERTY_UPDATE: (id) => `/properties/${id}`,
  PROPERTY_DELETE: (id) => `/properties/${id}`,
  USER_PROPERTIES: (userId) => `/properties/user/${userId}`,

  // SEARCH
  SEARCH_PROPERTIES: "/search/properties",

  // WISHLIST
  WISHLIST: "/wishlist",
  WISHLIST_TOGGLE: (id) => `/wishlist/toggle/${id}`,
  WISHLIST_REMOVE: (id) => `/wishlist/${id}`,
};

export default API;
