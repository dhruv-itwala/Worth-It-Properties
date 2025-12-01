// src/pages/Properties/Properties.jsx
import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import styles from "./Properties.module.css";
import { useProperties } from "../../context/PropertyContext";

export default function Properties() {
  const { properties, loading, fetchProperties, page, count, limit, setPage } =
    useProperties();
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    fetchProperties(1);
    // eslint-disable-next-line
  }, []);

  const loadMore = async () => {
    setLocalLoading(true);
    const next = page + 1;
    await fetchProperties(next);
    setLocalLoading(false);
  };

  return (
    <div className="section">
      <div className="masterContainer">
        <div style={{ width: "100%" }}>
          <SearchBar onSearch={(params) => fetchProperties(1, params)} />

          <div className={styles.grid}>
            {properties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>

          <div className={styles.pagination}>
            {properties.length < count ? (
              <button
                className="btn"
                onClick={loadMore}
                disabled={localLoading}
              >
                {localLoading ? "Loading..." : "Load More"}
              </button>
            ) : (
              <p>Showing all results</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
