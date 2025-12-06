import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaHome, FaCheckCircle, FaTimesCircle, FaClock, FaTrophy } from 'react-icons/fa';
import QuestionReview from '../../components/user/QuestionReview';

export default function TestResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total, timeTaken, answers, questions } = location.state || { 
    score: 0, 
    total: 0, 
    timeTaken: 0, 
    answers: [],
    questions: []
  };

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const getGradeColor = () => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="min-vh-100 bg-light py-5" dir="rtl" style={{ paddingTop: '100px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Result Card */}
        <div className="card border-0 shadow-lg">
          <div className="card-body p-5 text-center">
            
            {/* Trophy Icon */}
            <div className="mb-4">
              <FaTrophy size={80} color={getGradeColor()} />
            </div>

            {/* Title */}
            <h2 className="fw-bold mb-2">نتيجة الاختبار</h2>
            <p className="text-muted mb-4">لقد أكملت الاختبار بنجاح!</p>

            {/* Score Circle */}
            <div 
              className="mx-auto mb-4 d-flex align-items-center justify-content-center"
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: `conic-gradient(${getGradeColor()} ${percentage * 3.6}deg, #e5e7eb 0deg)`,
                position: 'relative'
              }}
            >
              <div 
                className="bg-white rounded-circle d-flex flex-column align-items-center justify-content-center"
                style={{ width: '120px', height: '120px' }}
              >
                <div className="fw-bold" style={{ fontSize: '2.5rem', color: getGradeColor() }}>
                  {score}/{total}
                </div>
                <small className="text-muted">إجابة صحيحة</small>
              </div>
            </div>

            {/* Percentage */}
            <h3 className="fw-bold mb-4" style={{ color: getGradeColor() }}>
              {percentage}%
            </h3>

            {/* Stats */}
            <div className="row g-3 mb-4">
              <div className="col-6">
                <div className="card bg-success bg-opacity-10 border-0">
                  <div className="card-body py-3">
                    <FaCheckCircle className="text-success mb-2" size={24} />
                    <div className="fw-bold text-success">{score}</div>
                    <small className="text-muted">صحيحة</small>
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="card bg-danger bg-opacity-10 border-0">
                  <div className="card-body py-3">
                    <FaTimesCircle className="text-danger mb-2" size={24} />
                    <div className="fw-bold text-danger">{total - score}</div>
                    <small className="text-muted">خاطئة</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Time */}
            {timeTaken > 0 && (
              <div className="d-flex align-items-center justify-content-center gap-2 mb-4 text-muted">
                <FaClock />
                <span>الوقت المستغرق: {Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, '0')} دقيقة</span>
              </div>
            )}

            {/* Buttons */}
            <div className="d-grid gap-2">
              <Link 
                to="/dashboard" 
                className="btn btn-primary btn-lg"
                style={{ borderRadius: '12px' }}
              >
                <FaHome className="me-2" />
                العودة للصفحة الرئيسية
              </Link>
              <button 
                onClick={() => navigate(-2)} 
                className="btn btn-outline-secondary"
                style={{ borderRadius: '12px' }}
              >
                اختبار جديد
              </button>
            </div>

          </div>
        </div>

        {/* Question Review Component */}
        {questions && questions.length > 0 && (
          <QuestionReview questions={questions} userAnswers={answers} />
        )}

      </div>
    </div>
  );
}
