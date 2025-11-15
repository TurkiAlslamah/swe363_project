import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TeacherNav from '../components/TeacherNav';
import QuestionTable from '../components/QuestionTable';
import { getQuestions, deleteQuestion } from '../data/mockQuestions';

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
      direction: "rtl"
    }}>
      <TeacherNav />
      
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0" style={{ color: "#6B46C1" }}>
            أسئلتي
          </h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/teacher/questions/add')}
            style={{ borderRadius: "8px" }}
          >
            <i className="bi bi-plus-circle me-1"></i>
            إضافة سؤال
          </button>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
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

