// rafce
import React from "react";
import styles from "./Wizard.module.css";

export const Input = ({ label, error, ...props }) => (
  <div className={styles.field}>
    {label && <label>{label}</label>}
    <input {...props} className={styles.input} />
    {error && <p className={styles.error}>{error}</p>}
  </div>
);

export const Select = ({ label, error, children, ...props }) => (
  <div className={styles.field}>
    {label && <label>{label}</label>}
    <select {...props} className={styles.input}>
      {children}
    </select>
    {error && <p className={styles.error}>{error}</p>}
  </div>
);

export const Textarea = ({ label, error, ...props }) => (
  <div className={styles.field}>
    {label && <label>{label}</label>}
    <textarea {...props} className={styles.textarea} />
    {error && <p className={styles.error}>{error}</p>}
  </div>
);

export const SectionTitle = ({ children }) => (
  <h2 className={styles.sectionTitle}>{children}</h2>
);

export const ImgPreview = ({ src, onRemove }) => (
  <div className={styles.imageBox}>
    <img src={src} alt="preview" />
    {onRemove && (
      <button className={styles.removeBtn} onClick={onRemove}>
        ×
      </button>
    )}
  </div>
);

export const VideoPreview = ({ src }) => (
  <video controls className={styles.videoPreview}>
    <source src={src} />
  </video>
);
