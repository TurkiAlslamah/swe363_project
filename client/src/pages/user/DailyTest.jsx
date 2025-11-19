import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaCalendarDay } from 'react-icons/fa';

export default function DailyTest() {
  const navigate = useNavigate();

  // Daily question - changes every day
  const [question] = useState({
    id: 1,
    question_type: "جبر",
    question_text: "ما هو ناتج المعادلة: 4x - 8 = 12؟",
    question_image: null,
    options: [
      { id: "أ", text: "x = 3" },
      { id: "ب", text: "x = 5" },
      { id: "ج", text: "x = 7" },
      { id: "د", text: "x = 4" }
    ],
    correct_answer: "ب"
  });

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60); // 1 minute for daily test
  const [testStarted] = useState(true);

  // Timer countdown
  useEffect(() => {
    if (!testStarted || timeLeft <= 0) {
      if (timeLeft === 0) {
        handleFinishTest();
      }
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
  }, [timeLeft, testStarted]);

  const handleAnswerSelect = (optionId) => {
    setSelectedAnswer(optionId);
  };

  const handleFinishTest = () => {
    const score = selectedAnswer === question.correct_answer ? 1 : 0;
    const timeTaken = 60 - timeLeft;

    navigate('/test-result', {
      state: {
        score,
        total: 1,
        timeTaken,
        answers: { 0: selectedAnswer },
        questions: [question]
      },
      replace: true
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-vh-100" dir="rtl" style={{ backgroundColor: "#E8E5F5", paddingTop: "100px", paddingBottom: "50px" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        
        {/* Header - Daily Test Badge */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill" style={{ backgroundColor: '#4B0082', color: 'white' }}>
            <FaCalendarDay size={20} />
            <span className="fw-bold">الاختبار اليومي</span>
          </div>
          <p className="text-muted mt-2">سؤال واحد - دقيقة واحدة</p>
        </div>

        {/* Timer Card */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "20px", backgroundColor: "#FFFFFF" }}>
          <div className="card-body p-3">
            <div className="d-flex justify-content-center align-items-center">
              <div className="d-flex align-items-center gap-3">
                <div 
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    background: timeLeft < 20 ? '#DC3545' : '#4B0082',
                    color: 'white'
                  }}
                >
                  <FaClock size={24} />
                </div>
                <div>
                  <div className="fw-bold" style={{ fontSize: '1.5rem', color: timeLeft < 20 ? '#DC3545' : '#4B0082' }}>
                    {formatTime(timeLeft)}
                  </div>
                  <small className="text-muted">الوقت المتبقي</small>
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
                {question.question_type}
              </span>
            </div>

            {/* Question Text */}
            <div className="mb-4">
              <p className="mb-3" style={{ fontSize: "18px", lineHeight: "1.6", fontWeight: '500' }}>
                {question.question_text}
              </p>
              
              {question.question_image && (
                <div className="text-center mb-3">
                  <img 
                    src={question.question_image} 
                    alt="question" 
                    className="img-fluid" 
                    style={{ maxHeight: "300px", borderRadius: "12px" }} 
                  />
                </div>
              )}
            </div>

            {/* Options */}
            <div className="d-flex flex-column gap-3">
              {question.options.map((option) => {
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

        {/* Submit Button */}
        <div className="d-grid">
          <button
            onClick={handleFinishTest}
            disabled={!selectedAnswer}
            className="btn text-white btn-lg"
            style={{ 
              backgroundColor: selectedAnswer ? "#28A745" : "#6c757d", 
              borderRadius: "12px", 
              fontWeight: "bold", 
              border: "none",
              cursor: selectedAnswer ? "pointer" : "not-allowed"
            }}
          >
            إنهاء الاختبار اليومي ✓
          </button>
        </div>

        {/* Warning when time is low */}
        {timeLeft <= 20 && timeLeft > 0 && (
          <div className="alert alert-danger mt-3 text-center" role="alert">
            ⚠️ تبقى أقل من 20 ثانية! سيتم إنهاء الاختبار تلقائياً
          </div>
        )}
      </div>
    </div>
  );
}