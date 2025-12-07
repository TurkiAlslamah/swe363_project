import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const handleLogin = async (e) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    const email = e.target.email.value;
    const password = e.target.password.value;

    // Validation
    if (!email || !password) {
      throw new Error('يرجى إدخال البريد الإلكتروني وكلمة المرور');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('البريد الإلكتروني غير صالح');
    }

    if (password.length < 6) {
      throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    }

    // Call backend API
    const response = await fetch('http://localhost:5005/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'فشل تسجيل الدخول');
    }

    // Save token and user data
  // Save to localStorage
    const { token, user } = data.data;
    const userType = user.type === "student" ? "user" : user.type;

    localStorage.setItem('token', token);
    localStorage.setItem('userType', userType);
    localStorage.setItem('fullName', user.fullName);
    localStorage.setItem('email', user.email);

    // Update auth context
    login({ token, type: userType, fullName: user.fullName, email: user.email });

    // Navigate based on user type
    if (userType === "admin") {
      navigate("/admin/dashboard");
    } else if (userType === "teacher") {
      navigate("/teacher/dashboard");
    } else {
      navigate("/dashboard");
    }

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
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
         {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

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

          

          <button
            type="submit"
            className="btn w-100 text-white fw-bold"
            style={{ backgroundColor: "#4B0082", border: "none" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                جاري تسجيل الدخول...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
