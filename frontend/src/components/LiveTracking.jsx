import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";

// ORS API endpoint
const BASE_URL = import.meta.env.VITE_BASE_URL;

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const LiveTracking = ({ pickupAddress, destinationAddress }) => {
  const [pickupCoord, setPickupCoord] = useState(null);
  const [destinationCoord, setDestinationCoord] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Fetch geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      (err) => {
        console.error("Geolocation error:", err.message);
        // Optional fallback location
        setUserLocation([28.6139, 77.2090]); // New Delhi default
      }
    );
  }, []);

  // Convert address to coordinates using your backend
  const geocodeAddress = async (address) => {
    try {
      const response = await axios.get(`${BASE_URL}/maps/get-coordinates`, {
        params: { address },
      });
      return response.data.coordinates; // [lat, lng]
    } catch (error) {
      console.error("Geocoding failed for:", address, error);
      return null;
    }
  };

  // Fetch pickup and destination coordinates
  useEffect(() => {
    const fetchCoords = async () => {
      if (!pickupAddress || !destinationAddress) return;

      const pickup = await geocodeAddress(pickupAddress);
      const destination = await geocodeAddress(destinationAddress);

      setPickupCoord(pickup);
      setDestinationCoord(destination);
    };

    fetchCoords();
  }, [pickupAddress, destinationAddress]);

  // Fetch route from ORS
  useEffect(() => {
    const fetchRoute = async () => {
      if (!pickupCoord || !destinationCoord) return;

      try {
        const response = await axios.post(
          "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
          {
            coordinates: [
              [pickupCoord[1], pickupCoord[0]],
              [destinationCoord[1], destinationCoord[0]],
            ],
          },
          {
            headers: {
              Authorization: import.meta.env.VITE_ORS_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        const coords = response.data.features[0].geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        );
        setRouteCoords(coords);
      } catch (error) {
        console.error("Route fetch error:", error);
      }
    };

    fetchRoute();
  }, [pickupCoord, destinationCoord]);

  const mapCenter = pickupCoord || userLocation || [28.6139, 77.2090];

  return (
    <div className="h-screen w-full">
      <MapContainer
        center={mapCenter}
        zoom={13}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fit bounds */}
        <FitBoundsToMarkers
          pickup={pickupCoord}
          destination={destinationCoord}
        />

        {/* Pickup Marker */}
        {pickupCoord && (
          <Marker position={pickupCoord} icon={customIcon}>
            <Popup>Pickup Location</Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destinationCoord && (
          <Marker position={destinationCoord} icon={customIcon}>
            <Popup>Drop Location</Popup>
          </Marker>
        )}

        {/* Route Line */}
        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="blue" />
        )}
      </MapContainer>
    </div>
  );
};

// Fit both markers in view
const FitBoundsToMarkers = ({ pickup, destination }) => {
  const map = useMap();

  useEffect(() => {
    if (pickup && destination) {
      const bounds = L.latLngBounds([pickup, destination]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [pickup, destination]);

  return null;
};

export default LiveTracking;
