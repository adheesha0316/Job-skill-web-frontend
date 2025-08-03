import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LoginForm from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import EmployerDashboard from "./Pages/EmployerDashboard/EmployerDashboard";
import TrainerDashboard from "./Pages/TrainerDashboard/TrainerDashboard";
import JobSeekerDashboard from "./Pages/JobSeekerDashboard/JobSeekerDashboard";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import ChooseRole from "./Component/ChooseRole/ChooseRole";
import { useEffect, useState } from "react";

function ProtectedRoute({ isLoggedIn, role, allowedRoles, children }) {
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      const userRole = localStorage.getItem("role");
      setRole(userRole);
    };

    syncAuth();

    // Listen to changes across tabs/windows
    window.addEventListener("storage", syncAuth);

    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // Helper to get dashboard route by role
  const getDashboardRoute = (role) => {
    switch (role) {
      case "EMPLOYER":
        return "/dashboard/employer";
      case "JOBSEEKER":
        return "/dashboard/jobseeker";
      case "TRAINER":
        return "/dashboard/trainer";
      case "ADMIN":
        return "/dashboard/admin";
      case "GUEST":
        return "/dashboard/guest";
      default:
        return "/choose-role";
    }
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn && role ? (
            <Navigate to={getDashboardRoute(role)} />
          ) : (
            <LoginForm
              onLogin={() => {
                setIsLoggedIn(true);
                setRole(localStorage.getItem("role"));
              }}
            />
          )
        }
      />
      <Route
        path="/choose-role"
        element={
          isLoggedIn ? (
            <ChooseRole onRoleChange={(newRole) => setRole(newRole)} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isLoggedIn && role ? (
            <Navigate to={getDashboardRoute(role)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/dashboard/employer"
        element={
          <ProtectedRoute
            isLoggedIn={isLoggedIn}
            role={role}
            allowedRoles={["EMPLOYER"]}
          >
            <EmployerDashboard
              onLogout={() => {
                setIsLoggedIn(false);
                setRole(null);
              }}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/jobseeker"
        element={
          <ProtectedRoute
            isLoggedIn={isLoggedIn}
            role={role}
            allowedRoles={["JOBSEEKER"]}
          >
            <JobSeekerDashboard
              onLogout={() => {
                setIsLoggedIn(false);
                setRole(null);
              }}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/trainer"
        element={
          <ProtectedRoute
            isLoggedIn={isLoggedIn}
            role={role}
            allowedRoles={["TRAINER"]}
          >
            <TrainerDashboard
              onLogout={() => {
                setIsLoggedIn(false);
                setRole(null);
              }}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute
            isLoggedIn={isLoggedIn}
            role={role}
            allowedRoles={["ADMIN"]}
          >
            <AdminDashboard
              onLogout={() => {
                setIsLoggedIn(false);
                setRole(null);
              }}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/guest"
        element={
          <ProtectedRoute
            isLoggedIn={isLoggedIn}
            role={role}
            allowedRoles={["GUEST"]}
          >
            <Dashboard
              onLogout={() => {
                setIsLoggedIn(false);
                setRole(null);
              }}
            />
          </ProtectedRoute>
        }
      />

      {/* Redirect all unknown routes */}
      <Route
        path="*"
        element={
          <Navigate
            to={isLoggedIn && role ? getDashboardRoute(role) : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;

