import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionForm from './components/QuestionForm';
import { addQuestion, getNextAvailableQuestionNumber } from './data/mockQuestions';

export default function AddQuestion() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [nextQuestionNumber, setNextQuestionNumber] = useState(1);

  useEffect(() => {
    // Get the next available question number when component mounts
    setNextQuestionNumber(getNextAvailableQuestionNumber());
  }, []);

  const handleSubmit = (formData) => {
    try {
      // Validate question number is a valid positive integer
      const questionOrder = parseInt(formData.questionOrder);
      if (isNaN(questionOrder) || questionOrder < 1) {
        alert('يجب أن يكون رقم السؤال رقماً صحيحاً أكبر من الصفر');
        return;
      }

      // Add question - automatic reordering will happen in mockQuestions.js
      // No duplicate check needed - reordering handles everything
      addQuestion(formData);
      setSuccessMessage('تم إضافة السؤال بنجاح! سيتم مراجعته من قبل المشرف.');
      setTimeout(() => {
        navigate('/teacher/questions');
      }, 2000);
    } catch (error) {
      alert('حدث خطأ أثناء إضافة السؤال');
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

        <div className="card shadow-sm border-0">
          <div className="card-body p-3 p-md-4">
            <QuestionForm
              initialData={{ questionOrder: nextQuestionNumber }}
              onSubmit={handleSubmit}
              onCancel={handleClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

