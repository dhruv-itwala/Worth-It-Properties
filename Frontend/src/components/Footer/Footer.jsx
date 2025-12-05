import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`masterContainer ${styles.inner}`}>
        {/* BRAND */}
        <div className={styles.col}>
          <h3 className={styles.logo}>
            Worth<span>It</span>
          </h3>
          <p className={styles.tagline}>
            India’s premium property discovery & posting platform. Helping
            thousands find their dream home with trust & transparency.
          </p>
        </div>

        {/* EXPLORE */}
        <div className={styles.col}>
          <h4>Explore</h4>
          <Link to="/">Buy Property</Link>
          <Link to="/">Rent Property</Link>
          <Link to="/post-property">Post Your Property</Link>
          <Link to="/dashboard">Your Dashboard</Link>
        </div>

        {/* POPULAR LOCATIONS */}
        <div className={styles.col}>
          <h4>Popular Locations</h4>
          <p>Mumbai</p>
          <p>Pune</p>
          <p>Delhi NCR</p>
          <p>Bangalore</p>
          <p>Hyderabad</p>
        </div>

        {/* COMPANY */}
        <div className={styles.col}>
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/advertise">Advertise With Us</Link>
          <Link to="/blogs">Real Estate Blog</Link>
        </div>

        {/* HELP & SUPPORT */}
        <div className={styles.col}>
          <h4>Help & Support</h4>
          <Link to="/contact">Contact Support</Link>
          <Link to="/faq">FAQs</Link>
          <Link to="/support-center">Support Center</Link>
          <Link to="/report-issue">Report an Issue</Link>

          <div className={styles.socials}>
            <FaFacebookF />
            <FaInstagram />
            <FaYoutube />
            <FaTwitter />
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        © {new Date().getFullYear()} Worth It Properties — All Rights Reserved.
      </div>
    </footer>
  );
}
