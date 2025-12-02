import { createContext, useContext, useEffect, useState } from "react";
import ApiService from "../api/api.service";
import { notifyError, notifySuccess } from "../utils/toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true); // initial app load
  const [authLoading, setAuthLoading] = useState(false); // login/profile actions
  const [authError, setAuthError] = useState(null);

  // Load user if cookie exists
  const loadUser = async () => {
    try {
      const res = await ApiService.getMe();
      setUser(res.data.user || null);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser().finally(() => setLoading(false));
  }, []);

  // Google login: pass response.credential (id token string)
  const loginWithGoogle = async (credential) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await ApiService.googleLogin(credential);
      const userData = res?.data?.user;
      if (!userData) throw new Error("Invalid response");
      setUser(userData);
      notifySuccess("Logged in with Google");
      return userData;
    } catch (err) {
      notifyError(err?.response?.data?.message || "Google login failed");
      setAuthError(err?.message || "Google login failed");
      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  // Email + password login
  const loginUser = async (data) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await ApiService.userLogin(data);
      const userData = res?.data?.user;
      if (!userData) throw new Error("Invalid response");
      setUser(userData);
      notifySuccess("Logged in");
      return userData;
    } catch (err) {
      notifyError(err?.response?.data?.message || "Login failed");
      setAuthError(err?.message || "Login failed");
      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  // Admin login
  const loginAdmin = async (data) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await ApiService.adminLogin(data);
      const adminData = res?.data?.admin || res?.data;
      if (!adminData) throw new Error("Invalid admin response");
      setAdmin(adminData);
      notifySuccess("Admin logged in");
      return adminData;
    } catch (err) {
      notifyError(err?.response?.data?.message || "Admin login failed");
      setAuthError(err?.message || "Admin login failed");
      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  // Update / complete profile (handles optional password)
  const updateProfile = async (formData) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await ApiService.completeProfile(formData);
      const userData = res?.data?.user;
      if (!userData) throw new Error("Invalid response");
      setUser(userData);
      notifySuccess(res?.data?.message || "Profile updated");
      return userData;
    } catch (err) {
      notifyError(err?.response?.data?.message || "Profile update failed");
      setAuthError(err?.message || "Profile update failed");
      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await ApiService.logout();
    } catch {
      // ignore
    } finally {
      setUser(null);
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        authLoading,
        authError,
        setUser,
        loadUser,
        loginWithGoogle,
        loginUser,
        loginAdmin,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
