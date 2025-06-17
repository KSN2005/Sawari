import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        localStorage.setItem('token', data.token);
        navigate("/home");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage("Password is wrong. Please try again.");
      }
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 md:p-8">
      <img
        className="w-20 mb-4 mx-auto"
        src="https://sdmntprwestus3.oaiusercontent.com/files/00000000-7d1c-61fd-be3c-2a16c300538b/raw?se=2025-06-16T09%3A43%3A22Z&sp=r&sv=2024-08-04&sr=b&scid=93f6c23f-063b-57a5-9676-ccf78f1989b5&skoid=864daabb-d06a-46b3-a747-d35075313a83&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-15T22%3A35%3A33Z&ske=2025-06-16T22%3A35%3A33Z&sks=b&skv=2024-08-04&sig=4gnArVqnI2J5zlTpd4x%2BEORcQFeBPMoEXnpakswm8BU%3D"
        alt="Sawari Logo"
      />
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
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
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg px-4 py-3 w-full text-lg hover:opacity-90 transition-all">
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
