// src/pages/admin/Reports.jsx
import React, { useState } from "react";

const MOCK_REPORTS = [
  {
    id: 501,
    questionId: 1,
    questionText: "أكمل النمط التالي: 113 ، 334 ، 551 ، ...",
    reporterName: "عبدالله",
    status: "open", // open | resolved | ignored
    createdAt: "2025-11-18",
    message: "أعتقد أن الحل الصحيح مختلف عن الموجود في النظام.",
  },
  {
    id: 502,
    questionId: 2,
    questionText: "ما هي مساحة المملكة العربية السعودية؟",
    reporterName: "سارة",
    status: "open",
    createdAt: "2025-11-19",
    message: "في خيارين متشابهين، يفضل توضيح الفرق.",
  },
];

export default function Reports() {
  const [reports, setReports] = useState(MOCK_REPORTS);

  const handleResolve = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r))
    );
    alert(`(تجريبي) تم وضع البلاغ #${id} كـ "تم الحل"`);
  };

  const handleIgnore = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "ignored" } : r))
    );
    alert(`(تجريبي) تم تجاهل البلاغ #${id}`);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "open":
        return { label: "مفتوح", bg: "#F59E0B" };
      case "resolved":
        return { label: "تم الحل", bg: "#16A34A" };
      case "ignored":
        return { label: "تم التجاهل", bg: "#6B7280" };
      default:
        return { label: status, bg: "#6B7280" };
    }
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
          بلاغات الأسئلة
        </h2>

        <div
          className="shadow-sm bg-white rounded-3 p-4"
          style={{ minHeight: "300px" }}
        >
          {reports.length === 0 ? (
            <p className="text-center text-muted mt-3">
              لا توجد بلاغات حالياً.
            </p>
          ) : (
            <table className="table align-middle text-end">
              <thead>
                <tr>
                  <th style={{ width: "8%" }}>رقم البلاغ</th>
                  <th style={{ width: "8%" }}>رقم السؤال</th>
                  <th style={{ width: "26%" }}>السؤال</th>
                  <th style={{ width: "20%" }}>نص البلاغ</th>
                  <th style={{ width: "10%" }}>المبلِّغ</th>
                  <th style={{ width: "10%" }}>التاريخ</th>
                  <th style={{ width: "8%" }}>الحالة</th>
                  <th style={{ width: "10%" }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => {
                  const { label, bg } = getStatusBadge(r.status);
                  return (
                    <tr key={r.id}>
                      <td>#{r.id}</td>
                      <td>#{r.questionId}</td>
                      <td style={{ whiteSpace: "pre-wrap" }}>
                        {r.questionText}
                      </td>
                      <td style={{ whiteSpace: "pre-wrap" }}>{r.message}</td>
                      <td>{r.reporterName}</td>
                      <td>{r.createdAt}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: bg,
                            padding: "6px 12px",
                            fontSize: "13px",
                          }}
                        >
                          {label}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-success btn-sm ms-2"
                          onClick={() => handleResolve(r.id)}
                          disabled={r.status === "resolved"}
                        >
                          تم الحل
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleIgnore(r.id)}
                          disabled={r.status === "ignored"}
                        >
                          تجاهل
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
