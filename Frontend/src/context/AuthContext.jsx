// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from "react";
import ApiService from "../api/api.service";
import { notifyError, notifySuccess } from "../utils/toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const hasLoaded = useRef(false);

  // ---- Load User Once ----
  const loadUser = async () => {
    try {
      const res = await ApiService.getMe();
      if (res?.data?.user) {
        setUser(res.data.user);
        setRole(res.data.user.role);
        setIsAuthenticated(true);
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    (async () => {
      await loadUser();
      setLoading(false);
    })();
  }, []);

  // ---- Google Login ----
  const loginWithGoogle = async (googleCredential) => {
    try {
      const res = await ApiService.googleLogin(googleCredential);

      const user = res?.data?.user;
      if (!user) {
        notifyError("Login failed. Invalid user response.");
        return null;
      }

      setUser(user);
      setRole(user.role);
      setIsAuthenticated(true);

      notifySuccess("Logged in successfully!");
      return user;
    } catch (err) {
      notifyError("Google login failed");
      throw err;
    }
  };

  // ---- Logout ----
  const logout = async () => {
    try {
      await ApiService.logout();
      setUser(null);
      setIsAuthenticated(false);
      notifySuccess("Logged out");
    } catch {
      notifyError("Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loading,
        loginWithGoogle,
        loadUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
