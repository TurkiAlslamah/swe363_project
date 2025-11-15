import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  return (
    <nav
      className="navbar navbar-expand-lg d-flex justify-content-between flex-row-reverse px-4 py-2 shadow-sm fixed-top"
      style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #dee2e6",
      }}
    >
      {/* Brand / Logo */}
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

            {/* Role-based navigation links */}
            {user.role === "admin" && (
              <Link className="btn btn-outline-primary me-2" to="/admin/dashboard">
                لوحة التحكم
              </Link>
            )}

            {user.role === "teacher" && (
              <Link className="btn btn-outline-primary me-2" to="/teacher/dashboard">
                لوحة التحكم
              </Link>
            )}

            {/* Home button - shown for all logged in users */}
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
