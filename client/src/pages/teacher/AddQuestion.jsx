import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionForm from './components/QuestionForm';
import { createQuestion } from '../../services/api';

export default function AddQuestion() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      // Create question via API - backend will assign q_no automatically
      await createQuestion(formData);
      
      setSuccessMessage('تم إضافة السؤال بنجاح! سيتم مراجعته من قبل المشرف.');
      setTimeout(() => {
        navigate('/teacher/questions');
      }, 2000);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء إضافة السؤال');
      console.error('Error adding question:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/teacher/questions');
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)",
      direction: "rtl",
      paddingTop: "80px"
    }}>
      <div className="container py-4 px-2 px-md-4">
        <h2 className="mb-4 fw-bold" style={{ color: "#6B46C1", fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}>
          إضافة سؤال جديد
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

        {loading && (
          <div className="alert alert-info" role="alert">
            جاري إضافة السؤال...
          </div>
        )}

        <div className="card shadow-sm border-0">
          <div className="card-body p-3 p-md-4">
            <QuestionForm
              initialData={null}
              onSubmit={handleSubmit}
              onCancel={handleClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
