const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });

  const { pickup, destination, vehicleType } = req.body;

  const isLngLat = str =>
    typeof str === 'string' &&
    str.split(',').length === 2 &&
    str.split(',').every(n => !isNaN(Number(n.trim())));

  try {
    let pickupCoordinates;
    let pickupGeoCoord = pickup;
    let destinationGeoCoord = destination;


    if (!isLngLat(pickup)) {
      pickupCoordinates = await mapService.getAddressCoordinate(pickup);
      if (!pickupCoordinates?.lat || !pickupCoordinates?.lng)
        return res.status(400).json({ error: 'Invalid pickup location' });
      pickupGeoCoord = `${pickupCoordinates.lng},${pickupCoordinates.lat}`;
    } else {
      const [lng, lat] = pickup.split(',').map(p => p.trim());
      pickupCoordinates = { lat: Number(lat), lng: Number(lng) };
    }

    if (!isLngLat(destination)) {
      const dest = await mapService.getAddressCoordinate(destination);
      if (!dest?.lat || !dest?.lng)
        return res.status(400).json({ error: 'Invalid destination location' });
      destinationGeoCoord = `${dest.lng},${dest.lat}`;
    }


    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });

    const captainsInRadius = await mapService.getCaptainsTheRedius(
      pickupCoordinates.lat,
      pickupCoordinates.lng,
      50
    );

    const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

    console.log("Populated ride user data:", rideWithUser.user.fullname);

    captainsInRadius.map(captain => {
      if (captain.socketId) {
        console.log(` Sending to Captain ${captain._id} via socket ${captain.socketId}`);
        sendMessageToSocketId(captain.socketId, {
          event: 'new-Ride',
          data: rideWithUser,
        });
      } else {
        console.warn(` Captain ${captain._id} has no socketId`);
      }
    });

    return res.status(200).json({ ride });

  } catch (err) {
    console.error(" Ride creation error:", err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { pickup, destination } = req.query;
  let pickupCoord = pickup;
  let destinationCoord = destination;

  const isLngLat = str =>
    typeof str === 'string' &&
    str.split(',').length === 2 &&
    str.split(',').every(n => !isNaN(Number(n.trim())));

  if (!isLngLat(pickup)) {
    const { lng, lat } = await mapService.getAddressCoordinate(pickup);
    pickupCoord = `${lng},${lat}`;
  }
  if (!isLngLat(destination)) {
    const { lng, lat } = await mapService.getAddressCoordinate(destination);
    destinationCoord = `${lng},${lat}`;
  }

  try {
    const fare = await rideService.getFare(pickupCoord, destinationCoord);
    return res.status(200).json(fare);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.confirmRide({ rideId, captain: req.captain });

    sendMessageToSocketId(ride.user.socketId, {
      event: 'ride-confirmed',
      data: ride
    })

    return res.status(200).json({ ride });
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

module.exports.starRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { rideId, otp } = req.query;

  try {
    const ride = await rideService.startRide({ rideId, otp, captain: req.captain })


    sendMessageToSocketId(ride.user.socketId, {
      event: 'ride-started',
      data: ride
    })

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({ rideId, captain: req.captain })


    sendMessageToSocketId(ride.user.socketId, {
      event: 'ride-ended',
      data: ride
    })



    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}