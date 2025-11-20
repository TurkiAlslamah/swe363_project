import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuestionTable from './components/QuestionTable';
import { getQuestions, deleteQuestion } from './data/mockQuestions';

export default function MyQuestions() {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState(getQuestions());

  // Refresh questions when component mounts or when returning from other pages
  useEffect(() => {
    setQuestions(getQuestions());
  }, [location.pathname]);

  const handleEdit = (id) => {
    navigate(`/teacher/questions/edit/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      deleteQuestion(id);
      // Refresh the questions list after deletion
      setQuestions(getQuestions());
      alert('تم حذف السؤال بنجاح');
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)",
      direction: "rtl",
      paddingTop: "80px"
    }}>
      <div className="container py-4 px-2 px-md-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-2">
          <h2 className="fw-bold mb-0" style={{ color: "#6B46C1", fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}>
            أسئلتي
          </h2>
          <button
            className="btn btn-primary w-100 w-sm-auto"
            onClick={() => navigate('/teacher/questions/add')}
            style={{ borderRadius: "8px", whiteSpace: "nowrap" }}
          >
            <i className="bi bi-plus-circle me-1"></i>
            إضافة سؤال
          </button>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-2 p-md-4">
            <QuestionTable
              questions={questions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

