import React from "react";

const ConfirmRide = (props) => {
  return (
    <div>
      <h5 className="p-1 text-center w-[93%] absolute top-0" onClick={() => {
    props.setVehiclePanel(false);
    }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
      <h3 className="text-2xl font-semibold mb-5">Confirm your Ride</h3>

      <div className="flex gap-2 justify-between flex-col items-center">
        <img className="h-20" src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1688398971/assets/29/fbb8b0-75b1-4e2a-8533-3a364e7042fa/original/UberSelect-White.png" alt="" />
        <div className="w-full">
            <div className="flex items-cente gap-5">
                <i className="text-lg ri-map-pin-2-fill"></i>
                <div>
                    <h3 className="text-lg font-medium">562/11-A</h3>
                    <p className="text-sm -mt-1 text-gray-600">Kankariya Talab, Bhopal </p>
                </div>
            </div>
            <div></div>
            <div></div>
        </div>
        <button className="w-full bg-green-600 text-white font-semibold p-2 rounded-lg">Confirm</button>
      </div>
    </div>
  );
};

export default ConfirmRide;
