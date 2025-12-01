import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";

import Navbar from "./components/Navbar/Navbar";
// import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Login from "./pages/Auth/Login";
// import Signup from "./pages/Auth/Signup";
import ProtectedRoute from "./routes/ProtectedRoute";
import CompleteProfile from "./pages/Auth/CompleteProfile";
import Properties from "./pages/Properties/Properties";
import PropertyDetail from "./pages/Properties/PropertyDetail";
import { PropertyProvider } from "./context/PropertyContext";
import PostProperty from "./pages/PostProperty/PostProperty";

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <AppProvider>
          <BrowserRouter>
            <Navbar />

            <Routes>
              <Route path="/login" element={<Login />} />
              {/* <Route path="/signup" element={<Signup />} /> */}
              <Route path="/" element={<Home />} />
              <Route
                path="/complete-profile"
                element={
                  <ProtectedRoute profileRequired={false}>
                    <CompleteProfile />
                  </ProtectedRoute>
                }
              />

              {/* <Route
                path="/wishlist"
                element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                }
              /> */}

              <Route
                path="/post-property"
                element={
                  <ProtectedRoute allowedRoles={["owner", "builder"]}>
                    <PostProperty />
                  </ProtectedRoute>
                }
              />

              {/* For editing (owner only) */}
              {/* <Route
                path="/property/edit/:id"
                element={
                  <ProtectedRoute allowedRoles={["owner", "builder"]}>
                    <EditProperty />{" "}
                  </ProtectedRoute>
                }
              /> */}

              <Route path="/properties" element={<Properties />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
            </Routes>

            <ToastContainer
              position="top-right"
              autoClose={2500}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              pauseOnHover
              theme="light"
            />

            {/* <Footer /> */}
          </BrowserRouter>
        </AppProvider>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;
