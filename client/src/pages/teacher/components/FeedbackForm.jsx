import React, { useState } from 'react';

export default function FeedbackForm({ studentName, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ direction: "rtl" }}>
      <div className="mb-3">
        <label className="form-label fw-bold">اسم الطالب</label>
        <input
          type="text"
          className="form-control"
          value={studentName}
          disabled
          style={{ textAlign: "right" }}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">عنوان التقييم *</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="أدخل عنوان التقييم"
          required
          style={{ textAlign: "right" }}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">نص التقييم *</label>
        <textarea
          className="form-control"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          placeholder="أدخل نص التقييم"
          required
          style={{ textAlign: "right" }}
        />
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          إلغاء
        </button>
        <button type="submit" className="btn btn-success">
          إرسال
        </button>
      </div>
    </form>
  );
}

