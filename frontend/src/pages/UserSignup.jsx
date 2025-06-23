import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {UserDataContext} from "../context/UserContext";
import logo from "../assets/LogoSAWARI.png";


const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userData, setUserData] = useState({});
  const [error, setError] = useState("");


  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) { 
      setError("Passwords do not match");
      return;
    }

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
    };

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

    if (response.status === 201) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem('token', data.token);
      navigate('/home');
    }

    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setConfirmPassword("");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <img
          className="w-20 mb-8 mx-auto hover:scale-105 transition-transform"
          src={logo}
          alt="Sawari Logo"
        />
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">First Name</h3>
              <input
                type="text"
                className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="First name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                required
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Last Name</h3>
              <input
                type="text"
                className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                required
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Enter your email</h3>
            <input
              type="email"
              className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Create a password</h3>
            <input
              type="password"
              className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Confirm your password</h3>
            <input
              type="password"
              className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm font-medium text-center">{error}</p>
          )}
          <button className="bg-black text-white font-semibold rounded-lg px-4 py-3 w-full text-lg hover:opacity-90 transition-all">
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Login
          </Link>
        </p>
        <div>
          <p className="text-[10px] leading-tight text-gray-500 mt-6">
            By proceeding, you consent to receive calls, WhatsApp or SMS messages,
            including via automated systems, from Sawari and its affiliates to the
            number you provide.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
