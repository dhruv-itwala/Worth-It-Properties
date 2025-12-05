import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ApiService from "../../api/api.service";
import styles from "./Dashboard.module.css";
import PropertyRow from "../../components/PropertyRow/PropertyRow";

export default function Dashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);

  const fetchData = async () => {
    const res = await ApiService.getUserProperties(user._id);
    setProperties(res.data.properties || res.data);
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Dashboard</h2>

      <button
        className={styles.postBtn}
        onClick={() => (window.location.href = "/post-property")}
      >
        + Post New Property
      </button>

      <div className={styles.statsBox}>
        <div className={styles.stat}>
          <h3>{properties.length}</h3>
          <p>Total Listings</p>
        </div>

        <div className={styles.stat}>
          <h3>{properties.reduce((sum, p) => sum + (p.views || 0), 0)}</h3>
          <p>Total Views</p>
        </div>
      </div>

      <div className={styles.list}>
        {properties.map((p) => (
          <PropertyRow key={p._id} property={p} refresh={fetchData} />
        ))}
      </div>
    </div>
  );
}
