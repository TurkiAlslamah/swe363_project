import React from 'react';

export default function SearchBar({ placeholder, value, onChange, className = "" }) {
  return (
    <div className={`mb-4 ${className}`} style={{ direction: "rtl" }}>
      <div className="input-group" style={{ maxWidth: "500px", margin: "0 auto" }}>
        <input
          type="text"
          className="form-control"
          placeholder={placeholder || "بحث..."}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ textAlign: "right" }}
        />
        <span className="input-group-text">
          <i className="bi bi-search"></i>
        </span>
      </div>
    </div>
  );
}

