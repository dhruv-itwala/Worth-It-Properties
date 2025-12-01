// src/api/api.service.js
import api from "./api";
import API from "./api.endpoints";

const ApiService = {
  // auth (google-only)
  googleLogin: (googleToken) =>
    api.post(API.GOOGLE_LOGIN, { token: googleToken }),
  getMe: () => api.get(API.ME),
  logout: () => api.post(API.LOGOUT),

  // user
  completeProfile: (data) => api.put(API.COMPLETE_PROFILE, data),
  updateUserPhoto: (formData) =>
    api.put(API.UPDATE_PHOTO, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // properties
  getAllProperties: (page = 1, limit = 10) =>
    api.get(API.ALL_PROPERTIES, { params: { page, limit } }),

  getPropertyById: (id) => api.get(API.PROPERTY_SINGLE(id)),

  createProperty: (formData) =>
    api.post(API.PROPERTY_CREATE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateProperty: (id, formData) =>
    api.put(API.PROPERTY_UPDATE(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteProperty: (id) => api.delete(API.PROPERTY_DELETE(id)),

  // search (advanced)
  searchProperties: (params) => api.get(API.SEARCH_PROPERTIES, { params }),

  // wishlist
  getWishlist: () => api.get(API.WISHLIST),
  toggleWishlist: (propertyId) => api.post(API.WISHLIST_TOGGLE(propertyId)),
  removeFromWishlist: (propertyId) =>
    api.delete(API.WISHLIST_REMOVE(propertyId)),
};

export default ApiService;
