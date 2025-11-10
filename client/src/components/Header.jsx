import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav
    className="navbar navbar-expand-lg navbar-dark d-flex justify-content-between flex-row-reverse px-4 py-2 shadow-sm"
    style={{
      backgroundColor: "#f8f9fa",      // light gray
      border: "1px solid #dee2e6",     // subtle border
      borderRadius: "10px",            // soft rounded corners
    }}
    >  
      <Link className="navbar-brand text-dark fw-bold" to="/">SWE363</Link>
      <div className="d-flex">
        {isLoggedIn ? ( 
          <>
            <Link className="btn btn-outline-light me-2" to="/home">الصفحة الرئيسة</Link>
            <button className="btn btn-danger" onClick={logout}>تسجيل خروج</button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline-dark  me-2" to="/login"
            >تسجيل دخول</Link>
                    <Link
            className="btn btn-success"
            style={{
              borderRadius: "8px",
              fontWeight: "500",
              padding: "6px 14px",
              backgroundColor: "#8B5CF6",
              border: "none",
            }}
            to="/register"
          >
            تسجيل حساب
          </Link>

          </>
        )}
      </div>
    </nav>
  );
}
