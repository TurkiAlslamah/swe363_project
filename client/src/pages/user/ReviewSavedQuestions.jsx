import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const API_URL = "/api";
const getToken = () => localStorage.getItem("token");

export default function ReviewSavedQuestions() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    loadSavedQuestions();
  }, []);

  const loadSavedQuestions = async () => {
    try {
      const res = await fetch(`${API_URL}/saved`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();

      if (data.success) {
        // Transform API data to match component structure
        const formattedQuestions = data.data.map(item => ({
          id: item._id,
          q_no: item.q_no,
          question_type: "سؤال محفوظ", // You can add internal_type later if needed
          question_text: item.question?.question_text || "",
          question_image: item.question?.question_image || null,
          options: [
            { id: "a", text: item.question?.mc_a },
            { id: "b", text: item.question?.mc_b },
            { id: "c", text: item.question?.mc_c },
            { id: "d", text: item.question?.mc_d }
          ],
          correct_answer: item.question?.correct_answer,
          user_answer: null, // Saved questions don't have user_answer
          explanation: item.question?.explanation || "لا يوجد شرح متاح",
          // Add comparable and visualization data
          is_comparable: item.question?.is_comparable || false,
          comparable_option1_text: item.question?.comparable_option1_text || null,
          comparable_option2_text: item.question?.comparable_option2_text || null,
          have_visualization: item.question?.have_visualization || false,
          visualization_image_url: item.question?.visualization_image_url || null
        }));

        setQuestions(formattedQuestions);
      }
    } catch (error) {
      console.error("Error loading saved questions:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleUnsave = async () => {
    try {
      const res = await fetch(`${API_URL}/saved/${currentQuestion.q_no}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      
      if (res.ok) {
        // Remove from list
        const newQuestions = questions.filter((_, index) => index !== currentQuestionIndex);
        setQuestions(newQuestions);
        
        // Adjust index if needed
        if (currentQuestionIndex >= newQuestions.length && newQuestions.length > 0) {
          setCurrentQuestionIndex(newQuestions.length - 1);
        }
      }
    } catch (error) {
      console.error("Error unsaving question:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" dir="rtl">
        <div className="text-center">
          <FaBook size={80} className="text-muted mb-4" />
          <h3>لا توجد أسئلة محفوظة للمراجعة!</h3>
          <p className="text-muted">احفظ الأسئلة المهمة لمراجعتها لاحقاً</p>
          <button onClick={() => navigate('/stats')} className="btn btn-primary mt-3">
            العودة للإحصائيات
          </button>
        </div>
      </div>
    );
  }

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
            
            {/* Question Type Badge & Unsave Button */}
            <div className="mb-3 d-flex justify-content-between align-items-center">
              <span className="badge bg-primary" style={{ fontSize: '14px', padding: '8px 16px', borderRadius: '8px' }}>
                {currentQuestion.question_type}
              </span>
              <button 
                onClick={handleUnsave}
                className="btn btn-sm btn-outline-danger"
                style={{ borderRadius: '8px' }}
              >
                إلغاء الحفظ
              </button>
            </div>

            {/* Question Text */}
            {currentQuestion.question_text && (
              <div className="mb-4 p-3" style={{ backgroundColor: "#F3F4F6", borderRadius: "12px" }}>
                <p className="mb-0" style={{ fontSize: "18px", lineHeight: "1.6" }}>
                  {currentQuestion.question_text}
                </p>
              </div>
            )}

            {/* Question Image (if not comparable) */}
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

            {/* Visualization */}
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

            {/* Comparable Questions */}
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

            {/* Options */}
            <div className="d-flex flex-column gap-3 mb-4">
              {currentQuestion.options.map((option) => {
                const isCorrectAnswer = option.id === currentQuestion.correct_answer;

                return (
                  <div
                    key={option.id}
                    className="p-3 d-flex align-items-center justify-content-between"
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #E5E7EB",
                      backgroundColor: "#FFFFFF"
                    }}
                  >
                    <div className="d-flex align-items-center gap-3 w-100">
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          backgroundColor: "#F3F4F6",
                          color: "#6B7280",
                          fontWeight: "bold",
                          fontSize: "18px"
                        }}
                      >
                        {option.id.toUpperCase()}
                      </div>
                      <span style={{ fontSize: "16px", flex: 1 }}>{option.text}</span>
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
                {showExplanation ? '🔽 إخفاء الإجابة والشرح' : '📖 عرض الإجابة والشرح'}
              </button>
              
              {showExplanation && (
                <div className="alert alert-success" style={{ borderRadius: '12px' }}>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <FaCheckCircle className="text-success" size={20} />
                    <h6 className="fw-bold mb-0 text-success">
                      الإجابة الصحيحة: {currentQuestion.correct_answer.toUpperCase()}
                    </h6>
                  </div>
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