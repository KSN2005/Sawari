const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });

    const { pickup, destination, vehicleType, vehicletype } = req.body;
    const type = vehicleType || vehicletype;

    let pickupCoord = pickup, destinationCoord = destination;
    const isLngLat = str => typeof str === 'string' && str.split(',').length === 2 && str.split(',').every(n => !isNaN(Number(n.trim())));
    if (!isLngLat(pickup)) {
        const { lng, lat } = await require('../services/maps.service').getAddressCoordinate(pickup);
        pickupCoord = `${lng},${lat}`;
    }
    if (!isLngLat(destination)) {
        const { lng, lat } = await require('../services/maps.service').getAddressCoordinate(destination);
        destinationCoord = `${lng},${lat}`;
    }

    try {
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup: pickupCoord,
            destination: destinationCoord,
            vehicleType: type
        });
        return res.status(201).json(ride);
    } catch (err) {
        return res.status(500).json({ error: err.message || 'Internal server error' });
    }
}