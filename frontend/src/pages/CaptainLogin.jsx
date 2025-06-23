import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';
import logo from "../assets/LogoSAWARI.png";

const CaptainLogin = () => {
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Add error state
 
 const { captain, setCaptain } = React.useContext(CaptainDataContext);
  const navigate = useNavigate();
 
 
  const submitHandler = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before request
    const captain = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        captain
      );

      if (response.status === 200) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem("token", data.token);
        navigate("/captain-home");
      }
      setEmail("");
      setPassword("");
    } catch (err) {
      // Show error if login fails (e.g., wrong password)
      setError(
        err.response && err.response.status === 401
          ? "Incorrect email or password."
          : "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 sm:p-8">
        {/* Show error message if exists */}
        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">
            {error}
          </div>
        )}

        <img
          className="w-20 mb-8 mx-auto hover:scale-105 transition-transform"
          src={logo}
          alt="Sawari Logo"
        />

        <form onSubmit={submitHandler} className="space-y-6">
          <h3 className="text-lg font-medium mb-2">what's your email?</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 mb-7 rounded-lg px-4 py-2 border border-gray-200 w-full text-lg placeholder:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="email@example.com"
            required
          />

          <h3 className="text-lg font-medium mb-2">Enter your password</h3>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 mb-7 rounded-lg px-4 py-2 border border-gray-200 w-full text-lg placeholder:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="password"
            required
          />
          <button className="bg-black text-white font-semibold rounded-lg px-4 py-3 w-full text-lg hover:opacity-90 transition-all">
            Login as Captain
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Want to drive with us?{" "}
          <Link to="/captain-signup" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Register as a Captain
          </Link>
        </p>

        <div className="mt-6">
          <Link
            to="/login"
            className="bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center text-white font-semibold rounded-lg px-4 py-3 w-full text-lg hover:opacity-90 transition-all"
          >
            Sign in as User
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaptainLogin;