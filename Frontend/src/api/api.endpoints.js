// Frontend/src/api/api.endpoints.js
const API = {
  // USER AUTH
  GOOGLE_LOGIN: "/auth/google", // login with Google
  USER_LOGIN: "/auth/login", // login with email + password
  ME: "/auth/me", // get current logged in user
  LOGOUT: "/auth/logout", // logout

  // ADMIN AUTH
  ADMIN_LOGIN: "/admin/login", // admin login with email + password
  ADMIN_ME: "/admin/me", // get current logged in admin
  ADMIN_LOGOUT: "/admin/logout", // admin logout

  // USER PROFILE
  COMPLETE_PROFILE: "/users/complete-profile", // complete user profile
  PROFILE: "/users/me", // get or update user profile

  // PROPERTIES
  PROPERTIES: "/properties",
  PROPERTY: (id) => `/properties/${id}`,
  USER_PROPERTIES: (id) => `/properties/user/${id}`,

  // SEARCH
  SEARCH_PROPERTIES: "/search/properties",

  // WISHLIST
  WISHLIST: "/wishlist",
  WISHLIST_TOGGLE: (id) => `/wishlist/toggle/${id}`,
  WISHLIST_REMOVE: (id) => `/wishlist/${id}`,
};

export default API;
