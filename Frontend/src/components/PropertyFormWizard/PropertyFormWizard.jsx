// rafce
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useProperty, PropertyProvider } from "../../context/PropertyContext";

import Step1Details from "./Steps/Step1Details";
import Step2Amenities from "./Steps/Step2Amenities";
import Step3Location from "./Steps/Step3Location";
import Step4Media from "./Steps/Step4Media";
import Step5Review from "./Steps/Step5Review";

import styles from "./Wizard.module.css";
const InnerWizard = ({
  mode = "create",
  initialData = {},
  propertyId,
  onSuccess,
}) => {
  const methods = useForm({ mode: "onTouched" });
  const { reset } = methods;

  const { step, goToStep, setOldImages, setVideoUrl, loading } = useProperty();

  // Prefill form when editing
  useEffect(() => {
    if (mode === "edit" && initialData) {
      const defaults = {
        title: initialData.title || "",
        description: initialData.description || "",
        price: initialData.price || "",
        bhk: initialData.bhk || "",
        propertyType: initialData.propertyType || "flat",
        areaSqFt: initialData.areaSqFt || "",
        furnishing: initialData.furnishing || "unfurnished",
        status: initialData.status || "new",
        city: initialData.city || "",
        locality: initialData.locality || "",
        transactionType: initialData.transactionType || "sale",
        mapAddress: initialData.mapAddress || "",
        latitude: initialData.latitude || "",
        longitude: initialData.longitude || "",
        bathrooms: initialData.bathrooms || 1,
        parking: !!initialData.parking,
        floor: initialData.floor || 0,
        totalFloors: initialData.totalFloors || 0,
        ageOfProperty: initialData.ageOfProperty || "",
        facing: initialData.facing || "",
        amenities: initialData.amenities || [],
        availability: initialData.availability || "",
      };

      reset(defaults);
      if (initialData.images) setOldImages(initialData.images);
      if (initialData.video) setVideoUrl(initialData.video);

      if (Array.isArray(initialData.images)) setOldImages(initialData.images);
      if (initialData.video) setVideoUrl(initialData.video);

      // start at step 1
      goToStep(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initialData, reset]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.topRow}>
        <div className={styles.stepsIndicator}>
          <div
            className={`${styles.stepItem} ${step >= 1 ? styles.active : ""}`}
          >
            <div className={styles.circle}>1</div>
            <div className={styles.label}>Details</div>
          </div>
          <div
            className={`${styles.stepItem} ${step >= 2 ? styles.active : ""}`}
          >
            <div className={styles.circle}>2</div>
            <div className={styles.label}>Amenities</div>
          </div>
          <div
            className={`${styles.stepItem} ${step >= 3 ? styles.active : ""}`}
          >
            <div className={styles.circle}>3</div>
            <div className={styles.label}>Location</div>
          </div>
          <div
            className={`${styles.stepItem} ${step >= 4 ? styles.active : ""}`}
          >
            <div className={styles.circle}>4</div>
            <div className={styles.label}>Media</div>
          </div>
          <div
            className={`${styles.stepItem} ${step >= 5 ? styles.active : ""}`}
          >
            <div className={styles.circle}>5</div>
            <div className={styles.label}>Review</div>
          </div>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={(e) => e.preventDefault()}>
          {step === 1 && <Step1Details />}
          {step === 2 && <Step2Amenities />}
          {step === 3 && <Step3Location />}
          {step === 4 && <Step4Media />}
          {step === 5 && (
            <Step5Review
              mode={mode}
              propertyId={propertyId}
              onSuccess={onSuccess}
              formMethods={methods}
            />
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default function PropertyFormWizardWrapper(props) {
  return (
    <PropertyProvider>
      <InnerWizard {...props} />
    </PropertyProvider>
  );
}
