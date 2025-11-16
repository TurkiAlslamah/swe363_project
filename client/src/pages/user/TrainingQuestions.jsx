import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GeometryImage from "../../assets/images/Geometry.png";
import Explanations from "../../components/user/Explanations";
import ReportQuestion from "../../components/user/ReportQuestion";
// Mock data - you can move this to a separate file later if needed
const mockQuestions = {
  // استيعاب المقروء (id: 1)
  1: [
    {
      id: 1,
      question_type: "استيعاب المقروء",
      passage: "إن من أهم المبادئ والممارسات التي أوردها هو القرب هو الأخذ بمبدأ التغليب والترجيح فهـــم لا يكتفـــون بالكمال للانقسام ولا لاحتمالهم ولا لمخافيهم. إن تمركز...",
      question_text: "أي الآتي صحيح وفقا للنص؟ السؤال: بصيغة أخرى: الفكرة الصحيحة في عدم النص........... أي استفاد من النص أن:",
      question_image: null,
      options: [
        { id: "أ", text: "التمركز من طبيعة الإنسان ويمكن التحكم فيه" },
        { id: "ب", text: "التمركز من طبيعة الشعوب المتطورة" },
        { id: "ج", text: "التمركز يؤدي إلى التطور" },
        { id: "د", text: "الترجيح نسبة الشعوب المتمركزة" }
      ],
      correct_answer: "أ"
    }
  ],
  
  // التناظر اللفظي (id: 2)
  2: [
    {
      id: 1,
      question_type: "التناظر اللفظي",
      question_text: "قلم : كتابة",
      question_image: null,
      options: [
        { id: "أ", text: "مفك : إصلاح" },
        { id: "ب", text: "سيارة : سفر" },
        { id: "ج", text: "كتاب : قراءة" },
        { id: "د", text: "باب : فتح" }
      ],
      correct_answer: "أ"
    }
  ],

  // إكمال الجمل (id: 3)
  3: [
    {
      id: 1,
      question_type: "إكمال الجمل",
      question_text: "كان الرجل _______ في تعامله مع الآخرين",
      question_image: null,
      options: [
        { id: "أ", text: "متواضعاً" },
        { id: "ب", text: "متكبراً" },
        { id: "ج", text: "لطيفاً" },
        { id: "د", text: "قاسياً" }
      ],
      correct_answer: "أ"
    }
  ],

  // الخطأ السياقي (id: 4)
  4: [
    {
      id: 1,
      question_type: "الخطأ السياقي",
      question_text: "الجملة التالية تحتوي على خطأ سياقي: 'ذهب الطالب إلى المدرسة ليشتري الخبز'",
      question_image: null,
      options: [
        { id: "أ", text: "ذهب" },
        { id: "ب", text: "المدرسة" },
        { id: "ج", text: "ليشتري" },
        { id: "د", text: "الخبز" }
      ],
      correct_answer: "ب"
    }
  ],

  // المفردة الشاذة (id: 5 for لفظي)
  5: [
    {
      id: 1,
      question_type: "المفردة الشاذة",
      question_text: "أي من الكلمات التالية لا تنتمي للمجموعة؟",
      question_image: null,
      options: [
        { id: "أ", text: "قلم" },
        { id: "ب", text: "دفتر" },
        { id: "ج", text: "كتاب" },
        { id: "د", text: "تفاحة" }
      ],
      correct_answer: "د"
    }
  ],

  // جبر - كمي (id: 6)
  6: [
    {
      id: 1,
      question_type: "جبر",
      question_text: "إذا كان س + ٥ = ١٢، فما قيمة س؟",
      question_image: null,
      options: [
        { id: "أ", text: "٥" },
        { id: "ب", text: "٧" },
        { id: "ج", text: "١٢" },
        { id: "د", text: "١٧" }
      ],
      correct_answer: "ب"
    }
  ],

  // هندسة - كمي (id: 7)
// هندسة - كمي (id: 7)
// هندسة - كمي (id: 7)
7: [
  {
    id: 1,
    question_type: "هندسة",
    question_text: "في الشكل المجاور اوجد قيمة س :",
    question_image: GeometryImage,
    options: [
      { id: "أ", text: "١٠٠" },
      { id: "ب", text: "٩٠" },
      { id: "ج", text: "١٨٠" },
      { id: "د", text: "٨٠" }
    ],
    correct_answer: "أ",
    explanation: "مجموع الزوايا في المثلث يساوي ١٨٠ درجة. في هذا الشكل، الزوايا المعطاة هي ٤٠ و ٤٠، لذلك: س = ١٨٠ - (٤٠ + ٤٠) = ١٠٠ درجة"
  }
],

  // الاحصاء - كمي (id: 8)
  8: [
    {
      id: 1,
      question_type: "الاحصاء",
      question_text: "ما هو متوسط الأعداد التالية: ٤، ٦، ٨، ١٠؟",
      question_image: null,
      options: [
        { id: "أ", text: "٦" },
        { id: "ب", text: "٧" },
        { id: "ج", text: "٨" },
        { id: "د", text: "٩" }
      ],
      correct_answer: "ب"
    }
  ],

  // حساب - كمي (id: 9)
  9: [
    {
      id: 1,
      question_type: "حساب",
      question_text: "كم يساوي ٢٥ × ٤؟",
      question_image: null,
      options: [
        { id: "أ", text: "٨٠" },
        { id: "ب", text: "٩٠" },
        { id: "ج", text: "١٠٠" },
        { id: "د", text: "١١٠" }
      ],
      correct_answer: "ج"
    }
  ],

  // مقارنات كمية (id: 10)
  10: [
    {
      id: 1,
      question_type: "مقارنات كمية",
      question_text: "قارن بين:",
      question_image: null,
      quantity_a: "١/٤",
      quantity_b: "ب",
      comparison_note: "حيث ب تقع بين -٢ و -٣ على خط الأعداد",
      options: [
        { id: "أ", text: "القيمة الأولى أكبر" },
        { id: "ب", text: "القيمة الثانية أكبر" },
        { id: "ج", text: "القيمتان متساويتان" },
        { id: "د", text: "المعطيات غير كافية" }
      ],
      correct_answer: "ب"
    }
  ]
};

export default function TrainingQuestions() {
  const { trainingId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isReported, setIsReported] = useState(false);
  


  useEffect(() => {
    const trainingQuestions = mockQuestions[trainingId] || [];
    setQuestions(trainingQuestions);
  }, [trainingId]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = () => {
  if (currentQuestionIndex < questions.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setShowExplanation(false);
    setShowReport(false);
    setIsReported(false);
    setIsSaved(false); 
    
  }
};
  

  const handlePrevious = () => {
  if (currentQuestionIndex > 0) {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setShowExplanation(false);
    setShowReport(false);
    setIsReported(false);
    setIsSaved(false);
  }
};

  const handleAnswerSelect = (answerId) => {
  setSelectedAnswer(answerId);
  setShowResult(true);
  setIsCorrect(answerId === currentQuestion.correct_answer);
};

  if (!currentQuestion) {
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

  return (
    <div className="min-vh-100" dir="rtl" style={{ backgroundColor: "#E8E5F5", paddingTop: "100px", paddingBottom: "50px" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        
        {/* Header with back button */}
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
            السؤال {currentQuestionIndex + 1} من {questions.length}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2 mb-4">
          <button className="btn btn-light d-flex align-items-center gap-2 px-3 py-2" style={{ borderRadius: "12px" }} onClick={() => setShowExplanation(true)}>
            <span>📄</span>
            <span>عرض الشرح</span>
          </button>
          <button className="btn btn-light d-flex align-items-center gap-2 px-3 py-2" style={{ borderRadius: "12px" }} onClick={() => setIsSaved(!isSaved)}>
            <span>🔖</span>
            <span>حفظ</span>
          </button>
          <button className="btn btn-light d-flex align-items-center gap-2 px-3 py-2" style={{ borderRadius: "12px" }} onClick={() => setShowReport(true)}>
            <span>⚠️</span>
            <span>تبليغ عن خطأ</span>
          </button>
        </div>
        
        {isSaved && (
          <div className="alert alert-success" role="alert">
            تم حفظ السؤال بنجاح!
          </div>
        )}
        {/* Explanation Modal */}
        {showExplanation && (
           <Explanations 
        show={showExplanation}
         onClose={() => setShowExplanation(false)}
        explanation={currentQuestion?.explanation}
        />
        )}
        <ReportQuestion 
        show={showReport}
        onClose={() => setShowReport(false)}
        questionId={currentQuestion?.id}
        onReportSubmitted={() => setIsReported(true)}
        />
        {isReported && (
        <div className="alert alert-success" role="alert">
            تم إرسال التبليغ بنجاح! شكراً لمساعدتك في تحسين المحتوى
        </div>
        )}

       
        

        {/* Question Card */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: "20px", backgroundColor: "#FFFFFF" }}>
          <div className="card-body p-4">
            
            {/* استيعاب المقروء - Show passage first */}
            {currentQuestion.question_type === "استيعاب المقروء" && currentQuestion.passage && (
              <div className="mb-4 p-4" style={{ backgroundColor: "#E3F2FD", borderRadius: "12px", borderRight: "4px solid #2196F3" }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span style={{ fontSize: "20px" }}>📖</span>
                  <h5 className="fw-bold mb-0" style={{ color: "#1976D2" }}>المركز</h5>
                </div>
                <p className="mb-0" style={{ lineHeight: "1.8", textAlign: "justify" }}>
                  {currentQuestion.passage}
                </p>
                <button className="btn btn-primary mt-3" style={{ borderRadius: "8px" }}>
                  🔗 قراءة النص كاملاً
                </button>
              </div>
            )}

            {/* مقارنات كمية - Show two boxes */}
            {currentQuestion.question_type === "مقارنات كمية" && (
              <div className="mb-4">
                <h5 className="text-center mb-3 fw-bold">{currentQuestion.question_text}</h5>
                
                {/* Image if exists */}
                {currentQuestion.question_image && (
                  <div className="text-center mb-4">
                    <img src={currentQuestion.question_image} alt="visualization" className="img-fluid" style={{ maxHeight: "200px" }} />
                  </div>
                )}

                {/* Comparison note */}
                {currentQuestion.comparison_note && (
                  <div className="text-center mb-3">
                    <p className="text-muted">{currentQuestion.comparison_note}</p>
                  </div>
                )}

                {/* Two comparison boxes */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="p-4 text-center" style={{ backgroundColor: "#E3F2FD", borderRadius: "12px", border: "2px solid #2196F3" }}>
                      <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                        <span style={{ color: "#2196F3", fontSize: "20px" }}>ℹ️</span>
                        <h6 className="fw-bold mb-0" style={{ color: "#1976D2" }}>القيمة الاولى</h6>
                      </div>
                      <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                        {currentQuestion.quantity_a}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-4 text-center" style={{ backgroundColor: "#F3E5F5", borderRadius: "12px", border: "2px solid #9C27B0" }}>
                      <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                        <span style={{ color: "#9C27B0", fontSize: "20px" }}>🔮</span>
                        <h6 className="fw-bold mb-0" style={{ color: "#7B1FA2" }}>القيمة الثانية</h6>
                      </div>
                      <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                        {currentQuestion.quantity_b}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Regular question - Show text or image */}
            {currentQuestion.question_type !== "مقارنات كمية" && (
              <div className="mb-4">
                {currentQuestion.question_text && (
                  <p className="mb-3" style={{ fontSize: "18px", lineHeight: "1.6" }}>
                    {currentQuestion.question_text}
                  </p>
                )}
                
                {currentQuestion.question_image && (
                  <div className="text-center mb-3">
                    <img src={currentQuestion.question_image} alt="question" className="img-fluid" style={{ maxHeight: "300px", borderRadius: "12px" }} />
                  </div>
                )}
              </div>
            )}

            {/* Options */}
            <div className="d-flex flex-column gap-3">
            {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrectOption = option.id === currentQuestion.correct_answer;
                const showCorrect = showResult && isCorrectOption;
                const showIncorrect = showResult && isSelected && !isCorrect;

                return (
                <button
                    key={option.id}
                    onClick={() => handleAnswerSelect(option.id)}
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
                        {option.id}
                    </div>
                    <span style={{ fontSize: "16px", flex: 1 }}>{option.text}</span>
                    {showCorrect && <span style={{ color: "#28A745", fontSize: "20px" }}>✓</span>}
                    {showIncorrect && <span style={{ color: "#DC3545", fontSize: "20px" }}>✗</span>}
                    </div>
                </button>
                );
            })}
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
          
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
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