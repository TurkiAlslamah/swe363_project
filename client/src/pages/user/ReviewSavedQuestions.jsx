import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function ReviewSavedQuestions() {
  const navigate = useNavigate();
  

  // Mock saved questions - replace with API data
  // These are questions the user previously saved (bookmarked) and answered
  const [questions] = useState([
    {
      id: 1,
      question_type: "جبر",
      question_text: "ما هو ناتج المعادلة: 3x - 7 = 20؟",
      question_image: null,
      options: [
        { id: "أ", text: "x = 9" },
        { id: "ب", text: "x = 7" },
        { id: "ج", text: "x = 13" },
        { id: "د", text: "x = 6" }
      ],
      correct_answer: "أ",
      user_answer: "أ", // User got this correct
      explanation: "نضيف 7 للطرفين: 3x = 27، ثم نقسم على 3: x = 9"
    },
    {
      id: 2,
      question_type: "هندسة",
      question_text: "ما هو محيط دائرة نصف قطرها 7 سم؟ (π ≈ 3.14)",
      question_image: null,
      options: [
        { id: "أ", text: "44 سم" },
        { id: "ب", text: "22 سم" },
        { id: "ج", text: "154 سم" },
        { id: "د", text: "49 سم" }
      ],
      correct_answer: "أ",
      user_answer: "ب", // User got this wrong
      explanation: "محيط الدائرة = 2πr = 2 × 3.14 × 7 = 43.96 ≈ 44 سم"
    },
    {
      id: 3,
      question_type: "لغة عربية",
      question_text: "ما هو المفعول به في الجملة: 'قرأ الطالب الكتاب'؟",
      question_image: null,
      options: [
        { id: "أ", text: "الطالب" },
        { id: "ب", text: "الكتاب" },
        { id: "ج", text: "قرأ" },
        { id: "د", text: "لا يوجد" }
      ],
      correct_answer: "ب",
      user_answer: "ب", // User got this correct
      explanation: "المفعول به هو 'الكتاب' لأنه وقع عليه فعل القراءة"
    },
    {
      id: 4,
      question_type: "حساب",
      question_text: "ما هو ناتج: 15% من 200؟",
      question_image: null,
      options: [
        { id: "أ", text: "30" },
        { id: "ب", text: "15" },
        { id: "ج", text: "45" },
        { id: "د", text: "20" }
      ],
      correct_answer: "أ",
      user_answer: "ج", // User got this wrong
      explanation: "15% من 200 = (15/100) × 200 = 30"
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
          <h3>لا توجد أسئلة محفوظة للمراجعة!</h3>
          <button onClick={() => navigate('/stats')} className="btn btn-primary mt-3">
            العودة للإحصائيات
          </button>
        </div>
      </div>
    );
  }

  // Check if user got this question correct
  const isCorrect = currentQuestion.user_answer === currentQuestion.correct_answer;
  

  return (
    <div className="min-vh-100" dir="rtl" style={{ backgroundColor: "#E8F4F8", paddingTop: "100px", paddingBottom: "50px" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button 
            onClick={() => navigate('/stats')} 
            className="btn btn-primary d-flex align-items-center gap-2"
            style={{ borderRadius: "12px", padding: "10px 20px" }}
          >
            <span>→</span>
            <span>العودة</span>
          </button>
          
          <div className="d-flex align-items-center gap-2">
            <FaBook className="text-primary" size={24} />
            <span className="fw-bold">مراجعة الأسئلة المحفوظة</span>
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
                className="progress-bar bg-primary"
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
            
            {/* Question Type Badge & Status */}
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <span className="badge bg-primary" style={{ fontSize: '14px', padding: '8px 16px', borderRadius: '8px' }}>
                {currentQuestion.question_type}
              </span>
              {isCorrect ? (
                <span className="badge bg-success" style={{ fontSize: '14px', padding: '8px 16px', borderRadius: '8px' }}>
                  <FaCheckCircle className="me-1" />
                  إجابة صحيحة
                </span>
              ) : (
                <span className="badge bg-danger" style={{ fontSize: '14px', padding: '8px 16px', borderRadius: '8px' }}>
                  <FaTimesCircle className="me-1" />
                  إجابة خاطئة
                </span>
              )}
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
                <div 
                  className="alert" 
                  style={{ 
                    borderRadius: '12px',
                    backgroundColor: isCorrect ? '#D4EDDA' : '#F8D7DA',
                    borderColor: isCorrect ? '#28A745' : '#DC3545',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                  }}
                >
                  <div className="d-flex align-items-start gap-2 mb-2">
                    {isCorrect ? (
                      <>
                        <FaCheckCircle className="text-success mt-1" size={20} />
                        <h6 className="fw-bold mb-0 text-success">أحسنت! إجابتك صحيحة 🎉</h6>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-danger mt-1" size={20} />
                        <h6 className="fw-bold mb-0 text-danger">الإجابة الصحيحة: {currentQuestion.correct_answer}</h6>
                      </>
                    )}
                  </div>
                  <h6 className="fw-bold mb-2 mt-3">💡 الشرح:</h6>
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
              className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2"
              style={{ borderRadius: "12px", fontWeight: "bold" }}
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