import React, { useState } from "react";
import styles from "./HelpAndSupport.module.css";

const faqs = [
  {
    q: "How do I post my property on Worth It Properties?",
    a: "To post a property, simply login to your account, click 'Post Property', fill the required details, upload images, and submit. Your listing will be reviewed and published shortly.",
  },
  {
    q: "Are property listings verified?",
    a: "We perform multiple verification checks, including phone verification, owner identity checks, and listing quality checks. Premium users can request additional verification.",
  },
  {
    q: "Do you charge any fee for listing properties?",
    a: "Posting a basic listing is free. However, premium visibility plans, featured listings, and promotional packages may have associated charges.",
  },
  {
    q: "Why am I not receiving enquiries for my property?",
    a: "Ensure your listing has clear photos, accurate pricing, proper location tagging, and a complete description. High-quality listings receive more engagement.",
  },
  {
    q: "How do I report suspicious or fraudulent activity?",
    a: "You can report any suspicious listing or user from the 'Report an Issue' page or by contacting our support team with evidence/screenshots.",
  },
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="masterContainer">
      <div className={styles.pageWrapper}>
        <h1 className={styles.title}>Frequently Asked Questions</h1>

        <div className={styles.faqContainer}>
          {faqs.map((item, i) => (
            <div key={i} className={styles.faqItem}>
              <div className={styles.faqQuestion} onClick={() => toggle(i)}>
                {item.q}
                <span>{openIndex === i ? "−" : "+"}</span>
              </div>

              {openIndex === i && (
                <div className={styles.faqAnswer}>{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;
