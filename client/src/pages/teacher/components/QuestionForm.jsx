import React, { useState } from 'react';

export default function QuestionForm({ initialData = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    questionText: initialData?.questionText || "",
    questionImage: null,
    questionType: initialData?.questionType || "نصي",
    category: initialData?.category || "لفظي",
    internalType: initialData?.internalType || "",
    passageLink: initialData?.passageLink || "",
    questionOrder: initialData?.questionOrder || 1,
    explanation: initialData?.explanation || "",
    options: initialData?.options || [
      { id: 1, text: "" },
      { id: 2, text: "" },
      { id: 3, text: "" },
      { id: 4, text: "" }
    ],
    correctAnswer: initialData?.correctAnswer || 1
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert questionOrder to number
    if (name === 'questionOrder') {
      const numValue = parseInt(value) || 0;
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleOptionChange = (id, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map(opt =>
        opt.id === id ? { ...opt, text: value } : opt
      )
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, questionImage: file }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ direction: "rtl" }}>
      <div className="mb-3">
        <label className="form-label fw-bold">نص السؤال *</label>
        <textarea
          className="form-control"
          name="questionText"
          value={formData.questionText}
          onChange={handleInputChange}
          rows="3"
          required
          style={{ textAlign: "right" }}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">صورة السؤال (اختياري)</label>
        <div className="d-flex align-items-center">
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="btn btn-outline-primary ms-2"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              fontSize: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => document.querySelector('input[type="file"]').click()}
          >
            +
          </button>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label fw-bold">نوع السؤال *</label>
          <select
            className="form-select"
            name="questionType"
            value={formData.questionType}
            onChange={handleInputChange}
            required
          >
            <option value="نصي">نصي</option>
            <option value="صورة">صورة</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label fw-bold">النوع (لفظي / كمي) *</label>
          <select
            className="form-select"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="لفظي">لفظي</option>
            <option value="كمي">كمي</option>
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">النوع الداخلي</label>
        <input
          type="text"
          className="form-control"
          name="internalType"
          value={formData.internalType}
          onChange={handleInputChange}
          placeholder="مثال: فهم المقروء، حساب، مفردات"
          style={{ textAlign: "right" }}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">ربط السؤال لقطعة</label>
        <input
          type="text"
          className="form-control"
          name="passageLink"
          value={formData.passageLink}
          onChange={handleInputChange}
          placeholder="رقم القطعة (إن وجدت)"
          style={{ textAlign: "right" }}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">رقم السؤال (ترتيب السؤال) *</label>
        <input
          type="number"
          className="form-control"
          name="questionOrder"
          value={formData.questionOrder || ''}
          onChange={handleInputChange}
          min="1"
          required
          style={{ textAlign: "right" }}
        />
        <small className="text-muted">يمكنك تعديل رقم السؤال يدوياً</small>
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">الشرح</label>
        <textarea
          className="form-control"
          name="explanation"
          value={formData.explanation}
          onChange={handleInputChange}
          rows="3"
          placeholder="شرح الإجابة الصحيحة"
          style={{ textAlign: "right" }}
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">خيارات (اختيار واحد يكتب فقط) *</label>
        {formData.options.map((option) => (
          <div key={option.id} className="mb-2">
            <div className="input-group">
              <span className="input-group-text">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={formData.correctAnswer === option.id}
                  onChange={() => setFormData(prev => ({ ...prev, correctAnswer: option.id }))}
                  className="form-check-input"
                />
              </span>
              <input
                type="text"
                className="form-control"
                value={option.text}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                placeholder={`الخيار ${option.id}`}
                required
                style={{ textAlign: "right" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          إلغاء
        </button>
        <button type="submit" className="btn btn-primary">
          {initialData ? "تحديث" : "إضافة"}
        </button>
      </div>
    </form>
  );
}

