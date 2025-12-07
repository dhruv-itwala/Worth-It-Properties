// rafce
import React from "react";
import PropertyFormWizard from "../../../components/PropertyFormWizard/PropertyFormWizard";
import { useNavigate } from "react-router-dom";

export default function PostProperty() {
  const navigate = useNavigate();
  return (
    <PropertyFormWizard
      mode="create"
      onSuccess={(p) => navigate(`/properties/${p._id}`)}
    />
  );
}
