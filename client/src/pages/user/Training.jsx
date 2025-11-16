import { useState } from "react";
import { FaBook, FaLanguage, FaFileAlt, FaBullseye, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Training() {
  const [activeSection, setActiveSection] = useState("كمي");

  const verbalSections = [
    { id: 1, title: "استيعاب المقروء", progress: 1528, total: 15, percentage: 1, colorClass: "blue", icon: "book" },
    { id: 2, title: "التناظر اللفظي", progress: 777, total: 4, percentage: 1, colorClass: "purple", icon: "language" },
    { id: 3, title: "إكمال الجمل", progress: 589, total: 4, percentage: 1, colorClass: "green", icon: "file" },
    { id: 4, title: "الخطأ السياقي", progress: 736, total: 1, percentage: 1, colorClass: "red", icon: "target" },
    { id: 5, title: "المفردة الشاذة", progress: 516, total: 1, percentage: 1, colorClass: "orange", icon: "star" },
  ];

  const quantSections = [
    { id: 6, title: "جبر", progress: 450, total: 12, percentage: 1, colorClass: "indigo", icon: "book" },
    { id: 7, title: "هندسة", progress: 320, total: 8, percentage: 1, colorClass: "indigo", icon: "language" },
    { id: 8, title: "الاحصاء", progress: 280, total: 6, percentage: 1, colorClass: "indigo", icon: "file" },
    { id: 9, title: "حساب", progress: 520, total: 10, percentage: 4, colorClass: "indigo", icon: "target" },
    { id: 10, title: "مقارنات كمية", progress: 610, total: 15, percentage: 1, colorClass: "indigo", icon: "star" },
  ];

  const colors = {
    blue: "#5B8DEE",
    purple: "#A78BFA",
    green: "#34D399",
    red: "#F87171",
    orange: "#FBBF24",
    indigo: "#6B21A8"
  };

  const icons = {
    book: <FaBook size={24} />,
    language: <FaLanguage size={24} />,
    file: <FaFileAlt size={24} />,
    target: <FaBullseye size={24} />,
    star: <FaStar size={24} />
  };

  const sections = activeSection === "لفظي" ? verbalSections : quantSections;

  return (
    <div 
      className="min-vh-100 p-4" 
      dir="rtl"
      style={{ 
        backgroundColor: "#F3F4F6",
        paddingTop: "100px"
      }}
    >
      <div className="container" style={{ maxWidth: "800px" }}>
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="fw-bold mb-2" style={{ color: "#1F2937", fontSize: "32px" }}>التدريبات</h1>
          <p className="text-muted mb-4">اختر نوع التدريب وابدأ رحلة التعلم</p>
        </div>

        {/* Toggle Buttons */}
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

        {/* Section Cards */}
        <div className="d-flex flex-column gap-3">
          {sections.map((section) => {
            const bgColor = colors[section.colorClass];
            const icon = icons[section.icon];
            
            return (
              <div
                key={section.id}
                className="card border-0 shadow-sm"
                style={{
                  borderRadius: "16px",
                  backgroundColor: "#FFFFFF"
                }}
              >
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    {/* Right Side - Icon & Title */}
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
                        {section.title}
                      </h5>
                    </div>

                    {/* Center - Progress Info */}
                    <div className="flex-grow-1 mx-4">
                      {/* Progress Bar */}
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
                      
                      {/* Progress Text */}
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ color: "#10B981", fontSize: "18px" }}>●</span>
                        <small className="text-muted" style={{ fontSize: "13px" }}>
                          {section.total} / {section.progress} مكتمل
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

                    {/* Left Side - Button */}
                    <Link 
                    to={`/training/${section.id}`}
                    className="btn text-white fw-bold d-flex align-items-center gap-2"
                    style={{
                        backgroundColor: bgColor,
                        borderRadius: "12px",
                        border: "none",
                        padding: "10px 20px",
                        textDecoration: "none"
                    }}
                    >
                    <span>◄</span>
                    <span>متابعة</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );}
