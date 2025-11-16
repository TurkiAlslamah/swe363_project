import { useState } from "react";
import { on } from "ws";

export default function ReportQuestion({ show, onClose, questionId,onReportSubmitted  }) {
  const [reportText, setReportText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!show) return null;

  const handleSubmit = () => {
    if (!reportText.trim()) {
      alert("الرجاء كتابة سبب التبليغ");
      return;
      
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      
      setReportText("");
      setIsSubmitting(false);
      onClose();
      onReportSubmitted();
    }, 1000);
  };

  const handleClose = () => {
    setReportText("");
    onClose();
  };

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 }}
      onClick={handleClose}
      dir="rtl"
    >
      <div 
        className="bg-white rounded-4 p-4 shadow-lg" 
        style={{ maxWidth: "600px", width: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">⚠️ تبليغ عن خطأ</h4>
          <button 
            onClick={handleClose}
            className="btn-close"
            disabled={isSubmitting}
          ></button>
        </div>
        
        <div className="mb-3">
          <label className="form-label fw-bold">ما هو الخطأ في هذا السؤال؟</label>
          <textarea
            className="form-control"
            rows="5"
            placeholder="اكتب تفاصيل الخطأ هنا... (مثال: الإجابة الصحيحة خاطئة، الصورة غير واضحة، خطأ في الصياغة)"
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            disabled={isSubmitting}
            style={{ 
              borderRadius: "12px",
              border: "2px solid #E5E7EB",
              padding: "12px",
              fontSize: "16px"
            }}
          />
        </div>

        <div className="d-flex gap-2 justify-content-end">
          <button 
            onClick={handleClose}
            className="btn btn-light px-4 py-2"
            style={{ borderRadius: "12px", fontWeight: "bold" }}
            disabled={isSubmitting}
          >
            إلغاء
          </button>
          <button 
            onClick={handleSubmit}
            className="btn text-white px-4 py-2"
            style={{ 
              backgroundColor: "#4B0082", 
              borderRadius: "12px", 
              fontWeight: "bold",
              border: "none" 
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري الإرسال..." : "إرسال التبليغ"}
            
          </button>
        </div>
      </div>
    </div>
  );
}