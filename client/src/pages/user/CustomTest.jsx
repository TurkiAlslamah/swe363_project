import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaBookOpen, 
  FaCalculator, 
  FaCog, 
  FaClock, 
  FaBolt,
  FaExclamationTriangle,
  FaChevronRight,
  FaSquare,
  FaEye,
  FaChartLine,
  FaBook,
  FaRuler,
  FaFileAlt
  
} from "react-icons/fa";

const CustomTest = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("verbal"); // "verbal" or "quantitative"
  
  // Test settings state
  const [settings, setSettings] = useState({
    repeatQuestions: false,
    timed: false,
    timePerQuestion: 30,
    totalTime: 30,
  });

  // Topic selections for verbal section
  const [verbalTopics, setVerbalTopics] = useState({
    readingComprehension: 0,
    analogies: 0,
    errorDetection: 0,
    sentenceCompletion: 0,
    unusualWord: 0,
  });

  // Topic selections for quantitative section
  const [quantTopics, setQuantTopics] = useState({
    algebra: 0,
    geometry: 0,
    statistics: 0,
    arithmetic: 0,
    comparison: 0,
  });

  const verbalTopicsData = [
    { key: "readingComprehension", label: "استيعاب المقروء", subtitle: "فئة لفظيه", icon: FaBookOpen, color: "#3b82f6" },
    { key: "analogies", label: "التناظر اللفظي", subtitle: "فئة لفظيه", icon: FaChartLine, color: "#3b82f6" },
    { key: "errorDetection", label: "إكمال الجمل", subtitle: "فئة لفظيه", icon: FaFileAlt, color: "#3b82f6" },
    { key: "sentenceCompletion", label: "الخطأ السياقي", subtitle: "فئة لفظيه", icon: FaEye, color: "#3b82f6" },
    { key: "unusualWord", label: "المفردة الشاذة", subtitle: "فئة لفظيه", icon: FaChartLine, color: "#3b82f6" },
  ];

  const quantTopicsData = [
    { key: "algebra", label: "جبر", subtitle: "فئة كمية", icon: FaCalculator, color: "#a855f7" },
    { key: "geometry", label: "هندسة", subtitle: "فئة كمية", icon: FaRuler, color: "#a855f7" },
    { key: "statistics", label: "الإحصاء والإحتمالات", subtitle: "فئة كمية", icon: FaChartLine, color: "#a855f7" },
    { key: "arithmetic", label: "حساب", subtitle: "فئة كمية", icon: FaCalculator, color: "#a855f7" },
    { key: "comparison", label: "مقارنة كمية", subtitle: "فئة كمية", icon: FaBook, color: "#a855f7" },
  ];

  const handleTopicChange = (topic, value) => {
  try {
    const numValue = parseInt(value) || 0;
    
    // Validate number
    if (numValue < 0) {
      alert('العدد يجب أن يكون أكبر من أو يساوي صفر');
      return;
    }
    
    if (numValue > 50) {
      alert('العدد الأقصى لكل موضوع هو 50');
      return;
    }
    
    if (activeTab === "verbal") {
      setVerbalTopics(prev => ({ ...prev, [topic]: numValue }));
    } else {
      setQuantTopics(prev => ({ ...prev, [topic]: numValue }));
    }
  } catch (err) {
    alert('حدث خطأ أثناء تحديث عدد الأسئلة');
  }
};

  const getTotalQuestions = () => {
    const topics = activeTab === "verbal" ? verbalTopics : quantTopics;
    return Object.values(topics).reduce((sum, val) => sum + val, 0);
  };

  const getTotalTime = () => {
  const total = getTotalQuestions();
  if (settings.timed) {
    return settings.totalTime;
  }
  
  return Math.ceil(total * (settings.timePerQuestion / 60));
};

  const handleStartTest = () => {
  try {
    const totalQuestions = getTotalQuestions();
    if (totalQuestions === 0) {
      alert("يرجى اختيار عدد الأسئلة من الموضوعات أدناه");
      return;
    }

    if (totalQuestions > 100) {
      alert("العدد الأقصى للأسئلة هو 100");
      return;
    }
    
    // Navigate to test questions
    navigate('/exams/custom/start', {
      state: {
        settings,
        verbalTopics,
        quantTopics,
        activeTab,
        totalQuestions
      }
    });
  } catch (err) {
    alert('حدث خطأ أثناء إنشاء الاختبار. يرجى المحاولة مرة أخرى.');
  }
};

  const currentTopics = activeTab === "verbal" ? verbalTopicsData : quantTopicsData;
  const currentSelections = activeTab === "verbal" ? verbalTopics : quantTopics;

  return (
    <div style={{ direction: "rtl", minHeight: "100vh", background: "#f8f9fa", padding: "2rem" }}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="fw-bold">إنشاء اختبار مخصص</h2>
          <p className="text-muted">صمم اختباراتك المثالي حسب احتياجاتك</p>
           {/*instruture to test the custom test */}
          <div className="col-12 mb-4">
            <div className="alert alert-info d-flex align-items-center " role="alert">
              <FaBookOpen className="me-2 " />
              <div>
                for testing purpose pls use only max 2 questions of algebra 
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Left Sidebar - Settings */}
          <div className="col-lg-3">
            {/* Test Settings Card */}
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body">
                <h6 className="d-flex align-items-center mb-3">
                  <FaCog className="me-2 text-primary" />
                  إعدادات الاختبار
                </h6>

              

               {/* Timed Toggle */}
                <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                    <div className="fw-medium">سيتم حساب الوقت</div>
                    <small className="text-muted">تفعيل المؤقت</small>
                </div>
                <div className="form-check form-switch">
                    <input 
                    className="form-check-input" 
                    type="checkbox" 
                    checked={settings.timed}
                    onChange={(e) => setSettings({...settings, timed: e.target.checked})}
                    />
                </div>
                </div>

                {/* Time Settings */}
                {/* Time Settings - FIXED */}
                <div className="py-2">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-medium">الوقت لكل سؤال</span>
                    <span className="fw-bold text-primary">{settings.timePerQuestion} ثانية</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-muted">30 ثانية</small>
                    <small className="text-muted">3 دقائق</small>
                </div>
                <input 
                    type="range" 
                    className="form-range" 
                    min="30" 
                    max="180" 
                    step="30"
                    value={settings.timePerQuestion}
                    onChange={(e) => setSettings({...settings, timePerQuestion: parseInt(e.target.value)})}
                />
                </div>
              </div>
            </div>

            {/* Test Summary Card */}
            <div className="card shadow-sm border-0" style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
              <div className="card-body text-white">
                <h6 className="d-flex align-items-center mb-3">
                  <FaBolt className="me-2" />
                  ملخص الاختبار
                </h6>
                
                <div className="d-flex justify-content-between mb-2">
                  <span>إجمالي الأسئلة:</span>
                  <span className="fw-bold">{getTotalQuestions()}</span>
                </div>
                
                <div className="d-flex justify-content-between mb-3">
                  <span>الوقت الإجمالي:</span>
                  <span className="fw-bold">{getTotalTime()} دقيقة</span>
                </div>

                <button 
                  className="btn btn-light w-100 fw-bold"
                  onClick={handleStartTest}
                  disabled={getTotalQuestions() === 0}
                >
                  <FaChevronRight className="me-2" />
                  ابدأ الاختبار المخصص
                </button>

                {getTotalQuestions() === 0 && (
                  <div className="alert alert-warning mt-3 mb-0 p-2 text-center" style={{ fontSize: "0.85rem" }}>
                    <FaExclamationTriangle className="me-1" />
                    يرجى اختيار عدد من الأسئلة أو الضغط ابدأ الاختبار
                  </div>
                )}
              </div>
            </div>
          </div>

         


          

          {/* Right Content - Topics */}
          <div className="col-lg-9">
            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item flex-fill">
                <button 
                  className={`nav-link w-100 ${activeTab === "verbal" ? "active" : ""}`}
                  style={{
                    background: activeTab === "verbal" ? "#3b82f6" : "white",
                    color: activeTab === "verbal" ? "white" : "#666",
                    border: "none",
                    borderRadius: "8px 8px 0 0",
                  }}
                  onClick={() => setActiveTab("verbal")}
                >
                  <FaBookOpen className="me-2" />
                  اللفظي
                </button>
              </li>
              <li className="nav-item flex-fill">
                <button 
                  className={`nav-link w-100 ${activeTab === "quantitative" ? "active" : ""}`}
                  style={{
                    background: activeTab === "quantitative" ? "#a855f7" : "white",
                    color: activeTab === "quantitative" ? "white" : "#666",
                    border: "none",
                    borderRadius: "8px 8px 0 0",
                  }}
                  onClick={() => setActiveTab("quantitative")}
                >
                  <FaCalculator className="me-2" />
                  الكمي
                </button>
              </li>
            </ul>

            {/* Topics List */}
            <div className="row g-3">
              {currentTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <div key={topic.key} className="col-12">
                    <div className="card shadow-sm border-0">
                      <div className="card-body">
                        <div className="row align-items-center">
                          <div className="col-auto">
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ 
                                width: "50px", 
                                height: "50px", 
                                background: topic.color,
                                color: "white"
                              }}
                            >
                              <Icon size={24} />
                            </div>
                          </div>
                          <div className="col">
                            <h6 className="mb-0">{topic.label}</h6>
                            <small className="text-muted">{topic.subtitle}</small>
                          </div>
                          <div className="col-auto">
                            <div className="d-flex align-items-center gap-2">
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleTopicChange(topic.key, Math.max(0, currentSelections[topic.key] - 1))}
                              >
                                -
                              </button>
                              <input 
                                type="number" 
                                className="form-control text-center" 
                                style={{ width: "60px" }}
                                min="0"
                                value={currentSelections[topic.key]}
                                onChange={(e) => handleTopicChange(topic.key, e.target.value)}
                              />
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleTopicChange(topic.key, currentSelections[topic.key] + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTest;