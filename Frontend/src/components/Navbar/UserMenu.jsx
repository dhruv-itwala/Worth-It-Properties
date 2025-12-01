import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";
import { motion, AnimatePresence } from "framer-motion";

const UserMenu = ({ mobileClose }) => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const avatar =
    user?.profilePhoto ||
    user?.avatar ||
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const handleLogout = async () => {
    await logout();
    mobileClose?.();
    navigate("/login");
  };

  return (
    <div className={styles.userWrapper}>
      <img
        src={avatar}
        alt="avatar"
        className={styles.avatar}
        onClick={() => setOpen(!open)}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.userMenu}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            <p
              className={styles.menuItem}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </p>
            <p className={styles.menuItem} onClick={() => navigate("/profile")}>
              My Profile
            </p>

            {(user.role === "owner" || user.role === "builder") && (
              <p
                className={styles.menuItem}
                onClick={() => navigate("/post-property")}
              >
                Post Property
              </p>
            )}

            <p className={styles.menuItem} onClick={handleLogout}>
              Logout
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
