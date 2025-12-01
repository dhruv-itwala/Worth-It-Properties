// src/pages/Home/Home.jsx
import { motion } from "framer-motion";
import SearchBar from "../../components/SearchBar/SearchBar";
import styles from "./Home.module.css";
import { useProperties } from "../../context/PropertyContext";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import { Link } from "react-router-dom";

export default function Home() {
  const { properties, loading, fetchProperties } = useProperties();

  const onSearch = async (params) => {
    await fetchProperties(1, params);
  };

  return (
    <div>
      <section className={styles.hero}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.heroInner}>
            <h1 className={styles.title}>Find your perfect property</h1>
            <p className={styles.subtitle}>
              Search apartments, houses, plots and more — premium listings
            </p>

            <SearchBar onSearch={onSearch} />
          </div>
        </motion.div>
      </section>

      <section className="section">
        <div className="masterContainer">
          <div style={{ width: "100%" }}>
            <div className={styles.sectionHeader}>
              <h2>Featured Listings</h2>
              <Link to="/properties">View all</Link>
            </div>

            <div className={styles.grid}>
              {!loading &&
                properties
                  .slice(0, 8)
                  .map((p) => <PropertyCard key={p._id} property={p} />)}
              {loading && <p>Loading...</p>}
              {!loading && properties.length === 0 && (
                <p>No properties found</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
