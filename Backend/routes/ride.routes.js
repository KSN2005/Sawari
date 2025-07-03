const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Pickup must be a string with at least 3 characters'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Destination must be a string with at least 3 characters'),
    body('vehicleType').isString().isIn(['auto', 'car', 'bike']).withMessage('Vehicle type must be one of: auto, car, bike'),
    rideController.createRide
);

module.exports = router;