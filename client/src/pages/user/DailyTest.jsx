import { useState, useEffect,useRef  } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaCalendarDay } from 'react-icons/fa';

const API_URL = "http://localhost:5005/api";
const getToken = () => localStorage.getItem("token");

export default function DailyTest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [examId, setExamId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
   const hasStarted = useRef(false); 

  useEffect(() => {
    if (!hasStarted.current) { 
      hasStarted.current = true;
      startDailyTest();
    }
  }, []);


  const startDailyTest = async () => {
  try {
    console.log("🚀 Starting exam...");
    
    const res = await fetch(`${API_URL}/exams/daily`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}` 
      }
    });

    console.log("📡 Response status:", res.status);
    const data = await res.json();
    console.log("📦 Full response:", data);
    console.log("🆔 Exam ID:", data.data?.exam_id);

    if (data.success && data.data && data.data.exam_id) {
      console.log("✅ Setting exam ID:", data.data.exam_id);
      setExamId(data.data.exam_id);
      
      const formattedQuestions = data.data.questions.map(q => ({
        id: q._id,
        question_type: q.internal_name || "",
        question_text: q.question_text,
        question_image: q.question_image,
        is_comparable: q.is_comparable,
        comparable_option1_text: q.comparable_option1_text,
        comparable_option2_text: q.comparable_option2_text,
        have_visualization: q.have_visualization,
        visualization_image_url: q.visualization_image_url,
        options: [
          { id: "a", text: q.mc_a },
          { id: "b", text: q.mc_b },
          { id: "c", text: q.mc_c },
          { id: "d", text: q.mc_d }
        ],
        correct_answer: q.correct_answer
      }));

      console.log("📝 Questions count:", formattedQuestions.length);
      setQuestions(formattedQuestions);
      setTimeLeft(60 * formattedQuestions.length);
      setTestStarted(true);
    } else {
      console.error("❌ Failed:", data);
      setError(data.message || 'فشل في تحميل الاختبار اليومي');
    }
  } catch (err) {
    console.error('❌ Error:', err);
    setError('حدث خطأ أثناء تحميل السؤال اليومي');
  } finally {
    setLoading(false);
  }
};

 useEffect(() => {
  if (!testStarted || timeLeft === null || timeLeft <= 0) { 
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

  const handleFinishTest = async () => {
  console.log("🏁 Finishing test...");
  console.log("🆔 Current examId:", examId);
  
  if (!examId) {
    console.error("❌ No exam ID!");
    alert('خطأ: معرف الاختبار غير موجود');
    return;
  }

  try {
    const initialTime = 60 * questions.length;
    const timeTaken = initialTime - timeLeft;

    // Don't send null answers - only send answered questions
    const answers = questions
      .map((q, index) => ({
        question_id: q.id, // This should be the _id from MongoDB
        user_answer: selectedAnswers[index]
      }))
      .filter(a => a.user_answer !== undefined); // Remove unanswered

    console.log("📤 Submitting answers:", answers);

    const res = await fetch(`${API_URL}/exams/${examId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        time_spent: timeTaken,
        answers: answers
      })
    });

    console.log("📡 Submit response status:", res.status);
    const data = await res.json();
    console.log("📦 Submit response:", data);

    if (data.success) {
      navigate('/test-result', {
        state: {
          score: data.data.correct_count,
          total: data.data.total_questions,
          percentage: data.data.score_percentage,
          timeTaken: data.data.time_spent,
          examId: examId
        },
        replace: true
      });
    } else {
      alert('فشل في تسليم الاختبار: ' + data.message);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('حدث خطأ أثناء إنهاء الاختبار');
  }
};

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" dir="rtl">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
          <p className="text-muted">جاري تحميل السؤال اليومي...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" dir="rtl">
        <div className="text-center">
          <div className="alert alert-danger" role="alert">
            <h4>حدث خطأ</h4>
            <p>{error}</p>
          </div>
          <button onClick={() => navigate('/exams')} className="btn btn-primary mt-3">
            العودة للاختبارات
          </button>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" dir="rtl">
        <div className="text-center">
          <h3>لا توجد أسئلة متاحة</h3>
          <button onClick={() => navigate('/exams')} className="btn btn-primary mt-3">
            العودة للاختبارات
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestionIndex];

  return (
    <div className="min-vh-100" dir="rtl" style={{ backgroundColor: "#E8E5F5", paddingTop: "100px", paddingBottom: "50px" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill" style={{ backgroundColor: '#4B0082', color: 'white' }}>
            <FaCalendarDay size={20} />
            <span className="fw-bold">الاختبار اليومي</span>
          </div>
          <p className="text-muted mt-2">{questions.length} سؤال - {questions.length} دقيقة</p>
        </div>

        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "20px", backgroundColor: "#FFFFFF" }}>
          <div className="card-body p-3">
            <div className="row align-items-center">
              <div className="col-md-4">
                <div className="d-flex align-items-center gap-3">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{ 
                      width: '50px', 
                      height: '50px', 
                      background: timeLeft < 60 ? '#DC3545' : '#4B0082',
                      color: 'white'
                    }}
                  >
                    <FaClock size={24} />
                  </div>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '1.5rem', color: timeLeft < 60 ? '#DC3545' : '#4B0082' }}>
                      {formatTime(timeLeft)}
                    </div>
                    <small className="text-muted">الوقت المتبقي</small>
                  </div>
                </div>
              </div>

              <div className="col-md-8">
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

        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "20px", backgroundColor: "#FFFFFF" }}>
          <div className="card-body p-4">
            
            <div className="mb-3">
              <span className="badge" style={{ backgroundColor: '#A855F7', fontSize: '14px', padding: '8px 16px', borderRadius: '8px' }}>
                {currentQuestion.question_type}
              </span>
            </div>

            {currentQuestion.question_text && (
              <div className="mb-4 p-3" style={{ backgroundColor: "#F3F4F6", borderRadius: "12px" }}>
                <p className="mb-0" style={{ fontSize: "18px", lineHeight: "1.6" }}>
                  {currentQuestion.question_text}
                </p>
              </div>
            )}

            {currentQuestion.question_image && !currentQuestion.is_comparable && (
              <div className="text-center mb-4">
                <img 
                  src={currentQuestion.question_image} 
                  alt="question" 
                  className="img-fluid" 
                  style={{ maxHeight: "300px", borderRadius: "12px" }} 
                />
              </div>
            )}

            {currentQuestion.have_visualization && currentQuestion.visualization_image_url && (
              <div className="text-center mb-4 p-3" style={{ backgroundColor: "#E3F2FD", borderRadius: "12px" }}>
                <h6 className="fw-bold mb-3" style={{ color: "#1976D2" }}>الشكل التوضيحي</h6>
                <img 
                  src={currentQuestion.visualization_image_url} 
                  alt="visualization" 
                  className="img-fluid" 
                  style={{ maxHeight: "350px", borderRadius: "12px" }} 
                />
              </div>
            )}

            {currentQuestion.is_comparable && (
              <div className="mb-4">
                <h5 className="text-center mb-3 fw-bold">قارن بين:</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-4 text-center" style={{ backgroundColor: "#E3F2FD", borderRadius: "12px", border: "2px solid #2196F3" }}>
                      <h6 className="fw-bold mb-2" style={{ color: "#1976D2" }}>القيمة الأولى</h6>
                      <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {currentQuestion.comparable_option1_text}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-4 text-center" style={{ backgroundColor: "#F3E5F5", borderRadius: "12px", border: "2px solid #9C27B0" }}>
                      <h6 className="fw-bold mb-2" style={{ color: "#7B1FA2" }}>القيمة الثانية</h6>
                      <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                        {currentQuestion.comparable_option2_text}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                        {option.id.toUpperCase()}
                      </div>
                      <span style={{ fontSize: "16px", flex: 1 }}>{option.text}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

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

        {timeLeft <= 60 && timeLeft > 0 && (
          <div className="alert alert-danger mt-3 text-center" role="alert">
            ⚠️ تبقى أقل من دقيقة! سيتم إنهاء الاختبار تلقائياً
          </div>
        )}
      </div>
    </div>
  );
}