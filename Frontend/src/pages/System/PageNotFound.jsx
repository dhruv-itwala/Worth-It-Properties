import React from "react";
import { Link } from "react-router-dom";
import styles from "./PageStatus.module.css";

const PageNotFound = () => {
  return (
    <div className="masterContainer">
      <div className={styles.wrapper}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>

        <p className={styles.text}>
          The page you're looking for doesn’t exist or may have been moved.
        </p>

        <Link to="/" className={styles.button}>
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
