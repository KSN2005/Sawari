import React from "react";

const RidePopUp = (props) => {
  const { ride, setRidePopUpPanel, setConfirmRidePopUpPanel, confirmRide } =
    props;

  if (!ride) return null;

  const riderName = ride?.user?.fullname
    ? `${ride.user.fullname.firstname} ${ride.user.fullname.lastname}`
    : "Unknown Rider";

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => setRidePopUpPanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="text-2xl font-semibold mb-5">New Ride Available!</h3>

      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4">
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
            alt="Rider"
          />
          <h2 className="text-lg font-medium">{riderName}</h2>
        </div>
        <h5 className="text-lg font-semibold">2.2 KM</h5>
      </div>

      <div className="flex flex-col items-center gap-2 justify-between">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">Pickup</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {ride?.pickup || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-2-fill text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">Destination</h3>
              <p className="text-sm -mt-1 text-gray-600">
                {ride?.destination || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line text-lg"></i>
            <div>
              <h3 className="text-lg font-medium">₹{ride?.fare ?? "--"}</h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>

        <div className="mt-5 w-full">
          <button
            onClick={() => {
              setConfirmRidePopUpPanel(true);
              confirmRide();
            }}
            className="bg-green-600 w-full text-white font-semibold p-2 px-10 rounded-lg"
          >
            Accept
          </button>

          <button
            onClick={() => {
              setRidePopUpPanel(false);
            }}
            className="mt-2 w-full bg-gray-300 text-gray-700 font-semibold p-2 px-10 rounded-lg"
          >
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
};

export default RidePopUp;
