// rafce
import React from "react";
import { useFormContext } from "react-hook-form";
import { useProperty } from "../../../context/PropertyContext";
import styles from "../Wizard.module.css";

export default function Step1Details() {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext();
  const { nextStep } = useProperty();

  const handleNext = async () => {
    const valid = await trigger(["title", "price", "bhk", "areaSqFt"]);
    if (!valid) return;
    nextStep();
  };

  return (
    <div className={styles.step}>
      <h2>Property Details</h2>

      <div className={styles.grid}>
        <input
          placeholder="Title"
          {...register("title", { required: "Title required" })}
        />
        {errors.title && <p className={styles.error}>{errors.title.message}</p>}

        <input
          type="number"
          placeholder="Price"
          {...register("price", { required: "Price required", min: 1 })}
        />
        {errors.price && <p className={styles.error}>{errors.price.message}</p>}

        <input
          type="number"
          placeholder="BHK"
          {...register("bhk", { required: "BHK required", min: 1 })}
        />
        {errors.bhk && <p className={styles.error}>{errors.bhk.message}</p>}

        <select {...register("propertyType")}>
          <option value="flat">Flat</option>
          <option value="house">House</option>
          <option value="plot">Plot</option>
          <option value="office">Office</option>
          <option value="shop">Shop</option>
        </select>

        <input
          type="number"
          placeholder="Area (sq.ft)"
          {...register("areaSqFt", { required: "Area required", min: 1 })}
        />
        {errors.areaSqFt && (
          <p className={styles.error}>{errors.areaSqFt.message}</p>
        )}

        <select {...register("furnishing")}>
          <option value="unfurnished">Unfurnished</option>
          <option value="semi-furnished">Semi-Furnished</option>
          <option value="fully-furnished">Fully-Furnished</option>
        </select>

        <select {...register("status")}>
          <option value="new">New</option>
          <option value="resale">Resale</option>
        </select>

        <textarea
          placeholder="Short description"
          className={styles.textarea}
          {...register("description")}
        />
      </div>

      <div className={styles.navBtns}>
        <div />
        <button type="button" className={styles.nextBtn} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}
