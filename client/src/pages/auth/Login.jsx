import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const role = e.target.role.value; // Get selected role

    // Simulate login (store email + role)
    login(email, role);

    // Redirect based on role
    if (role === "admin") navigate("/admin/dashboard");
    else if (role === "teacher") navigate("/teacher/courses");
    else navigate("/home");
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        background: "linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)",
        direction: "rtl",
      }}
    >
      <div
        className="p-5 shadow rounded"
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2 className="text-center fw-bold text-primary mb-2">تسجيل الدخول</h2>
        <p className="text-center text-muted mb-4">مرحباً بعودتك 👋</p>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              className="form-control text-end"
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">كلمة المرور</label>
            <input
              type="password"
              name="password"
              className="form-control text-end"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Role selection */}
          <div className="mb-4">
            <label className="form-label">نوع المستخدم</label>
            <select name="role" className="form-select text-end" required>
              <option value="user">مستخدم</option>
              <option value="teacher">معلم</option>
              <option value="admin">مدير</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn w-100 text-white fw-bold"
            style={{
              backgroundColor: "#4B0082",
              border: "none",
            }}
          >
            تسجيل الدخول
          </button>
        </form>
      </div>
    </div>
  );
}
