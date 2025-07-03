const rideModel = require('../models/ride.model');
const mapService = require('../services/maps.service');

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required to calculate fare');
    }

    console.log(`Calculating distance and time between "${pickup}" and "${destination}"`);

    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    console.log("Distance and Time from mapService:", distanceTime);

    const baseFares = {
        auto: 30,
        car: 50,
        bike: 20
    };

    const perKmRates = {
        auto: 10,
        car: 15,
        bike: 7
    };

    const distanceInKm = distanceTime.distance / 1000;

    const fare = {
        auto: baseFares.auto + perKmRates.auto * distanceInKm,
        car: baseFares.car + perKmRates.car * distanceInKm,
        bike: baseFares.bike + perKmRates.bike * distanceInKm
    };

    console.log("Calculated Fare:", fare);

    return fare;
}

module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {
    console.log("createRide called with:", { user, pickup, destination, vehicleType });

    try {
        if (!user || !pickup || !destination || !vehicleType) {
            throw new Error('ALL fields are required to create a ride');
        }

        console.log(`Creating ride for ${user} from "${pickup}" to "${destination}" via ${vehicleType}`);

        const fare = await getFare(pickup, destination);

        const ride = await rideModel.create({
            author: user,
            pickup,
            destination,
            fare: fare[vehicleType]
        });

        console.log("Ride successfully created:", ride);

        return ride;
    } catch (err) {
        console.error("Error creating ride:", err.message);
        throw err;
    }
};
