import React from "react";
import { Link } from "react-router-dom";
import backgroundImage from "../assets/start_background.png"

const Start = () => {
  return (
    <div className="h-screen relative flex flex-col justify-between bg-white">
      <div className="relative h-2/3 bg-cover bg-center" style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg px-6 py-8 z-10">
        <h2 className="text-2xl font-bold text-black mb-2">
          Get Started with Sawari
        </h2>
        <p className="text-gray-500 text-sm mb-6">Your journey begins here</p>

        <Link
          to="/login"
          className="w-full block bg-black text-white text-center py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
        >
          Continue
        </Link>
      </div>

      <div className="absolute top-6 left-6 text-white text-xl font-bold z-10">
        Sawari
      </div>
    </div>
  );
};

export default Start;
