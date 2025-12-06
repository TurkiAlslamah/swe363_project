export default function Explanations({ show, onClose, explanation }) {
  if (!show) return null;

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
      style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999 }}
      onClick={onClose}
      dir="rtl"
    >
      <div 
        className="bg-white rounded-4 p-4 shadow-lg" 
        style={{ maxWidth: "600px", width: "90%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">📖 شرح السؤال</h4>
          <button 
            onClick={onClose}
            className="btn-close"
          ></button>
        </div>
        <div className="mb-3">
          <p style={{ lineHeight: "1.8", fontSize: "16px" }}>
            {explanation || "لا يوجد شرح متاح لهذا السؤال"}
          </p>
        </div>
        <div className="text-end">
          <button 
            onClick={onClose}
            className="btn text-white px-4 py-2"
            style={{ backgroundColor: "#4B0082", borderRadius: "12px", border: "none" }}
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
