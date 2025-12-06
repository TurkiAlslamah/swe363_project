import React from 'react';

export default function QuestionTable({ questions, onEdit, onDelete }) {
  const getStatusBadge = (status) => {
    const statusColors = {
      "قيد المراجعة": "warning",
      "مقبول": "success",
      "مرفوض": "danger",
      "بانتظار موافقة المشرف": "info",
      "بانتظار مراجعة المشرف": "info"
    };
    const color = statusColors[status] || "secondary";
    return (
      <span className={`badge bg-${color}`}>
        {status || "قيد المراجعة"}
      </span>
    );
  };

  // Helper function to get question text for display
  const getQuestionText = (question) => {
    if (question.question_text) {
      return question.question_text;
    }
    if (question.question_image) {
      return "[صورة]";
    }
    return "[لا يوجد نص]";
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
            questions.map((question) => {
              const questionText = getQuestionText(question);
              const questionId = question._id || question.id;
              
              return (
                <tr key={questionId}>
                  <td style={{ whiteSpace: "nowrap" }}>{question.q_no || questionId}</td>
                  <td>
                    <div style={{ 
                      maxWidth: "100%",
                      wordBreak: "break-word",
                      overflowWrap: "break-word"
                    }}>
                      {questionText.length > 50
                        ? questionText.substring(0, 50) + "..."
                        : questionText}
                    </div>
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{getStatusBadge(question.status)}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onEdit(questionId)}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        تعديل
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(questionId)}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
