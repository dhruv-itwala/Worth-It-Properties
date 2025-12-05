import styles from "./MapView.module.css";

export default function MapView({ lat, lng }) {
  if (!lat || !lng) return <p>No map available</p>;

  const url = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <div className={styles.mapWrap}>
      <iframe src={url} loading="lazy"></iframe>
    </div>
  );
}
