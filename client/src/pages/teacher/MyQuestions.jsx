import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import QuestionTable from './components/QuestionTable';
import { getQuestions, deleteQuestion as deleteQuestionAPI } from '../../services/api';

export default function MyQuestions() {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch questions from API
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError('');
      // apiCall returns data.data from ApiResponse, so response is already the array
      const questionsList = await getQuestions();
      // Ensure we have an array
      const questions = Array.isArray(questionsList) ? questionsList : [];
      console.log('Fetched questions:', questions.length); // Debug log
      setQuestions(questions);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء جلب الأسئلة');
      console.error('Error fetching questions:', err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Load questions on mount and when location changes
  useEffect(() => {
    fetchQuestions();
  }, [location.pathname]);

  // Listen for question added/updated/deleted events
  useEffect(() => {
    const handleQuestionChange = () => {
      fetchQuestions();
    };

    // Listen for custom events
    window.addEventListener('questionAdded', handleQuestionChange);
    window.addEventListener('questionUpdated', handleQuestionChange);
    window.addEventListener('questionDeleted', handleQuestionChange);
    
    return () => {
      window.removeEventListener('questionAdded', handleQuestionChange);
      window.removeEventListener('questionUpdated', handleQuestionChange);
      window.removeEventListener('questionDeleted', handleQuestionChange);
    };
  }, []);

  const handleEdit = (id) => {
    navigate(`/teacher/questions/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
      try {
        await deleteQuestionAPI(id);
        // Dispatch event to trigger refetch in Dashboard
        window.dispatchEvent(new CustomEvent('questionDeleted', { 
          detail: { questionId: id } 
        }));
        // Refresh the questions list after deletion
        await fetchQuestions();
        alert('تم حذف السؤال بنجاح');
      } catch (err) {
        alert('حدث خطأ أثناء حذف السؤال');
        console.error('Error deleting question:', err);
      }
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

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="card shadow-sm border-0">
            <div className="card-body p-4 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">جاري التحميل...</span>
              </div>
              <p className="mt-2 text-muted">جاري تحميل الأسئلة...</p>
            </div>
          </div>
        ) : (
          <div className="card shadow-sm border-0">
            <div className="card-body p-2 p-md-4">
              <QuestionTable
                questions={questions}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
