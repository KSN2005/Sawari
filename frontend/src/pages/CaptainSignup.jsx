import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from "../assets/LogoSAWARI.png";

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleColor, setVehicleColor] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');

  const [error, setError] = useState('');

  const { captain, setCaptain } = React.useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setError('');
      const captainData = {
        fullname: {
          firstname: firstName,
          lastname: lastName,
        },
        email: email,
        password: password,
        vehicle: {
          vehicleType: vehicleType,
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: vehicleCapacity,
        },
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        captainData
      );

      if (response.status === 201) {
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        navigate('/captain-home');
      }
    } catch (err) {
      // Show error if login fails (e.g., wrong password)
      setError(
        err.response && err.response.status === 401
          ? "Incorrect email or password."
          : "Login failed. Please try again."
      );
    }

    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setVehicleType('');
    setVehicleColor('');
    setVehiclePlate('');
    setVehicleCapacity('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <img
          className="w-20 mb-8 mx-auto hover:scale-105 transition-transform"
          src={logo}
          alt="Sawari Logo"
        />
        {/* Show error message if exists */}
        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">
            {error}
          </div>
        )}
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">What's our Captain's name</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">What's our Captain's email</h3>
            <input
              type="email"
              className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <h3 className="text-sm font-medium mb-2">Enter Password</h3>
            <input
              type="password"
              className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Confirm Password</h3>
            <input
              type="password"
              className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Vehicle Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Vehicle Color"
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                required
              />
              <input
                type="text"
                className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Vehicle Plate"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <select
                className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                required
              >
                <option value="">Select vehicle</option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="bike">Bike</option>
              </select>
              <input
                type="number"
                className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="Enter vehicle capacity"
                value={vehicleCapacity}
                onChange={(e) => setVehicleCapacity(e.target.value)}
                required
              />
            </div>
          </div>
          <button className="bg-black text-white font-semibold rounded-lg px-4 py-3 w-full text-sm hover:opacity-90 transition-all">
            Create Captain Account
          </button>
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/captain-login" className="text-blue-600 hover:text-blue-700 font-medium">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CaptainSignup;