// src/pages/admin/EditQuestionAdmin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuestionForm from "../teacher/components/QuestionForm";
import { getQuestionById, updateQuestion } from "../teacher/data/mockQuestions";

// دالة ترجع سؤال فارغ لتغذية QuestionForm في حال لم يوجد سؤال حقيقي
function createEmptyQuestion(idNumber) {
  return {
    id: idNumber,
    questionText: "",
    questionType: "mcq",        // قيمة افتراضية – QuestionForm يتعامل معها تجريبياً
    mainTopic: "",
    subTopic: "",
    image: "",
    questionOrder: 1,
    explanation: "",
    // خيارات افتراضية – لو الفورم يستخدمها
    options: [
      { id: 1, text: "", isCorrect: false },
      { id: 2, text: "", isCorrect: false },
      { id: 3, text: "", isCorrect: false },
      { id: 4, text: "", isCorrect: false },
    ],
  };
}

export default function EditQuestionAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const numericId = parseInt(id);

    // نحاول نجيب السؤال من mockQuestions (بيانات المعلّم)
    const foundQuestion = getQuestionById(numericId);

    if (foundQuestion) {
      setQuestion(foundQuestion);
    } else {
      // لو ما لقيناه → نفتح فورم فاضي بنفس التصميم (تجريبي فقط)
      setQuestion(createEmptyQuestion(numericId));
    }
  }, [id]);

  const handleSubmit = (formData) => {
    if (!question) return;

    try {
      const numericId = parseInt(id);
      const questionOrder = parseInt(formData.questionOrder);

      const updatedData = {
        ...formData,
        questionOrder:
          questionOrder && questionOrder > 0
            ? questionOrder
            : question.questionOrder || 1,
      };

      // نحاول نحدّث السؤال الحقيقي لو موجود في mockQuestions
      const existing = getQuestionById(numericId);
      if (existing) {
        updateQuestion(numericId, updatedData);
      }

      setSuccessMessage("تم تحديث السؤال (تجريبي) بنجاح!");

      setTimeout(() => {
        navigate("/admin/review");
      }, 1500);
    } catch (error) {
      alert("حدث خطأ أثناء تحديث السؤال (تجريبي)");
    }
  };

  const handleCancel = () => {
    navigate("/admin/review");
  };

  if (!question) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)",
          direction: "rtl",
        }}
      >
        <div className="container py-4">
          <div className="text-center">جاري التحميل...</div>
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

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <QuestionForm
              initialData={question}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
