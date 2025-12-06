import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Explanations from "../../components/user/Explanations";
import ReportQuestion from "../../components/user/ReportQuestion";

const API_URL = "http://localhost:5005/api";
const getToken = () => localStorage.getItem("token");

export default function TrainingQuestions() {
  const { trainingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(location.state?.startIndex || 0);
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuestion();
  }, [currentQuestionIndex, trainingId]);

  const loadQuestion = async () => {
    setLoading(true);
    setError(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setShowExplanation(false);
    
    try {
      const res = await fetch(
        `${API_URL}/training/question/${trainingId}?index=${currentQuestionIndex}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      const data = await res.json();
      
      if (data.success) {
        setQuestionData(data.data);
        
        if (data.data.attempt_info?.already_attempted) {
          setSelectedAnswer(data.data.attempt_info.user_answer);
          setShowResult(true);
          setIsCorrect(data.data.attempt_info.is_correct);
        }
      } else {
        setError(data.message || "فشل تحميل السؤال");
      }
    } catch (err) {
      setError("فشل الاتصال بالخادم");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (answerId) => {
    if (showResult) return;
    
    setSelectedAnswer(answerId);
    const correct = answerId === questionData.question.correct_answer;
    setIsCorrect(correct);
    setShowResult(true);
    
    try {
      await fetch(`${API_URL}/training/attempts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          question_id: questionData.question._id,
          q_no: questionData.question.q_no,
          internal_type_id: parseInt(trainingId),
          user_answer: answerId
        })
      });
      
      await fetch(`${API_URL}/training/progress/${trainingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ last_question_index: currentQuestionIndex })
      });
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleNext = () => {
    if (questionData && currentQuestionIndex < questionData.total_questions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsSaved(false);
      setIsReported(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsSaved(false);
      setIsReported(false);
    }
  };

  const handleSaveQuestion = async () => {
    try {
      const method = isSaved ? "DELETE" : "POST";
      await fetch(`${API_URL}/saved/${questionData.question._id}`, {
        method,
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" dir="rtl">
        <div className="text-center">
          <h3 className="text-danger">{error}</h3>
          <button onClick={() => navigate('/training')} className="btn btn-primary mt-3">
            العودة للتدريبات
          </button>
        </div>
      </div>
    );
  }

  if (!questionData) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" dir="rtl">
        <div className="text-center">
          <h3>لا توجد أسئلة متاحة</h3>
          <button onClick={() => navigate('/training')} className="btn btn-primary mt-3">
            العودة للتدريبات
          </button>
        </div>
      </div>
    );
  }

  const { question, current_index, total_questions, is_first, is_last } = questionData;

  return (
    <div className="min-vh-100" dir="rtl" style={{ backgroundColor: "#E8E5F5", paddingTop: "100px", paddingBottom: "50px" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button 
            onClick={() => navigate('/training')} 
            className="btn text-white d-flex align-items-center gap-2"
            style={{ backgroundColor: "#4B0082", borderRadius: "12px", padding: "10px 20px" }}
          >
            <span>→</span>
            <span>العودة</span>
          </button>
          
          <div className="text-muted">
            السؤال {current_index + 1} من {total_questions}
          </div>
        </div>

        <div className="d-flex gap-2 mb-4">
          <button 
            className="btn btn-light d-flex align-items-center gap-2 px-3 py-2" 
            style={{ borderRadius: "12px" }} 
            onClick={() => setShowExplanation(true)}
            disabled={!question.explanation}
          >
            <span>📄</span>
            <span>عرض الشرح</span>
          </button>
          <button 
            className="btn btn-light d-flex align-items-center gap-2 px-3 py-2" 
            style={{ borderRadius: "12px" }} 
            onClick={handleSaveQuestion}
          >
            <span>{isSaved ? "🔖" : "📌"}</span>
            <span>{isSaved ? "محفوظ" : "حفظ"}</span>
          </button>
          <button 
            className="btn btn-light d-flex align-items-center gap-2 px-3 py-2" 
            style={{ borderRadius: "12px" }} 
            onClick={() => setShowReport(true)}
          >
            <span>⚠️</span>
            <span>تبليغ عن خطأ</span>
          </button>
        </div>
        
        {isSaved && (
          <div className="alert alert-success" role="alert">
            تم حفظ السؤال بنجاح!
          </div>
        )}
        
        {isReported && (
          <div className="alert alert-success" role="alert">
            تم إرسال التبليغ بنجاح! شكراً لمساعدتك في تحسين المحتوى
          </div>
        )}

        <Explanations 
          show={showExplanation}
          onClose={() => setShowExplanation(false)}
          explanation={question?.explanation}
        />
        
        <ReportQuestion 
          show={showReport}
          onClose={() => setShowReport(false)}
          questionId={question?._id}
          onReportSubmitted={() => {
            setIsReported(true);
            setShowReport(false);
          }}
        />

        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "20px", backgroundColor: "#FFFFFF" }}>
          <div className="card-body p-4">
            
            {/* Question Text */}
            {question.question_text && (
              <div className="mb-4 p-3" style={{ backgroundColor: "#F3F4F6", borderRadius: "12px" }}>
                <p className="mb-0" style={{ fontSize: "18px", lineHeight: "1.6" }}>
                  {question.question_text}
                </p>
              </div>
            )}

            {/* Question Image (if exists and not comparable) */}
            {question.question_image && !question.is_comparable && (
              <div className="text-center mb-4">
                <img 
                  src={question.question_image} 
                  alt="question" 
                  className="img-fluid" 
                  style={{ maxHeight: "300px", borderRadius: "12px" }} 
                />
              </div>
            )}

            {/* Visualization Image (if have_visualization is true) */}
            {question.have_visualization && question.visualization_image_url && (
              <div className="text-center mb-4 p-3" style={{ backgroundColor: "#E3F2FD", borderRadius: "12px" }}>
                <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                  
                  <h6 className="fw-bold mb-0" style={{ color: "#1976D2" }}>الشكل التوضيحي</h6>
                </div>
                <img 
                  src={question.visualization_image_url} 
                  alt="visualization" 
                  className="img-fluid" 
                  style={{ maxHeight: "350px", borderRadius: "12px" }} 
                />
              </div>
            )}

            {/* Comparable Questions - Two boxes side by side */}
            {question.is_comparable && question.comparable_option1_text && question.comparable_option2_text && (
              <div className="mb-4">
                <h5 className="text-center mb-3 fw-bold">قارن بين:</h5>
                
                <div className="row g-3 mb-4">
                  {/* Option 1 */}
                  <div className="col-md-6">
                    <div className="p-4 text-center" style={{ backgroundColor: "#E3F2FD", borderRadius: "12px", border: "2px solid #2196F3", minHeight: "150px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                        <span style={{ color: "#2196F3", fontSize: "20px" }}>ℹ️</span>
                        <h6 className="fw-bold mb-0" style={{ color: "#1976D2" }}>القيمة الأولى</h6>
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: "bold", lineHeight: "1.6" }}>
                        {question.comparable_option1_text}
                      </div>
                    </div>
                  </div>
                  
                  {/* Option 2 */}
                  <div className="col-md-6">
                    <div className="p-4 text-center" style={{ backgroundColor: "#F3E5F5", borderRadius: "12px", border: "2px solid #9C27B0", minHeight: "150px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                        <span style={{ color: "#9C27B0", fontSize: "20px" }}>🔮</span>
                        <h6 className="fw-bold mb-0" style={{ color: "#7B1FA2" }}>القيمة الثانية</h6>
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: "bold", lineHeight: "1.6" }}>
                        {question.comparable_option2_text}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Answer Options */}
            <div className="d-flex flex-column gap-3">
              {["a", "b", "c", "d"].map((optionId) => {
                const optionText = question[`mc_${optionId}`];
                const isSelected = selectedAnswer === optionId;
                const isCorrectOption = question.correct_answer === optionId;
                const showCorrect = showResult && isCorrectOption;
                const showIncorrect = showResult && isSelected && !isCorrect;

                return (
                  <button
                    key={optionId}
                    onClick={() => handleAnswerSelect(optionId)}
                    disabled={showResult}
                    className="btn text-end p-3 d-flex align-items-center justify-content-between"
                    style={{
                      borderRadius: "12px",
                      border: showCorrect 
                        ? "2px solid #28A745" 
                        : showIncorrect 
                        ? "2px solid #DC3545" 
                        : isSelected 
                        ? "2px solid #4B0082" 
                        : "2px solid #E5E7EB",
                      backgroundColor: showCorrect 
                        ? "#D4EDDA" 
                        : showIncorrect 
                        ? "#F8D7DA" 
                        : isSelected 
                        ? "#F3E5F5" 
                        : "#FFFFFF",
                      transition: "all 0.3s",
                      cursor: showResult ? "not-allowed" : "pointer"
                    }}
                  >
                    <div className="d-flex align-items-center gap-3 w-100">
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "8px",
                          backgroundColor: showCorrect 
                            ? "#28A745" 
                            : showIncorrect 
                            ? "#DC3545" 
                            : isSelected 
                            ? "#4B0082" 
                            : "#F3F4F6",
                          color: (showCorrect || showIncorrect || isSelected) ? "#FFFFFF" : "#6B7280",
                          fontWeight: "bold",
                          fontSize: "18px"
                        }}
                      >
                        {optionId.toUpperCase()}
                      </div>
                      <span style={{ fontSize: "16px", flex: 1 }}>{optionText}</span>
                      {showCorrect && <span style={{ color: "#28A745", fontSize: "20px" }}>✓</span>}
                      {showIncorrect && <span style={{ color: "#DC3545", fontSize: "20px" }}>✗</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation after answering */}
            {showResult && question.explanation && (
              <div 
                className={`mt-4 p-3 rounded ${isCorrect ? "bg-success" : "bg-danger"} bg-opacity-10`}
                style={{ borderRight: `4px solid ${isCorrect ? "#28A745" : "#DC3545"}` }}
              >
                <h6 className={`fw-bold ${isCorrect ? "text-success" : "text-danger"}`}>
                  {isCorrect ? "✓ إجابة صحيحة" : "✗ إجابة خاطئة"}
                </h6>
                <p className="mb-0" style={{ lineHeight: "1.6" }}>
                  {question.explanation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="d-flex justify-content-between gap-3">
          <button
            onClick={handlePrevious}
            disabled={is_first}
            className="btn btn-light px-4 py-2 d-flex align-items-center gap-2"
            style={{ borderRadius: "12px", fontWeight: "bold" }}
          >
            <span>→</span>
            <span>السابق</span>
          </button>
          
          <button
            onClick={handleNext}
            disabled={is_last}
            className="btn text-white px-4 py-2 d-flex align-items-center gap-2"
            style={{ backgroundColor: "#4B0082", borderRadius: "12px", fontWeight: "bold", border: "none" }}
          >
            <span>التالي</span>
            <span>←</span>
          </button>
        </div>
      </div>
    </div>
  );
}