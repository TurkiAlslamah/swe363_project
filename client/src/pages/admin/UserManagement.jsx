// src/pages/admin/UserManagement.jsx
import React, { useState } from "react";

const MOCK_STUDENTS = [
  { id: 1, name: "تركي السلمان", email: "turki@student.com" },
  { id: 2, name: "محمد الغبي", email: "mohammed@student.com" },
];

const MOCK_TEACHERS = [
  { id: 1, name: "أحمد المعلم", email: "ahmed@teacher.com" },
  { id: 2, name: "سعيد المدرس", email: "saeed@teacher.com" },
];

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("students"); // students | teachers
  const [filter, setFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // المستخدم المفتوح في الإعدادات
  const [status, setStatus] = useState("active"); // active | inactive | blocked

  const list = activeTab === "students" ? MOCK_STUDENTS : MOCK_TEACHERS;

  const filtered = list.filter(
    (u) =>
      u.name.includes(filter) ||
      String(u.id).includes(filter)
  );

  const handleDelete = (user) => {
    const role = activeTab === "students" ? "طالب" : "معلم";
    if (window.confirm(`(تجريبي) هل أنت متأكد من حذف ${role}: ${user.name}؟`)) {
      alert(`(تجريبي) تم حذف ${role}: ${user.name}`);
      // لاحقاً: حذف فعلي من الـ state أو من الـ backend
    }
  };

  const handleSettings = (user) => {
    setSelectedUser(user);
    setStatus("active"); // حالة افتراضية (تجريبية)
  };

  const handleSaveSettings = () => {
    if (!selectedUser) return;
    alert(
      `(تجريبي) تم حفظ إعدادات المستخدم: ${selectedUser.name} بالحالة: ${status}`
    );
  };

  const handleCloseSettings = () => {
    setSelectedUser(null);
    setStatus("active");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)",
        direction: "rtl",
        paddingTop: "80px",
      }}
    >
      <div className="container text-end">
        {/* عنوان الصفحة */}
        <h2
          className="fw-bold mb-4"
          style={{ color: "#4B0082", marginTop: "8px" }}
        >
          إدارة المستخدمين
        </h2>

        {/* الكرت الأبيض */}
        <div
          className="shadow-sm bg-white rounded-3 p-4"
          style={{ minHeight: "300px" }}
        >
          {/* Tabs طلاب / معلمين */}
          <div className="d-inline-flex mb-3">
            <button
              className="btn"
              style={{
                borderRadius: "999px 0 0 999px",
                backgroundColor:
                  activeTab === "students" ? "#4B0082" : "#e5e7eb",
                color: activeTab === "students" ? "#fff" : "#444",
                minWidth: "120px",
              }}
              onClick={() => {
                setActiveTab("students");
                setSelectedUser(null);
              }}
            >
              الطلاب
            </button>
            <button
              className="btn"
              style={{
                borderRadius: "0 999px 999px 0",
                backgroundColor:
                  activeTab === "teachers" ? "#4B0082" : "#e5e7eb",
                color: activeTab === "teachers" ? "#fff" : "#444",
                minWidth: "120px",
              }}
              onClick={() => {
                setActiveTab("teachers");
                setSelectedUser(null);
              }}
            >
              المعلمين
            </button>
          </div>

          {/* حقل الفلتر */}
          <div className="mb-4">
            <input
              type="text"
              className="form-control text-end"
              placeholder="اسم المستخدم أو رقم المستخدم (Filter)"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {/* الجدول */}
          <div className="table-responsive">
            <table className="table align-middle text-end">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>رقم المستخدم</th>
                  <th style={{ width: "50%" }}>اسم المستخدم</th>
                  <th style={{ width: "40%" }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      لا يوجد مستخدمون مطابقون للبحث
                    </td>
                  </tr>
                )}

                {filtered.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.name}</td>
                    <td>
                      <button
                        className="btn btn-success ms-2"
                        onClick={() => handleSettings(user)}
                      >
                        إعدادات
                      </button>
                      {/* حذف المستخدم الآن فقط داخل لوحة الإعدادات، مو هنا */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* لوحة إعدادات المستخدم – فيها حذف + تغيير حالة */}
          {selectedUser && (
            <div className="mt-4 p-4 border rounded">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">إعدادات المستخدم</h5>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleCloseSettings}
                >
                  إغلاق
                </button>
              </div>

              <div className="mb-3">
                <label className="form-label">اسم المستخدم</label>
                <input
                  type="text"
                  className="form-control text-end"
                  value={selectedUser.name}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">إيميل المستخدم</label>
                <input
                  type="text"
                  className="form-control text-end"
                  value={selectedUser.email || "غير متوفر"}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">حالة الحساب</label>
                <select
                  className="form-select text-end"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                  <option value="blocked">محظور</option>
                </select>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(selectedUser)}
                >
                  حذف المستخدم
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleSaveSettings}
                >
                  حفظ التغييرات 
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
