import React from "react";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div className="h-screen relative flex flex-col justify-between bg-white">
      <div className="relative h-2/3 bg-cover bg-center" style={{
          backgroundImage: `url('https://sdmntprwestus.oaiusercontent.com/files/00000000-0fa4-6230-920c-cc88e1617420/raw?se=2025-06-13T16%3A53%3A00Z&sp=r&sv=2024-08-04&sr=b&scid=f21c6d9b-8cfc-5af6-8ee2-6081b7c48446&skoid=ec8eb293-a61a-47e0-abd0-6051cc94b050&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-12T23%3A57%3A30Z&ske=2025-06-13T23%3A57%3A30Z&sks=b&skv=2024-08-04&sig=feSkKf1TO9/kFVw6GcYDWt7LKL6ke2g/L0PngEdLCuE%3D')`,
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
