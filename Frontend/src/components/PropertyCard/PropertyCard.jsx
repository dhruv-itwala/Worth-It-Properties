// src/components/PropertyCard/PropertyCard.jsx
import { motion } from "framer-motion";
import styles from "./PropertyCard.module.css";
import { Link } from "react-router-dom";
import { FaHeart, FaMapMarkerAlt, FaBed } from "react-icons/fa";
import ApiService from "../../api/api.service";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function PropertyCard({ property }) {
  const {
    _id,
    title,
    price,
    images = [],
    bhk,
    city,
    locality,
    propertyType,
    status,
  } = property;
  const [favLoading, setFavLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const toggleFav = async () => {
    if (!isAuthenticated) {
      // show toast and redirect to login
      window.location.href = "/login";
      return;
    }
    setFavLoading(true);
    try {
      await ApiService.toggleWishlist(_id);
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <motion.div
      className={styles.card}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link to={`/property/${_id}`} className={styles.media}>
        <img
          src={images[0] || "https://via.placeholder.com/520x320?text=No+Image"}
          alt={title}
        />
        <div className={styles.price}>₹{Number(price).toLocaleString()}</div>
        {status && <div className={styles.badge}>{status}</div>}
      </Link>

      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link to={`/property/${_id}`}>{title}</Link>
        </h3>

        <p className={styles.meta}>
          <FaBed /> {bhk} BHK • {propertyType}
        </p>
        <p className={styles.location}>
          <FaMapMarkerAlt /> {locality}, {city}
        </p>

        <div className={styles.actions}>
          <button className={styles.contactBtn}>Contact</button>
          <button
            className={styles.wishBtn}
            onClick={toggleFav}
            disabled={favLoading}
          >
            <FaHeart />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
