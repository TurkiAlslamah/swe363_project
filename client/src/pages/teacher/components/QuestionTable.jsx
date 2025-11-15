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
    <div className="table-responsive" style={{ direction: "rtl" }}>
      <table className="table table-hover">
        <thead>
          <tr>
            <th style={{ color: "#6B46C1", fontWeight: "bold" }}>رقم السؤال</th>
            <th style={{ color: "#6B46C1", fontWeight: "bold" }}>السؤال</th>
            <th style={{ color: "#6B46C1", fontWeight: "bold" }}>الحالة</th>
            <th style={{ color: "#6B46C1", fontWeight: "bold" }}>الإجراءات</th>
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
                <td>{question.questionOrder || question.id}</td>
                <td>
                  {question.questionText.length > 50
                    ? question.questionText.substring(0, 50) + "..."
                    : question.questionText}
                </td>
                <td>{getStatusBadge(question.status)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => onEdit(question.id)}
                  >
                    تعديل
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(question.id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

