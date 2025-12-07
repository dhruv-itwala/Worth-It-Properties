// rafce
import React from "react";
import { useFormContext } from "react-hook-form";
import { useProperty } from "../../../context/PropertyContext";
import styles from "../Wizard.module.css";

export default function Step5Review({
  mode = "create",
  propertyId,
  onSuccess,
  formMethods,
}) {
  const { getValues } = useFormContext();
  const {
    oldImages,
    images,
    video,
    videoUrl,
    submitProperty,
    prevStep,
    loading,
  } = useProperty();

  const handleSubmit = async () => {
    const values = getValues();

    // Basic final validation
    if (
      !values.title ||
      !values.price ||
      !values.bhk ||
      !values.city ||
      !values.locality
    ) {
      alert("Please complete required fields in previous steps.");
      return;
    }

    try {
      await submitProperty(values, mode, propertyId, onSuccess);
    } catch (err) {
      // submitProperty already toasts
    }
  };

  const mediaPreview = (
    <>
      {oldImages?.map((u, i) => (
        <img key={"old" + i} src={u} className={styles.mediaThumb} alt="old" />
      ))}
      {images?.map((f, i) => (
        <img
          key={"new" + i}
          src={URL.createObjectURL(f)}
          className={styles.mediaThumb}
          alt="new"
        />
      ))}
      {video ? (
        <video key="newvideo" className={styles.mediaVideo} controls>
          <source src={URL.createObjectURL(video)} />
        </video>
      ) : videoUrl ? (
        <video key="oldvideo" className={styles.mediaVideo} controls>
          <source src={videoUrl} />
        </video>
      ) : null}
    </>
  );

  const values = getValues();

  return (
    <div className={styles.step}>
      <h2>Review & Submit</h2>

      <div className={styles.reviewSection}>
        <h3>Basic</h3>
        <p>
          <strong>Title:</strong> {values.title}
        </p>
        <p>
          <strong>Price:</strong> ₹ {values.price}
        </p>
        <p>
          <strong>BHK:</strong> {values.bhk}
        </p>
        <p>
          <strong>Type:</strong> {values.propertyType}
        </p>
        <p>
          <strong>Area:</strong> {values.areaSqFt} sq.ft
        </p>
        <p>
          <strong>Furnishing:</strong> {values.furnishing}
        </p>
      </div>

      <div className={styles.reviewSection}>
        <h3>Location</h3>
        <p>
          <strong>City:</strong> {values.city}
        </p>
        <p>
          <strong>Locality:</strong> {values.locality}
        </p>
        <p>
          <strong>Address:</strong> {values.mapAddress}
        </p>
        <p>
          <strong>Coordinates:</strong> {values.latitude}, {values.longitude}
        </p>
      </div>

      <div className={styles.reviewSection}>
        <h3>Media Preview</h3>
        <div className={styles.mediaRow}>{mediaPreview}</div>
      </div>

      <div className={styles.navBtns}>
        <button onClick={prevStep}>Back</button>

        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <div className="loader" />
          ) : mode === "create" ? (
            "Post Property"
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}
