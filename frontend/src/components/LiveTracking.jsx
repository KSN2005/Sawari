import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// ✅ Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ✅ Recenter map on coordinates change
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], 15);
    }
  }, [lat, lng, map]);
  return null;
};

const LiveTracking = ({ pickupAddress, destinationAddress }) => {
  const [pickupCoord, setPickupCoord] = useState(null);
  const [destinationCoord, setDestinationCoord] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);

  // ✅ On mount: set pickup to user's location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPickupCoord(coords);
      },
      (err) => console.error("Geolocation error:", err.message)
    );
  }, []);

  // 📍 Reset pickup to live location
  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPickupCoord(coords);
      },
      (err) => {
        console.error("Location fetch failed:", err.message);
        alert("Failed to get current location");
      }
    );
  };

  // ✅ Geocode destination address using backend
  const geocodeAddress = async (address) => {
    if (!address || address.trim().length < 3) return null;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
        params: { address },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const [lat, lng] = response.data.coordinates || []; // ✅ FIXED: lat first
      if (lat == null || lng == null) return null;
      return [lat, lng];
    } catch (err) {
      console.error("Geocode error:", err.message);
      return null;
    }
  };

  // ✅ Convert destination address to coordinates
  useEffect(() => {
    const fetchCoords = async () => {
      if (!destinationAddress) return;
      const destination = await geocodeAddress(destinationAddress);
      if (destination) setDestinationCoord(destination);
    };
    fetchCoords();
  }, [destinationAddress]);

  // ✅ Fetch route from ORS API
  useEffect(() => {
    const fetchRoute = async () => {
      if (!pickupCoord || !destinationCoord) return;

      try {
        const response = await axios.post(
          'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
          {
            coordinates: [
              [pickupCoord[1], pickupCoord[0]],      // [lng, lat]
              [destinationCoord[1], destinationCoord[0]],
            ],
          },
          {
            headers: {
              Authorization: import.meta.env.VITE_ORS_API_KEY,
              'Content-Type': 'application/json',
            },
          }
        );

        const coords = response.data.features[0].geometry.coordinates.map(
          ([lng, lat]) => [lat, lng]
        );
        setRouteCoords(coords);
      } catch (err) {
        console.error("Route fetch error:", err.response?.data || err.message);
      }
    };

    fetchRoute();
  }, [pickupCoord, destinationCoord]);

  const mapCenter = pickupCoord || destinationCoord;

  if (!mapCenter) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500">
        Loading map...
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={15}
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {pickupCoord && (
          <Marker position={pickupCoord}>
            <Popup>Pickup Location</Popup>
          </Marker>
        )}

        {destinationCoord && (
          <Marker position={destinationCoord}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="blue" />
        )}

        <RecenterMap lat={mapCenter[0]} lng={mapCenter[1]} />
      </MapContainer>

      {/* 📍 Button to set pickup = current location */}
      <div
        className="absolute bottom-12 right-4 z-[1000] bg-white shadow-lg p-3 rounded-full cursor-pointer hover:bg-gray-100"
        onClick={handleUseCurrentLocation}
      >
        <i className="ri-crosshair-line text-xl text-gray-800" />
      </div>
    </div>
  );
};

export default LiveTracking;
