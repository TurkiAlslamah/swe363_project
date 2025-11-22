import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { login } = useAuth(); // simulate registering and logging in
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  try {
    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // Validation
    if (!fullName.trim() || fullName.trim().length < 3) {
      throw new Error('الاسم يجب أن يكون 3 أحرف على الأقل');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('البريد الإلكتروني غير صالح');
    }

    if (password.length < 6) {
      throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    }

    if (password !== confirmPassword) {
      throw new Error('كلمتا المرور غير متطابقتين');
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    login(email, "user");
    navigate("/dashboard");

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
        <h2 className="text-center fw-bold text-primary mb-2">
          انضم إلى منصتنا
        </h2>
        <p className="text-center text-muted mb-4">ابدأ رحلتك الآن</p>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">الاسم الكامل</label>
            <input
              type="text"
              name="fullName"
              className="form-control text-end"
              placeholder="أدخل اسمك الكامل"
              required
            />
          </div>

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
            <label className="form-label">كلمة السر</label>
            <input
              type="password"
              name="password"
              className="form-control text-end"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">تأكيد كلمة السر</label>
            <input
              type="password"
              name="confirmPassword"
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
              جاري التسجيل...
            </>
          ) : (
            'ابدأ رحلتك الآن'
          )}
        </button>
        </form>
      </div>
    </div>
  );
}
