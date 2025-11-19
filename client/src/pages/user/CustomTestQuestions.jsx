import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';

export default function CustomTestQuestions() {
  const navigate = useNavigate();
  const location = useLocation();
  const testSettings = location.state || {};

  // Generate questions based on selected topics
  const generateQuestions = () => {
    const allQuestions = [
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
        correct_answer: "أ"
      },
      {
        id: 2,
        question_type: "جبر",
        question_text: "إذا كان 3y - 4 = 11، فما قيمة y؟",
        question_image: null,
        options: [
          { id: "أ", text: "y = 3" },
          { id: "ب", text: "y = 5" },
          { id: "ج", text: "y = 7" },
          { id: "د", text: "y = 4" }
        ],
        correct_answer: "ب"
      },
      {
        id: 3,
        question_type: "جبر",
        question_text: "حل المعادلة: 5x - 10 = 20",
        question_image: null,
        options: [
          { id: "أ", text: "x = 4" },
          { id: "ب", text: "x = 6" },
          { id: "ج", text: "x = 8" },
          { id: "د", text: "x = 10" }
        ],
        correct_answer: "ب"
      }
    ];

    // Get number of questions from settings
    const algebraCount = testSettings.quantTopics?.algebra || 0;
    return allQuestions.slice(0, algebraCount);
  };

  const [questions] = useState(generateQuestions());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(() => {
    const timePerQuestion = testSettings.settings?.timePerQuestion || 30;
    const totalQuestions = questions.length;
    return timePerQuestion * totalQuestions;
  });
  const [testStarted] = useState(true);
  const isTimedTest = testSettings.settings?.timed !== false;

  // Timer countdown with auto-finish
  useEffect(() => {
  if (!testStarted || !isTimedTest) return; // إيقاف المؤقت إذا كان غير مفعل

  if (timeLeft <= 0) {
    handleFinishTest();
    return;
  }

  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(timer);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [timeLeft, testStarted, isTimedTest]);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];

  const handleAnswerSelect = (optionId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionId
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinishTest = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_answer) {
        score++;
      }
    });

    const timePerQuestion = testSettings.settings?.timePerQuestion || 30;
    const initialTime = timePerQuestion * questions.length;
    const timeTaken = initialTime - timeLeft;

    navigate('/test-result', {
      state: {
        score,
        total: questions.length,
        timeTaken,
        answers: selectedAnswers,
        questions: questions
      },
      replace: true
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if no questions
  if (!questions || questions.length === 0) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" dir="rtl">
        <div className="text-center">
          <h3>لم تقم باختيار أي أسئلة!</h3>
          <p className="text-muted">يرجى العودة واختيار عدد الأسئلة</p>
          <button onClick={() => navigate('/exams/custom')} className="btn btn-primary mt-3">
            العودة للاختبارات
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" dir="rtl">
        <div className="text-center">
          <h3>لا توجد أسئلة متاحة</h3>
          <button onClick={() => navigate('/exams/custom')} className="btn btn-primary mt-3">
            العودة للاختبارات
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" dir="rtl" style={{ backgroundColor: "#E8E5F5", paddingTop: "100px", paddingBottom: "50px" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        
        {/* Header with Timer and Progress */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "20px", backgroundColor: "#FFFFFF" }}>
          <div className="card-body p-3">
            <div className="row align-items-center">
              {/* Timer */}
              {isTimedTest && (
                <div className="col-md-4">
                    <div className="d-flex align-items-center gap-3">
                    <div 
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{ 
                        width: '50px', 
                        height: '50px', 
                        background: timeLeft < 30 ? '#DC3545' : '#4B0082',
                        color: 'white'
                        }}
                    >
                        <FaClock size={24} />
                    </div>
                    <div>
                        <div className="fw-bold" style={{ fontSize: '1.5rem', color: timeLeft < 30 ? '#DC3545' : '#4B0082' }}>
                        {formatTime(timeLeft)}
                        </div>
                        <small className="text-muted">الوقت المتبقي</small>
                    </div>
                    </div>
                </div>
                )}

              {/* Progress */}
              <div className={isTimedTest ? "col-md-8" : "col-md-12"}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold">السؤال {currentQuestionIndex + 1} من {questions.length}</span>
                  <span className="text-muted">{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="progress" style={{ height: '10px', borderRadius: '10px' }}>
                  <div 
                    className="progress-bar"
                    style={{ 
                      width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                      backgroundColor: '#4B0082',
                      borderRadius: '10px'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "20px", backgroundColor: "#FFFFFF" }}>
          <div className="card-body p-4">
            
            {/* Question Type Badge */}
            <div className="mb-3">
              <span className="badge" style={{ backgroundColor: '#A855F7', fontSize: '14px', padding: '8px 16px', borderRadius: '8px' }}>
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
            <div className="d-flex flex-column gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
                    className="btn text-end p-3 d-flex align-items-center justify-content-between"
                    style={{
                      borderRadius: "12px",
                      border: isSelected ? "2px solid #4B0082" : "2px solid #E5E7EB",
                      backgroundColor: isSelected ? "#F3E5F5" : "#FFFFFF",
                      transition: "all 0.3s",
                      cursor: "pointer"
                    }}
                  >
                    <div className="d-flex align-items-center gap-3 w-100">
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          backgroundColor: isSelected ? "#4B0082" : "#F3F4F6",
                          color: isSelected ? "#FFFFFF" : "#6B7280",
                          fontWeight: "bold",
                          fontSize: "18px"
                        }}
                      >
                        {option.id}
                      </div>
                      <span style={{ fontSize: "16px", flex: 1 }}>{option.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Questions Overview */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "20px", backgroundColor: "#FFFFFF" }}>
          <div className="card-body p-3">
            <h6 className="mb-3 fw-bold">نظرة عامة على الأسئلة</h6>
            <div className="d-flex flex-wrap gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={`btn ${
                    selectedAnswers[index] !== undefined
                      ? 'text-white'
                      : currentQuestionIndex === index
                      ? 'text-white'
                      : ''
                  }`}
                  style={{ 
                    width: '45px', 
                    height: '45px', 
                    borderRadius: '8px',
                    backgroundColor: selectedAnswers[index] !== undefined
                      ? '#28A745'
                      : currentQuestionIndex === index
                      ? '#4B0082'
                      : '#F3F4F6',
                    border: 'none',
                    fontWeight: 'bold',
                    color: (selectedAnswers[index] !== undefined || currentQuestionIndex === index) ? 'white' : '#6B7280'
                  }}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
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
              onClick={handleFinishTest}
              className="btn text-white px-4 py-2 d-flex align-items-center gap-2"
              style={{ backgroundColor: "#28A745", borderRadius: "12px", fontWeight: "bold", border: "none" }}
            >
              <span>إنهاء الاختبار</span>
              <span>✓</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn text-white px-4 py-2 d-flex align-items-center gap-2"
              style={{ backgroundColor: "#4B0082", borderRadius: "12px", fontWeight: "bold", border: "none" }}
            >
              <span>التالي</span>
              <span>←</span>
            </button>
          )}
        </div>

        {/* Warning when time is low */}
        {timeLeft <= 30 && timeLeft > 0 && (
          <div className="alert alert-danger mt-3 text-center" role="alert">
             تبقى أقل من 30 ثانية! سيتم إنهاء الاختبار تلقائياً
          </div>
        )}
      </div>
    </div>
  );
}