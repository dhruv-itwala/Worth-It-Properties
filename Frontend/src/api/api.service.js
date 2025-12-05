// Frontend/src/api/api.service.js
import api from "./api";
import API from "./api.endpoints";

const ApiService = {
  // USER AUTH
  // token is the id token string from Google (response.credential)
  googleLogin: (token) => api.post(API.GOOGLE_LOGIN, { token }),
  userLogin: (data) => api.post(API.USER_LOGIN, data),
  getMe: () => api.get(API.ME),
  logout: () => api.post(API.LOGOUT),

  // ADMIN AUTH
  adminLogin: (data) => api.post(API.ADMIN_LOGIN, data),
  adminMe: () => api.get(API.ADMIN_ME),
  adminLogout: () => api.post(API.ADMIN_LOGOUT),

  // USER PROFILE
  completeProfile: (formData) =>
    api.put(API.COMPLETE_PROFILE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // optional: update profile endpoint alias
  updateProfile: (formData) =>
    api.put(API.COMPLETE_PROFILE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Properties
  getProperties: (params) => api.get(API.PROPERTIES, { params }),
  getProperty: (id) => api.get(API.PROPERTY(id)),
  getUserProperties: (id) => api.get(API.USER_PROPERTIES(id)),
  postProperty: (formData, config = {}) =>
    api.post(API.PROPERTIES, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      ...config,
    }),
  updateProperty: (id, formData) =>
    api.put(API.PROPERTY(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Search + Wishlist
  searchProperties: (params) => api.get(API.SEARCH_PROPERTIES, { params }),
  toggleWishlist: (id) => api.post(API.WISHLIST_TOGGLE(id)),
  removeWishlist: (id) => api.delete(API.WISHLIST_REMOVE(id)),
  getWishlist: () => api.get(API.WISHLIST),
};

export default ApiService;
