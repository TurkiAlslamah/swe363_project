import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import Training from "./pages/user/Training";
import TrainingQuestions from "./pages/user/TrainingQuestions";
import Exams from "./pages/user/Exams";
import CustomTest from "./pages/user/CustomTest";
import Profile from "./pages/user/Profile";
import TestResult from "./pages/user/TestResult";
import CustomTestQuestions from "./pages/user/CustomTestQuestions";
import DailyTest from "./pages/user/DailyTest";

import Stats from "./pages/user/Stats";
import ReviewWrongAnswers from "./pages/user/ReviewWrongAnswers";
import ReviewSavedQuestions from "./pages/user/ReviewSavedQuestions";

// Admin pages

import UserManagement from "./pages/admin/UserManagement";
import ReviewQuestions from "./pages/admin/ReviewQuestions";
import EditQuestionAdmin from "./pages/admin/EditQuestionAdmin"; 
import Reports from "./pages/admin/Reports";

// Teacher pages
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherLogin from "./pages/teacher/Login";
import MyQuestions from "./pages/teacher/MyQuestions";
import AddQuestion from "./pages/teacher/AddQuestion";
import EditQuestion from "./pages/teacher/EditQuestion";
import Feedback from "./pages/teacher/Feedback";

// Navigation components
import Header from "./components/common/Header";

import Footer from "./components/common/Footer";
function AppContent() {
  const location = useLocation();

  return (
    <>
      {/* Global Header - always shown */}
      <Header />
      
      <main style={{ minHeight: "80vh", paddingTop: "56px" }}>
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
          <Route
            path="/exams"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <Exams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/custom"
            element={ 
              <ProtectedRoute allowedRoles={["user"]}>
                <CustomTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={ 
              <ProtectedRoute allowedRoles={["user"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams/custom/start"
            element={ 
              <ProtectedRoute allowedRoles={["user"]}>
                <CustomTestQuestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test-result"
            element={ 
              <ProtectedRoute allowedRoles={["user"]}>
                <TestResult />
              </ProtectedRoute>
            }
          />
          <Route  
            path="/daily-test"
            element={
              <ProtectedRoute allowedRoles={["user"]}>

                <DailyTest />
              </ProtectedRoute>
            }
          />
         <Route  path="/stats"  element={     <ProtectedRoute allowedRoles={["user"]}>      <Stats />    </ProtectedRoute>  }/> <Route  path="/review-wrong-answers"  element={     <ProtectedRoute allowedRoles={["user"]}>      <ReviewWrongAnswers />    </ProtectedRoute>  }/>
          <Route  path="/review-saved-questions"  element={     <ProtectedRoute allowedRoles={["user"]}>      <ReviewSavedQuestions />    </ProtectedRoute>  }/>
 

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
          

             {/* ========= Admin Routes ========= */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/review"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ReviewQuestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/review/:id/edit"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <EditQuestionAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Reports />
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