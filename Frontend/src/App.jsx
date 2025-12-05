// Frontend/src/App.jsx
import React from "react";
import { Routes, Route, redirect, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home/Home";
import UserLogin from "./pages/Auth/UserLogin/UserLogin";
import AdminLogin from "./pages/Auth/AdminLogin/AdminLogin";
import CompleteProfile from "./pages/Auth/CompleteProfile/CompleteProfile";
import ProtectedRoute from "./routes/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ReportAnIssue from "./pages/Help/ReportAnIssue";
import TermsAndConditions from "./pages/Help/TermsAndConditions";
import PrivacyPolicies from "./pages/Help/PrivacyPolicies";
import ContactSupport from "./pages/Help/ContactSupport";
import SupportCenter from "./pages/Help/SupportCenter";
import FAQs from "./pages/Help/FAQs";
import UnderMaintenance from "./pages/System/UnderMaintenance";
import Unauthorized from "./pages/System/Unauthorized";
import PageNotFound from "./pages/System/PageNotFound";
import PostProperty from "./pages/Property/PostProperty/PostProperty";
import PropertyList from "./pages/Property/PropertyList/PropertyList";
import PropertyDetails from "./pages/Property/PropertyDetails/PropertyDetails";
import Profile from "./pages/Profile/Profile";
import Dashboard from "./pages/Dashboard/Dashboard";
import EditProperty from "./pages/Property/PostProperty/EditProperty";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* Home Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        {/* Profile Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Property Editing Route */}
        <Route
          path="/edit-property/:id"
          element={
            <ProtectedRoute>
              <EditProperty />
            </ProtectedRoute>
          }
        />

        {/* Property Posting Route */}
        <Route
          path="/post-property"
          element={
            <ProtectedRoute
              allowedRoles={["owner", "builder", "broker", "admin"]}
            >
              <PostProperty />
            </ProtectedRoute>
          }
        />
        {/* Property Listing Route */}
        <Route path="/properties" element={<PropertyList />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />

        {/* Help and Support Routes */}
        <Route path="/contact-support" element={<ContactSupport />} />
        <Route path="/privacy-policy" element={<PrivacyPolicies />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/report-an-issue" element={<ReportAnIssue />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/support-center" element={<SupportCenter />} />

        {/* System Routes */}
        <Route path="/404" element={<PageNotFound />} />
        <Route path="/maintainance" element={<UnderMaintenance />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2500} newestOnTop />
      <Footer />
    </AuthProvider>
  );
}

export default App;
