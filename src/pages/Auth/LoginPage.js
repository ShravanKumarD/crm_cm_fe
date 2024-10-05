import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {jwtDecode} from "jwt-decode"; // Corrected import
import { useAuth } from "./../../context/AuthContext"; // Import the useAuth hook

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth(); // Get the login function from AuthContext
  const navigate = useNavigate();

  // Define getDefaultRoute function to route users based on role
  const getDefaultRoute = (role) => {
    switch (role) {
      case "ROLE_ADMIN":
        return "/admin-dashboard";
      case "ROLE_MANAGER":
        return "/manager-dashboard";
      case "ROLE_EMPLOYEE":
        return "/employee-dashboard";
      default:
        return "/login";
    }
  };

  const handleLogin = async () => {
    if (email && password) {
      try {
        const response = await axios.post("/auth/login", {
          email,
          password,
        });
        const { token } = response.data;
        const decodedToken = jwtDecode(token);
        const user = decodedToken.user;

        if (token && user) {
          login(token, user.role); // Store token and role in AuthContext
          navigate(getDefaultRoute(user.role)); // Redirect to the correct dashboard
        } else {
          setError("Login failed, invalid response from server.");
        }
      } catch (error) {
        setError(error.response?.data?.message || "Login failed");
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  return (
    <>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="form-group">
        
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="button"
        className="btn btn-primary btn-sm mt-3"
        onClick={handleLogin}
      >
        Login
      </button>
    </>
  );
};

export default LoginPage;
