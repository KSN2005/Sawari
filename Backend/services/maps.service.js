const axios = require('axios');

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
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.ORS_API_KEY;
    if (!apiKey) {
        throw new Error('ORS_API_KEY is not set in environment variables');
    }
    const url = `https://api.openrouteservice.org/v2/directions/driving-car`;

    const body = {
        coordinates: [
            origin.split(',').map(Number),
            destination.split(',').map(Number)
        ]
    };

    try {
        const response = await axios.post(url, body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            }
        });

        const data = response.data;
        return {
            distance: data.routes[0].summary.distance,
            duration: data.routes[0].summary.duration
        };
    } catch (err) {
        // Log the error for debugging
        console.log(err.response?.data || err);
        // If 401, give a clear message
        if (err.response && err.response.status === 401) {
            throw new Error('Unauthorized: Check your ORS_API_KEY');
        }
        throw err;
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