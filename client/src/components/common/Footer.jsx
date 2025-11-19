export default function Footer() {
  return (
    <footer 
      className="mt-auto"
      style={{
        backgroundColor: "#ffffff",
        borderTop: "2px solid #4B0082",
        direction: "rtl",
        position: "relative",
        bottom: 0,
        width: "100%",
        boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.05)"
      }}
    >
      <div className="container py-4">
        <div className="row align-items-center">
          {/* Right side - Logo/Brand */}
          <div className="col-md-4 text-md-end text-center mb-3 mb-md-0">
            <h5 className="fw-bold mb-0" style={{ color: "#4B0082" }}>
              SWE363
            </h5>
          </div>

          {/* Center - Main text */}
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <p className="mb-1 fw-bold" style={{ color: "#4B0082", fontSize: "18px" }}>
              منصة القدرات التعليمية
            </p>
            <p className="mb-0 text-muted" style={{ fontSize: "14px" }}>
              By Team 27 - SWE363
            </p>
          </div>

        </div>

        {/* Divider */}
        <hr className="my-3" style={{ opacity: 0.1 }} />

      </div>
    </footer>
  );
}