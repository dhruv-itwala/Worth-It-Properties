import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./PropertyDetails.module.css";
import MapView from "../../../components/MapView/MapView";
import ContactOwner from "../../../components/ContactOwner/ContactOwner";
import ApiService from "../../../api/api.service";
import MediaGallery from "../../../components/MediaGallery/MediaGallery";

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
      {/* IMAGE GALLERY */}
      <MediaGallery images={property.images} video={property.video} />

      <div className={styles.header}>
        <h1>{property.title}</h1>
        <p className={styles.price}>₹ {property.price.toLocaleString()}</p>
      </div>

      <div className={styles.quick}>
        <span>{property.bhk} BHK</span>
        <span>{property.areaSqFt} sq.ft</span>
        <span>{property.furnishing}</span>
        <span>{property.propertyType}</span>
      </div>

      {/* LOCATION */}
      <div className={styles.section}>
        <h2>Location</h2>
        <p>{property.mapAddress}</p>
        <MapView lat={property.latitude} lng={property.longitude} />
      </div>

      {/* DESCRIPTION */}
      <div className={styles.section}>
        <h2>Description</h2>
        <p>{property.description || "No description available."}</p>
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
