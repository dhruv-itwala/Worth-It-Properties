import { useNavigate } from "react-router-dom";
import styles from "./PropertyCard.module.css";

export default function PropertyCard({ item }) {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      onClick={() => navigate(`/properties/${item._id}`)}
    >
      <img src={item.images?.[0]} className={styles.img} alt={item.title} />

      <div className={styles.info}>
        <h3 className={styles.title}>{item.title}</h3>

        <p className={styles.price}>₹ {item.price.toLocaleString()}</p>

        <p className={styles.details}>
          {item.bhk} BHK • {item.areaSqFt} sq.ft
        </p>

        <p className={styles.location}>
          {item.locality}, {item.city}
        </p>
      </div>
    </div>
  );
}
