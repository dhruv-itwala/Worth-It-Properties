import api from "./api"; // your axios instance
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
};

export default ApiService;
