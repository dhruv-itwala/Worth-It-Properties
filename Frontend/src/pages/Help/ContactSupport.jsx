import React from "react";
import styles from "./HelpAndSupport.module.css";

const ContactSupport = () => {
  return (
    <div className="masterContainer">
      <div className={styles.pageWrapper}>
        <h1 className={styles.title}>Contact Support</h1>

        <section className={styles.section}>
          <p>
            Our support team is available to assist you with account queries,
            listing issues, payments, and platform-related concerns. We aim to
            respond within 24–48 hours.
          </p>

          <div className={styles.infoBox}>
            <p>
              <strong>Email:</strong> support@worthitproperties.com
            </p>
            <p>
              <strong>Phone:</strong> +91 98765 43210
            </p>
            <p>
              <strong>Support Hours:</strong> Mon–Sat, 10 AM – 6 PM
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Submit a Query</h2>

          <form className={styles.form}>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <textarea placeholder="Describe your issue"></textarea>
            <button type="submit">Submit Request</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ContactSupport;
