import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";
import React from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const profileRef = useRef();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={styles.navbarWrapper}>
      <div className="masterContainer">
        <div className={styles.navbar}>
          {/* LEFT: Logo */}
          <div className={styles.logo}>
            <Link to="/">
              <img src="/logo.png" alt="Worth It Properties" />
            </Link>
          </div>

          {/* DESKTOP LINKS */}
          <div className={styles.links}>
            <NavLink to="/" className={styles.link}>
              Buy
            </NavLink>
            <NavLink to="/" className={styles.link}>
              Rent
            </NavLink>
          </div>

          {/* RIGHT BUTTONS */}
          <div className={styles.rightButtons}>
            {!user ? (
              <Link to="/login" className={styles.loginLink}>
                Login / Register
              </Link>
            ) : (
              <div
                className={styles.profileBox}
                ref={profileRef}
                onClick={() => setOpenProfile(!openProfile)}
              >
                <img
                  src={user.profilePhoto || "/default-avatar.png"}
                  className={styles.avatar}
                  alt="User"
                />

                {openProfile && (
                  <div className={styles.profileMenu}>
                    <Link to="/profile">Profile</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    <button onClick={logout}>Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger Icon */}
          <div
            className={styles.hamburger}
            onClick={() => setOpenMenu(!openMenu)}
          >
            ☰
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {openMenu && (
        <div className={styles.mobileMenu}>
          <NavLink to="/" onClick={() => setOpenMenu(false)}>
            Buy
          </NavLink>
          <NavLink to="/" onClick={() => setOpenMenu(false)}>
            Rent
          </NavLink>

          {!user ? (
            <NavLink
              to="/login"
              className={styles.mobileBtnSecondary}
              onClick={() => setOpenMenu(false)}
            >
              Login / Register
            </NavLink>
          ) : (
            <>
              <NavLink to="/dashboard" onClick={() => setOpenMenu(false)}>
                Dashboard
              </NavLink>
              <button className={styles.mobileBtnSecondary} onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
