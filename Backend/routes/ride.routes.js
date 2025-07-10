const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Pickup must be a string with at least 3 characters'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Destination must be a string with at least 3 characters'),
    body('vehicleType').isString().isIn(['auto', 'car', 'bike']).withMessage('Vehicle type must be one of: auto, car, bike'),
    rideController.createRide
);

router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Pickup must be a string with at least 3 characters'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Destination must be a string with at least 3 characters'),
    rideController.getFare
);

router.post('/confirm',
    authMiddleware.authUser,
    body('rideId').isString().withMessage('Ride ID must be a valid string'),
    rideController.confirmRide
);

module.exports = router;