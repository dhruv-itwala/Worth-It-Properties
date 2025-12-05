import React from "react";
import styles from "./HelpAndSupport.module.css";

const TermsAndConditions = () => {
  return (
    <div className="masterContainer">
      <div className={styles.pageWrapper}>
        <h1 className={styles.title}>Terms & Conditions</h1>
        <p className={styles.updated}>
          Last Updated: {new Date().getFullYear()}
        </p>

        <section className={styles.section}>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Worth It Properties. By accessing or using our platform,
            you agree to comply with the following Terms & Conditions. These
            terms govern your use of our website, mobile application, and all
            associated services. Please read them carefully before proceeding.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. User Responsibilities</h2>
          <p>
            Users must provide accurate information while creating accounts or
            posting property listings. Any attempt to upload misleading, fake,
            or fraudulent listings may lead to suspension or permanent account
            termination. Users are solely responsible for maintaining the
            confidentiality of their login credentials.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. Property Listings</h2>
          <p>
            All property listings must adhere to local law, ownership validity,
            and truthful representation. Worth It Properties is not responsible
            for verifying ownership documents unless explicitly stated under
            premium verification services.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Payment & Services</h2>
          <p>
            Any paid services, promotions, or premium visibility packages on
            Worth It Properties are non-refundable once activated. Users must
            review service details before making payments.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Limitation of Liability</h2>
          <p>
            Worth It Properties acts as an intermediary platform connecting
            buyers, owners, builders, and brokers. We are not a party to any
            sale, rental, or leasing agreement. Users must independently verify
            property details before making decisions.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Changes to Terms</h2>
          <p>
            We may update these Terms periodically to comply with legal or
            operational requirements. Continued use of our platform signifies
            acceptance of the updated terms.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
