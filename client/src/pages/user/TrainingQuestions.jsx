import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Explanations from "../../components/user/Explanations";
import ReportQuestion from "../../components/user/ReportQuestion";

const API_URL = "/api";
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

  useEffect(() => {
  if (questionData?.question) {
    checkIfSaved();
  }
}, [questionData]);
 const loadQuestion = async () => {
    setLoading(true);
    setError(null);
    // DON'T reset these here - let them be set by attempt_info
    // setSelectedAnswer(null);
    // setShowResult(false);
    // setIsCorrect(false);
    setShowExplanation(false);
    
    try {
      const res = await fetch(
        `${API_URL}/training/question/${trainingId}?index=${currentQuestionIndex}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      const data = await res.json();
      
      if (data.success) {
        setQuestionData(data.data);
        
        // Show previous answer if already attempted
        if (data.data.attempt_info?.already_attempted) {
          setSelectedAnswer(data.data.attempt_info.user_answer);
          setShowResult(true);
          setIsCorrect(data.data.attempt_info.is_correct);
        } else {
          // Only reset if NOT attempted
          setSelectedAnswer(null);
          setShowResult(false);
          setIsCorrect(false);
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
    
    // ADD THIS DEBUG LOG:
    console.log("Full questionData:", questionData);
    console.log("Question object:", questionData.question);
    console.log("Question _id:", questionData.question._id);
    console.log("Question q_no:", questionData.question.q_no);
    
    setSelectedAnswer(answerId);
    const correct = answerId === questionData.question.correct_answer;
    setIsCorrect(correct);
    setShowResult(true);
    
    try {
      const attemptRes = await fetch(`${API_URL}/training/attempts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          question_id: questionData.question.q_no,
          q_no: questionData.question.q_no,
          internal_type_id: parseInt(trainingId),
          user_answer: answerId
        })
      });
      
      const attemptData = await attemptRes.json();
      console.log("Attempt response:", attemptData);
      
      await fetch(`${API_URL}/training/progress/${trainingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ last_question_index: currentQuestionIndex + 1 })
      });
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

const handleNext = () => {
  // Add this check at the beginning
  if (!showResult) {
    alert("يرجى الإجابة على السؤال أولاً");
    return;
  }
  
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
    const res = await fetch(`${API_URL}/saved/${questionData.question.q_no}`, {
      method,
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    const data = await res.json();
    if (data.success) {
      setIsSaved(!isSaved);
    }
  } catch (error) {
    console.error("Error saving question:", error);
  }
};
  const checkIfSaved = async () => {
  try {
    const res = await fetch(`${API_URL}/saved/check/${questionData.question.q_no}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    const data = await res.json();
    if (data.success) {
      setIsSaved(data.data.is_saved);
    }
  } catch (error) {
    console.error("Error checking saved:", error);
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
          questionId={question.q_no}  // Changed from currentQuestion to question
          onReportSubmitted={() => {
            setIsReported(true);
            setShowReport(false);
          }}
        />
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "20px", backgroundColor: "#FFFFFF" }}>
          <div className="card-body p-4">

            {question.passage && (
  <div className="mb-4 p-4" style={{ 
    backgroundColor: "#FFF9E6", 
    borderRadius: "12px",
    border: "2px solid #FFD700"
  }}>
    <div className="d-flex align-items-center gap-2 mb-3">
      <span style={{ fontSize: '24px' }}>📖</span>
      <h6 className="fw-bold mb-0" style={{ color: "#D97706" }}>
        {question.passage.title}
      </h6>
    </div>
    <p style={{ 
      fontSize: "16px", 
      lineHeight: "1.8",
      textAlign: "justify",
      color: "#1F2937"
    }}>
      {question.passage.passage_text}
    </p>
  </div>
)}
            
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