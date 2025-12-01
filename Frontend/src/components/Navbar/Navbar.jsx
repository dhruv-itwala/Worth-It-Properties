import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";
import { motion, AnimatePresence } from "framer-motion";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setMobileMenu(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMain}>WorthIt</span>
          <span className={styles.logoSub}>Properties</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className={styles.links}>
          <NavLink to="/" className={styles.navItem}>
            Home
          </NavLink>
          <NavLink to="/properties" className={styles.navItem}>
            Buy / Rent
          </NavLink>

          {isAuthenticated &&
            (user.role === "owner" || user.role === "builder") && (
              <NavLink to="/post-property">
                <button className={styles.postBtn}>Post Property</button>
              </NavLink>
            )}
        </div>

        {/* Right Section */}
        <div className={styles.right}>
          {!isAuthenticated ? (
            <button
              className={styles.loginBtn}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <UserMenu />
          )}

          {/* Mobile Menu Button */}
          <div
            className={styles.mobileBtn}
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            ☰
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={styles.mobileMenu}
          >
            <NavLink to="/" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/properties" onClick={closeMenu}>
              Buy / Rent
            </NavLink>

            {isAuthenticated &&
              (user.role === "owner" || user.role === "builder") && (
                <NavLink to="/post-property" onClick={closeMenu}>
                  <button className={styles.postBtnMobile}>
                    Post Property
                  </button>
                </NavLink>
              )}

            {!isAuthenticated ? (
              <button
                className={styles.loginBtnMobile}
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            ) : (
              <UserMenu mobileClose={closeMenu} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
