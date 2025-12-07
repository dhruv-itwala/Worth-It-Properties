// rafce
import React, { useEffect, useState } from "react";
import PropertyFormWizard from "../../../components/PropertyFormWizard/PropertyFormWizard";
import ApiService from "../../../api/api.service";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    ApiService.getProperty(id)
      .then((res) => setProperty(res.data.property))
      .catch(console.error);
  }, [id]);

  if (!property) return <p>Loading...</p>;

  return (
    <PropertyFormWizard
      mode="edit"
      initialData={property}
      propertyId={id}
      onSuccess={(p) => navigate(`/properties/${p._id}`)}
    />
  );
}
