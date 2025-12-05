import styles from "./Popup.module.css";

export default function Popup({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>{title}</h3>
        <p>{message}</p>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.confirm} onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
