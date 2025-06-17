import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      setError(err.response?.data?.message || 'Something went wrong');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <img
        className="w-20 mb-4 mx-auto"
        src="https://sdmntprwestus3.oaiusercontent.com/files/00000000-7d1c-61fd-be3c-2a16c300538b/raw?se=2025-06-16T09%3A43%3A22Z&sp=r&sv=2024-08-04&sr=b&scid=93f6c23f-063b-57a5-9676-ccf78f1989b5&skoid=864daabb-d06a-46b3-a747-d35075313a83&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-15T22%3A35%3A33Z&ske=2025-06-16T22%3A35%3A33Z&sks=b&skv=2024-08-04&sig=4gnArVqnI2J5zlTpd4x%2BEORcQFeBPMoEXnpakswm8BU%3D"
        alt="Sawari Logo"
      />
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">What's our Captain's name</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Vehicle Color"
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                required
              />
              <input
                type="text"
                className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Vehicle Plate"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <select
                className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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