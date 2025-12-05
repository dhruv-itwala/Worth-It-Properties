import { useEffect, useState } from "react";
import ApiService from "../../../api/api.service";
import Pagination from "../../../components/Pagination/Pagination";
import PropertyCard from "../../../components/PropertyCard/PropertyCard";
import styles from "./PropertyList.module.css";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 12;

  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await ApiService.getProperties({ page, limit });
      setProperties(res.data.properties || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, [page]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Available Properties</h2>

      {loading ? (
        <p>Loading...</p>
      ) : properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <div className={styles.grid}>
          {properties.map((item) => (
            <PropertyCard key={item._id} item={item} />
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      )}
    </div>
  );
};

export default PropertyList;
