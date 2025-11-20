import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimesCircle, FaCheckCircle } from 'react-icons/fa';

export default function ReviewWrongAnswers() {
  const navigate = useNavigate();

  // Mock wrong answers - replace with API data
  const [questions] = useState([
    {
      id: 1,
      question_type: "جبر",
      question_text: "ما هو ناتج المعادلة: 2x + 5 = 15؟",
      question_image: null,
      options: [
        { id: "أ", text: "x = 5" },
        { id: "ب", text: "x = 10" },
        { id: "ج", text: "x = 7.5" },
        { id: "د", text: "x = 2.5" }
      ],
      correct_answer: "أ",
      user_answer: "ب",
      explanation: "نطرح 5 من الطرفين: 2x = 10، ثم نقسم على 2: x = 5"
    },
    {
      id: 2,
      question_type: "هندسة",
      question_text: "ما هي مساحة مثلث قاعدته 10 سم وارتفاعه 8 سم؟",
      question_image: null,
      options: [
        { id: "أ", text: "80 سم²" },
        { id: "ب", text: "40 سم²" },
        { id: "ج", text: "20 سم²" },
        { id: "د", text: "160 سم²" }
      ],
      correct_answer: "ب",
      user_answer: "أ",
      explanation: "مساحة المثلث = (القاعدة × الارتفاع) ÷ 2 = (10 × 8) ÷ 2 = 40 سم²"
    },
    {
      id: 3,
      question_type: "استيعاب المقروء",
      question_text: "ما هي الفكرة الرئيسية للنص؟",
      question_image: null,
      options: [
        { id: "أ", text: "أهمية القراءة" },
        { id: "ب", text: "فوائد التعليم" },
        { id: "ج", text: "التطور التكنولوجي" },
        { id: "د", text: "الثقافة العربية" }
      ],
      correct_answer: "أ",
      user_answer: "ج",
      explanation: "النص يركز على أهمية القراءة في بناء المعرفة"
    }
  ]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  const handleFinish = () => {
    navigate('/stats');
  };

  if (!currentQuestion) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" dir="rtl">
        <div className="text-center">
          <h3>لا توجد أسئلة خاطئة للمراجعة!</h3>
          <button onClick={() => navigate('/stats')} className="btn btn-primary mt-3">
            العودة للإحصائيات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" dir="rtl" style={{ backgroundColor: "#E8E5F5", paddingTop: "100px", paddingBottom: "50px" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button 
            onClick={() => navigate('/stats')} 
            className="btn text-white d-flex align-items-center gap-2"
            style={{ backgroundColor: "#DC3545", borderRadius: "12px", padding: "10px 20px" }}
          >
            <span>→</span>
            <span>العودة</span>
          </button>
          
          <div className="d-flex align-items-center gap-2">
            <FaTimesCircle className="text-danger" size={24} />
            <span className="fw-bold">مراجعة الإجابات الخاطئة</span>
          </div>
          
          <div className="text-muted">
            السؤال {currentQuestionIndex + 1} من {questions.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "15px" }}>
          <div className="card-body p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold">التقدم</span>
              <span className="text-muted">{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="progress" style={{ height: '10px', borderRadius: '10px' }}>
              <div 
                className="progress-bar bg-danger"
                style={{ 
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  borderRadius: '10px'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "20px", backgroundColor: "#FFFFFF" }}>
          <div className="card-body p-4">
            
            {/* Question Type Badge */}
            <div className="mb-3">
              <span className="badge bg-danger" style={{ fontSize: '14px', padding: '8px 16px', borderRadius: '8px' }}>
                {currentQuestion.question_type}
              </span>
            </div>

            {/* Question Text */}
            <div className="mb-4">
              <p className="mb-3" style={{ fontSize: "18px", lineHeight: "1.6", fontWeight: '500' }}>
                {currentQuestion.question_text}
              </p>
              
              {currentQuestion.question_image && (
                <div className="text-center mb-3">
                  <img 
                    src={currentQuestion.question_image} 
                    alt="question" 
                    className="img-fluid" 
                    style={{ maxHeight: "300px", borderRadius: "12px" }} 
                  />
                </div>
              )}
            </div>

            {/* Options */}
            <div className="d-flex flex-column gap-3 mb-4">
              {currentQuestion.options.map((option) => {
                const isUserAnswer = currentQuestion.user_answer === option.id;
                const isCorrectAnswer = option.id === currentQuestion.correct_answer;

                return (
                  <div
                    key={option.id}
                    className="p-3 d-flex align-items-center justify-content-between"
                    style={{
                      borderRadius: "12px",
                      border: isCorrectAnswer 
                        ? "2px solid #28A745" 
                        : isUserAnswer 
                        ? "2px solid #DC3545" 
                        : "2px solid #E5E7EB",
                      backgroundColor: isCorrectAnswer 
                        ? "#D4EDDA" 
                        : isUserAnswer 
                        ? "#F8D7DA" 
                        : "#FFFFFF"
                    }}
                  >
                    <div className="d-flex align-items-center gap-3 w-100">
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          backgroundColor: isCorrectAnswer 
                            ? "#28A745" 
                            : isUserAnswer 
                            ? "#DC3545" 
                            : "#F3F4F6",
                          color: (isCorrectAnswer || isUserAnswer) ? "#FFFFFF" : "#6B7280",
                          fontWeight: "bold",
                          fontSize: "18px"
                        }}
                      >
                        {option.id}
                      </div>
                      <span style={{ fontSize: "16px", flex: 1 }}>{option.text}</span>
                      {isCorrectAnswer && (
                        <div className="d-flex align-items-center gap-2">
                          <FaCheckCircle className="text-success" size={20} />
                          <span className="badge bg-success">الإجابة الصحيحة</span>
                        </div>
                      )}
                      {isUserAnswer && !isCorrectAnswer && (
                        <div className="d-flex align-items-center gap-2">
                          <FaTimesCircle className="text-danger" size={20} />
                          <span className="badge bg-danger">إجابتك</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation Section */}
            <div className="border-top pt-3">
              <button
                className="btn btn-outline-primary w-100 mb-3"
                onClick={() => setShowExplanation(!showExplanation)}
                style={{ borderRadius: '10px' }}
              >
                {showExplanation ? '🔽 إخفاء الشرح' : '📖 عرض الشرح'}
              </button>
              
              {showExplanation && currentQuestion.explanation && (
                <div className="alert alert-info" style={{ borderRadius: '12px' }}>
                  <h6 className="fw-bold mb-2">💡 الشرح:</h6>
                  <p className="mb-0">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="d-flex justify-content-between gap-3">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="btn btn-light px-4 py-2 d-flex align-items-center gap-2"
            style={{ borderRadius: "12px", fontWeight: "bold" }}
          >
            <span>→</span>
            <span>السابق</span>
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleFinish}
              className="btn btn-success px-4 py-2 d-flex align-items-center gap-2"
              style={{ borderRadius: "12px", fontWeight: "bold" }}
            >
              <span>إنهاء المراجعة</span>
              <span>✓</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn text-white px-4 py-2 d-flex align-items-center gap-2"
              style={{ backgroundColor: "#DC3545", borderRadius: "12px", fontWeight: "bold", border: "none" }}
            >
              <span>التالي</span>
              <span>←</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}