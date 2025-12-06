// src/pages/admin/EditQuestionAdmin.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../../api/http";

// أنواع الأسئلة (لفظي / كمي)
const questionTypes = [
  { type_id: 1, type_name: "لفظي", type_name_en: "Verbal" },
  { type_id: 2, type_name: "كمي", type_name_en: "Quantitative" },
];

// الأنواع الداخلية
const internalTypes = [
  { internal_type_id: 1, type_id: 1, internal_name: "استيعاب المقروء", internal_name_en: "Reading Comprehension" },
  { internal_type_id: 2, type_id: 1, internal_name: "التناظر اللفظي", internal_name_en: "Verbal Analogies" },
  { internal_type_id: 3, type_id: 1, internal_name: "إكمال الجمل", internal_name_en: "Sentence Completion" },
  { internal_type_id: 4, type_id: 1, internal_name: "الخطأ السياقي", internal_name_en: "Contextual Error" },
  { internal_type_id: 5, type_id: 1, internal_name: "المفردة الشاذة", internal_name_en: "Odd Word Out" },
  { internal_type_id: 6, type_id: 2, internal_name: "جبر", internal_name_en: "Algebra" },
  { internal_type_id: 7, type_id: 2, internal_name: "هندسة", internal_name_en: "Geometry" },
  { internal_type_id: 8, type_id: 2, internal_name: "الإحصاء والاحتمالات", internal_name_en: "Statistics" },
  { internal_type_id: 9, type_id: 2, internal_name: "حساب", internal_name_en: "Arithmetic" },
  { internal_type_id: 10, type_id: 2, internal_name: "مقارنات كمية", internal_name_en: "Quantitative Comparisons" },
];

const STATUS_OPTIONS = ["قيد المراجعة", "مقبول", "مرفوض"];

export default function EditQuestionAdmin() {
  const { id: routeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [questionId, setQuestionId] = useState(null);
  const [initialStatus, setInitialStatus] = useState("قيد المراجعة");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    q_no: "",
    is_question_text: true,
    question_text: "",
    question_image: "",
    type_id: "",
    internal_type_id: "",
    passage_id: "",
    mc_a: "",
    mc_b: "",
    mc_c: "",
    mc_d: "",
    correct_answer: "a",
    explanation: "",
    is_comparable: false,
    comparable_option1_text: "",
    comparable_option2_text: "",
    have_visualization: false,
    visualization_image_url: "",
    status: "قيد المراجعة",
  });

  const availableInternalTypes = internalTypes.filter(
    (t) => Number(t.type_id) === Number(formData.type_id)
  );

  // هل هذا السؤال من نوع "استيعاب المقروء"؟
  const isReadingComprehension =
    Number(formData.internal_type_id) === 1;

  // تحميل البيانات
  useEffect(() => {
    const fromState = location.state?.question;

    if (fromState) {
      const id = fromState._id || fromState.id || fromState.q_no || routeId;

      setQuestionId(id);
      setInitialStatus(fromState.status || "قيد المراجعة");

      setFormData({
        q_no: fromState.q_no ?? "",
        is_question_text:
          typeof fromState.is_question_text === "boolean"
            ? fromState.is_question_text
            : true,
        question_text: fromState.question_text || "",
        question_image: fromState.question_image || "",
        type_id: fromState.type_id ?? "",
        internal_type_id: fromState.internal_type_id ?? "",
        passage_id: fromState.passage_id || "",
        mc_a: fromState.mc_a || "",
        mc_b: fromState.mc_b || "",
        mc_c: fromState.mc_c || "",
        mc_d: fromState.mc_d || "",
        correct_answer: fromState.correct_answer || "a",
        explanation: fromState.explanation || "",
        is_comparable: !!fromState.is_comparable,
        comparable_option1_text: fromState.comparable_option1_text || "",
        comparable_option2_text: fromState.comparable_option2_text || "",
        have_visualization: !!fromState.have_visualization,
        visualization_image_url: fromState.visualization_image_url || "",
        status: fromState.status || "قيد المراجعة",
      });

      setLoading(false);
    } else {
      // فتح الصفحة مباشرة بدون state (refresh مثلاً)
      const fetchSingle = async () => {
        try {
          const res = await api.get(`/admin/questions/${routeId}`);
          const q = res.data?.data || res.data?.question || res.data;

          if (!q) {
            setError("السؤال غير موجود");
            setLoading(false);
            return;
          }

          const id = q._id || q.id || q.q_no || routeId;
          setQuestionId(id);
          setInitialStatus(q.status || "قيد المراجعة");

          setFormData((prev) => ({
            ...prev,
            q_no: q.q_no ?? "",
            is_question_text:
              typeof q.is_question_text === "boolean"
                ? q.is_question_text
                : true,
            question_text: q.question_text || "",
            question_image: q.question_image || "",
            type_id: q.type_id ?? "",
            internal_type_id: q.internal_type_id ?? "",
            passage_id: q.passage_id || "",
            mc_a: q.mc_a || "",
            mc_b: q.mc_b || "",
            mc_c: q.mc_c || "",
            mc_d: q.mc_d || "",
            correct_answer: q.correct_answer || "a",
            explanation: q.explanation || "",
            is_comparable: !!q.is_comparable,
            comparable_option1_text: q.comparable_option1_text || "",
            comparable_option2_text: q.comparable_option2_text || "",
            have_visualization: !!q.have_visualization,
            visualization_image_url: q.visualization_image_url || "",
            status: q.status || "قيد المراجعة",
          }));
        } catch (err) {
          console.error(err);
          setError("تعذّر تحميل بيانات السؤال");
        } finally {
          setLoading(false);
        }
      };

      if (routeId) {
        fetchSingle();
      } else {
        setError("السؤال غير موجود");
        setLoading(false);
      }
    }
  }, [location.state, routeId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!questionId) {
      alert("لا يمكن حفظ السؤال: المعرّف غير معروف");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // تجهيز البيانات حسب الـ schema
      const payload = {
        ...formData,
        q_no: Number(formData.q_no),
        type_id: Number(formData.type_id),
        internal_type_id: Number(formData.internal_type_id),
      };

      // ✅ التعامل مع الـ Passage
      if (payload.internal_type_id === 1) {
        // استيعاب المقروء
        if (!formData.passage_id || !formData.passage_id.trim()) {
          setSaving(false);
          alert("يجب اختيار الفقرة (Passage) لسؤال استيعاب المقروء");
          return;
        }
        payload.passage_id = formData.passage_id.trim();
      } else {
        // أي نوع آخر → نخليها null عشان ما يرجع Cast error
        payload.passage_id = null;
      }

      // إذا السؤال نصي فقط
      if (payload.is_question_text) {
        payload.question_image = payload.question_image || null;
      } else {
        payload.question_text = payload.question_text || null;
      }

      // لو ما فيه مقارنة، فضي حقول المقارنة
      if (!payload.is_comparable) {
        payload.comparable_option1_text = null;
        payload.comparable_option2_text = null;
      }

      // لو ما فيه visualization، فضي الـ URL
      if (!payload.have_visualization) {
        payload.visualization_image_url = null;
      }

      // 1) تحديث السؤال نفسه
      await api.put(`/questions/${questionId}`, payload);

      // 2) لو تغيرت الحالة نستخدم API الأدمن الخاص بالاعتماد/الرفض (إن وُجد)
      if (formData.status !== initialStatus) {
        if (formData.status === "مقبول") {
          try {
            await api.put(`/admin/questions/${questionId}/approve`);
          } catch (_) {
            // نتجاهل الخطأ هنا عشان ما نكسر الفورم
          }
        } else if (formData.status === "مرفوض") {
          try {
            await api.put(`/admin/questions/${questionId}/reject`);
          } catch (_) {}
        }
      }

      alert("تم حفظ التعديلات بنجاح ✅");
      navigate("/admin/review");
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء حفظ التعديلات");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/review");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)",
          direction: "rtl",
        }}
      >
        <div className="container py-4">
          <div className="text-center">جاري تحميل السؤال...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)",
          direction: "rtl",
        }}
      >
        <div className="container py-4 text-center">
          <p className="text-danger mb-3">{error}</p>
          <button className="btn btn-secondary" onClick={handleCancel}>
            الرجوع إلى مراجعة الأسئلة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)",
        direction: "rtl",
      }}
    >
      <div className="container py-4">
        <h2 className="mb-4 fw-bold" style={{ color: "#6B46C1" }}>
          تعديل السؤال
        </h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              {/* رقم السؤال */}
              <div className="mb-3">
                <label className="form-label fw-bold">رقم السؤال *</label>
                <input
                  type="number"
                  name="q_no"
                  className="form-control text-end"
                  value={formData.q_no}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* نوع السؤال + النوع الداخلي */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-bold">
                    النوع (لفظي / كمي) *
                  </label>
                  <select
                    name="type_id"
                    className="form-select text-end"
                    value={formData.type_id}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        type_id: value,
                        internal_type_id: "",
                      }));
                    }}
                    required
                  >
                    <option value="">اختر نوع السؤال</option>
                    {questionTypes.map((t) => (
                      <option key={t.type_id} value={t.type_id}>
                        {t.type_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">النوع الداخلي *</label>
                  <select
                    name="internal_type_id"
                    className="form-select text-end"
                    value={formData.internal_type_id}
                    onChange={handleChange}
                    required
                    disabled={!formData.type_id}
                  >
                    <option value="">اختر النوع الداخلي</option>
                    {availableInternalTypes.map((it) => (
                      <option
                        key={it.internal_type_id}
                        value={it.internal_type_id}
                      >
                        {it.internal_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* الفقرة (Passage) – تظهر فقط إذا النوع الداخلي استيعاب المقروء */}
              {isReadingComprehension && (
                <div className="mb-3">
                  <label className="form-label fw-bold">
                    الفقرة (Passage) *
                  </label>
                  <input
                    type="text"
                    name="passage_id"
                    className="form-control text-end"
                    placeholder="اكتب أو الصق معرف الفقرة (ObjectId)"
                    value={formData.passage_id}
                    onChange={handleChange}
                  />
                  {/* لاحقًا تقدرون تبدلون هذا input بـ select بعد ما تسوون API للـ Passages */}
                </div>
              )}

              {/* محتوى السؤال */}
              <div className="mb-3">
                <label className="form-label fw-bold">محتوى السؤال *</label>
                <div className="mb-2">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="is_question_text"
                      id="q_text"
                      checked={formData.is_question_text}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          is_question_text: true,
                        }))
                      }
                    />
                    <label className="form-check-label" htmlFor="q_text">
                      نص
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="is_question_text"
                      id="q_image"
                      checked={!formData.is_question_text}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          is_question_text: false,
                        }))
                      }
                    />
                    <label className="form-check-label" htmlFor="q_image">
                      صورة (رابط)
                    </label>
                  </div>
                </div>

                {formData.is_question_text ? (
                  <textarea
                    name="question_text"
                    className="form-control text-end"
                    rows="3"
                    placeholder="اكتب نص السؤال هنا"
                    value={formData.question_text}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <input
                    type="text"
                    name="question_image"
                    className="form-control text-end"
                    placeholder="ضع رابط صورة السؤال"
                    value={formData.question_image}
                    onChange={handleChange}
                    required
                  />
                )}
              </div>

              {/* الخيارات */}
              <div className="row mb-3">
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-bold">الخيار 1 (أ)</label>
                  <input
                    type="text"
                    name="mc_a"
                    className="form-control text-end"
                    value={formData.mc_a}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-bold">الخيار 2 (ب)</label>
                  <input
                    type="text"
                    name="mc_b"
                    className="form-control text-end"
                    value={formData.mc_b}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-bold">الخيار 3 (ج)</label>
                  <input
                    type="text"
                    name="mc_c"
                    className="form-control text-end"
                    value={formData.mc_c}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <label className="form-label fw-bold">الخيار 4 (د)</label>
                  <input
                    type="text"
                    name="mc_d"
                    className="form-control text-end"
                    value={formData.mc_d}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* الإجابة الصحيحة */}
              <div className="mb-3">
                <label className="form-label fw-bold">الإجابة الصحيحة *</label>
                <select
                  name="correct_answer"
                  className="form-select text-end"
                  value={formData.correct_answer}
                  onChange={handleChange}
                  required
                >
                  <option value="a">الخيار 1 (أ)</option>
                  <option value="b">الخيار 2 (ب)</option>
                  <option value="c">الخيار 3 (ج)</option>
                  <option value="d">الخيار 4 (د)</option>
                </select>
              </div>

              {/* الشرح */}
              <div className="mb-3">
                <label className="form-label fw-bold">
                  الشرح (اختياري)
                </label>
                <textarea
                  name="explanation"
                  className="form-control text-end"
                  rows="3"
                  placeholder="اكتب شرح الإجابة الصحيحة إن وجد"
                  value={formData.explanation}
                  onChange={handleChange}
                />
              </div>

              {/* مقارنة كمية */}
              <div className="mb-3">
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="is_comparable"
                    name="is_comparable"
                    checked={formData.is_comparable}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="is_comparable">
                    سؤال مقارنات (قيمة 1 وقيمة 2)
                  </label>
                </div>

                {formData.is_comparable && (
                  <div className="row">
                    <div className="col-md-6 mb-2">
                      <input
                        type="text"
                        name="comparable_option1_text"
                        className="form-control text-end"
                        placeholder="النص الأول للمقارنة"
                        value={formData.comparable_option1_text}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6 mb-2">
                      <input
                        type="text"
                        name="comparable_option2_text"
                        className="form-control text-end"
                        placeholder="النص الثاني للمقارنة"
                        value={formData.comparable_option2_text}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Visualization */}
              <div className="mb-3">
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="have_visualization"
                    name="have_visualization"
                    checked={formData.have_visualization}
                    onChange={handleChange}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="have_visualization"
                  >
                    السؤال يحتوي على رسم / شكل (رابط صورة)
                  </label>
                </div>

                {formData.have_visualization && (
                  <input
                    type="text"
                    name="visualization_image_url"
                    className="form-control text-end"
                    placeholder="رابط صورة الرسم أو الشكل"
                    value={formData.visualization_image_url}
                    onChange={handleChange}
                  />
                )}
              </div>

              {/* حالة السؤال */}
              <div className="mb-4">
                <label className="form-label fw-bold">حالة السؤال *</label>
                <select
                  name="status"
                  className="form-select text-end"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* أزرار الحفظ / الإلغاء */}
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "جاري الحفظ..." : "تحديث"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
