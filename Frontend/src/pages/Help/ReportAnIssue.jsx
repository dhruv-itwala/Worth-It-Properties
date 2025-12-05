import React from "react";
import styles from "./HelpAndSupport.module.css";

const ReportAnIssue = () => {
  return (
    <div className="masterContainer">
      <div className={styles.pageWrapper}>
        <h1 className={styles.title}>Report an Issue</h1>

        <section className={styles.section}>
          <p>
            Found something unusual? Help us maintain a safe and trusted
            property marketplace by reporting issues related to fake listings,
            spam calls, misleading images, or suspicious user activity.
          </p>
        </section>

        <section className={styles.section}>
          <h2>Types of Issues You Can Report</h2>
          <ul className={styles.list}>
            <li>Fake or misleading property listing</li>
            <li>Fraudulent owner / broker activity</li>
            <li>Incorrect pricing or area information</li>
            <li>Inappropriate or abusive communication</li>
            <li>Technical issues with the platform</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>Submit Issue Report</h2>

          <form className={styles.form}>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <textarea placeholder="Describe the issue in detail"></textarea>
            <button type="submit">Report Issue</button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ReportAnIssue;
