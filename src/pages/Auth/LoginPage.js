import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {jwtDecode} from "jwt-decode";
import { useAuth } from "./../../context/AuthContext"; 
import AdminSidebar from "./../../components/Sidebar/AdminSidebar";
import ManagerSidebar from "./../../components/Sidebar/ManagerSidebar";
import EmployeeSidebar from "./../../components/Sidebar/EmployeeSidebar";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const getDefaultRoute = (role) => {
    console.log(role,'in getrole')
    if (!role) return { sidebar: null, route: "/login" };
    let sidebar = null;
    let route = "/login"; 

    switch (role) {
      case "ROLE_ADMIN":
        sidebar = <AdminSidebar/>;
        route = "/admin-dashboard";
        break;
      case "ROLE_MANAGER":
        sidebar = <ManagerSidebar />;
        route = "/manager-dashboard";
        break;
      case "ROLE_EMPLOYEE":
        sidebar = <EmployeeSidebar />;
        route = "/employee-dashboard";
        break;
      default:
        sidebar = null;
        break;
    }
    return { sidebar, route };
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
          login(token, user);
          const  {route}  = getDefaultRoute(user.role); 

          navigate(route); 
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
