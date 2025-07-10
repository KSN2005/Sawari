const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
  const apiKey = process.env.ORS_API_KEY;
  const url = `https://api.openrouteservice.org/geocode/search?text=${encodeURIComponent(address)}&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    // ORS returns features array, not status/results
    if (response.data && response.data.features && response.data.features.length > 0) {
      const location = response.data.features[0].geometry.coordinates; // [lng, lat]
      return {
        lat: location[1],
        lng: location[0]
      };
    } else {
      throw new Error('Unable to fetch coordinates');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports.getDistanceTime = async (origin, destination) => {
  const apiKey = process.env.ORS_API_KEY;
  const url = 'https://api.openrouteservice.org/v2/directions/driving-car';

  function parseCoordinates(coordStr) {
    const parts = coordStr.split(',').map(s => parseFloat(s.trim()));
    if (parts.length !== 2 || parts.some(isNaN)) {
      throw new Error(`Invalid coordinate string: ${coordStr}`);
    }
    return parts;
  }

  const coordinates = [parseCoordinates(origin), parseCoordinates(destination)];
  console.log("📡 ORS request coordinates:", coordinates);

  const body = { coordinates };

  try {
    const response = await axios.post(url, body, {
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (
      !response.data ||
      !response.data.routes ||
      !response.data.routes[0] ||
      !response.data.routes[0].summary
    ) {
      throw new Error("Invalid response from ORS API: " + JSON.stringify(response.data));
    }

    const { distance, duration } = response.data.routes[0].summary;
    console.log("✅ ORS response:", { distance, duration });

    return { distance, duration };
  } catch (error) {
    console.error("❌ ORS API error:", error.response?.data || error.message);
    return { distance: 0, duration: 0 };
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input || input.length < 1) {
    throw new Error('Input query must be at least 1 character.');
  }

  const apiKey = process.env.ORS_API_KEY;
  if (!apiKey) {
    throw new Error('ORS_API_KEY is not set in environment variables');
  }
  const url = `https://api.openrouteservice.org/geocode/autocomplete?text=${encodeURIComponent(input)}&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.features && response.data.features.length > 0) {
      return response.data.features.map(feature => ({
        name: feature.properties.label,
        coordinates: feature.geometry.coordinates
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('AutoCompleteSuggestions error:', error.response?.data || error.message || error);
    if (error.response && error.response.status === 401) {
      throw new Error('Unauthorized: Check your ORS_API_KEY');
    }
    throw error;
  }
}

module.exports.getCaptainsTheRedius = async (lat, lng, radius) => {

const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[lat , lng], radius / 6378] // radius in kilometers
      }
    }
  });

  return captains;

}