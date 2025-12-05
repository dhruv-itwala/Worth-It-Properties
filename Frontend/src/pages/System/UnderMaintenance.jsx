import React from "react";
import { Link } from "react-router-dom";
import styles from "./PageStatus.module.css";

const UnderMaintenance = () => {
  return (
    <div className="masterContainer">
      <div className={styles.wrapper}>
        <h1 className={styles.maintenanceIcon}>🚧</h1>

        <h2 className={styles.title}>We’re Under Maintenance</h2>

        <p className={styles.text}>
          Our team is upgrading systems to serve you better. Please check back
          soon.
        </p>

        <Link to="/" className={styles.button}>
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default UnderMaintenance;
