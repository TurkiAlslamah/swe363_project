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
      // Ensure questionOrder is a number
      const questionOrder = parseInt(formData.questionOrder);
      const updatedData = {
        ...formData,
        questionOrder: (questionOrder && questionOrder > 0) ? questionOrder : question.questionOrder
      };
      updateQuestion(parseInt(id), updatedData);
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
        direction: "rtl"
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
      direction: "rtl"
    }}>
      
      <div className="container py-4">
        <h2 className="mb-4 fw-bold" style={{ color: "#6B46C1" }}>
          تعديل السؤال
        </h2>

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
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

