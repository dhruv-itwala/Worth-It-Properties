// src/context/PropertyContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import ApiService from "../api/api.service";
import { notifyError, notifySuccess } from "../utils/toast";

const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    city: "",
    area: "",
    priceMin: "",
    priceMax: "",
    bhk: "",
    propertyType: "",
    furnishing: "",
    status: "",
    sort: "newest",
  });

  // Fetch search results (use for hero + properties listing)
  const fetchProperties = useCallback(
    async (p = 1, params = {}) => {
      setLoading(true);
      try {
        const merged = { ...searchParams, ...params };
        const res = await ApiService.searchProperties({
          ...merged,
          page: p,
          limit,
        });
        if (res?.data) {
          setProperties(res.data.results || []);
          setCount(res.data.count || 0);
          setPage(res.data.page || p);
        }
      } catch (err) {
        notifyError(
          err?.response?.data?.message || "Failed to fetch properties"
        );
      } finally {
        setLoading(false);
      }
    },
    [limit, searchParams]
  );

  // fetch all (fallback when search not used)
  const fetchAll = useCallback(
    async (p = 1) => {
      setLoading(true);
      try {
        const res = await ApiService.getAllProperties(p, limit);
        if (res?.data) {
          setProperties(res.data.properties || []);
          setCount(res.data.count || 0);
          setPage(p);
        }
      } catch (err) {
        notifyError("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  // Create property (multi-step form will prepare a FormData)
  const createProperty = async (formData) => {
    setLoading(true);
    try {
      const res = await ApiService.createProperty(formData);
      notifySuccess("Property posted successfully");
      return res.data.property;
    } catch (err) {
      notifyError(err?.response?.data?.message || "Failed to create property");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProperty = async (id, formData) => {
    setLoading(true);
    try {
      const res = await ApiService.updateProperty(id, formData);
      notifySuccess("Property updated");
      return res.data.property;
    } catch (err) {
      notifyError(err?.response?.data?.message || "Failed to update property");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async (id) => {
    setLoading(true);
    try {
      await ApiService.deleteProperty(id);
      notifySuccess("Property deleted");
      // remove locally
      setProperties((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      notifyError("Failed to delete property");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search trigger (nice UX)
  useEffect(() => {
    const t = setTimeout(() => {
      fetchProperties(1);
    }, 450);
    return () => clearTimeout(t);
  }, [searchParams, fetchProperties]);

  useEffect(() => {
    // initial load: show recent properties
    fetchAll(1);
  }, [fetchAll]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        count,
        page,
        limit,
        loading,
        searchParams,
        setSearchParams,
        fetchProperties,
        fetchAll,
        setPage,
        createProperty,
        updateProperty,
        deleteProperty,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => useContext(PropertyContext);
