// src/pages/admin/UserManagement.jsx
import React, { useState } from "react";


const MOCK_STUDENTS = [
  { id: 1, name: "تركي السلمان" },
  { id: 2, name: "محمد الغبي" },
];

const MOCK_TEACHERS = [
  { id: 1, name: "أحمد المعلم" },
  { id: 2, name: "سعيد المدرس" },
];

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("students"); // 'students' | 'teachers'
  const [filter, setFilter] = useState("");

  const list = activeTab === "students" ? MOCK_STUDENTS : MOCK_TEACHERS;

  const filtered = list.filter(
    (u) =>
      u.name.includes(filter) ||
      String(u.id).includes(filter)
  );

  const handleDelete = (user) => {
    alert(`(تجريبي) سيتم حذف المستخدم: ${user.name}`);
  };

  const handleSettings = (user) => {
    alert(`(تجريبي) إعدادات المستخدم: ${user.name}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)",
        direction: "rtl",
        paddingTop: "80px", // نفس القيمة بالضبط
      }}
    >
      <div className="container text-end">
        {/* شريط الأدمن الموحد */}
      

        {/* عنوان الصفحة */}
        <h2
          className="fw-bold mb-4"
          style={{ color: "#4B0082", marginTop: "8px" }}
        >
          إدارة المستخدمين
        </h2>

        {/* الكرت الأبيض اللي فيه التاب + الفلتر + الجدول */}
        <div
          className="shadow-sm bg-white rounded-3 p-4"
          style={{ minHeight: "300px" }}
        >
          {/* Tabs الطلاب / المعلمين */}
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
              onClick={() => setActiveTab("students")}
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
              onClick={() => setActiveTab("teachers")}
            >
              المعلمين
            </button>
          </div>

          {/* حقل الفلتر */}
          <div className="mb-4">
            <input
              type="text"
              className="form-control text-end"
              placeholder="اسم المستخدم، رقم المستخدم (Filter)"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {/* الجدول البسيط */}
          <div className="table-responsive">
            <table className="table align-middle text-end">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>رقم الطالب</th>
                  <th style={{ width: "50%" }}>اسم الطالب</th>
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
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(user)}
                      >
                        حذف المستخدم
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
