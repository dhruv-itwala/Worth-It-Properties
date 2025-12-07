// rafce
import React, { createContext, useContext, useState } from "react";
import ApiService from "../api/api.service";
import { toast } from "react-toastify";

const PropertyContext = createContext();

export const useProperty = () => useContext(PropertyContext);

export const PropertyProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]); // new File[]
  const [oldImages, setOldImages] = useState([]); // urls
  const [video, setVideo] = useState(null); // new File
  const [videoUrl, setVideoUrl] = useState(""); // old video url
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const nextStep = () => setStep((s) => Math.min(5, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));
  const goToStep = (n) => setStep(Math.max(1, Math.min(5, n)));

  const resetWizard = () => {
    setStep(1);
    setImages([]);
    setOldImages([]);
    setVideo(null);
    setVideoUrl("");
  };

  const submitProperty = async (
    formValues,
    mode = "create",
    propertyId,
    onSuccess
  ) => {
    try {
      setLoading(true);

      const fd = new FormData();

      // Append MAIN FORM FIELDS
      Object.entries(formValues).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (Array.isArray(value)) {
          fd.append(key, JSON.stringify(value));
        } else {
          fd.append(key, String(value));
        }
      });

      // --- fix: append oldImages as JSON array ---
      fd.append("oldImages", JSON.stringify(oldImages));

      // New Images
      images.forEach((file) => fd.append("images", file));

      // New Video
      if (video) fd.append("video", video);

      let res;
      if (mode === "create") res = await ApiService.postProperty(fd);
      else res = await ApiService.updateProperty(propertyId, fd);

      toast.success("Property saved successfully");
      setSuccessOpen(true);
      resetWizard();
      onSuccess?.(res.data.property);

      return res.data.property;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save property");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PropertyContext.Provider
      value={{
        step,
        nextStep,
        prevStep,
        goToStep,
        images,
        setImages,
        oldImages,
        setOldImages,
        video,
        setVideo,
        videoUrl,
        setVideoUrl,
        loading,
        submitProperty,
        resetWizard,
        successOpen,
        setSuccessOpen,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};
