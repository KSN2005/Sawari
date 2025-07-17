import React, { useRef, useState } from "react";
import logo from "../assets/LogoSAWARI.png";
import { Link, useLocation } from "react-router-dom";
import FinishRide from "../components/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import LiveTracking from "../components/LiveTracking";

const CaptainRiding = () => {
  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const finishRidePanelRef = useRef(null);
  const location = useLocation();
  const rideData = location.state?.ride;

  const pickup = rideData?.pickupAddress || "";
  const destination = rideData?.destinationAddress || "";

  useGSAP(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePanelRef.current, {
        y: 0,
        ease: "power3.out",
        duration: 0.5,
      });
    } else {
      gsap.to(finishRidePanelRef.current, {
        y: "100%",
        ease: "power3.in",
        duration: 0.5,
      });
    }
  }, [finishRidePanel]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Map */}
      <div className="absolute inset-0 z-0">
        <LiveTracking
          pickupAddress={rideData?.pickup}
          destinationAddress={rideData?.destination}
        />
      </div>

      {/* Top Bar */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-10">
        <img
          className="w-16 pointer-events-auto"
          src={logo}
          alt="Sawari Logo"
        />
        <Link
          to="/captain-home"
          className="pointer-events-auto h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Bottom Panel (trigger for finish ride) */}
      <div
        className="pointer-events-auto absolute bottom-0 w-full bg-yellow-400 p-6 pt-10 flex items-center justify-between z-10"
        onClick={() => setFinishRidePanel(true)}
      >
        <h5 className="absolute top-0 w-full text-center">
          <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
        </h5>
        <h4 className="text-xl font-semibold">4 KM away</h4>
        <button className="bg-green-600 text-white font-semibold p-3 px-10 rounded-lg">
          Complete Ride
        </button>
      </div>

      {/* Slide-up Finish Ride Panel */}
      <div
        ref={finishRidePanelRef}
        className="fixed bottom-0 left-0 right-0 z-50 translate-y-full bg-white px-3 py-10 pt-12 shadow-2xl rounded-t-2xl"
      >
        <FinishRide ride={rideData} setFinishRidePanel={setFinishRidePanel} />
      </div>
    </div>
  );
};

export default CaptainRiding;
