import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaBook, 
  FaClipboardCheck, 
  FaChartLine, 
  FaTimesCircle,
  FaTrophy,
  FaFire,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt
} from 'react-icons/fa';

export default function Stats() {
  const [stats, setStats] = useState({
    // Training Stats
    totalTrainingQuestions: 150,
    correctTraining: 120,
    wrongTraining: 30,
    trainingAccuracy: 80,
    
    // Exam Stats
    totalExams: 12,
    totalExamQuestions: 360,
    correctExams: 270,
    wrongExams: 90,
    examAccuracy: 75,
    bestExamScore: 95,
    
    // Overall Stats
    totalQuestions: 510,
    totalCorrect: 390,
    totalWrong: 120,
    overallAccuracy: 76.5,
    
    // Time Stats
    totalTimeSpent: 450, // minutes
    averageTimePerQuestion: 53, // seconds
    
    // Streak
    currentStreak: 7,
    longestStreak: 15,
    
    // This Week
    thisWeekQuestions: 45,
    thisWeekAccuracy: 82
  });

  useEffect(() => {
    // TODO: Fetch stats from API
  }, []);

  const StatCard = ({ icon: Icon, title, value, subtitle, color, bgColor }) => (
    <div className="col-md-6 col-lg-4 mb-4">
      <div 
        className="card border-0 shadow-sm h-100"
        style={{ borderRadius: '15px', transition: 'transform 0.3s' }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-3">
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ 
                width: '50px', 
                height: '50px', 
                backgroundColor: bgColor,
                color: color 
              }}
            >
              <Icon size={24} />
            </div>
            <div className="ms-3">
              <h6 className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>{title}</h6>
              <h3 className="fw-bold mb-0" style={{ color: color }}>{value}</h3>
            </div>
          </div>
          {subtitle && <p className="text-muted small mb-0">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-vh-100 bg-light py-5" dir="rtl" style={{ paddingTop: '100px' }}>
      <div className="container">
        
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="fw-bold mb-2"><FaChartLine className="me-2" /> إحصائياتي</h1>
          <p className="text-muted">تابع تقدمك وأدائك في التدريبات والاختبارات</p>
        </div>

        {/* Overall Performance Card */}
        <div className="card border-0 shadow-lg mb-5" style={{ 
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <div className="card-body p-5 text-white">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h2 className="fw-bold mb-3">احصائيات التدريب</h2>
                <div className="row g-4">
                  <div className="col-6">
                    <div className="d-flex align-items-center gap-3">
                      <FaBook size={30} />
                      <div>
                        <h4 className="fw-bold mb-0">{stats.totalQuestions}</h4>
                        <small>إجمالي الأسئلة</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center gap-3">
                      <FaCheckCircle size={30} />
                      <div>
                        <h4 className="fw-bold mb-0">{stats.totalCorrect}</h4>
                        <small>إجابات صحيحة</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="d-flex align-items-center gap-3">
                      <FaTimesCircle size={30} />
                      <div>
                        <h4 className="fw-bold mb-0">{stats.totalWrong}</h4>
                        <small>إجابات خاطئة</small>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
              <div className="col-md-4 text-center">
                <div className="position-relative d-inline-block">
                  <svg width="150" height="150">
                    <circle
                      cx="75"
                      cy="75"
                      r="60"
                      fill="none"
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="15"
                    />
                    <circle
                      cx="75"
                      cy="75"
                      r="60"
                      fill="none"
                      stroke="white"
                      strokeWidth="15"
                      strokeDasharray={`${2 * Math.PI * 60}`}
                      strokeDashoffset={`${2 * Math.PI * 60 * (1 - stats.overallAccuracy / 100)}`}
                      transform="rotate(-90 75 75)"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <h1 className="fw-bold mb-0">{stats.overallAccuracy}%</h1>
                    <small>دقة الإجابات</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      

        {/* Exam Section */}
        <div className="mb-5">
          <h3 className="fw-bold mb-4"><FaClipboardCheck className="me-2" /> إحصائيات الاختبارات</h3>
          <div className="row">
            <StatCard
              icon={FaClipboardCheck}
              title="عدد الاختبارات"
              value={stats.totalExams}
              subtitle={`${stats.totalExamQuestions} سؤال إجمالي`}
              color="#8b5cf6"
              bgColor="#ede9fe"
            />
            <StatCard
              icon={FaTrophy}
              title="أفضل نتيجة"
              value={`${stats.bestExamScore}%`}
              subtitle="أعلى درجة حصلت عليها"
              color="#f59e0b"
              bgColor="#fef3c7"
            />
            <StatCard
              icon={FaChartLine}
              title="متوسط الأداء"
              value={`${stats.examAccuracy}%`}
              subtitle={`${stats.correctExams} صحيحة من ${stats.totalExamQuestions}`}
              color="#06b6d4"
              bgColor="#cffafe"
            />
          </div>
        </div>

        {/* Activity Section */}
        <div className="mb-5">
          <h3 className="fw-bold mb-4"><FaFire className="me-2" /> النشاط والإنجازات</h3>
          <div className="row">
            <StatCard
              icon={FaFire}
              title="السلسلة الحالية"
              value={`${stats.currentStreak} أيام`}
              subtitle="حافظ على نشاطك اليومي"
              color="#f97316"
              bgColor="#ffedd5"
            />
            <StatCard
              icon={FaTrophy}
              title="أطول سلسلة"
              value={`${stats.longestStreak} أيام`}
              subtitle="رقمك القياسي"
              color="#eab308"
              bgColor="#fef9c3"
            />
            <StatCard
              icon={FaCalendarAlt}
              title="هذا الأسبوع"
              value={`${stats.thisWeekQuestions} سؤال`}
              subtitle={`دقة: ${stats.thisWeekAccuracy}%`}
              color="#ec4899"
              bgColor="#fce7f3"
            />
          </div>
        </div>

        {/* Review Wrong Answers Button */}
        <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
          <div className="card-body p-4 text-center">
            <FaTimesCircle size={50} className="text-danger mb-3" />
            <h4 className="fw-bold mb-2">مراجعة الإجابات الخاطئة</h4>
            <p className="text-muted mb-4">
              لديك {stats.totalWrong} إجابة خاطئة للمراجعة
            </p>
            <Link
              to="/review-wrong-answers"
              className="btn btn-danger btn-lg px-5"
              style={{ borderRadius: '12px', fontWeight: 'bold' }}
            >
              <FaTimesCircle className="me-2" />
              ابدأ المراجعة
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}