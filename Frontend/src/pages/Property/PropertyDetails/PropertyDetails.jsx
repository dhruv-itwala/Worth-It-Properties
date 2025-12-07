import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./PropertyDetails.module.css";
import MapView from "../../../components/MapView/MapView";
import ContactOwner from "../../../components/ContactOwner/ContactOwner";
import ApiService from "../../../api/api.service";
import MediaGallery from "../../../components/MediaGallery/MediaGallery";

// Icons
import {
  FaBath,
  FaCar,
  FaRulerCombined,
  FaBuilding,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaArrowUp,
  FaHome,
  FaClock,
  FaTag,
  FaEye,
  FaCompass,
} from "react-icons/fa";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProperty = async () => {
    try {
      const res = await ApiService.getProperty(id);
      setProperty(res.data.property);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (!property) return <p className={styles.notFound}>Property not found</p>;

  return (
    <div className={styles.container}>
      {/* MEDIA SECTION */}
      <MediaGallery images={property.images} video={property.video} />

      {/* HEADER SECTION */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{property.title}</h1>
          <p className={styles.address}>
            <FaMapMarkerAlt /> {property.locality}, {property.city}
          </p>
        </div>

        <div className={styles.priceBox}>
          <h2 className={styles.price}>₹ {property.price.toLocaleString()}</h2>

          {property.isVerified && (
            <p className={styles.verified}>
              <FaCheckCircle /> Verified Listing
            </p>
          )}

          <p className={styles.views}>
            <FaEye /> {property.views} views
          </p>
        </div>
      </div>

      {/* QUICK INFO GRID */}
      <div className={styles.quickGrid}>
        <div className={styles.item}>
          <FaHome /> {property.bhk} BHK
        </div>

        <div className={styles.item}>
          <FaRulerCombined /> {property.areaSqFt} sq.ft
        </div>

        <div className={styles.item}>
          <FaBuilding /> {property.propertyType}
        </div>

        <div className={styles.item}>
          <FaTag /> {property.furnishing}
        </div>

        <div className={styles.item}>
          <FaBath /> {property.bathrooms} Bathrooms
        </div>

        <div className={styles.item}>
          <FaCar /> {property.parking ? "Parking Available" : "No Parking"}
        </div>

        <div className={styles.item}>
          <FaArrowUp /> Floor {property.floor} / {property.totalFloors}
        </div>

        <div className={styles.item}>
          <FaClock /> {property.ageOfProperty || "New Property"}
        </div>

        <div className={styles.item}>
          <FaCompass /> Facing: {property.facing || "N/A"}
        </div>

        <div className={styles.item}>
          <FaTag /> {property.transactionType.toUpperCase()}
        </div>

        <div className={styles.item}>
          <FaClock /> Availability: {property.availability || "Immediate"}
        </div>
      </div>

      {/* LOCATION */}
      <div className={styles.section}>
        <h2>Location</h2>
        <p className={styles.locationText}>{property.mapAddress}</p>
        <MapView lat={property.latitude} lng={property.longitude} />
      </div>

      {/* DESCRIPTION */}
      <div className={styles.section}>
        <h2>Description</h2>
        <p className={styles.description}>
          {property.description || "No description available."}
        </p>
      </div>

      {/* AMENITIES */}
      {property.amenities?.length > 0 && (
        <div className={styles.section}>
          <h2>Amenities</h2>
          <ul className={styles.amenities}>
            {property.amenities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* CONTACT OWNER */}
      <ContactOwner user={property.postedBy} />
    </div>
  );
}
