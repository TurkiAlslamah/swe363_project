// src/components/common/Header.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaHome } from "react-icons/fa";
import { MdMenuBook } from "react-icons/md";
import { MdQuiz } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";

export default function Header() {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const location = useLocation();

  const isAdmin = isLoggedIn && user.role === "admin";

  const isActiveAdmin = (path) => location.pathname.startsWith(path);

  // ======== هيدر الأدمن ========
  if (isAdmin) {
    return (
      <nav
        className="navbar navbar-expand-lg fixed-top px-4 py-2 shadow-sm"
        style={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #dee2e6",
          direction: "rtl",
        }}
      >
        {/* يمين: اللوجو */}
        <div className="d-flex align-items-center gap-2">
          <Link className="navbar-brand fw-bold text-dark" to="/admin/dashboard">
            SWE363
          </Link>
        </div>

        {/* وسط: روابط الأدمن (الصفحة الرئيسة / إدارة المستخدمين / مراجعة الأسئلة) */}
        <div className="mx-auto d-flex align-items-center gap-3">
          <Link
            to="/admin/dashboard"
            className="d-flex align-items-center px-3 py-2 rounded-pill text-decoration-none"
            style={{
              backgroundColor: isActiveAdmin("/admin/dashboard")
                ? "#4B0082"
                : "transparent",
              color: isActiveAdmin("/admin/dashboard") ? "#ffffff" : "#4B0082",
              fontWeight: 600,
            }}
          >
            <span className="ms-1">🏠</span>
            <span>الصفحة الرئيسة</span>
          </Link>

          <Link
            to="/admin/users"
            className="d-flex align-items-center px-3 py-2 rounded-pill text-decoration-none"
            style={{
              backgroundColor: isActiveAdmin("/admin/users")
                ? "#4B0082"
                : "transparent",
              color: isActiveAdmin("/admin/users") ? "#ffffff" : "#6b7280",
              fontWeight: 500,
            }}
          >
            <span className="ms-1">📘</span>
            <span>إدارة المستخدمين</span>
          </Link>

          <Link
            to="/admin/review"
            className="d-flex align-items-center px-3 py-2 rounded-pill text-decoration-none"
            style={{
              backgroundColor: isActiveAdmin("/admin/review")
                ? "#4B0082"
                : "transparent",
              color: isActiveAdmin("/admin/review") ? "#ffffff" : "#6b7280",
              fontWeight: 500,
            }}
          >
            <span className="ms-1">📊</span>
            <span>مراجعة الأسئلة</span>
          </Link>
        </div>

        {/* يسار: شارة الدور + تسجيل خروج */}
        <div className="d-flex align-items-center gap-2">
          <span
            className="badge text-light"
            style={{ backgroundColor: "#4B0082" }}
          >
            مدير
          </span>

          <button className="btn btn-danger btn-sm" onClick={logout}>
            تسجيل خروج
          </button>
        </div>
      </nav>
    );
  }

  // ======== الهيدر العادي (لغير الأدمن) ========
  return (
  <nav
    className="navbar navbar-expand-lg d-flex justify-content-between align-items-center px-4 py-2 shadow-sm fixed-top"
    dir="rtl"
    style={{
      backgroundColor: "#fffefeff",
      borderBottom: "1px solid #dee2e6",
    }}
  >
    {/* Brand / Logo - FAR RIGHT */}
    <Link className="navbar-brand fw-bold text-dark" to="/">
      SWE363
    </Link>

      {/* RIGHT SIDE CONTENT */}
      <div className="d-flex align-items-center gap-2">

        {/* ====================== NOT LOGGED IN ======================= */}
        {!isLoggedIn && (
          <>
            <Link className="btn btn-outline-dark" to="/login">
              تسجيل دخول
            </Link>

            <Link
              className="btn text-white"
              style={{
                backgroundColor: "#4B0082",
                borderRadius: "8px",
                fontWeight: 500,
                padding: "6px 14px",
              }}
              to="/register"
            >
              تسجيل حساب
            </Link>
          </>
        )}

        {/* ======================== LOGGED IN ======================== */}
        {isLoggedIn && (
          <>
            {/* User Role Indicator */}
            <span
              className="badge text-light me-2"
              style={{ backgroundColor: "#4B0082" }}
            >
              {user.role === "admin"
                ? "مدير"
                : user.role === "teacher"
                ? "معلم"
                : "مستخدم"}
            </span>

            {/* Home button */}
            <Link className="btn btn-outline-dark" to="/home">
              الصفحة الرئيسة
            </Link>

            {/* Logout button */}
            <button className="btn btn-danger" onClick={logout}>
              تسجيل خروج
            </button>
          </>
        )}

      </div>
    </nav>
  );
}
