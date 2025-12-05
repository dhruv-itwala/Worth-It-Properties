import React, { useEffect, useRef } from "react";

export default function MapPicker({ value = {}, onChange }) {
  const inputRef = useRef(null);
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!window.__googleMapsLoading) {
      window.__googleMapsLoading = true;
      loadGoogleMapsScript(initMap);
    } else {
      // script already loading or loaded
      if (window.google && window.google.maps) initMap();
    }

    function loadGoogleMapsScript(callback) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=places&callback=__googleMapsCallback`;

      script.async = true;
      script.defer = true;

      window.__googleMapsCallback = () => {
        if (callback) callback();
      };

      document.head.appendChild(script);
    }

    function initMap() {
      if (!window.google || !window.google.maps) return;

      const initialLat = value.latitude || 19.076;
      const initialLng = value.longitude || 72.8777;

      const position = { lat: initialLat, lng: initialLng };

      mapRef.current = new window.google.maps.Map(mapElement.current, {
        center: position,
        zoom: 14,
      });

      markerRef.current = new window.google.maps.Marker({
        position,
        map: mapRef.current,
        draggable: true,
      });

      // When marker dragged
      markerRef.current.addListener("dragend", (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results) => {
          const formatted =
            results?.[0]?.formatted_address || "Unknown Location";
          onChange?.({
            latitude: lat,
            longitude: lng,
            formattedAddress: formatted,
          });
        });
      });

      // Autocomplete
      const auto = new window.google.maps.places.Autocomplete(inputRef.current);
      auto.addListener("place_changed", () => {
        const place = auto.getPlace();
        if (!place.geometry) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        mapRef.current.panTo({ lat, lng });
        markerRef.current.setPosition({ lat, lng });

        onChange?.({
          latitude: lat,
          longitude: lng,
          formattedAddress: place.formatted_address,
        });
      });
    }
  }, []);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search location..."
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <div
        ref={mapElement}
        style={{ width: "100%", height: "300px", borderRadius: "8px" }}
      />
    </div>
  );
}
