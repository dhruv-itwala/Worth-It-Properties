import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    priceRange: "",
    type: "",
  });

  return (
    <AppContext.Provider
      value={{
        loading,
        setLoading,
        filters,
        setFilters,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
