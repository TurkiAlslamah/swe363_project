import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaFire, 
  FaTrophy, 
  FaChartLine, 
  FaClipboardList,
  FaCalendarAlt,
  FaCog,
  FaBolt
} from "react-icons/fa";

const Exams = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    thisWeek: 0,
    bestResult: 0,
    averageScore: 0,
    totalTests: 0,
  });

  useEffect(() => {
    // TODO: Fetch user stats from API
    setStats({
      thisWeek: 3,
      bestResult: 100,
      averageScore: 37,
      totalTests: 5,
    });
  }, []);

  const handleCustomTest = () => {
    navigate("/exams/custom");
  };

  const handleDailyTest = () => {
    // navigate("/exams/daily");
    alert("We need questions for daily test first so we wanna make it later in backend");
  };

  return (
    <div style={{ direction: "rtl", minHeight: "100vh", background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", padding: "2rem" }}>
      <div className="container">
        {/* Main Test Cards */}
        <div className="row g-4 mb-4">
          {/* Custom Test Card */}
          <div className="col-lg-6">
            <div 
              className="card shadow-lg border-0 h-100"
              style={{
                background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
                borderRadius: "20px",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div className="card-body p-4 text-white">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge" style={{ background: "rgba(255, 255, 255, 0.2)", fontSize: "0.875rem" }}>
                    <FaBolt className="me-1" /> من
                  </span>
                  <h3 className="card-title text-center flex-grow-1 mb-0">
                    <FaCog className="me-2" />
                    اختبار مخصص
                  </h3>
                  <FaCalendarAlt size={24} />
                </div>

                {/* Body */}
                <p className="text-center mb-3" style={{ fontSize: "1rem", opacity: 0.9 }}>
                  صمم اختباراتك بنفسك
                </p>
                
                <ul className="list-unstyled">
                  <li className="mb-2" style={{ fontSize: "0.9rem", opacity: 0.95 }}>
                    • اختر المواضيع والصعوبة
                  </li>
                  <li className="mb-2" style={{ fontSize: "0.9rem", opacity: 0.95 }}>
                    • حدد عدد الأسئلة والوقت
                  </li>
                  <li className="mb-2" style={{ fontSize: "0.9rem", opacity: 0.95 }}>
                    • تدرب على نقاط ضعفك
                  </li>
                </ul>

                {/* Button */}
                <button 
                  className="btn btn-light w-100 mt-3 fw-bold"
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    color: "white",
                    borderRadius: "15px",
                    padding: "0.75rem",
                    backdropFilter: "blur(10px)",
                  }}
                  onClick={handleCustomTest}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                >
                  <FaCog className="me-2" />
                  إنشاء اختبار مخصص
                </button>
              </div>
            </div>
          </div>

          {/* Daily Test Card */}
          <div className="col-lg-6">
            <div 
              className="card shadow-lg border-0 h-100"
              style={{
                background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                borderRadius: "20px",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div className="card-body p-4 text-white">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="badge" style={{ background: "rgba(255, 255, 255, 0.2)", fontSize: "0.875rem" }}>
                    <FaFire className="me-1" /> يومي
                  </span>
                  <h3 className="card-title text-center flex-grow-1 mb-0">
                    <FaClipboardList className="me-2" />
                    الاختبار اليومي
                  </h3>
                  <FaCalendarAlt size={24} />
                </div>

                {/* Body */}
                <p className="text-center mb-3" style={{ fontSize: "1rem", opacity: 0.9 }}>
                  30 سؤال متنوع يومياً
                </p>
                
                <ul className="list-unstyled">
                  <li className="mb-2" style={{ fontSize: "0.9rem", opacity: 0.95 }}>
                    • 15 سؤال لفظي + 15 سؤال كمي
                  </li>
                  <li className="mb-2" style={{ fontSize: "0.9rem", opacity: 0.95 }}>
                    • أسئلة فريدة غير مكررة
                  </li>
                  <li className="mb-2" style={{ fontSize: "0.9rem", opacity: 0.95 }}>
                    • تحليل فوري للأداء
                  </li>
                </ul>

                {/* Button */}
                <button 
                  className="btn btn-light w-100 mt-3 fw-bold"
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "none",
                    color: "white",
                    borderRadius: "15px",
                    padding: "0.75rem",
                    backdropFilter: "blur(10px)",
                  }}
                  onClick={handleDailyTest}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
                >
                  ▶ ابدأ الاختبار اليومي
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row g-3">
          {/* This Week */}
          <div className="col-lg-3 col-md-6">
            <div 
              className="card shadow border-0"
              style={{
                background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)",
                borderRadius: "15px",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div className="card-body p-3 text-white d-flex align-items-center">
                <FaCalendarAlt size={40} className="me-3" />
                <div>
                  <small style={{ fontSize: "0.875rem", opacity: 0.9 }}>هذا الأسبوع</small>
                  <h3 className="mb-0 fw-bold">{stats.thisWeek} <FaFire size={20} /></h3>
                </div>
              </div>
            </div>
          </div>

          {/* Best Result */}
          <div className="col-lg-3 col-md-6">
            <div 
              className="card shadow border-0"
              style={{
                background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
                borderRadius: "15px",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div className="card-body p-3 text-white d-flex align-items-center">
                <FaTrophy size={40} className="me-3" />
                <div>
                  <small style={{ fontSize: "0.875rem", opacity: 0.9 }}>أفضل نتيجة</small>
                  <h3 className="mb-0 fw-bold">{stats.bestResult}%</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Average Score */}
          <div className="col-lg-3 col-md-6">
            <div 
              className="card shadow border-0"
              style={{
                background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                borderRadius: "15px",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div className="card-body p-3 text-white d-flex align-items-center">
                <FaChartLine size={40} className="me-3" />
                <div>
                  <small style={{ fontSize: "0.875rem", opacity: 0.9 }}>المتوسط العام</small>
                  <h3 className="mb-0 fw-bold">{stats.averageScore}%</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Total Tests */}
          <div className="col-lg-3 col-md-6">
            <div 
              className="card shadow border-0"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                borderRadius: "15px",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div className="card-body p-3 text-white d-flex align-items-center">
                <FaClipboardList size={40} className="me-3" />
                <div>
                  <small style={{ fontSize: "0.875rem", opacity: 0.9 }}>إجمالي الاختبارات</small>
                  <h3 className="mb-0 fw-bold">{stats.totalTests}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Exams;