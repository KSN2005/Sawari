import React, { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/LogoSAWARI.png";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import LiveTracking from "../components/LiveTracking";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import axios from 'axios';
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopUpPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);

  const ridePopUpPanelRef = useRef(null);
  const confirmRidePopUpPanelRef = useRef(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  // Send location updates to socket
  useEffect(() => {
    if (!captain || !socket) return;

    socket.emit("join", {
      userId: captain._id,
      userType: "captain",
    });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          socket.emit("update-Location-captain", {
            userId: captain._id,
            location: { lat: latitude, lng: longitude },
          });
        });
      }
    };

    updateLocation();
    const locationInterval = setInterval(updateLocation, 10000);

    return () => clearInterval(locationInterval);
  }, [socket, captain]);

  // Listen for new ride
  useEffect(() => {
    if (!socket) return;

    const handleNewRide = (data) => {
      console.log("New ride request received:", data);
      setRide(data);
      setRidePopupPanel(true);
    };

    socket.on("new-Ride", handleNewRide);
    return () => socket.off("new-Ride", handleNewRide);
  }, [socket]);

  // Confirm ride
  async function confirmRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
          captainId: captain._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
    } catch (err) {
      console.error("Error confirming ride:", err);
    }
  }

  // Animate ride popup
  useGSAP(() => {
    gsap.to(ridePopUpPanelRef.current, {
      transform: ridePopupPanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.3,
    });
  }, [ridePopupPanel]);

  // Animate confirm ride popup
  useGSAP(() => {
    gsap.to(confirmRidePopUpPanelRef.current, {
      transform: confirmRidePopUpPanel ? "translateY(0)" : "translateY(100%)",
      duration: 0.3,
    });
  }, [confirmRidePopUpPanel]);

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Header */}
      <div className="fixed p-6 top-0 left-0 right-0 flex items-center justify-between z-40 bg-transparent shadow">
        <img className="w-16" src={logo} alt="Sawari Logo" />
        <Link
          to={`/captain-login`}
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full border border-gray-300"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      {/* Live Map */}
      <div className="h-3/5 relative z-0">
        <LiveTracking />
      </div>

      {/* Captain Details */}
      <div className="h-2/5 p-6 relative z-10 bg-white">
        <CaptainDetails />
      </div>

      {/* Ride Request Pop-up */}
      <div
        ref={ridePopUpPanelRef}
        className="fixed bottom-0 left-0 right-0 translate-y-full z-50 bg-white px-3 py-10 pt-12 shadow-2xl rounded-t-2xl"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>

      {/* Confirm Ride Pop-up */}
      <div
        ref={confirmRidePopUpPanelRef}
        className="fixed bottom-0 left-0 right-0 h-screen translate-y-full z-50 bg-white px-3 py-10 pt-12 shadow-2xl"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
