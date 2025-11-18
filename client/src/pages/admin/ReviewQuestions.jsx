import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const INITIAL_QUESTIONS = [
  {
    id: 111,
    text: "أكمل النمط التالي: 113 ، 334 ، 551 ، ...",
    status: "active",      // active | pending | rejected
  },
  {
    id: 112,
    text: "ما هي مساحة المملكة العربية السعودية؟",
    status: "pending",
  },
];

export default function ReviewQuestions() {
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const navigate = useNavigate();

  const getStatusStyle = (status) => {
    switch (status) {
      case "active":
        return { label: "فعال", bg: "#16A34A" };
      case "pending":
        return { label: "قيد المراجعة", bg: "#F59E0B" };
      case "rejected":
        return { label: "مرفوض", bg: "#DC2626" };
      default:
        return { label: status, bg: "#6b7280" };
    }
  };

  const approveQuestion = (id) => {
    // تجريبي: نحدّث الحالة في الواجهة فقط
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status: "active" } : q
      )
    );
    alert("(تجريبي) تم اعتماد السؤال #" + id);
  };

  const rejectQuestion = (id) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, status: "rejected" } : q
      )
    );
    alert("(تجريبي) تم رفض السؤال #" + id);
  };

  const editQuestion = (id) => {
    // لاحقاً: أنشئ صفحة EditQuestionAdmin وربطها بهذا المسار
    navigate(`/admin/review/${id}/edit`);
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
        {/* العنوان */}
        <h2
          className="fw-bold mb-4"
          style={{ color: "#4B0082", marginTop: "8px" }}
        >
          مراجعة الأسئلة
        </h2>

        {/* الكرت الأبيض */}
        <div
          className="shadow-sm bg-white rounded-3 p-4"
          style={{ minHeight: "300px" }}
        >
          {questions.length === 0 ? (
            <p className="text-center text-muted mt-3">
              لا توجد أسئلة قيد المراجعة حالياً.
            </p>
          ) : (
            <table className="table align-middle text-end">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>رقم السؤال</th>
                  <th style={{ width: "50%" }}>السؤال</th>
                  <th style={{ width: "10%" }}>الحالة</th>
                  <th style={{ width: "30%" }}>الإجراءات</th>
                </tr>
              </thead>

              <tbody>
                {questions.map((q) => {
                  const { label, bg } = getStatusStyle(q.status);
                  return (
                    <tr key={q.id}>
                      <td>#{q.id}</td>

                      {/* نص السؤال */}
                      <td style={{ whiteSpace: "pre-wrap" }}>{q.text}</td>

                      {/* حالة السؤال */}
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

                      {/* الأزرار */}
                      <td>
                        <button
                          className="btn text-white ms-2"
                          style={{
                            backgroundColor: "#0284C7",
                            minWidth: "90px",
                          }}
                          onClick={() => editQuestion(q.id)}
                        >
                          تعديل
                        </button>

                        <button
                          className="btn text-white ms-2"
                          style={{
                            backgroundColor: "#16A34A",
                            minWidth: "90px",
                          }}
                          onClick={() => approveQuestion(q.id)}
                        >
                          اعتماد
                        </button>

                        <button
                          className="btn text-white"
                          style={{
                            backgroundColor: "#DC2626",
                            minWidth: "90px",
                          }}
                          onClick={() => rejectQuestion(q.id)}
                        >
                          رفض
                        </button>
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

