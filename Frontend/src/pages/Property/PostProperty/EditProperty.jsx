import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../../api/api.service";
import PropertyForm from "../../../components/PropertyForm/PropertyForm";

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);

  const loadProperty = async () => {
    const res = await ApiService.getProperty(id);
    setProperty(res.data.property);
  };

  useEffect(() => {
    loadProperty();
  }, [id]);

  if (!property) return <p>Loading...</p>;

  return (
    <PropertyForm
      mode="edit"
      initialData={property}
      propertyId={id}
      onSuccess={(updated) => navigate(`/properties/${updated._id}`)}
    />
  );
}
