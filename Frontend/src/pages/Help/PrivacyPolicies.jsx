import React from "react";
import styles from "./HelpAndSupport.module.css";

const PrivacyPolicies = () => {
  return (
    <div className="masterContainer">
      <div className={styles.pageWrapper}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.updated}>
          Last Updated: {new Date().getFullYear()}
        </p>

        <section className={styles.section}>
          <h2>1. Information We Collect</h2>
          <p>
            We collect personal information such as name, email ID, phone
            number, and location details to provide a seamless property browsing
            and posting experience. Additional data may be collected when users
            create listings or contact property owners.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. How We Use Your Information</h2>
          <p>
            Collected information is used to enhance platform performance,
            improve search results, personalize property recommendations, and
            provide customer support. We do not sell user data to third parties.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Cookies & Tracking</h2>
          <p>
            Worth It Properties uses cookies to store login sessions, improve
            loading speeds, and personalize user experience. You may disable
            cookies, but certain features may not function as expected.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Data Security</h2>
          <p>
            We implement advanced encryption, secure authentication, and
            server-level protection to safeguard user data. However, no digital
            platform can guarantee absolute security.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Third-Party Services</h2>
          <p>
            Our platform may integrate payment gateways, map services, analytics
            tools, and social login providers. These services operate under
            their own privacy policies.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Your Consent</h2>
          <p>
            By using Worth It Properties, you consent to the terms outlined in
            this Privacy Policy. Changes will be updated periodically.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicies;
