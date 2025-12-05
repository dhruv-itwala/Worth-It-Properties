import { useNavigate } from "react-router-dom";
import ApiService from "../../api/api.service";
import styles from "./PropertyRow.module.css";

export default function PropertyRow({ property, refresh }) {
  const navigate = useNavigate();

  const remove = async () => {
    await ApiService.removeWishlist; // ignore accidentally

    await ApiService.deleteProperty(property._id);
    refresh();
  };

  return (
    <div className={styles.row}>
      <img src={property.images[0]} className={styles.img} />

      <div className={styles.info}>
        <h3>{property.title}</h3>
        <p>
          {property.bhk} BHK — {property.areaSqFt} sq.ft
        </p>
        <p>
          {property.locality}, {property.city}
        </p>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.viewBtn}
          onClick={() => navigate(`/properties/${property._id}`)}
        >
          View
        </button>

        <button
          className={styles.editBtn}
          onClick={() => navigate(`/edit-property/${property._id}`)}
        >
          Edit
        </button>

        <button className={styles.deleteBtn} onClick={remove}>
          Delete
        </button>
      </div>
    </div>
  );
}
