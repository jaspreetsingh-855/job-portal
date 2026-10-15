import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { ROLES } from "./utils/api";

import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Profile from "./pages/Profile";
import CompleteProfile from "./pages/CompleteProfile";
import AppliedJobs from "./pages/AppliedJobs";
import SavedJobs from "./pages/SavedJobs";
import EmployerDashboard from "./pages/EmployerDashboard";
import PostJob from "./pages/PostJob";
import MyJobs from "./pages/MyJobs";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminReports from "./pages/AdminReports";
import Settings from "./pages/Settings";
import JobDetail from "./pages/JobDetail";
import EmployerApplicants from "./pages/EmployerApplicants";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={[ROLES.JOBSEEKER]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <ProtectedRoute roles={[ROLES.JOBSEEKER]}>
            <Jobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs/:id"
        element={
          <ProtectedRoute roles={[ROLES.JOBSEEKER]}>
            <JobDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applied-jobs"
        element={
          <ProtectedRoute roles={[ROLES.JOBSEEKER]}>
            <AppliedJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved-jobs"
        element={
          <ProtectedRoute roles={[ROLES.JOBSEEKER]}>
            <SavedJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute roles={[ROLES.JOBSEEKER]}>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employer/dashboard"
        element={
          <ProtectedRoute roles={[ROLES.EMPLOYER]}>
            <EmployerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/post-job"
        element={
          <ProtectedRoute roles={[ROLES.EMPLOYER]}>
            <PostJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/jobs/:id/edit"
        element={
          <ProtectedRoute roles={[ROLES.EMPLOYER]}>
            <PostJob />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/jobs/:id/applicants"
        element={
          <ProtectedRoute roles={[ROLES.EMPLOYER]}>
            <EmployerApplicants />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employer/my-jobs"
        element={
          <ProtectedRoute roles={[ROLES.EMPLOYER]}>
            <MyJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
            <AdminReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
