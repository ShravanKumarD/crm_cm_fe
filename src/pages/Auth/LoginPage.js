import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const getDefaultRoute = (role) => {
    if (!role) return '/login';
    switch (role) {
      case 'ROLE_ADMIN':
        return '/admin-dashboard';
      case 'ROLE_MANAGER':
        return '/manager-dashboard';
      case 'ROLE_EMPLOYEE':
        return '/employee-dashboard';
      default:
        return '/login';
    }
  };

  const handleLogin = async () => {
    if (email && password) {
      try {
        const response = await axios.post("http://localhost:3000/auth/login", {
          email,
          password,
        });
        const token = response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("token", JSON.stringify(token));
      
        navigate(getDefaultRoute(JSON.parse(localStorage.getItem('user')).role), { state: { token: token } });
      } catch (error) {
        setError(error.response?.data?.message || "Login failed");
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  return (
    <div>
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
        className="btn btn-primary btn-block"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};

export default LoginPage;
