// rafce
import React from "react";
import { useFormContext } from "react-hook-form";
import { useProperty } from "../../../context/PropertyContext";
import styles from "../Wizard.module.css";

export default function Step2Amenities() {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext();

  const { nextStep, prevStep } = useProperty();

  const handleNext = async () => {
    const valid = await trigger([
      "bathrooms",
      "parking",
      "floor",
      "totalFloors",
    ]);
    if (!valid) return;
    nextStep();
  };

  return (
    <div className={styles.step}>
      <h2>Property Amenities</h2>

      <div className={styles.grid}>
        <input
          type="number"
          placeholder="Bathrooms"
          {...register("bathrooms", { required: true, min: 1 })}
        />

        <select {...register("parking")}>
          <option value={true}>Parking Available</option>
          <option value={false}>No Parking</option>
        </select>

        <input type="number" placeholder="Floor" {...register("floor")} />

        <input
          type="number"
          placeholder="Total Floors"
          {...register("totalFloors")}
        />

        <input
          type="text"
          placeholder="Age of Property"
          {...register("ageOfProperty")}
        />

        <select {...register("facing")}>
          <option value="">Facing</option>
          <option value="north">North</option>
          <option value="south">South</option>
          <option value="east">East</option>
          <option value="west">West</option>
        </select>

        <textarea
          placeholder="Amenities (comma separated)"
          {...register("amenities")}
        />
      </div>

      <div className={styles.navBtns}>
        <button type="button" onClick={prevStep}>
          Back
        </button>
        <button type="button" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}
