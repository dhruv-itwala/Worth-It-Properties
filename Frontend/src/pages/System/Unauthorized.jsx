import React from "react";
import { Link } from "react-router-dom";
import styles from "./PageStatus.module.css";

const Unauthorized = () => {
  return (
    <div className="masterContainer">
      <div className={styles.wrapper}>
        <div className={styles.lockIcon}>🔒</div>

        <h2 className={styles.title}>Access Denied</h2>

        <p className={styles.text}>
          You don’t have permission to access this page. Please login with the
          correct account or return to the homepage.
        </p>

        <Link to="/" className={styles.button}>
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
