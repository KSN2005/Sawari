import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/LogoSAWARI.png";
const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        userData
      );

      if (response.status === 200) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem("token", data.token);
        navigate("/home");
      }
    } catch (err) {
      // Show error if login fails (e.g., wrong password)
      setError(
        err.response && err.response.status === 401
          ? "Incorrect email or password."
          : "Login failed. Please try again."
      );
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <img
          className="w-20 mb-8 mx-auto hover:scale-105 transition-transform"
          src={logo}
          alt="Sawari Logo"
        />

        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-4">
          <h3 className="text-lg font-medium mb-2">what's your email?</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 mb-7 rounded-lg px-4 py-2 border border-gray-200 w-full text-lg placeholder:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="email@example.com"
            required
          />

          <h3 className="text-lg font-medium mb-2">Enter your password</h3>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 mb-7 rounded-lg px-4 py-2 border border-gray-200 w-full text-lg placeholder:text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="password"
            required
          />
          <button className="bg-black text-white font-semibold rounded-lg px-4 py-3 w-full text-lg hover:opacity-90 transition-all">
            Login
          </button>

          <p className="text-center text-gray-600">
            New here?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create new Account
            </Link>
          </p>
        </form>

        <div className="mt-6">
          <Link
            to="/captain-login"
            className="bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold rounded-lg px-4 py-3 w-full text-lg hover:opacity-90 transition-all"
          >
            Sign in as Captain
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
