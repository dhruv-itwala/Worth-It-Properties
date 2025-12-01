// src/pages/Property/PropertyDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../api/api.service";
import styles from "./PropertyDetail.module.css";
import { FaMapMarkerAlt, FaBed } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function PropertyDetail() {
  const { isAuthenticated } = useAuth();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const contactOwner = () => {
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const res = await ApiService.getPropertyById(id);
        setProperty(res.data.property);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!property) return <p>Property not found</p>;

  const {
    title,
    description,
    images = [],
    price,
    bhk,
    city,
    locality,
    areaSqFt,
    postedBy,
    video,
  } = property;

  return (
    <div className="section">
      <div className="masterContainer">
        <div style={{ width: "100%" }}>
          <div className={styles.grid}>
            <div className={styles.gallery}>
              <div className={styles.mainImg}>
                <img
                  src={images[0] || "https://via.placeholder.com/800x500"}
                  alt={title}
                />
              </div>

              <div className={styles.thumbRow}>
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${i}`}
                    className={styles.thumb}
                  />
                ))}
              </div>

              {video && (
                <div className={styles.video}>
                  <video controls src={video} width="100%" />
                </div>
              )}
            </div>

            <div className={styles.info}>
              <h1>{title}</h1>
              <p className={styles.price}>₹{Number(price).toLocaleString()}</p>

              <div className={styles.meta}>
                <span>
                  <FaBed /> {bhk} BHK
                </span>
                <span>{areaSqFt} sqft</span>
                <span>
                  <FaMapMarkerAlt /> {locality}, {city}
                </span>
              </div>

              <div className={styles.section}>
                <h3>Overview</h3>
                <p>{description}</p>
              </div>

              <div className={styles.section}>
                <h3>Posted By</h3>
                <p>
                  {postedBy?.name} • {postedBy?.email}
                </p>
              </div>

              <div className={styles.section}>
                <h3>Location</h3>
                <div className={styles.mapPlaceholder}>
                  Map will go here (use Google Maps / Leaflet)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
