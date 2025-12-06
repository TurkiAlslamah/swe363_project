// src/pages/admin/ReviewQuestions.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/http";

export default function ReviewQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("قيد المراجعة"); // افتراضي: قيد المراجعة
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const statusOptions = [
    { value: "قيد المراجعة", label: "قيد المراجعة" },
    { value: "مقبول", label: "مقبول" },
    { value: "مرفوض", label: "مرفوض" },
    { value: "all", label: "الكل" },
  ];

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError("");

      try {
        const params = {};
        if (statusFilter !== "all") {
          params.status = statusFilter;
        }

        const res = await api.get("/admin/questions", { params });

        // نحاول نخمن شكل البيانات من الـ API
        const data =
          res.data?.data ||
          res.data?.questions ||
          res.data ||
          [];

        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading questions", err);
        setError("تعذّر تحميل الأسئلة من الخادم");
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [statusFilter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "مقبول":
        return { label: "مقبول", bg: "#16A34A" }; // أخضر
      case "مرفوض":
        return { label: "مرفوض", bg: "#DC2626" }; // أحمر
      case "قيد المراجعة":
      default:
        return { label: "قيد المراجعة", bg: "#F59E0B" }; // برتقالي
    }
  };

  const handleEdit = (question) => {
    const id = question._id || question.id || question.q_no;
    if (!id) {
      alert("لا يمكن فتح التعديل: رقم السؤال غير معروف");
      return;
    }

    navigate(`/admin/review/${id}/edit`, {
      state: { question }, // نرسل السؤال كامل لصفحة التعديل
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)",
        direction: "rtl",
        paddingTop: "80px",
      }}
    >
      <div className="container text-end">
        <h2
          className="fw-bold mb-4"
          style={{ color: "#4B0082", marginTop: "8px" }}
        >
          مراجعة الأسئلة
        </h2>

        {/* فلتر الحالة */}
        <div className="mb-3 d-flex justify-content-end">
          <select
            className="form-select"
            style={{ maxWidth: "220px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div
          className="shadow-sm bg-white rounded-3 p-4"
          style={{ minHeight: "300px" }}
        >
          {loading ? (
            <p className="text-center text-muted mt-3">جاري تحميل الأسئلة...</p>
          ) : error ? (
            <p className="text-center text-danger mt-3">{error}</p>
          ) : questions.length === 0 ? (
            <p className="text-center text-muted mt-3">
              لا توجد أسئلة مطابقة للفلتر الحالي.
            </p>
          ) : (
            <table className="table align-middle text-end">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>رقم السؤال</th>
                  <th style={{ width: "50%" }}>السؤال</th>
                  <th style={{ width: "15%" }}>الحالة</th>
                  <th style={{ width: "25%" }}>الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {questions.map((q) => {
                  const { label, bg } = getStatusStyle(q.status);

                  return (
                    <tr key={q._id || q.id || q.q_no}>
                      <td>#{q.q_no ?? q.id ?? q._id}</td>
                      <td style={{ whiteSpace: "pre-wrap" }}>
                        {q.question_text || q.text || "—"}
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: bg,
                            padding: "8px 14px",
                            fontSize: "14px",
                          }}
                        >
                          {label}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn text-white"
                          style={{
                            backgroundColor: "#0284C7",
                            minWidth: "90px",
                          }}
                          onClick={() => handleEdit(q)}
                        >
                          تعديل
                        </button>
                        {/* ✅ ما في اعتماد / رفض هنا، كلها صارت من داخل صفحة التعديل */}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
