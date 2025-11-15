import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home"; 
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard"; 
import Training from "./pages/user/Training";
import TrainingQuestions from "./pages/user/TrainingQuestions";
// Teacher pages
import TeacherLogin from "./pages/teacher/pages/Login";
import MyQuestions from "./pages/teacher/pages/MyQuestions";
import AddQuestion from "./pages/teacher/pages/AddQuestion";
import EditQuestion from "./pages/teacher/pages/EditQuestion";
import Feedback from "./pages/teacher/pages/Feedback";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

function AppContent() {
  const location = useLocation();
  const isTeacherRoute = location.pathname.startsWith('/teacher');

  return (
    <>
      {!isTeacherRoute && <Header />}
      <main style={{ minHeight: "80vh" }}>
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
            path="/training"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Training />
              </ProtectedRoute>
            }
          />
          <Route path="/training/:trainingId" element={<ProtectedRoute allowedRoles={["user"]}><TrainingQuestions /></ProtectedRoute>} />


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
      {!isTeacherRoute && <Footer />}
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