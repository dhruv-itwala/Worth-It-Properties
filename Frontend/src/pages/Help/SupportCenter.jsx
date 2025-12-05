import React from "react";
import { Link } from "react-router-dom";
import styles from "./HelpAndSupport.module.css";

const SupportCenter = () => {
  return (
    <div className="masterContainer">
      <div className={styles.pageWrapper}>
        <h1 className={styles.title}>Support Center</h1>
        <p className={styles.subtitle}>
          Need help? Find answers, get support, or report an issue. We're here
          to assist you.
        </p>

        {/* HELP CATEGORIES */}
        <div className={styles.supportGrid}>
          <div className={styles.supportCard}>
            <h3>Account & Login</h3>
            <Link to="/contact-support">Account not accessible</Link>
            <Link to="/faqs">Trouble logging in</Link>
            <Link to="/faqs">Reset password</Link>
          </div>

          <div className={styles.supportCard}>
            <h3>Property Listings</h3>
            <Link to="/faqs">How to post a property</Link>
            <Link to="/faqs">Why is my listing not visible?</Link>
            <Link to="/report-issue">Report fake listing</Link>
          </div>

          <div className={styles.supportCard}>
            <h3>Payments & Plans</h3>
            <Link to="/faqs">Refund policy</Link>
            <Link to="/faqs">Premium listing details</Link>
            <Link to="/contact-support">Payment failed</Link>
          </div>

          <div className={styles.supportCard}>
            <h3>Safety & Verification</h3>
            <Link to="/report-issue">Report fraudulent user</Link>
            <Link to="/faqs">How verification works</Link>
          </div>
        </div>

        {/* CONTACT BOX */}
        <div className={styles.infoBox}>
          <h3>Need Personal Assistance?</h3>
          <p>Email: support@worthitproperties.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Support Hours: Mon–Sat, 10 AM – 6 PM</p>
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;
