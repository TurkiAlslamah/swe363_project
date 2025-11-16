import React, { useState } from "react";


export default function ReviewQuestions() {
  const MOCK_QUESTIONS = [
    {
      id: 111,
      text: "أكمل النمط التالي: 113 ، 334 ، 551 ، ...",
      status: "فعال",
    },
  ];

  const [questions, setQuestions] = useState(MOCK_QUESTIONS);

  const approveQuestion = (id) => {
    alert("(تجريبي) تم اعتماد السؤال #" + id);
  };

  const rejectQuestion = (id) => {
    alert("(تجريبي) تم رفض السؤال #" + id);
  };

  const editQuestion = (id) => {
    alert("(تجريبي) تعديل السؤال #" + id);
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
        
        {/* 🔹 شريط الأدمن */}
     
        {/* 🔹 عنوان الصفحة */}
        <h2
          className="fw-bold mb-4"
          style={{ color: "#4B0082", marginTop: "8px" }}
        >
          مراجعة الأسئلة
        </h2>

        {/* 🔹 الكرت الأبيض */}
        <div
          className="shadow-sm bg-white rounded-3 p-4"
          style={{ minHeight: "300px" }}
        >
          {/* 🔹 رأس الجدول */}
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
              {questions.map((q) => (
                <tr key={q.id}>
                  <td>#{q.id}</td>

                  {/* نص السؤال */}
                  <td style={{ whiteSpace: "pre-wrap" }}>{q.text}</td>

                  {/* حالة السؤال */}
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: "#16A34A",
                        padding: "8px 14px",
                        fontSize: "14px",
                      }}
                    >
                      {q.status}
                    </span>
                  </td>

                  {/* الأزرار */}
                  <td>
                    <button
                      className="btn text-white ms-2"
                      style={{ backgroundColor: "#0284C7", minWidth: "90px" }}
                      onClick={() => editQuestion(q.id)}
                    >
                      تعديل
                    </button>

                    <button
                      className="btn text-white ms-2"
                      style={{ backgroundColor: "#16A34A", minWidth: "90px" }}
                      onClick={() => approveQuestion(q.id)}
                    >
                      اعتماد
                    </button>

                    <button
                      className="btn text-white"
                      style={{ backgroundColor: "#DC2626", minWidth: "90px" }}
                      onClick={() => rejectQuestion(q.id)}
                    >
                      رفض
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
