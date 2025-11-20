import React from 'react';

export default function QuestionTable({ questions, onEdit, onDelete }) {
  const getStatusBadge = (status) => {
    const statusColors = {
      "مراجعة": "warning",
      "مقبول": "success",
      "مرفوض": "danger",
      "بانتظار موافقة المشرف": "info",
      "بانتظار مراجعة المشرف": "info"
    };
    const color = statusColors[status] || "secondary";
    return (
      <span className={`badge bg-${color}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="table-responsive" style={{ direction: "rtl", overflowX: "auto" }}>
      <table className="table table-hover mb-0">
        <thead>
          <tr>
            <th style={{ color: "#6B46C1", fontWeight: "bold", whiteSpace: "nowrap", minWidth: "80px" }}>
              رقم السؤال
            </th>
            <th style={{ color: "#6B46C1", fontWeight: "bold", minWidth: "200px" }}>
              السؤال
            </th>
            <th style={{ color: "#6B46C1", fontWeight: "bold", whiteSpace: "nowrap", minWidth: "120px" }}>
              الحالة
            </th>
            <th style={{ color: "#6B46C1", fontWeight: "bold", whiteSpace: "nowrap", minWidth: "140px" }}>
              الإجراءات
            </th>
          </tr>
        </thead>
        <tbody>
          {questions.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-muted py-4">
                لا توجد أسئلة
              </td>
            </tr>
          ) : (
            questions.map((question) => (
              <tr key={question.id}>
                <td style={{ whiteSpace: "nowrap" }}>{question.questionOrder || question.id}</td>
                <td>
                  <div style={{ 
                    maxWidth: "100%",
                    wordBreak: "break-word",
                    overflowWrap: "break-word"
                  }}>
                    {question.questionText.length > 50
                      ? question.questionText.substring(0, 50) + "..."
                      : question.questionText}
                  </div>
                </td>
                <td style={{ whiteSpace: "nowrap" }}>{getStatusBadge(question.status)}</td>
                <td>
                  <div className="d-flex flex-wrap gap-1">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => onEdit(question.id)}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      تعديل
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDelete(question.id)}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

