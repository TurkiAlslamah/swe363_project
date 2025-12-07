import { useState, useEffect } from "react";
import { FaBook, FaLanguage, FaFileAlt, FaBullseye, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const API_URL = "/api";
const getToken = () => localStorage.getItem("token");

export default function Training() {
  const [activeSection, setActiveSection] = useState("كمي");
  const [trainingData, setTrainingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTrainingData();
  }, [activeSection]);

  const loadTrainingData = async () => {
    setLoading(true);
    setError(null);
    try {
      const typeId = activeSection === "لفظي" ? 1 : 2;
      const res = await fetch(`${API_URL}/training/overview?type_id=${typeId}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      
      if (data.success) {
        setTrainingData(data.data);
      } else {
        setError(data.message || "حدث خطأ في تحميل البيانات");
      }
    } catch (err) {
      setError("فشل الاتصال بالخادم");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const colors = {
    1: "#5B8DEE", 2: "#A78BFA", 3: "#34D399", 4: "#F87171", 5: "#FBBF24",
    6: "#6B21A8", 7: "#8B5CF6", 8: "#10B981", 9: "#F59E0B", 10: "#6366F1"  // Add 10
};

const icons = {
    1: <FaBook size={24} />, 2: <FaLanguage size={24} />, 3: <FaFileAlt size={24} />,
    4: <FaBullseye size={24} />, 5: <FaStar size={24} />, 6: <FaBook size={24} />,
    7: <FaLanguage size={24} />, 8: <FaFileAlt size={24} />, 9: <FaBullseye size={24} />,
    10: <FaStar size={24} />  // Add 10
};

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" dir="rtl">
        <div className="text-center">
          <h3 className="text-danger">{error}</h3>
          <button onClick={loadTrainingData} className="btn btn-primary mt-3">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-vh-100 p-4" 
      dir="rtl"
      style={{ backgroundColor: "#F3F4F6", paddingTop: "100px" }}
    >
      <div className="container" style={{ maxWidth: "800px" }}>
        <div className="text-center mb-4">
          <h1 className="fw-bold mb-2" style={{ color: "#1F2937", fontSize: "32px" }}>التدريبات</h1>
          <p className="text-muted mb-4">اختر نوع التدريب وابدأ رحلة التعلم</p>
        </div>

        <div className="d-flex justify-content-center gap-2 mb-4">
          <button
            onClick={() => setActiveSection("كمي")}
            className="btn px-4 py-2 fw-bold"
            style={{
              borderRadius: "12px",
              fontSize: "16px",
              border: "none",
              backgroundColor: activeSection === "كمي" ? "#3B82F6" : "#FFFFFF",
              color: activeSection === "كمي" ? "#FFFFFF" : "#6B7280",
              boxShadow: activeSection === "كمي" ? "0 4px 6px rgba(59, 130, 246, 0.3)" : "none",
              transition: "all 0.3s"
            }}
          >
            القسم الكمي
          </button>
          <button
            onClick={() => setActiveSection("لفظي")}
            className="btn px-4 py-2 fw-bold"
            style={{
              borderRadius: "12px",
              fontSize: "16px",
              border: "none",
              backgroundColor: activeSection === "لفظي" ? "#3B82F6" : "#FFFFFF",
              color: activeSection === "لفظي" ? "#FFFFFF" : "#6B7280",
              boxShadow: activeSection === "لفظي" ? "0 4px 6px rgba(59, 130, 246, 0.3)" : "none",
              transition: "all 0.3s"
            }}
          >
            القسم اللفظي
          </button>
        </div>

        <div className="d-flex flex-column gap-3">
          {trainingData.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">لا توجد تدريبات متاحة حالياً</p>
            </div>
          ) : (
            trainingData.map((section) => {
              const bgColor = colors[section.internal_type_id] || "#6366f1";
              const icon = icons[section.internal_type_id] || <FaBook size={24} />;
              
              return (
                <div
                  key={section.internal_type_id}
                  className="card border-0 shadow-sm"
                  style={{ borderRadius: "16px", backgroundColor: "#FFFFFF" }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-3"
                          style={{
                            width: "56px",
                            height: "56px",
                            backgroundColor: bgColor,
                            color: "white",
                            flexShrink: 0
                          }}
                        >
                          {icon}
                        </div>
                        <h5 className="fw-bold mb-0" style={{ color: "#1F2937", fontSize: "18px" }}>
                          {section.internal_name}
                        </h5>
                      </div>

                      <div className="flex-grow-1 mx-4">
                        <div
                          className="progress mb-2"
                          style={{ height: "6px", borderRadius: "10px", backgroundColor: "#E5E7EB" }}
                        >
                          <div
                            className="progress-bar"
                            style={{
                              width: `${section.percentage}%`,
                              backgroundColor: bgColor,
                              borderRadius: "10px"
                            }}
                          ></div>
                        </div>
                        
                        <div className="d-flex align-items-center gap-2">
                          <span style={{ color: "#10B981", fontSize: "18px" }}>●</span>
                          <small className="text-muted" style={{ fontSize: "13px" }}>
                            {section.completed_questions} / {section.total_questions} مكتمل
                          </small>
                          <span 
                            className="badge" 
                            style={{ 
                              backgroundColor: "#F3F4F6", 
                              color: "#6B7280",
                              fontWeight: "600",
                              fontSize: "12px"
                            }}
                          >
                            {section.percentage}%
                          </span>
                        </div>
                      </div>

                     <Link 
                      to={`/training/${section.internal_type_id}`}
                      state={{ 
                        startIndex: section.last_question_index || 0,
                        internalTypeName: section.internal_name,
                        totalQuestions: section.total_questions
                      }}
                      className="btn text-white fw-bold d-flex align-items-center gap-2"
                      style={{
                        backgroundColor: bgColor,
                        borderRadius: "12px",
                        border: "none",
                        padding: "8px 16px",
                        textDecoration: "none",
                        fontSize: "14px",
                        whiteSpace: "nowrap"
                      }}
                    >
                      <span className="d-none d-md-inline">◄</span>
                      <span>متابعة</span>
                    </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}