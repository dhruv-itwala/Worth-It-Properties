import { useState, useEffect } from "react";
import styles from "./PropertyForm.module.css";
import ApiService from "../../api/api.service";
import Popup from "../../utils/Popup/Popup";
import MapPicker from "../MapPicker/MapPicker";

export default function PropertyForm({
  mode = "create",
  initialData = {},
  propertyId,
  onSuccess,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    bhk: "",
    propertyType: "flat",
    areaSqFt: "",
    furnishing: "unfurnished",
    status: "new",
    city: "",
    locality: "",
    transactionType: "sale",
    mapAddress: "",
    latitude: "",
    longitude: "",
    ...initialData,
  });

  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState(initialData.images || []);
  const [video, setVideo] = useState(null);

  // For delete confirmation popup
  const [deletePopup, setDeletePopup] = useState({ open: false, index: null });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageAdd = (e) => {
    setImages([...images, ...e.target.files]);
  };

  const handleVideoAdd = (e) => {
    setVideo(e.target.files[0]);
  };

  const deleteOldImage = (index) => {
    setDeletePopup({ open: true, index });
  };

  const confirmDeleteImage = () => {
    const updated = [...oldImages];
    updated.splice(deletePopup.index, 1);
    setOldImages(updated);
    setDeletePopup({ open: false, index: null });
  };

  const submit = async () => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    // keep old images for edit
    oldImages.forEach((img) => fd.append("oldImages", img));

    // new images
    images.forEach((img) => fd.append("images", img));

    if (video) fd.append("video", video);

    let res;
    if (mode === "create") {
      res = await ApiService.postProperty(fd);
    } else {
      res = await ApiService.updateProperty(propertyId, fd);
    }

    if (onSuccess) onSuccess(res.data.property);
  };

  return (
    <div className={styles.formWrapper}>
      <h2>{mode === "create" ? "Post Property" : "Edit Property"}</h2>

      <div className={styles.grid}>
        <input
          type="text"
          name="title"
          value={form.title}
          placeholder="Title"
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          value={form.price}
          placeholder="Price"
          onChange={handleChange}
        />
        <input
          type="number"
          name="bhk"
          value={form.bhk}
          placeholder="BHK"
          onChange={handleChange}
        />

        <select
          name="propertyType"
          value={form.propertyType}
          onChange={handleChange}
        >
          <option value="flat">Flat</option>
          <option value="house">House</option>
          <option value="plot">Plot</option>
          <option value="office">Office</option>
          <option value="shop">Shop</option>
        </select>

        <input
          type="text"
          name="city"
          value={form.city}
          placeholder="City"
          onChange={handleChange}
        />

        <input
          type="text"
          name="locality"
          value={form.locality}
          placeholder="Locality"
          onChange={handleChange}
        />
        <MapPicker
          value={{
            latitude: form.latitude,
            longitude: form.longitude,
            formattedAddress: form.mapAddress,
          }}
          onChange={(loc) => {
            setForm({
              ...form,
              latitude: loc.latitude,
              longitude: loc.longitude,
              mapAddress: loc.formattedAddress,
            });
          }}
        />
      </div>

      <textarea
        name="description"
        value={form.description}
        placeholder="Description"
        onChange={handleChange}
        className={styles.textarea}
      />

      {/* OLD IMAGES (EDIT MODE) */}
      {mode === "edit" && oldImages.length > 0 && (
        <div className={styles.oldImages}>
          {oldImages.map((img, idx) => (
            <div key={idx} className={styles.imgBox}>
              <img src={img} alt="" />
              <button onClick={() => deleteOldImage(idx)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {/* NEW IMAGES */}
      <label>Upload Images</label>
      <input type="file" multiple accept="image/*" onChange={handleImageAdd} />

      {/* VIDEO */}
      <label>Upload Video (optional)</label>
      <input type="file" accept="video/*" onChange={handleVideoAdd} />

      <button className={styles.submitBtn} onClick={submit}>
        {mode === "create" ? "Post Property" : "Save Changes"}
      </button>

      {/* DELETE POPUP */}
      <Popup
        open={deletePopup.open}
        title="Delete Image?"
        message="Are you sure you want to remove this image?"
        onCancel={() => setDeletePopup({ open: false, index: null })}
        onConfirm={confirmDeleteImage}
      />
    </div>
  );
}
