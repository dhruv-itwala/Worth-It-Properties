// Frontend/src/components/PropertyFormWizard/Steps/Step3Location.jsx
import React from "react";
import { useFormContext } from "react-hook-form";
import { useProperty } from "../../../context/PropertyContext";
import MapPicker from "../../MapPicker/MapPicker";
import styles from "../Wizard.module.css";

export default function Step3Location() {
  const { register, setValue, watch, trigger } = useFormContext();
  const { nextStep, prevStep } = useProperty();

  const handleNext = async () => {
    const valid = await trigger(["city", "locality"]);
    if (!valid) return;
    nextStep();
  };

  const onMapChange = (loc) => {
    if (!loc) return;
    const { latitude, longitude, formattedAddress } = loc;

    setValue("latitude", latitude);
    setValue("longitude", longitude);
    setValue("mapAddress", formattedAddress);
    const parts = formattedAddress.split(",");

    setValue("locality", parts[0]?.trim() || "");
    setValue("city", parts[parts.length - 3]?.trim() || "");
  };

  const currentMap = {
    latitude: watch("latitude"),
    longitude: watch("longitude"),
    formattedAddress: watch("mapAddress"),
  };

  return (
    <div className={styles.step}>
      <h2>Location</h2>

      <div className={styles.grid}>
        <input placeholder="City" {...register("city", { required: true })} />
        <input
          placeholder="Locality"
          {...register("locality", { required: true })}
        />
        <input placeholder="Map Address" {...register("mapAddress")} />

        <div className={styles.mapBox}>
          <label>Search & Pick on Map</label>
          <MapPicker value={currentMap} onChange={onMapChange} />
        </div>

        <input type="hidden" {...register("latitude")} />
        <input type="hidden" {...register("longitude")} />
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
