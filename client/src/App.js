import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/user/Home";
import AdminDashboard from "./pages/admin/Dashboard";
import TeacherCourses from "./pages/teacher/TeacherDashboard";

import Header from "./components/user/Header";
import Footer from "./components/user/Footer";

export default function App() {
  return (
     <AuthProvider>
      <BrowserRouter>
        <Header />

        <main style={{ minHeight: "80vh" }}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/courses"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <TeacherCourses />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
