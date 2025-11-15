import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";


import Header from "./components/common/Header";
import TeacherNav from "./pages/teacher/components/TeacherNav";
import Footer from "./components/common/Footer";

function AppContent() {
  const location = useLocation();
  const isTeacherRoute = location.pathname.startsWith('/teacher');

  return (
    <>
      {/* Global Header - always shown */}
      <Header />
      
      {/* Teacher-specific navigation - shown below Header on teacher routes */}
      {isTeacherRoute && <TeacherNav />}
      
      <main style={{ minHeight: "80vh", paddingTop: isTeacherRoute ? "120px" : "80px" }}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

          {/* Teacher Routes */}
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/questions"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <MyQuestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/questions/add"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <AddQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/questions/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <EditQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/feedback"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <Feedback />
              </ProtectedRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}