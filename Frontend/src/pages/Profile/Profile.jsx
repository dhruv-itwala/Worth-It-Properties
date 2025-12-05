import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(user?.profilePhoto);

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "",
    area: user?.area || "",
    gender: user?.gender || "",
    role: user?.role || "buyer",

    companyName: user?.companyName || "",
    companyWebsite: user?.companyWebsite || "",
    experienceYears: user?.experienceYears || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const update = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (photo) fd.append("photo", photo);

    const updated = await updateProfile(fd);
    if (updated) setEditing(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Profile</h2>

      <div className={styles.profileCard}>
        <img src={preview} className={styles.avatar} alt="profile" />

        {editing && (
          <input type="file" accept="image/*" onChange={handlePhoto} />
        )}

        <div className={styles.info}>
          <label>Name</label>
          {editing ? (
            <input name="name" value={form.name} onChange={handleChange} />
          ) : (
            <p>{user.name}</p>
          )}

          <label>Phone</label>
          {editing ? (
            <input name="phone" value={form.phone} onChange={handleChange} />
          ) : (
            <p>{user.phone}</p>
          )}

          <label>City</label>
          {editing ? (
            <input name="city" value={form.city} onChange={handleChange} />
          ) : (
            <p>{user.city}</p>
          )}

          <label>Area</label>
          {editing ? (
            <input name="area" value={form.area} onChange={handleChange} />
          ) : (
            <p>{user.area}</p>
          )}

          <label>Role</label>
          {editing ? (
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="buyer">Buyer</option>
              <option value="owner">Owner</option>
              <option value="broker">Broker</option>
              <option value="builder">Builder</option>
            </select>
          ) : (
            <p>{user.role}</p>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        {!editing ? (
          <button onClick={() => setEditing(true)} className={styles.editBtn}>
            Edit Profile
          </button>
        ) : (
          <button onClick={update} className={styles.saveBtn}>
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}
