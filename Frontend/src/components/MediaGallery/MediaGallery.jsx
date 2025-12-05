import { useState } from "react";
import styles from "./MediaGallery.module.css";

export default function MediaGallery({ images = [], video }) {
  const [active, setActive] = useState(0);

  const media = [...images]; // array of image URLs
  if (video) media.push(video); // last item becomes the video

  const isVideo = (index) => video && index === media.length - 1;

  return (
    <div className={styles.galleryWrapper}>
      {/* MAIN DISPLAY */}
      <div className={styles.mainDisplay}>
        {isVideo(active) ? (
          <video className={styles.video} controls preload="metadata">
            <source src={video} type="video/mp4" />
          </video>
        ) : (
          <img src={media[active]} className={styles.image} alt="property" />
        )}
      </div>

      {/* THUMBNAILS */}
      <div className={styles.thumbnails}>
        {media.map((item, idx) => (
          <div
            key={idx}
            className={`${styles.thumbBox} ${
              idx === active ? styles.active : ""
            }`}
            onClick={() => setActive(idx)}
          >
            {isVideo(idx) ? (
              <video className={styles.thumbVideo}>
                <source src={item} type="video/mp4" />
              </video>
            ) : (
              <img src={item} className={styles.thumbImg} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
