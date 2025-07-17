import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Recenter the map when location changes
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
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location
  useEffect(() => {
    const successHandler = (position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation([latitude, longitude]);
    };

    const errorHandler = (error) => {
      console.error("Geolocation error:", error.message);
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);
    const watchId = navigator.geolocation.watchPosition(successHandler, errorHandler);
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Geocode address using your backend
  const geocodeAddress = async (address) => {
    if (!address || address.length < 3) return null;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`, {
        params: { address },
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log("📍 Coordinates for", address, ":", response.data.coordinates);
      return response.data.coordinates; // Expected [lat, lng]
    } catch (error) {
      console.error("Geocode error for:", address, error.message);
      return null;
    }
  };

  // Get coordinates for both addresses
  useEffect(() => {
    const fetchCoords = async () => {
      if (!pickupAddress || !destinationAddress) return;
      const pickup = await geocodeAddress(pickupAddress);
      const destination = await geocodeAddress(destinationAddress);

      if (pickup) setPickupCoord(pickup);
      if (destination) setDestinationCoord(destination);
    };
    fetchCoords();
  }, [pickupAddress, destinationAddress]);

  // Fetch route from ORS
  useEffect(() => {
    const fetchRoute = async () => {
      if (
        !pickupCoord ||
        !destinationCoord ||
        pickupCoord.join() === destinationCoord.join()
      ) return;

      try {
        const response = await axios.post(
          'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
          {
            coordinates: [
              [pickupCoord[1], pickupCoord[0]], // lat,lng -> lng,lat
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
        console.error("Route fetch error:", err.message);
      }
    };

    fetchRoute();
  }, [pickupCoord, destinationCoord]);

  const mapCenter = pickupCoord || userLocation;

  if (!mapCenter) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-500">
        Loading map...
      </div>
    );
  }

  return (
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
      {userLocation && (
        <Marker position={userLocation}>
          <Popup>Your Location</Popup>
        </Marker>
      )}
      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="blue" />
      )}

      <RecenterMap lat={mapCenter[0]} lng={mapCenter[1]} />
    </MapContainer>
  );
};

export default LiveTracking;
