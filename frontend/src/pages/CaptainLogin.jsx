import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainLogin = () => {
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 
 const { captain, setCaptain } = React.useContext(CaptainDataContext);
  const navigate = useNavigate();
 
 
  const submitHandler = async (e) => {
    e.preventDefault();
    const captain = {
      email: email,
      password: password,
    };

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <img
          className="w-20 mb-8 mx-auto hover:scale-105 transition-transform"
          src="https://sdmntprwestus3.oaiusercontent.com/files/00000000-7d1c-61fd-be3c-2a16c300538b/raw?se=2025-06-16T09%3A43%3A22Z&sp=r&sv=2024-08-04&sr=b&scid=93f6c23f-063b-57a5-9676-ccf78f1989b5&skoid=864daabb-d06a-46b3-a747-d35075313a83&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-15T22%3A35%3A33Z&ske=2025-06-16T22%3A35%3A33Z&sks=b&skv=2024-08-04&sig=4gnArVqnI2J5zlTpd4x%2BEORcQFeBPMoEXnpakswm8BU%3D"
          alt="Sawari Logo"
        />

        <form onSubmit={submitHandler} className="space-y-6">
          <h3 className="text-lg font-medium mb-2">what's your email?</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            placeholder="email@example.com"
            required
          />
  
          <h3 className="text-lg font-medium mb-2">Enter your password</h3>
  
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            placeholder="password"
            required
          />
          <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg px-4 py-3 w-full text-lg hover:opacity-90 transition-all">
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