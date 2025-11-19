import { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function Profile() {
  // Placeholder user data
  const [userData, setUserData] = useState({
    name: "تركي السلامه",
    email: "turki@example.com",
  });

  // Edit modes
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    password: false,
  });

  // Form data
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Success/Error messages
  const [messages, setMessages] = useState({
    name: null,
    email: null,
    password: null,
  });

  // Loading states
  const [loading, setLoading] = useState({
    name: false,
    email: false,
    password: false,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle edit mode
  const toggleEdit = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    // Reset messages when entering edit mode
    if (!editMode[field]) {
      setMessages((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Cancel edit
  const cancelEdit = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: false,
    }));
    // Reset form data
    if (field === "name") {
      setFormData((prev) => ({ ...prev, name: userData.name }));
    } else if (field === "email") {
      setFormData((prev) => ({ ...prev, email: userData.email }));
    } else if (field === "password") {
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
    setMessages((prev) => ({ ...prev, [field]: null }));
  };

  // Save name
  const saveName = async () => {
    if (!formData.name.trim()) {
      setMessages((prev) => ({
        ...prev,
        name: { type: "error", text: "الرجاء إدخال الاسم الكامل" },
      }));
      return;
    }

    setLoading((prev) => ({ ...prev, name: true }));
    
    // Simulate API call
    setTimeout(() => {
      setUserData((prev) => ({ ...prev, name: formData.name }));
      setMessages((prev) => ({
        ...prev,
        name: { type: "success", text: "تم تحديث الاسم بنجاح" },
      }));
      setEditMode((prev) => ({ ...prev, name: false }));
      setLoading((prev) => ({ ...prev, name: false }));

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessages((prev) => ({ ...prev, name: null }));
      }, 3000);
    }, 1000);
  };

  // Save email
  const saveEmail = async () => {
    if (!formData.email.trim()) {
      setMessages((prev) => ({
        ...prev,
        email: { type: "error", text: "الرجاء إدخال البريد الإلكتروني" },
      }));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessages((prev) => ({
        ...prev,
        email: { type: "error", text: "البريد الإلكتروني غير صالح" },
      }));
      return;
    }

    setLoading((prev) => ({ ...prev, email: true }));
    
    // Simulate API call
    setTimeout(() => {
      setUserData((prev) => ({ ...prev, email: formData.email }));
      setMessages((prev) => ({
        ...prev,
        email: { type: "success", text: "تم تحديث البريد الإلكتروني بنجاح" },
      }));
      setEditMode((prev) => ({ ...prev, email: false }));
      setLoading((prev) => ({ ...prev, email: false }));

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessages((prev) => ({ ...prev, email: null }));
      }, 3000);
    }, 1000);
  };

  // Save password
  const savePassword = async () => {
    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessages((prev) => ({
        ...prev,
        password: { type: "error", text: "الرجاء ملء جميع الحقول" },
      }));
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessages((prev) => ({
        ...prev,
        password: { type: "error", text: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" },
      }));
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessages((prev) => ({
        ...prev,
        password: { type: "error", text: "كلمة المرور الجديدة غير متطابقة" },
      }));
      return;
    }

    setLoading((prev) => ({ ...prev, password: true }));
    
    // Simulate API call
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        password: { type: "success", text: "تم تحديث كلمة المرور بنجاح" },
      }));
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setEditMode((prev) => ({ ...prev, password: false }));
      setLoading((prev) => ({ ...prev, password: false }));

      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessages((prev) => ({ ...prev, password: null }));
      }, 3000);
    }, 1000);
  };

  return (
    <div className="container py-5" style={{ marginTop: "80px", direction: "rtl" }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="text-center mb-5">
            
            <h2 className="fw-bold" style={{ color: "#4B0082" }}>
              الملف الشخصي
            </h2>
            <p className="text-muted">قم بتحديث معلوماتك الشخصية</p>
          </div>

          {/* Profile Card */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              
              {/* Name Section */}
              <div className="mb-4 pb-4 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <FaUser color="#4B0082" />
                    الاسم الكامل
                  </h5>
                  {!editMode.name && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => toggleEdit("name")}
                    >
                      <FaEdit className="ms-1" />
                      تعديل
                    </button>
                  )}
                </div>

                {!editMode.name ? (
                  <p className="text-muted mb-0 ps-4">{userData.name}</p>
                ) : (
                  <div>
                    <input
                      type="text"
                      name="name"
                      className="form-control mb-3"
                      placeholder="أدخل الاسم الكامل"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading.name}
                    />
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success"
                        onClick={saveName}
                        disabled={loading.name}
                      >
                        {loading.name ? (
                          <>
                            <span className="spinner-border spinner-border-sm ms-2" />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <FaSave className="ms-1" />
                            حفظ
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => cancelEdit("name")}
                        disabled={loading.name}
                      >
                        <FaTimes className="ms-1" />
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}

                {messages.name && (
                  <div
                    className={`alert ${
                      messages.name.type === "success" ? "alert-success" : "alert-danger"
                    } mt-3 mb-0`}
                    role="alert"
                  >
                    {messages.name.text}
                  </div>
                )}
              </div>

              {/* Email Section */}
              <div className="mb-4 pb-4 border-bottom">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <FaEnvelope color="#4B0082" />
                    البريد الإلكتروني
                  </h5>
                  {!editMode.email && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => toggleEdit("email")}
                    >
                      <FaEdit className="ms-1" />
                      تعديل
                    </button>
                  )}
                </div>

                {!editMode.email ? (
                  <p className="text-muted mb-0 ps-4">{userData.email}</p>
                ) : (
                  <div>
                    <input
                      type="email"
                      name="email"
                      className="form-control mb-3"
                      placeholder="أدخل البريد الإلكتروني"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading.email}
                    />
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success"
                        onClick={saveEmail}
                        disabled={loading.email}
                      >
                        {loading.email ? (
                          <>
                            <span className="spinner-border spinner-border-sm ms-2" />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <FaSave className="ms-1" />
                            حفظ
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => cancelEdit("email")}
                        disabled={loading.email}
                      >
                        <FaTimes className="ms-1" />
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}

                {messages.email && (
                  <div
                    className={`alert ${
                      messages.email.type === "success" ? "alert-success" : "alert-danger"
                    } mt-3 mb-0`}
                    role="alert"
                  >
                    {messages.email.text}
                  </div>
                )}
              </div>

              {/* Password Section */}
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                    <FaLock color="#4B0082" />
                    كلمة المرور
                  </h5>
                  {!editMode.password && (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => toggleEdit("password")}
                    >
                      <FaEdit className="ms-1" />
                      تغيير
                    </button>
                  )}
                </div>

                {!editMode.password ? (
                  <p className="text-muted mb-0 ps-4">••••••••</p>
                ) : (
                  <div>
                    <div className="mb-3">
                      <label className="form-label">كلمة المرور الحالية</label>
                      <input
                        type="password"
                        name="currentPassword"
                        className="form-control"
                        placeholder="أدخل كلمة المرور الحالية"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        disabled={loading.password}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">كلمة المرور الجديدة</label>
                      <input
                        type="password"
                        name="newPassword"
                        className="form-control"
                        placeholder="أدخل كلمة المرور الجديدة"
                        value={formData.newPassword}
                        onChange={handleChange}
                        disabled={loading.password}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">تأكيد كلمة المرور الجديدة</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        placeholder="أعد إدخال كلمة المرور الجديدة"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading.password}
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success"
                        onClick={savePassword}
                        disabled={loading.password}
                      >
                        {loading.password ? (
                          <>
                            <span className="spinner-border spinner-border-sm ms-2" />
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <FaSave className="ms-1" />
                            حفظ
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => cancelEdit("password")}
                        disabled={loading.password}
                      >
                        <FaTimes className="ms-1" />
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}

                {messages.password && (
                  <div
                    className={`alert ${
                      messages.password.type === "success" ? "alert-success" : "alert-danger"
                    } mt-3 mb-0`}
                    role="alert"
                  >
                    {messages.password.text}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Info Card */}
          <div className="alert alert-info mt-4" role="alert">
            <strong>ملاحظة:</strong> عند تغيير البريد الإلكتروني أو كلمة المرور، قد تحتاج إلى تسجيل الدخول مرة أخرى.
          </div>
        </div>
      </div>
    </div>
  );
}