const mapService = require('../services/maps.service')
const { validationResult } = require('express-validator')

module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { address } = req.query;

    try {
        const { lat, lng } = await mapService.getAddressCoordinate(address);
           console.log(`✅ Geocoded: ${address} → [${lat}, ${lng}]`);
        res.status(200).json({ coordinates: [lat, lng] });
    } catch (error) {
        res.status(404).json({ message: 'coordinates not found' });
    }
};


module.exports.getDistanceTime = async (req, res, next) => {
    try {
        let { origin, destination } = req.query;
        const isLngLat = str => str.split(',').length === 2 && str.split(',').every(n => !isNaN(Number(n.trim())));
        if (!isLngLat(origin)) {
            const { lng, lat } = await mapService.getAddressCoordinate(origin.trim());
            origin = `${lng},${lat}`;
        }
        if (!isLngLat(destination)) {
            const { lng, lat } = await mapService.getAddressCoordinate(destination.trim());
            destination = `${lng},${lat}`;
        }
        const { distance, duration } = await mapService.getDistanceTime(origin, destination);
        if (!distance || !duration) return res.status(500).json({ message: "Could not get distance or duration from map service" });
        const distanceKm = (distance / 1000).toFixed(0);
        const distanceText = `${Number(distanceKm).toLocaleString()} km`;
        const days = Math.floor(duration / 86400);
        const hours = Math.floor((duration % 86400) / 3600);
        const durationText = `${days > 0 ? days + ' day' + (days > 1 ? 's ' : ' ') : ''}${hours > 0 ? hours + ' hour' + (hours > 1 ? 's' : '') : '0 hour'}`.trim();
        res.status(200).json({
            distance: { text: distanceText, value: distance },
            duration: { text: durationText, value: duration },
            status: "OK"
        });
    } catch (err) {
        console.log('DistanceTime error:', err);
        if (err.message && err.message.includes('Invalid coordinate format')) {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}

module.exports.getAutoCompleteSuggestions = async (req, res, next) => { 
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { input } = req.query;
        if (!input || input.length < 1) {
            return res.status(400).json({ message: 'Input query must be at least 1 character.' });
        }
        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        res.status(200).json({ suggestions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Internal server error' });
    }
}