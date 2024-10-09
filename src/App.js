import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AdminSidebar from "./components/Sidebar/AdminSidebar";
import ManagerSidebar from "./components/Sidebar/ManagerSidebar";
import EmployeeSidebar from "./components/Sidebar/EmployeeSidebar";
import Login from "./pages/Auth/AuthPage";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import { jwtDecode } from "jwt-decode";

import Unauthorized from "./Unauthorized";
import PrivateRoute from "./PrivateRoute";

// Admin routes
import AdminDashboard from "./pages/Admin/Dashboard";
import LeadDetail from "./pages/Admin/LeadDetails";
import LeadList from "./pages/Admin/LeadList";
import Settings from "./pages/Admin/Settings";
import Reports from "./pages/Admin/Reports";
import Leads from "./pages/Admin/Leads";
import EmployeeAdd from "./pages/Admin/EmployeeAdd";
import EmployeeEdit from "./pages/Admin/EmployeeEdit";
import LeadManagement from "./pages/Admin/LeadManagement";
// Employee routes
import EmployeeDashboard from "./pages/Employee/Dashboard";
import EmpLeads from "./pages/Employee/Leads";
import EmployeeViewLeadDetails from "./pages/Employee/LeadDetails";
import TaskViewEmployee from "./pages/Employee/Task";
import ScheduledTasks from "./pages/Employee/ScheduledTasks";
import EmployeeSettings from "./pages/Employee/Settings";
import UpdateTaskForm from "./pages/Employee/UpdateTaskForm";
import WalkinsList from "./pages/Employee/Walkins";

// Manager routes
import ManagerDashboard from "./pages/Manager/Dashboard";
import ManagerLeadList from "./pages/Manager/LeadList";
import ManagerLeads from "./pages/Manager/Leads";
import Header from "./components/Header";
import Employee from "./pages/Admin/Employee";
import WalkinsListManager from "./pages/Manager/Walkins";
import SettingsManager from "./pages/Manager/Settings";
import TaskManager from "./pages/Manager/Task";
import LeadDetailsManager from "./pages/Manager/LeadDetails";


const App = () => {
  let token = localStorage.getItem("token");
  let user;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      user = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Invalid token:", error);
      user = null; // Ensure user is null if token is invalid
    }
  } else {
    user = null;
  }

  const renderSidebar = () => {
    if (!user) return null;
    if (user.role === "ROLE_ADMIN") return <AdminSidebar />;
    if (user.role === "ROLE_MANAGER") return <ManagerSidebar />;
    if (user.role === "ROLE_EMPLOYEE") return <EmployeeSidebar />;
    return null;
  };

  const getDefaultRoute = () => {
    if (!user) return "/login";
    switch (user.role) {
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

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <div>
                <Header />
                {renderSidebar()}
                {/* <div className="content-wrapper"> */}
                <Routes>
                  <Route path="/unauthorized" element={<Unauthorized />} />

                  <Route
                    element={<PrivateRoute allowedRoles={["ROLE_ADMIN"]} />}
                  >
                    <Route
                      path="/admin-dashboard"
                      element={<AdminDashboard />}
                    />
                    <Route path="/lead-list" element={<LeadList />} />
                    <Route path="/lead-details" element={<LeadDetail />} />
                    <Route path="/employee" element={<Employee />} />
                    <Route path="/employee-add" element={<EmployeeAdd />} />
                    <Route
                      path="/employee-edit/:id"
                      element={<EmployeeEdit />}
                    />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/admin" element={<AdminSidebar />} />
                    <Route path="/Leads" element={<Leads />} />
                    <Route path="/manage-leads" element={<LeadManagement />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/reports" element={<Reports />} />
                  </Route>

                  <Route
                    element={<PrivateRoute allowedRoles={["ROLE_MANAGER"]} />}
                  >
                    <Route
                      path="/manager-dashboard"
                      element={<ManagerDashboard />}
                    />
                    <Route 
                    path = "/leadList" element={<ManagerLeadList/>}/>
                    <Route path="/manager-leads" element={<ManagerLeads/>}/>
                    <Route path="/walkins-list-manager" element={<WalkinsListManager/>}/>
                    <Route path="/manager-settings" element={<SettingsManager />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/lead-details" element={<LeadDetail />} />
                    <Route
                      path="/add-task-manager"
                      element={<TaskManager />}
                    />
                    <Route
                      path="/manager-lead-details"
                      element={<LeadDetailsManager />}
                    />
                  </Route>

                  <Route
                    element={<PrivateRoute allowedRoles={["ROLE_EMPLOYEE"]} />}
                  >
                    <Route
                      path="/employee-dashboard"
                      element={<EmployeeDashboard />}
                    />
                    <Route path="/emp-leads" element={<EmpLeads />} />
                    <Route
                      path="/emp-lead-details"
                      element={<EmployeeViewLeadDetails />}
                    />
                    <Route
                      path="/add-task-employee"
                      element={<TaskViewEmployee />}
                    />
                    <Route
                      path="/scheduled-tasks"
                      element={<ScheduledTasks />}
                    />
                    <Route
                      path="/employee-settings"
                      element={<EmployeeSettings />}
                    />
                    <Route path="/walkins-list" element={<WalkinsList />} />
                    <Route
                      path="/update-task-form"
                      element={<UpdateTaskForm />}
                    />
                  </Route>

                  <Route
                    path="/"
                    element={<Navigate to={getDefaultRoute()} />}
                  />
                </Routes>
                {/* </div> */}
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
