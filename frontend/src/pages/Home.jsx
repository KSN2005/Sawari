import React, { useEffect, useRef, useState, useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import logo from "../assets/LogoSAWARI.png";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import LocationSearchPanel from "../components/LocationSearchPanel";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);

  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", { userType: "user", userId: user._id });
    }
  }, [user]);

  useEffect(() => {
    const handleRideConfirmed = (ride) => {
      setVehicleFound(false);
      setWaitingForDriver(true);
      setRide(ride);
    };

    const handleRideStarted = (ride) => {
      setWaitingForDriver(false);
      navigate("/riding", { state: { ride } });
    };

    socket.on("ride-confirmed", handleRideConfirmed);
    socket.on("ride-started", handleRideStarted);

    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
      socket.off("ride-started", handleRideStarted);
    };
  }, [socket, navigate]);

  const isDisabled = pickup.trim() === "" || destination.trim() === "";

  const fetchSuggestions = async (value, setSuggestions) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
        params: { input: value },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = Array.isArray(response.data) ? response.data : response.data.suggestions || [];
      setSuggestions(data);
    } catch (error) {
      setSuggestions([]);
    }
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === "pickup") {
      setPickup(value);
      setPickupSuggestions([]);
      fetchSuggestions(value, setPickupSuggestions);
    } else {
      setDestination(value);
      setDestinationSuggestions([]);
      fetchSuggestions(value, setDestinationSuggestions);
    }
    setActiveField(field);
    setPanelOpen(true);
  };

  const handleSuggestionClick = (suggestion) => {
    const place = suggestion.name || suggestion.label || suggestion.formatted || suggestion;

    if (activeField === "pickup") {
      setPickup(place);
      setPickupSuggestions([]);
    } else {
      setDestination(place);
      setDestinationSuggestions([]);
    }

    setPanelOpen(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!isDisabled) {
      findTrip();
    }
  };

  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? "70%" : "0%",
      padding: panelOpen ? "20px" : "0px",
      pointerEvents: panelOpen ? "auto" : "none"
    });
    gsap.to(panelCloseRef.current, {
      opacity: panelOpen ? 1 : 0,
    });
  }, [panelOpen]);

  useGSAP(() => {
    gsap.to(vehiclePanelRef.current, {
      transform: vehiclePanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [vehiclePanel]);

  useGSAP(() => {
    gsap.to(confirmRidePanelRef.current, {
      transform: confirmRidePanel ? "translateY(0)" : "translateY(100%)",
    });
  }, [confirmRidePanel]);

  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, {
      transform: vehicleFound ? "translateY(0)" : "translateY(100%)",
    });
  }, [vehicleFound]);

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      transform: waitingForDriver ? "translateY(0)" : "translateY(100%)",
    });
  }, [waitingForDriver]);

  async function findTrip() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
        params: { pickup, destination },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setFare(response.data);
      setVehiclePanel(true);
      setPanelOpen(false);
    } catch (error) {
      console.error("❌ Error fetching fare:", error);
      alert("Failed to fetch fare. Try again later.");
    }
  }

  async function createRide() {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
        pickup,
        destination,
        vehicleType,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log(response.data);
    } catch (error) {
      console.error("❌ Error creating ride:", error);
    }
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <img className="w-16 absolute left-5 top-5 z-10" src={logo} alt="Logo" />

      <div className="absolute top-0 left-0 w-full h-[70%] z-0">
        <LiveTracking pickupAddress={pickup} destinationAddress={destination} />
      </div>

      <div className="flex flex-col justify-end h-screen absolute top-0 w-full pointer-events-none">
        <div className="h-[35%] p-6 bg-white relative pointer-events-auto z-10">
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className="absolute opacity-0 right-6 top-6 text-2xl cursor-pointer"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form onSubmit={submitHandler}>
            <div className="line absolute h-16 w-1 top-[40%] left-10 bg-gray-900 rounded-full"></div>
            <input
              value={pickup}
              onChange={(e) => handleInputChange(e, "pickup")}
              onFocus={() => setActiveField("pickup")}
              className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-5"
              type="text"
              placeholder="Add a pickup location"
            />
            <input
              value={destination}
              onChange={(e) => handleInputChange(e, "destination")}
              onFocus={() => setActiveField("destination")}
              className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
            />
            <button
              type="submit"
              disabled={isDisabled}
              className={`mt-4 w-full px-6 py-2 rounded-lg text-white font-medium ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-black"}`}
            >
              Find Trip
            </button>
          </form>
        </div>

        <div
          ref={panelRef}
          className="bg-white max-h-[500px] overflow-y-auto transition-all duration-300 ease-in-out z-10"
          style={{ pointerEvents: panelOpen ? "auto" : "none" }}
        >
          <LocationSearchPanel
            suggestions={
              activeField === "pickup"
                ? pickupSuggestions
                : destinationSuggestions
            }
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanel}
            setPickup={setPickup}
            setDestination={setDestination}
            setSuggestions={
              activeField === "pickup"
                ? setPickupSuggestions
                : setDestinationSuggestions
            }
            activeField={activeField}
          />
        </div>
      </div>

      <div ref={vehiclePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12">
        <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
      </div>

      <div ref={confirmRidePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
        <ConfirmRide createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
      </div>

      <div ref={vehicleFoundRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
        <LookingForDriver createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setVehicleFound={setVehicleFound} />
      </div>

      <div ref={waitingForDriverRef} className="fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12">
        <WaitingForDriver ride={ride} setVehicleFound={setVehicleFound} setWaitingForDriver={setWaitingForDriver} waitingForDriver={waitingForDriver} />
      </div>
    </div>
  );
};

export default Home;
