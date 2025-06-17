import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {UserDataContext} from "../context/UserContext";


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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <img
        className="w-20 mb-4 mx-auto"
        src="https://sdmntprwestus3.oaiusercontent.com/files/00000000-7d1c-61fd-be3c-2a16c300538b/raw?se=2025-06-16T09%3A43%3A22Z&sp=r&sv=2024-08-04&sr=b&scid=93f6c23f-063b-57a5-9676-ccf78f1989b5&skoid=864daabb-d06a-46b3-a747-d35075313a83&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-15T22%3A35%3A33Z&ske=2025-06-16T22%3A35%3A33Z&sks=b&skv=2024-08-04&sig=4gnArVqnI2J5zlTpd4x%2BEORcQFeBPMoEXnpakswm8BU%3D"
        alt="Sawari Logo"
      />
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">First Name</h3>
              <input
                type="text"
                className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200 w-full text-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg px-4 py-3 w-full text-lg hover:opacity-90 transition-all">
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
