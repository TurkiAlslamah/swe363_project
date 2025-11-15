// src/pages/admin/AdminDashboard.jsx
import React, { useState } from "react";


export default function AdminDashboard() {
  const stats = {
    questions: 120,
    students: 45,
    teachers: 8,
  };

  const [showBroadcast, setShowBroadcast] = useState(false);

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const body = e.target.body.value;
    const target = e.target.target.value;

    alert(
      `تم إرسال الرسالة:\nالعنوان: ${title}\nالنص: ${body}\nإلى: ${target}`
    );

    setShowBroadcast(false);
    e.target.reset();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)",
        direction: "rtl",
        paddingTop: "80px", // نفس القيمة في كل صفحات الأدمن
      }}
    >
      <div className="container text-end">
        {/* شريط الأدمن الموحد */}


        {/* الكروت */}
        <div className="row g-3 mb-4 text-center mt-2">
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="fw-bold mb-3">عدد الأسئلة</h5>
                <div className="display-6 fw-bold" style={{ color: "#4B0082" }}>
                  {stats.questions}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="fw-bold mb-3">عدد الطلاب</h5>
                <div className="display-6 fw-bold" style={{ color: "#4B0082" }}>
                  {stats.students}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="fw-bold mb-3">عدد المدرسين</h5>
                <div className="display-6 fw-bold" style={{ color: "#4B0082" }}>
                  {stats.teachers}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* الأزرار الخضراء */}
        <div
          className="text-center"
          style={{ maxWidth: "600px", margin: "0 auto" }}
        >
          <button
            className="btn w-100 mb-3 py-2 fw-bold text-white"
            style={{
              backgroundColor: "#16A34A",
              borderRadius: "999px",
              border: "none",
            }}
            onClick={() => setShowBroadcast(true)}
          >
            إرسال رسالة عامة لجميع المستخدمين
          </button>

          <button
            className="btn w-100 py-2 fw-bold text-white"
            style={{
              backgroundColor: "#16A34A",
              borderRadius: "999px",
              border: "none",
            }}
            onClick={() => alert("مستقبلاً: صفحة إدارة محتوى النظام")}
          >
            إدارة محتوى النظام
          </button>
        </div>
      </div>

      {/* مودال إرسال رسالة */}
      {showBroadcast && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 1050,
            direction: "rtl",
          }}
        >
          <div
            className="bg-white shadow rounded p-4"
            style={{ width: "90%", maxWidth: "700px" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                className="btn btn-link text-dark p-0 fs-4"
                onClick={() => setShowBroadcast(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit}>
              <div className="mb-3">
                <label
                  className="form-label fw-bold"
                  style={{ color: "#4B0082" }}
                >
                  عنوان الرسالة
                </label>
                <input
                  type="text"
                  name="title"
                  className="form-control text-end"
                  placeholder="اكتب عنواناً واضحاً للرسالة"
                  required
                />
              </div>

              <div className="mb-3">
                <label
                  className="form-label fw-bold"
                  style={{ color: "#4B0082" }}
                >
                  نص الرسالة
                </label>
                <textarea
                  name="body"
                  className="form-control text-end"
                  rows="3"
                  placeholder="اكتب محتوى الرسالة هنا"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="form-label fw-bold"
                  style={{ color: "#4B0082" }}
                >
                  إلى من تريد إرسال الرسالة؟
                </label>
                <select
                  name="target"
                  className="form-select text-end"
                  defaultValue="الكل"
                >
                  <option value="الكل">الكل</option>
                  <option value="الطلاب">الطلاب فقط</option>
                  <option value="المدرسين">المدرسين فقط</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn w-100 py-2 fw-bold text-white"
                style={{
                  backgroundColor: "#16A34A",
                  borderRadius: "999px",
                  border: "none",
                  fontSize: "18px",
                }}
              >
                إرسال
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
