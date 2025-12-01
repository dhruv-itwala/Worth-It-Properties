import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../api/api.service";
import { useAuth } from "../../context/AuthContext";
import { notifyError, notifySuccess } from "../../utils/toast";
import styles from "./CompleteProfile.module.css";

const CompleteProfile = () => {
  const { user, loadUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    city: "",
    area: "",
    role: "buyer",
  });

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ApiService.completeProfile(form);
      await loadUser();
      notifySuccess("Profile completed!");
      navigate("/");
    } catch (err) {
      notifyError("Failed to update profile");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Complete Your Profile</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={form.phone}
            onChange={(e) => updateForm("phone", e.target.value)}
          />

          <input
            type="text"
            placeholder="City"
            value={form.city}
            onChange={(e) => updateForm("city", e.target.value)}
          />

          <input
            type="text"
            placeholder="Area"
            value={form.area}
            onChange={(e) => updateForm("area", e.target.value)}
          />

          <select
            value={form.role}
            onChange={(e) => updateForm("role", e.target.value)}
          >
            <option value="buyer">Buyer</option>
            <option value="owner">Owner</option>
            <option value="builder">Builder</option>
          </select>

          <button type="submit" className={styles.submitBtn}>
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
