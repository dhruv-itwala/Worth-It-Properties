import styles from "./ContactOwner.module.css";

export default function ContactOwner({ user }) {
  if (!user) return null;

  return (
    <div className={styles.box}>
      <img src={user.profilePhoto} className={styles.avatar} alt={user.name} />

      <div>
        <h3>{user.name}</h3>
        <p>{user.role}</p>

        {user.phone && (
          <p>
            <b>Phone:</b> {user.phone}
          </p>
        )}

        {user.whatsappNumber && (
          <p>
            <b>WhatsApp:</b> {user.whatsappNumber}
          </p>
        )}
      </div>
    </div>
  );
}
