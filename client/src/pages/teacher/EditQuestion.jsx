import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionForm from './components/QuestionForm';
import { getQuestionById, updateQuestion } from '../../services/api';

export default function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestion();
  }, [id]);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      const response = await getQuestionById(id);
      setQuestion(response.data);
    } catch (err) {
      setError(err.message || 'السؤال غير موجود');
      console.error('Error loading question:', err);
      setTimeout(() => {
        navigate('/teacher/questions');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    if (!question) return;
    
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      // Update question via API
      await updateQuestion(id, formData);
      
      setSuccessMessage('تم تحديث السؤال بنجاح! سيتم مراجعته من قبل المشرف.');
      
      // Dispatch event to trigger refetch in MyQuestions
      window.dispatchEvent(new Event('questionAdded'));
      
      setTimeout(() => {
        navigate('/teacher/questions');
      }, 2000);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تحديث السؤال');
      console.error('Error updating question:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/teacher/questions');
  };

  if (loading && !question) {
    return (
      <div style={{ 
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)",
        direction: "rtl",
        paddingTop: "80px"
      }}>
        <div className="container py-4">
          <div className="text-center">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (error && !question) {
    return (
      <div style={{ 
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)",
        direction: "rtl",
        paddingTop: "80px"
      }}>
        <div className="container py-4">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)",
      direction: "rtl",
      paddingTop: "80px"
    }}>
      <div className="container py-4 px-2 px-md-4">
        <h2 className="mb-4 fw-bold" style={{ color: "#6B46C1", fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}>
          تعديل السؤال
        </h2>

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading && question && (
          <div className="alert alert-info" role="alert">
            جاري تحديث السؤال...
          </div>
        )}

        <div className="card shadow-sm border-0">
          <div className="card-body p-3 p-md-4">
            {question && (
              <QuestionForm
                initialData={question}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
