// src/components/SearchBar/SearchBar.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaMapMarkerAlt, FaSlidersH } from "react-icons/fa";
import styles from "./SearchBar.module.css";
import clsx from "clsx";

const PriceChip = ({ value, onClick }) => (
  <button className={styles.simpleChip} onClick={() => onClick(value)}>
    {value}
  </button>
);

export default function SearchBar({ onSearch, initial = {} }) {
  const [openAdvanced, setOpenAdvanced] = useState(false);
  const [keyword, setKeyword] = useState(initial.keyword || "");
  const [city, setCity] = useState(initial.city || "");
  const [area, setArea] = useState(initial.area || "");
  const [priceMin, setPriceMin] = useState(initial.priceMin || "");
  const [priceMax, setPriceMax] = useState(initial.priceMax || "");
  const [bhk, setBhk] = useState(initial.bhk || "");
  const [propertyType, setPropertyType] = useState(initial.propertyType || "");
  const [furnishing, setFurnishing] = useState(initial.furnishing || "");

  const runSearch = (e) => {
    e?.preventDefault();
    onSearch({
      keyword,
      city,
      area,
      priceMin,
      priceMax,
      bhk,
      propertyType,
      furnishing,
      sort: "newest",
    });
  };

  const quickPrice = (val) => {
    const [min, max] = val.split("-");
    setPriceMin(min);
    setPriceMax(max);
  };

  return (
    <div className={styles.heroSearch}>
      <motion.form
        className={styles.searchForm}
        onSubmit={runSearch}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.left}>
          <div className={styles.inputGroup}>
            <FaSearch className={styles.icon} />
            <input
              placeholder="Search projects, locality, landmark or project name"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <FaMapMarkerAlt className={styles.icon} />
            <input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.simpleChips}>
            <PriceChip value="0-5000000" onClick={quickPrice} />
            <PriceChip value="5000000-10000000" onClick={quickPrice} />
            <PriceChip value="10000000-25000000" onClick={quickPrice} />
          </div>
        </div>

        <div className={styles.right}>
          <button
            type="button"
            className={styles.advBtn}
            onClick={() => setOpenAdvanced(!openAdvanced)}
          >
            <FaSlidersH /> Advanced
          </button>

          <button type="submit" className={styles.searchBtn}>
            Search
          </button>
        </div>

        <motion.div
          className={clsx(
            styles.advancedPanel,
            openAdvanced ? styles.open : ""
          )}
          initial={{ height: 0 }}
          animate={{
            height: openAdvanced ? "auto" : 0,
            opacity: openAdvanced ? 1 : 0,
          }}
        >
          <div className={styles.advRow}>
            <label>BHK</label>
            <select value={bhk} onChange={(e) => setBhk(e.target.value)}>
              <option value="">Any</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>

            <label>Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="">Any</option>
              <option value="flat">Flat</option>
              <option value="house">House</option>
              <option value="plot">Plot</option>
              <option value="office">Office</option>
              <option value="shop">Shop</option>
            </select>

            <label>Furnishing</label>
            <select
              value={furnishing}
              onChange={(e) => setFurnishing(e.target.value)}
            >
              <option value="">Any</option>
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi-furnished</option>
              <option value="fully-furnished">Fully furnished</option>
            </select>

            <label>Area (sqft)</label>
            <input
              type="number"
              placeholder="Min area"
              className={styles.smallInput}
            />
            <input
              type="number"
              placeholder="Max area"
              className={styles.smallInput}
            />
          </div>
        </motion.div>
      </motion.form>
    </div>
  );
}
