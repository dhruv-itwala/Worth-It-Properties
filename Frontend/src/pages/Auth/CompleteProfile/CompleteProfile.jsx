import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import styles from "./CompleteProfile.module.css";

/* ------------------------------
    STEPWISE SCHEMAS
--------------------------------*/

// Step 0 – Basic
const step0Schema = z
  .object({
    name: z.string().min(2, "Enter a valid name"),
    phone: z.string().min(10, "Enter valid phone"),
    gender: z.string().optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) =>
      (!data.password && !data.confirmPassword) ||
      data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

// Step 1 – Location
const step1Schema = z.object({
  city: z.string().min(2, "Enter valid city"),
  area: z.string().min(2, "Enter valid area"),
});

// Step 2 – Role
const step2Schema = z.object({
  role: z.enum(["buyer", "owner", "builder", "broker"]),
  companyName: z.string().optional(),
  companyWebsite: z.string().optional(),
  experienceYears: z.string().optional(),
});

/* ------------------------------
    FULL SCHEMA (FINAL SUBMIT)
--------------------------------*/
const fullSchema = step0Schema.merge(step1Schema).merge(step2Schema);

export default function CompleteProfile() {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(user?.profilePhoto || "");

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(fullSchema),
    mode: "onSubmit",
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      gender: user?.gender || "",
      city: user?.city || "",
      area: user?.area || "",
      role: user?.role || "buyer",
      companyName: user?.companyName || "",
      companyWebsite: user?.companyWebsite || "",
      experienceYears: user?.experienceYears || "",
      password: "",
      confirmPassword: "",
    },
    shouldUnregister: false,
  });

  const role = watch("role");

  /* ------------------------------
        VALIDATE CURRENT STEP
  --------------------------------*/
  const validateStep = async () => {
    if (step === 0)
      return await trigger([
        "name",
        "phone",
        "gender",
        "password",
        "confirmPassword",
      ]);
    if (step === 1) return await trigger(["city", "area"]);
    if (step === 2)
      return await trigger([
        "role",
        "companyName",
        "companyWebsite",
        "experienceYears",
      ]);
  };

  /* ------------------------------
        NEXT BUTTON HANDLER
  --------------------------------*/
  const handleNext = async () => {
    const ok = await validateStep();
    if (ok) setStep((s) => s + 1);
  };

  /* ------------------------------
        IMAGE PREVIEW
  --------------------------------*/
  const onPhotoSelected = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setProfilePhoto(f);
    setPreview(URL.createObjectURL(f));
  };

  /* ------------------------------
        FINAL SUBMISSION
  --------------------------------*/
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      const { confirmPassword, ...rest } = data;

      Object.entries(rest).forEach(([k, v]) => formData.append(k, v));

      if (profilePhoto) formData.append("photo", profilePhoto);

      const updatedUser = await updateProfile(formData);
      if (updatedUser) navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.wrapper}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={styles.title}>Complete Your Profile</h2>

        {/* ---------------------- STEPS HEADER ---------------------- */}
        <div className={styles.steps}>
          <div className={`${styles.step} ${step === 0 ? styles.active : ""}`}>
            Basic Details
          </div>
          <div className={`${styles.step} ${step === 1 ? styles.active : ""}`}>
            Location
          </div>
          <div className={`${styles.step} ${step === 2 ? styles.active : ""}`}>
            Role Details
          </div>
        </div>

        {/* ---------------------- FORM ---------------------- */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* STEP 0 */}
          {step === 0 && (
            <div className={styles.section}>
              <label className={styles.label}>Profile Photo</label>
              <div className={styles.photoBox}>
                <img
                  src={
                    preview ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  className={styles.profilePreview}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPhotoSelected}
                />
              </div>

              <label className={styles.label}>Full Name</label>
              <input className={styles.input} {...register("name")} />
              {errors.name && (
                <p className={styles.error}>{errors.name.message}</p>
              )}

              <label className={styles.label}>Phone Number</label>
              <input className={styles.input} {...register("phone")} />
              {errors.phone && (
                <p className={styles.error}>{errors.phone.message}</p>
              )}

              <label className={styles.label}>Gender</label>
              <select className={styles.input} {...register("gender")}>
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <label className={styles.label}>Password (Optional)</label>
              <input
                type="password"
                className={styles.input}
                {...register("password")}
              />

              <label className={styles.label}>Confirm Password</label>
              <input
                type="password"
                className={styles.input}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className={styles.error}>{errors.confirmPassword.message}</p>
              )}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className={styles.section}>
              <label className={styles.label}>City</label>
              <input className={styles.input} {...register("city")} />
              {errors.city && (
                <p className={styles.error}>{errors.city.message}</p>
              )}

              <label className={styles.label}>Area / Locality</label>
              <input className={styles.input} {...register("area")} />
              {errors.area && (
                <p className={styles.error}>{errors.area.message}</p>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className={styles.section}>
              <label className={styles.label}>You are a:</label>
              <select className={styles.input} {...register("role")}>
                <option value="buyer">Buyer</option>
                <option value="owner">Owner</option>
                <option value="builder">Builder</option>
                <option value="broker">Broker</option>
              </select>

              {role === "builder" && (
                <>
                  <label className={styles.label}>Company Name</label>
                  <input
                    className={styles.input}
                    {...register("companyName")}
                  />

                  <label className={styles.label}>Website</label>
                  <input
                    className={styles.input}
                    {...register("companyWebsite")}
                  />

                  <label className={styles.label}>Experience (Years)</label>
                  <input
                    className={styles.input}
                    {...register("experienceYears")}
                  />
                </>
              )}

              {role === "broker" && (
                <>
                  <label className={styles.label}>Business Name</label>
                  <input
                    className={styles.input}
                    {...register("companyName")}
                  />

                  <label className={styles.label}>Experience (Years)</label>
                  <input
                    className={styles.input}
                    {...register("experienceYears")}
                  />
                </>
              )}
            </div>
          )}

          {/* ---------------------- CONTROLS ---------------------- */}
          <div className={styles.controls}>
            {step > 0 && (
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </button>
            )}

            {step < 2 ? (
              <button
                type="button"
                className={styles.nextBtn}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNext();
                }}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Finish Profile"}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
