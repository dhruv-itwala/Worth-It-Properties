// rafce
import React, { useEffect, useRef } from "react";

export default function MapPicker({ value = {}, onChange }) {
  const inputRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapDivRef = useRef(null);

  const loadScript = () => {
    return new Promise((resolve) => {
      if (window.google && window.google.maps) return resolve();
      if (document.getElementById("gmap-script")) {
        // script already added, wait a tick
        const tryReady = () =>
          window.google && window.google.maps
            ? resolve()
            : setTimeout(tryReady, 50);
        return tryReady();
      }

      const script = document.createElement("script");
      script.id = "gmap-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      await loadScript();
      if (!mounted) return;

      const lat = Number(value.latitude) || 19.076;
      const lng = Number(value.longitude) || 72.8777;

      const map = new window.google.maps.Map(mapDivRef.current, {
        center: { lat, lng },
        zoom: 14,
      });

      const marker = new window.google.maps.Marker({
        map,
        draggable: true,
        position: { lat, lng },
      });

      mapRef.current = map;
      markerRef.current = marker;

      const geocoder = new window.google.maps.Geocoder();

      marker.addListener("dragend", (e) => {
        const la = e.latLng.lat();
        const ln = e.latLng.lng();
        geocoder.geocode({ location: { lat: la, lng: ln } }, (r) => {
          onChange?.({
            latitude: la,
            longitude: ln,
            formattedAddress: r?.[0]?.formatted_address || "",
          });
        });
      });

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current
      );
      autocomplete.addListener("place_changed", () => {
        const p = autocomplete.getPlace();
        if (!p.geometry) return;
        const la = p.geometry.location.lat();
        const ln = p.geometry.location.lng();
        map.panTo({ lat: la, lng: ln });
        marker.setPosition({ lat: la, lng: ln });

        onChange?.({
          latitude: la,
          longitude: ln,
          formattedAddress: p.formatted_address,
        });
      });
    };

    init();

    return () => (mounted = false);
  }, []);

  return (
    <div>
      <input
        ref={inputRef}
        placeholder="Search location..."
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px",
          borderRadius: 8,
          border: "1.5px solid #ccc",
        }}
      />
      <div
        ref={mapDivRef}
        style={{ width: "100%", height: 300, borderRadius: 8 }}
      />
    </div>
  );
}
