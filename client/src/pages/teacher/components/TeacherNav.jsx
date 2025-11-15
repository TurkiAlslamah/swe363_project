import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function TeacherNav() {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4"
      style={{ direction: "rtl" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/teacher/dashboard" style={{ color: "#6B46C1" }}>
          منصة قدرات
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#teacherNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="teacherNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/teacher/dashboard') ? 'active fw-bold' : ''}`}
                to="/teacher/dashboard"
                style={{ color: isActive('/teacher/dashboard') ? '#6B46C1' : '#333' }}
              >
                <i className="bi bi-house-door me-1"></i>
                الرئيسية
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/teacher/questions') ? 'active fw-bold' : ''}`}
                to="/teacher/questions"
                style={{ color: isActive('/teacher/questions') ? '#6B46C1' : '#333' }}
              >
                <i className="bi bi-question-circle me-1"></i>
                الأسئلة
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/teacher/feedback') ? 'active fw-bold' : ''}`}
                to="/teacher/feedback"
                style={{ color: isActive('/teacher/feedback') ? '#6B46C1' : '#333' }}
              >
                <i className="bi bi-clipboard-check me-1"></i>
                التقييم
              </Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
            >
              <i className="bi bi-box-arrow-right me-1"></i>
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

