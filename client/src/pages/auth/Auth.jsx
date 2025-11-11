import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Auth() {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      // register logic here
      alert("تم إنشاء الحساب بنجاح!");
    } else {
      // login logic here
      login("user"); // for demo
      alert("تم تسجيل الدخول بنجاح!");
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2>{isRegister ? "إنشاء حساب جديد" : "تسجيل الدخول"}</h2>

      <form onSubmit={handleSubmit} className="mt-4" style={{ maxWidth: 400, margin: "auto" }}>
        {isRegister && (
          <input
            type="text"
            placeholder="الاسم الكامل"
            className="form-control mb-3"
            required
          />
        )}
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          className="form-control mb-3"
          required
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          className="form-control mb-3"
          required
        />
        <button type="submit" className="btn btn-success w-100">
          {isRegister ? "تسجيل" : "دخول"}
        </button>
      </form>

      <p className="mt-3">
        {isRegister ? (
          <>
            لديك حساب؟{" "}
            <button
              onClick={() => setIsRegister(false)}
              className="btn btn-link p-0"
            >
              تسجيل الدخول
            </button>
          </>
        ) : (
          <>
            ليس لديك حساب؟{" "}
            <button
              onClick={() => setIsRegister(true)}
              className="btn btn-link p-0"
            >
              إنشاء حساب
            </button>
          </>
        )}
      </p>
    </div>
  );
}
