import React, { useState, useEffect, useRef } from 'react';
import { getPassages } from '../../../services/api';

// Hardcoded internal types array
const internalTypes = [
  { internal_type_id: 1, type_id: 1, internal_name: "استيعاب المقروء" },
  { internal_type_id: 2, type_id: 1, internal_name: "التناظر اللفظي" },
  { internal_type_id: 3, type_id: 1, internal_name: "إكمال الجمل" },
  { internal_type_id: 4, type_id: 1, internal_name: "الخطأ السياقي" },
  { internal_type_id: 5, type_id: 1, internal_name: "المفردة الشاذة" },
  { internal_type_id: 6, type_id: 2, internal_name: "جبر" },
  { internal_type_id: 7, type_id: 2, internal_name: "هندسة" },
  { internal_type_id: 8, type_id: 2, internal_name: "الإحصاء والاحتمالات" },
  { internal_type_id: 9, type_id: 2, internal_name: "حساب" },
  { internal_type_id: 10, type_id: 2, internal_name: "مقارنات كمية" }
];

export default function QuestionForm({ initialData = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(() => ({
    type_id: initialData?.type_id || 1,
    internal_type_id: initialData?.internal_type_id || "",
    passage_id: initialData?.passage_id?._id || initialData?.passage_id || "",
    is_question_text: initialData?.is_question_text !== undefined ? initialData.is_question_text : true,
    question_text: initialData?.question_text || "",
    question_image: initialData?.question_image || "",
    mc_a: initialData?.mc_a || "",
    mc_b: initialData?.mc_b || "",
    mc_c: initialData?.mc_c || "",
    mc_d: initialData?.mc_d || "",
    correct_answer: initialData?.correct_answer || "a",
    explanation: initialData?.explanation || "",
    is_comparable: initialData?.is_comparable || false,
    comparable_option1_text: initialData?.comparable_option1_text || "",
    comparable_option2_text: initialData?.comparable_option2_text || "",
    comparable_value1: initialData?.comparable_value1 || "",
    comparable_value2: initialData?.comparable_value2 || "",
    have_visualization: initialData?.have_visualization || false,
    visualization_image_url: initialData?.visualization_image_url || "",
  }));

  const [selectedType, setSelectedType] = useState(formData.type_id || "");
  const [passages, setPassages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const hasLoadedRef = useRef(false);
  const alertShownRef = useRef(false);
  const initialDataProcessedRef = useRef(false);

  // Load data once on mount
  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;
    loadData().then(() => {
      // After loading, process initialData if it exists
      if (initialData && !initialDataProcessedRef.current) {
        initialDataProcessedRef.current = true;
        const typeId = initialData.type_id || formData.type_id;
        setSelectedType(typeId);
        setFormData(prev => ({
          ...prev,
          type_id: typeId,
          internal_type_id: initialData.internal_type_id || prev.internal_type_id,
          passage_id: initialData.passage_id?._id || initialData.passage_id || prev.passage_id,
          is_question_text: initialData.is_question_text !== undefined ? initialData.is_question_text : prev.is_question_text,
          question_text: initialData.question_text || prev.question_text,
          question_image: initialData.question_image || prev.question_image,
          mc_a: initialData.mc_a || prev.mc_a,
          mc_b: initialData.mc_b || prev.mc_b,
          mc_c: initialData.mc_c || prev.mc_c,
          mc_d: initialData.mc_d || prev.mc_d,
          correct_answer: initialData.correct_answer || prev.correct_answer,
          explanation: initialData.explanation || prev.explanation,
          is_comparable: initialData.is_comparable || prev.is_comparable,
          comparable_option1_text: initialData.comparable_option1_text || prev.comparable_option1_text,
          comparable_option2_text: initialData.comparable_option2_text || prev.comparable_option2_text,
          comparable_value1: initialData.comparable_value1 || prev.comparable_value1,
          comparable_value2: initialData.comparable_value2 || prev.comparable_value2,
          have_visualization: initialData.have_visualization || prev.have_visualization,
          visualization_image_url: initialData.visualization_image_url || prev.visualization_image_url,
        }));
      }
    });
  }, []);

  // Update selectedType when formData.type_id changes
  useEffect(() => {
    if (formData.type_id) {
      setSelectedType(formData.type_id);
    }
  }, [formData.type_id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const passagesData = await getPassages();
      setPassages(passagesData.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      if (!alertShownRef.current) {
        alertShownRef.current = true;
        alert('حدث خطأ أثناء تحميل البيانات');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    // Validate required fields based on internal_type_id
    if (!formData.internal_type_id) {
      newErrors.internal_type_id = 'النوع الداخلي مطلوب';
    }
    
    // Validate question content
    if (formData.is_question_text && !formData.question_text.trim()) {
      newErrors.question_text = 'نص السؤال مطلوب';
    }
    
    if (!formData.is_question_text && !formData.question_image.trim()) {
      newErrors.question_image = 'رابط صورة السؤال مطلوب';
    }
    
    // Validate choices
    if (!formData.mc_a.trim() || !formData.mc_b.trim() || 
        !formData.mc_c.trim() || !formData.mc_d.trim()) {
      newErrors.choices = 'جميع الخيارات مطلوبة';
    }
    
    // Validate passage for Reading Comprehension (internal_type_id = 1)
    const internalTypeIdNum = parseInt(formData.internal_type_id);
    if (internalTypeIdNum === 1 && !formData.passage_id) {
      newErrors.passage_id = 'الفقرة مطلوبة لأسئلة استيعاب المقروء';
    }
    
    // Validate comparable fields if is_comparable is true
    if (formData.is_comparable) {
      if (!formData.comparable_option1_text.trim() || !formData.comparable_option2_text.trim()) {
        newErrors.comparable = 'نصوص المقارنة مطلوبة';
      }
      // For quantitative comparisons (internal_type_id = 10), values are needed
      if (internalTypeIdNum === 10) {
        if (!formData.comparable_value1.trim() || !formData.comparable_value2.trim()) {
          newErrors.comparable_values = 'قيم المقارنة مطلوبة';
        }
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Prepare data for submission
    const submitData = {
      ...formData,
      type_id: parseInt(formData.type_id),
      internal_type_id: parseInt(formData.internal_type_id),
      passage_id: formData.passage_id || null,
      is_question_text: formData.is_question_text,
      is_comparable: formData.is_comparable || false,
      have_visualization: formData.have_visualization || false,
    };
    
    // Remove q_no - backend will generate it automatically
    delete submitData.q_no;
    
    // Remove empty optional fields
    if (!submitData.explanation) delete submitData.explanation;
    if (!submitData.passage_id) delete submitData.passage_id;
    if (!submitData.is_comparable) {
      delete submitData.comparable_option1_text;
      delete submitData.comparable_option2_text;
      delete submitData.comparable_value1;
      delete submitData.comparable_value2;
    }
    if (!submitData.have_visualization) {
      delete submitData.visualization_image_url;
    }
    
    onSubmit(submitData);
  };


  // Determine which fields to show based on internal_type_id
  const internalTypeIdNum = parseInt(formData.internal_type_id);
  const showPassageField = internalTypeIdNum === 1; // Reading Comprehension
  const showImageField = !formData.is_question_text; // Show when question type is image
  const showComparableFields = formData.is_comparable; // Only show when checkbox is checked
  const showVisualizationField = formData.have_visualization;
  const showComparableValues = formData.is_comparable && internalTypeIdNum === 10; // Quantitative Comparisons

  if (loading) {
    return <div className="text-center py-4">جاري التحميل...</div>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ direction: "rtl" }}>
      {/* Type Selection */}
      <div className="row mb-3">
        <div className="col-12 col-md-6 mb-2 mb-md-0">
          <label className="form-label fw-bold">النوع (لفظي / كمي) *</label>
          <select
            className="form-control"
            value={formData.type_id}
            onChange={(e) => {
              const val = Number(e.target.value);
              setSelectedType(val);
              setFormData({ ...formData, type_id: val, internal_type_id: "" });
            }}
          >
            <option value="">اختر النوع</option>
            <option value={1}>لفظي</option>
            <option value={2}>كمي</option>
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label fw-bold">النوع الداخلي *</label>
          <select
            className={`form-control ${errors.internal_type_id ? 'is-invalid' : ''}`}
            value={formData.internal_type_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                internal_type_id: Number(e.target.value)
              })
            }
            disabled={!selectedType}
          >
            <option value="">اختر النوع الداخلي</option>

            {internalTypes
              .filter((t) => t.type_id === selectedType)
              .map((item) => (
                <option key={item.internal_type_id} value={item.internal_type_id}>
                  {item.internal_name}
                </option>
              ))}
          </select>
          {errors.internal_type_id && (
            <div className="invalid-feedback d-block">{errors.internal_type_id}</div>
          )}
        </div>
      </div>

      {/* Passage Field - Only for Reading Comprehension */}
      {showPassageField && (
        <div className="mb-3">
          <label className="form-label fw-bold">الفقرة (Passage) *</label>
          <select
            className={`form-select ${errors.passage_id ? 'is-invalid' : ''}`}
            name="passage_id"
            value={formData.passage_id}
            onChange={handleInputChange}
            required={showPassageField}
          >
            <option value="">اختر الفقرة</option>
            {passages.map(passage => (
              <option key={passage._id} value={passage._id}>
                {passage.title}
              </option>
            ))}
          </select>
          {errors.passage_id && (
            <div className="invalid-feedback d-block">{errors.passage_id}</div>
          )}
        </div>
      )}

      {/* Question Type (Text/Image) */}
      <div className="mb-3">
        <label className="form-label fw-bold">نوع السؤال *</label>
        <select
          className="form-select"
          name="is_question_text"
          value={formData.is_question_text ? 'true' : 'false'}
          onChange={(e) => setFormData(prev => ({ ...prev, is_question_text: e.target.value === 'true' }))}
          required
        >
          <option value="true">نصي</option>
          <option value="false">صورة</option>
        </select>
      </div>

      {/* Question Text */}
      {formData.is_question_text && (
        <div className="mb-3">
          <label className="form-label fw-bold">نص السؤال *</label>
          <textarea
            className={`form-control ${errors.question_text ? 'is-invalid' : ''}`}
            name="question_text"
            value={formData.question_text}
            onChange={handleInputChange}
            rows="3"
            required={formData.is_question_text}
            style={{ textAlign: "right" }}
          />
          {errors.question_text && (
            <div className="invalid-feedback d-block">{errors.question_text}</div>
          )}
        </div>
      )}

      {/* Question Image URL - Replaced file upload with URL input */}
      {showImageField && (
        <div className="mb-3">
          <label className="form-label fw-bold">
            {formData.is_question_text ? 'رابط صورة السؤال (اختياري)' : 'رابط صورة السؤال *'}
          </label>
          <input
            type="text"
            className={`form-control ${errors.question_image ? 'is-invalid' : ''}`}
            name="question_image"
            value={formData.question_image}
            onChange={handleInputChange}
            placeholder="https://example.com/image.png"
            required={!formData.is_question_text}
            style={{ textAlign: "right" }}
          />
          {errors.question_image && (
            <div className="invalid-feedback d-block">{errors.question_image}</div>
          )}
          {formData.question_image && (
            <img 
              src={formData.question_image} 
              alt="Preview" 
              style={{ maxWidth: '200px', marginTop: '10px' }} 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
        </div>
      )}

      {/* Choices */}
      <div className="mb-3">
        <label className="form-label fw-bold">الخيارات *</label>
        {errors.choices && (
          <div className="text-danger mb-2">{errors.choices}</div>
        )}
        {['a', 'b', 'c', 'd'].map((option) => (
          <div key={option} className="mb-2">
            <div className="input-group">
              <span className="input-group-text">
                <input
                  type="radio"
                  name="correct_answer"
                  checked={formData.correct_answer === option}
                  onChange={() => setFormData(prev => ({ ...prev, correct_answer: option }))}
                  className="form-check-input"
                />
                <span className="ms-2">{option.toUpperCase()}</span>
              </span>
              <input
                type="text"
                className="form-control"
                value={formData[`mc_${option}`]}
                onChange={(e) => setFormData(prev => ({ ...prev, [`mc_${option}`]: e.target.value }))}
                placeholder={`الخيار ${option.toUpperCase()}`}
                required
                style={{ textAlign: "right" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Explanation */}
      <div className="mb-3">
        <label className="form-label fw-bold">الشرح (اختياري)</label>
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

      {/* Comparable Question */}
      <div className="mb-3">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="is_comparable"
            checked={formData.is_comparable}
            onChange={handleInputChange}
            id="is_comparable"
          />
          <label className="form-check-label fw-bold" htmlFor="is_comparable">
            سؤال مقارنة
          </label>
        </div>
      </div>

      {/* Comparable Fields - Only show when is_comparable is true */}
      {showComparableFields && (
        <div className="mb-3 border p-3 rounded">
          <label className="form-label fw-bold">حقول المقارنة *</label>
          {errors.comparable && (
            <div className="text-danger mb-2">{errors.comparable}</div>
          )}
          <div className="row mb-2">
            <div className="col-12 col-md-6">
              <label className="form-label">النص الأول *</label>
              <input
                type="text"
                className="form-control"
                name="comparable_option1_text"
                value={formData.comparable_option1_text}
                onChange={handleInputChange}
                required={showComparableFields}
                style={{ textAlign: "right" }}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label">النص الثاني *</label>
              <input
                type="text"
                className="form-control"
                name="comparable_option2_text"
                value={formData.comparable_option2_text}
                onChange={handleInputChange}
                required={showComparableFields}
                style={{ textAlign: "right" }}
              />
            </div>
          </div>
          
          {/* Comparable Values for Quantitative Comparisons */}
          {showComparableValues && (
            <div className="row">
              <div className="col-12 col-md-6">
                <label className="form-label">القيمة الأولى *</label>
                <input
                  type="text"
                  className={`form-control ${errors.comparable_values ? 'is-invalid' : ''}`}
                  name="comparable_value1"
                  value={formData.comparable_value1}
                  onChange={handleInputChange}
                  required={showComparableValues}
                  style={{ textAlign: "right" }}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">القيمة الثانية *</label>
                <input
                  type="text"
                  className={`form-control ${errors.comparable_values ? 'is-invalid' : ''}`}
                  name="comparable_value2"
                  value={formData.comparable_value2}
                  onChange={handleInputChange}
                  required={showComparableValues}
                  style={{ textAlign: "right" }}
                />
              </div>
              {errors.comparable_values && (
                <div className="invalid-feedback d-block">{errors.comparable_values}</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Visualization */}
      <div className="mb-3">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="have_visualization"
            checked={formData.have_visualization}
            onChange={handleInputChange}
            id="have_visualization"
          />
          <label className="form-check-label fw-bold" htmlFor="have_visualization">
            يحتوي على رسم/تصور
          </label>
        </div>
      </div>

      {/* Visualization Image URL */}
      {showVisualizationField && (
        <div className="mb-3">
          <label className="form-label fw-bold">رابط صورة التصور</label>
          <input
            type="text"
            className="form-control"
            name="visualization_image_url"
            value={formData.visualization_image_url}
            onChange={handleInputChange}
            placeholder="https://example.com/visualization.png"
            style={{ textAlign: "right" }}
          />
          {formData.visualization_image_url && (
            <img 
              src={formData.visualization_image_url} 
              alt="Visualization" 
              style={{ maxWidth: '200px', marginTop: '10px' }} 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
        </div>
      )}

      {/* Submit Buttons */}
      <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-4">
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
