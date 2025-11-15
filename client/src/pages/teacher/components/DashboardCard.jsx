import React from 'react';

export default function DashboardCard({ title, value, icon }) {
  return (
    <div 
      className="card shadow-sm border-0 mb-4"
      style={{
        borderRadius: "12px",
        minHeight: "150px",
        direction: "rtl"
      }}
    >
      <div className="card-body d-flex flex-column justify-content-center align-items-center p-4">
        {icon && <div className="mb-3" style={{ fontSize: "2.5rem" }}>{icon}</div>}
        <h5 
          className="card-title mb-3 fw-bold"
          style={{ color: "#6B46C1" }}
        >
          {title}
        </h5>
        <h2 
          className="mb-0 fw-bold"
          style={{ color: "#6B46C1", fontSize: "2.5rem" }}
        >
          {value || "0"}
        </h2>
      </div>
    </div>
  );
}

