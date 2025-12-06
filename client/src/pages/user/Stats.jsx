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
  const API_URL = "http://localhost:5005/api";
  const getToken = () => localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalCorrect: 0,
    totalWrong: 0,
    overallAccuracy: 0,
    totalSavedQuestions: 0,
    
    // Keep exam/activity stats as placeholder
    totalExams: 12,
    totalExamQuestions: 360,
    correctExams: 270,
    wrongExams: 90,
    examAccuracy: 75,
    bestExamScore: 95,
    currentStreak: 7,
    longestStreak: 15,
    thisWeekQuestions: 45,
    thisWeekAccuracy: 82,
  });

  const [categoriesKami, setCategoriesKami] = useState([]);
  const [categoriesLafzi, setCategoriesLafzi] = useState([]);
  const [selectedTab, setSelectedTab] = useState('kami');

  const currentCategories = selectedTab === 'kami' ? categoriesKami : categoriesLafzi;
  const categoryColor = "#8B5CF6";
  const categoryBgColor = "#EDE9FE";

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get overall stats
      const statsRes = await fetch(`${API_URL}/training/stats/overall`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const statsData = await statsRes.json();

      // Get stats by type
      const typeStatsRes = await fetch(`${API_URL}/training/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const typeStatsData = await typeStatsRes.json();

      // Get saved questions count
      const savedRes = await fetch(`${API_URL}/saved`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const savedData = await savedRes.json();

      if (statsData.success) {
        setStats(prev => ({
          ...prev,
          totalQuestions: statsData.data.total || 0,
          totalCorrect: statsData.data.correct || 0,
          totalWrong: statsData.data.wrong || 0,
          overallAccuracy: Math.round(statsData.data.percentage) || 0,
          totalSavedQuestions: savedData.success ? savedData.data.length : 0
        }));
      }

     if (typeStatsData.success) {
      // Kami categories (6-10)
      const kamiCats = typeStatsData.data
        .filter(item => item.internal_type_id >= 6 && item.internal_type_id <= 10)
        .map(item => ({
          id: item.internal_type_id,
          name: item.internal_name || item.internal_name_en || "غير محدد",  // ADD fallback
          totalQuestions: item.total || 0,
          correctAnswers: item.correct || 0,
          accuracy: Math.round(item.percentage) || 0
        }));

      // Lafzi categories (1-5)
      const lafziCats = typeStatsData.data
        .filter(item => item.internal_type_id >= 1 && item.internal_type_id <= 5)
        .map(item => ({
          id: item.internal_type_id,
          name: item.internal_name || item.internal_name_en || "غير محدد",  // ADD fallback
          totalQuestions: item.total || 0,
          correctAnswers: item.correct || 0,
          accuracy: Math.round(item.percentage) || 0
        }));

      setCategoriesKami(kamiCats);
      setCategoriesLafzi(lafziCats);
    }
  } catch (error) {
    console.error("Error loading stats:", error);
  }
};

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

        {/* Categories Performance Section */}
        <div className="mb-5">
          <h3 className="fw-bold mb-4">
            <FaBook className="me-2" /> 
            الأداء حسب الأقسام
          </h3>

          {/* Tab Buttons */}
          <div className="text-center mb-4">
            <div className="btn-group" role="group">
              <button
                type="button"
                className={`btn btn-lg px-5 ${selectedTab === 'kami' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setSelectedTab('kami')}
                style={{ 
                  borderRadius: '12px 0 0 12px',
                  fontWeight: 'bold'
                }}
              >
                القسم الكمي
              </button>
              <button
                type="button"
                className={`btn btn-lg px-5 ${selectedTab === 'lafzi' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setSelectedTab('lafzi')}
                style={{ 
                  borderRadius: '0 12px 12px 0',
                  fontWeight: 'bold'
                }}
              >
                القسم اللفظي
              </button>
            </div>
          </div>
          
          <div className="row">
            {currentCategories.map((category) => (
              <div key={category.id} className="col-md-6 col-lg-4 mb-4">
                <div 
                  className="card border-0 shadow-sm h-100"
                  style={{ borderRadius: '15px', transition: 'transform 0.3s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div 
                        className="rounded-3 d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          backgroundColor: categoryBgColor,
                          color: categoryColor
                        }}
                      >
                        <FaBook size={24} />
                      </div>
                      <div>
                        <h5 className="fw-bold mb-0">{category.name}</h5>
                        <small className="text-muted">{category.totalQuestions} سؤال</small>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between text-center pt-3 border-top">
                      <div>
                        <div className="fw-bold" style={{ color: categoryColor, fontSize: '1.5rem' }}>
                          {category.correctAnswers}
                        </div>
                        <small className="text-muted">صحيحة</small>
                      </div>
                      <div>
                        <div className="fw-bold" style={{ color: categoryColor, fontSize: '1.5rem' }}>
                          {category.accuracy}%
                        </div>
                        <small className="text-muted">نسبة الأداء</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

        {/* Review Saved Questions Button */}
        <div className="card border-0 shadow-lg mt-4" style={{ borderRadius: '20px' }}>
          <div className="card-body p-4 text-center">
            <FaBook size={50} className="text-primary mb-3" />
            <h4 className="fw-bold mb-2">مراجعة الأسئلة المحفوظة</h4>
            <p className="text-muted mb-4">
              لديك {stats.totalSavedQuestions} سؤال محفوظ للمراجعة
            </p>
            <Link
              to="/review-saved-questions"
              className="btn btn-primary btn-lg px-5"
              style={{ borderRadius: '12px', fontWeight: 'bold' }}
            >
              <FaBook className="me-2" />
              ابدأ المراجعة
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}