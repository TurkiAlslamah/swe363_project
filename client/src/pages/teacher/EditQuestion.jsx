import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionForm from './components/QuestionForm';
import { getQuestionById, updateQuestion } from './data/mockQuestions';

export default function EditQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const foundQuestion = getQuestionById(parseInt(id));
    if (foundQuestion) {
      setQuestion(foundQuestion);
    } else {
      alert('السؤال غير موجود');
      navigate('/teacher/questions');
    }
  }, [id, navigate]);

  const handleSubmit = (formData) => {
    if (!question) return;
    
    try {
      // Validate question number is a valid positive integer
      const questionOrder = parseInt(formData.questionOrder);
      if (isNaN(questionOrder) || questionOrder < 1) {
        alert('يجب أن يكون رقم السؤال رقماً صحيحاً أكبر من الصفر');
        return;
      }

      // Update question - automatic reordering will happen in mockQuestions.js
      // No duplicate check needed - reordering handles everything
      updateQuestion(parseInt(id), formData);
      setSuccessMessage('تم تحديث السؤال بنجاح! سيتم مراجعته من قبل المشرف.');
      setTimeout(() => {
        navigate('/teacher/questions');
      }, 2000);
    } catch (error) {
      alert('حدث خطأ أثناء تحديث السؤال');
    }
  };

  const handleCancel = () => {
    navigate('/teacher/questions');
  };

  if (!question) {
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

        <div className="card shadow-sm border-0">
          <div className="card-body p-3 p-md-4">
            <QuestionForm
              initialData={question}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

