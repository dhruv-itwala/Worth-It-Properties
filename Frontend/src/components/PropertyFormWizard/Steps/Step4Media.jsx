// Frontend/src/components/PropertyFormWizard/Steps/Step4Media.jsx
import React from "react";
import { useProperty } from "../../../context/PropertyContext";
import styles from "../Wizard.module.css";

export default function Step4Media() {
  const {
    images,
    setImages,
    oldImages,
    setOldImages,
    video,
    setVideo,
    nextStep,
    prevStep,
  } = useProperty();

  const handleImageAdd = (e) => {
    const files = Array.from(e.target.files || []);
    if (images.length + oldImages.length + files.length > 8) {
      alert("Max 8 images allowed (existing + new).");
      return;
    }
    const allowed = ["image/png", "image/jpeg", "image/webp"];
    if (!files.every((f) => allowed.includes(f.type))) {
      alert("Only PNG/JPG/WEBP images allowed.");
      return;
    }
    setImages((p) => [...p, ...files]);
  };

  const removeNewImage = (idx) =>
    setImages((p) => p.filter((_, i) => i !== idx));
  const removeOldImage = (idx) =>
    setOldImages((p) => p.filter((_, i) => i !== idx));

  const handleVideoAdd = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const allowedV = ["video/mp4", "video/quicktime", "video/x-matroska"];
    if (!allowedV.includes(f.type)) {
      alert("Video must be MP4 / MOV / MKV");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      alert("Video must be under 10MB");
      return;
    }
    setVideo(f);
  };

  return (
    <div className={styles.step}>
      <h2>Media</h2>

      <div className={styles.mediaGrid}>
        <div>
          <label className={styles.label}>Existing Images</label>
          <div className={styles.thumbRow}>
            {oldImages?.length ? (
              oldImages.map((url, idx) => (
                <div key={idx} className={styles.thumbBox}>
                  <img src={url} alt="old" className={styles.thumbImg} />
                  <button
                    type="button"
                    className={styles.smallBtn}
                    onClick={() => removeOldImage(idx)}
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.muted}>No existing images</p>
            )}
          </div>
        </div>

        <div>
          <label className={styles.label}>Add New Images (max 8 total)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageAdd}
          />
          <div className={styles.thumbRow}>
            {images?.map((file, idx) => (
              <div key={idx} className={styles.thumbBox}>
                <img
                  src={URL.createObjectURL(file)}
                  alt="new"
                  className={styles.thumbImg}
                />
                <button
                  type="button"
                  className={styles.smallBtn}
                  onClick={() => removeNewImage(idx)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className={styles.label}>Video (optional, max 10MB)</label>
          <input type="file" accept="video/*" onChange={handleVideoAdd} />
          <div className={styles.videoPreview}>
            {video ? (
              <video controls width="320">
                <source src={URL.createObjectURL(video)} />
              </video>
            ) : (
              <p className={styles.muted}>No new video selected</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.navBtns}>
        <button type="button" onClick={prevStep}>
          Back
        </button>
        <button type="button" onClick={nextStep}>
          Next
        </button>
      </div>
    </div>
  );
}
