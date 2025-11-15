import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaHome } from "react-icons/fa";
import { MdMenuBook } from "react-icons/md";
import { MdQuiz } from "react-icons/md";
import { BsGraphUp } from "react-icons/bs";

export default function Header() {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

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

    {/* CENTER - NAV LINKS (only for logged in user) */}
    {isLoggedIn && user.role === "user" && (
      <div className="d-flex align-items-center gap-4" style={{fontSize: "22px"}}>
    <Link to="/dashboard" className="nav-link fw-bold d-flex align-items-center gap-2">
      <FaHome size={18} color ="#4B0082" />
      الصفحة الرئيسية
    </Link>

    <Link to="/training" className="nav-link fw-bold d-flex align-items-center gap-2">
      <MdMenuBook size={18} color ="#4B0082" />
      التدرييبات
    </Link>

    <Link to="/exams" className="nav-link fw-bold d-flex align-items-center gap-2">
      <MdQuiz size={18} color ="#4B0082" />
      الاختبارات
    </Link>

    <Link to="/stats" className="nav-link fw-bold d-flex align-items-center gap-2">
      <BsGraphUp size={18} color ="#4B0082"/>
      الأداء
    </Link>

      </div>
    )}

    {/* FAR LEFT - AUTH BUTTONS or AVATAR */}
    <div className="d-flex align-items-center gap-2">
      {/* NOT LOGGED IN */}
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

      {/* LOGGED IN USER - Avatar */}
      {/* LOGGED IN USER - Avatar */}
{isLoggedIn && user.role === "user" && (
  <div className="dropdown">
    <img
      src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
      width="32"
      height="32"
      className="rounded-circle dropdown-toggle"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      alt="avatar"
      style={{ cursor: "pointer" }}
    />
    <ul className="dropdown-menu dropdown-menu-start">
      <li className="px-3 py-2 border-bottom">
        <div className="fw-bold">{user.name || "المستخدم"}</div>
        <small className="text-muted">{user.email}</small>
      </li>
      <li>
        <Link className="dropdown-item" to="/profile">
          الملف الشخصي
        </Link>
      </li>
      <li>
        <Link className="dropdown-item" to="/settings">
          الإعدادات
        </Link>
      </li>
      <li><hr className="dropdown-divider" /></li>
      <li>
        <button 
          className="dropdown-item text-danger" 
          onClick={logout}
        >
          تسجيل الخروج
        </button>
      </li>
    </ul>
  </div>
)}

      {/* LOGGED IN (admin) */}
      
      {/* LOGGED IN (teacher) */}
    </div>
  </nav>
);
}
