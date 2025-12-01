// src/pages/PostProperty/PostProperty.jsx
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PostProperty.module.css";
import { useProperties } from "../../context/PropertyContext";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { notifyError } from "../../utils/toast";

const STEP_TITLES = ["Basic", "Location & Price", "Media", "Review"];

export default function PostProperty({ editData = null }) {
  const { createProperty, updateProperty } = useProperties();
  const { user } = useAuth();
  const navigate = useNavigate();

  // form state
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: editData?.title || "",
    description: editData?.description || "",
    price: editData?.price || "",
    bhk: editData?.bhk || "",
    propertyType: editData?.propertyType || "flat",
    areaSqFt: editData?.areaSqFt || "",
    furnishing: editData?.furnishing || "unfurnished",
    status: editData?.status || "resale",
    city: editData?.city || "",
    locality: editData?.locality || "",
    latitude: editData?.latitude || "",
    longitude: editData?.longitude || "",
  });

  const [images, setImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState(editData?.images || []);
  const [video, setVideo] = useState(null);
  const videoRef = useRef();

  const updateField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const canNext = () => {
    if (step === 0) {
      return form.title.trim() && form.price && form.bhk;
    }
    if (step === 1) {
      return form.city.trim() && form.locality.trim();
    }
    if (step === 2) {
      return imagePreviews.length >= 1 && imagePreviews.length <= 8;
    }
    return true;
  };

  const onSelectImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + imagePreviews.length > 8) {
      notifyError("Maximum 8 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);
    const urls = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...urls]);
  };

  const removeImagePreview = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSelectVideo = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      notifyError("Video must be < 10MB");
      return;
    }
    setVideo(f);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Build FormData
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      // append image files
      images.forEach((file) => fd.append("images", file));
      if (video) fd.append("video", video);

      if (editData && editData._id) {
        await updateProperty(editData._id, fd);
        navigate(`/property/${editData._id}`);
      } else {
        const property = await createProperty(fd);
        navigate(`/property/${property._id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section">
      <div className="masterContainer" style={{ flexDirection: "column" }}>
        <div className={styles.card}>
          <h2>{editData ? "Edit Property" : "Post New Property"}</h2>

          <div className={styles.steps}>
            {STEP_TITLES.map((t, idx) => (
              <div
                key={t}
                className={`${styles.step} ${
                  idx === step ? styles.active : ""
                }`}
              >
                <div className={styles.stepIndex}>{idx + 1}</div>
                <div className={styles.stepTitle}>{t}</div>
              </div>
            ))}
          </div>

          <motion.div
            className={styles.formWrap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {step === 0 && (
              <div className={styles.formSection}>
                <label>Title</label>
                <input
                  className="input"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                />

                <label>Description</label>
                <textarea
                  className="input"
                  rows={4}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                />

                <div className={styles.row}>
                  <div>
                    <label>Price (INR)</label>
                    <input
                      className="input"
                      type="number"
                      value={form.price}
                      onChange={(e) => updateField("price", e.target.value)}
                    />
                  </div>

                  <div>
                    <label>BHK</label>
                    <input
                      className="input"
                      type="number"
                      value={form.bhk}
                      onChange={(e) => updateField("bhk", e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Property Type</label>
                    <select
                      className="input"
                      value={form.propertyType}
                      onChange={(e) =>
                        updateField("propertyType", e.target.value)
                      }
                    >
                      <option value="flat">Flat</option>
                      <option value="house">House</option>
                      <option value="plot">Plot</option>
                      <option value="office">Office</option>
                      <option value="shop">Shop</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className={styles.formSection}>
                <div className={styles.row}>
                  <div>
                    <label>City</label>
                    <input
                      className="input"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Locality / Area</label>
                    <input
                      className="input"
                      value={form.locality}
                      onChange={(e) => updateField("locality", e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div>
                    <label>Area (sqft)</label>
                    <input
                      className="input"
                      value={form.areaSqFt}
                      onChange={(e) => updateField("areaSqFt", e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Furnishing</label>
                    <select
                      className="input"
                      value={form.furnishing}
                      onChange={(e) =>
                        updateField("furnishing", e.target.value)
                      }
                    >
                      <option value="unfurnished">Unfurnished</option>
                      <option value="semi-furnished">Semi-furnished</option>
                      <option value="fully-furnished">Fully furnished</option>
                    </select>
                  </div>
                </div>

                <label>Status</label>
                <select
                  className="input"
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  <option value="resale">Resale</option>
                  <option value="new">New</option>
                </select>
              </div>
            )}

            {step === 2 && (
              <div className={styles.formSection}>
                <label>Images (1 - 8)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onSelectImages}
                />
                <div className={styles.previewRow}>
                  {imagePreviews.map((src, i) => (
                    <div key={i} className={styles.preview}>
                      <img src={src} alt={`img-${i}`} />
                      <button onClick={() => removeImagePreview(i)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <label>Video (optional, &lt;10MB)</label>
                <input type="file" accept="video/*" onChange={onSelectVideo} />
                {video && <div>{video.name}</div>}
              </div>
            )}

            {step === 3 && (
              <div className={styles.formSection}>
                <h3>Review</h3>
                <p>
                  <strong>Title:</strong> {form.title}
                </p>
                <p>
                  <strong>Price:</strong> ₹{form.price}
                </p>
                <p>
                  <strong>City:</strong> {form.city} • {form.locality}
                </p>
                <div className={styles.previewRow}>
                  {imagePreviews.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`rev-${i}`}
                      className={styles.smallThumb}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className={styles.controls}>
              {step > 0 && (
                <button
                  className="btn btn-outline"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={loading}
                >
                  Back
                </button>
              )}
              {step < STEP_TITLES.length - 1 && (
                <button
                  className="btn"
                  onClick={() =>
                    canNext()
                      ? setStep((s) => s + 1)
                      : notifyError("Please fill required fields")
                  }
                >
                  Next
                </button>
              )}
              {step === STEP_TITLES.length - 1 && (
                <button
                  className="btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading
                    ? "Posting..."
                    : editData
                    ? "Update Property"
                    : "Post Property"}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
