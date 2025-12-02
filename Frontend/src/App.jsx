import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home/Home";
import UserLogin from "./pages/Auth/UserLogin";
import AdminLogin from "./pages/Auth/AdminLogin";
import CompleteProfile from "./pages/Auth/CompleteProfile";
import ProtectedRoute from "./routes/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={2500} newestOnTop />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
