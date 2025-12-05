import PropertyForm from "../../../components/PropertyForm/PropertyForm";
import { useNavigate } from "react-router-dom";

export default function PostProperty() {
  const navigate = useNavigate();

  return (
    <PropertyForm
      mode="create"
      onSuccess={(property) => navigate(`/properties/${property._id}`)}
    />
  );
}
