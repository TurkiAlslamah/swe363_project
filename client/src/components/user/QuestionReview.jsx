import { useState } from 'react';
import { FaCheckCircle, FaTimesCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function QuestionReview({ questions, userAnswers }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!questions || questions.length === 0) {
    return null;
  }

  const currentQuestion = questions[currentIndex];
  const userAnswer = userAnswers[currentIndex];
  const isCorrect = userAnswer === currentQuestion.correct_answer;

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="card border-0 shadow-lg mt-4" style={{ borderRadius: '20px' }} dir="rtl">
      <div className="card-body p-4">
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
          <h5 className="fw-bold mb-0">مراجعة الأسئلة</h5>
          <span className="badge bg-secondary" style={{ fontSize: '14px', padding: '8px 16px' }}>
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Question Type */}
        <div className="mb-3">
          <span 
            className="badge" 
            style={{ 
              backgroundColor: isCorrect ? '#28A745' : '#DC3545', 
              fontSize: '14px', 
              padding: '8px 16px', 
              borderRadius: '8px' 
            }}
          >
            {currentQuestion.question_type}
          </span>
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <p className="fw-semibold mb-3" style={{ fontSize: '18px', lineHeight: '1.6' }}>
            {currentQuestion.question_text}
          </p>
          
          {currentQuestion.question_image && (
            <div className="text-center mb-3">
              <img 
                src={currentQuestion.question_image} 
                alt="question" 
                className="img-fluid" 
                style={{ maxHeight: '300px', borderRadius: '12px' }} 
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="d-flex flex-column gap-3 mb-4">
          {currentQuestion.options.map((option) => {
            const isUserAnswer = userAnswer === option.id;
            const isCorrectAnswer = option.id === currentQuestion.correct_answer;
            const showCorrect = isCorrectAnswer;
            const showIncorrect = isUserAnswer && !isCorrect;

            return (
              <div
                key={option.id}
                className="p-3 d-flex align-items-center justify-content-between"
                style={{
                  borderRadius: "12px",
                  border: showCorrect 
                    ? "2px solid #28A745" 
                    : showIncorrect 
                    ? "2px solid #DC3545" 
                    : "2px solid #E5E7EB",
                  backgroundColor: showCorrect 
                    ? "#D4EDDA" 
                    : showIncorrect 
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
                      backgroundColor: showCorrect 
                        ? "#28A745" 
                        : showIncorrect 
                        ? "#DC3545" 
                        : "#F3F4F6",
                      color: (showCorrect || showIncorrect) ? "#FFFFFF" : "#6B7280",
                      fontWeight: "bold",
                      fontSize: "18px"
                    }}
                  >
                    {option.id}
                  </div>
                  <span style={{ fontSize: "16px", flex: 1 }}>{option.text}</span>
                  {showCorrect && (
                    <div className="d-flex align-items-center gap-2">
                      <FaCheckCircle style={{ color: "#28A745", fontSize: "20px" }} />
                      <span className="badge bg-success">الإجابة الصحيحة</span>
                    </div>
                  )}
                  {showIncorrect && (
                    <div className="d-flex align-items-center gap-2">
                      <FaTimesCircle style={{ color: "#DC3545", fontSize: "20px" }} />
                      <span className="badge bg-danger">إجابتك</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Result Badge */}
        <div className="text-center mb-4">
          {isCorrect ? (
            <div className="alert alert-success d-inline-flex align-items-center gap-2" style={{ borderRadius: '12px' }}>
              <FaCheckCircle size={20} />
              <span className="fw-bold">إجابة صحيحة!</span>
            </div>
          ) : (
            <div className="alert alert-danger d-inline-flex align-items-center gap-2" style={{ borderRadius: '12px' }}>
              <FaTimesCircle size={20} />
              <span className="fw-bold">إجابة خاطئة</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            style={{ borderRadius: '10px', minWidth: '120px' }}
          >
            <FaChevronRight />
            <span>السابق</span>
          </button>

          {/* Dots Navigation */}
          <div className="d-flex gap-2">
            {questions.map((_, index) => {
              const answered = userAnswers[index];
              const correct = answered === questions[index].correct_answer;
              
              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    border: 'none',
                    padding: 0,
                    backgroundColor: index === currentIndex 
                      ? '#4B0082' 
                      : correct 
                      ? '#28A745' 
                      : '#DC3545',
                    opacity: index === currentIndex ? 1 : 0.5,
                    cursor: 'pointer'
                  }}
                />
              );
            })}
          </div>

          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-2"
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            style={{ borderRadius: '10px', minWidth: '120px' }}
          >
            <span>التالي</span>
            <FaChevronLeft />
          </button>
        </div>
      </div>
    </div>
  );
}