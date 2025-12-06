// src/pages/admin/UserManagement.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/http"; // axios instance (baseURL + token)

const STATUS_OPTIONS = [
  { value: "نشط", label: "نشط" },
  { value: "غير نشط", label: "غير نشط" },
  { value: "محظور", label: "محظور" },
];

export default function UserManagement() {
  const [activeTab, setActiveTab] = useState("students"); // "students" | "teachers"
  const [filter, setFilter] = useState("");
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showSettings, setShowSettings] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [settingsStatus, setSettingsStatus] = useState("نشط");
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Helper to extract id (backend might send `_id` or `id`)
  const getUserId = (user) => user._id || user.id;

  // Fetch users whenever tab changes
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const typeParam = activeTab === "students" ? "student" : "teacher";

        const res = await api.get("/admin/users", {
          params: { type: typeParam },
        });

        // Try common shapes: {data: {users:[]}} OR {data: []}
        const list =
          res.data?.data?.users ||
          res.data?.users ||
          res.data?.data ||
          res.data ||
          [];

        setUsers(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Error loading users", err);
        setError("تعذر تحميل المستخدمين. تأكد من تسجيل الدخول كأدمن.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [activeTab]);

  // Filtered list
  const filtered = users.filter((u) => {
    const idStr = String(getUserId(u) || "");
    const name = (u.fullName || u.name || "").toLowerCase();
    const q = filter.toLowerCase();
    return idStr.includes(filter) || name.includes(q);
  });

  // Open settings modal
  const openSettings = (user) => {
    setSelectedUser(user);
    setSettingsStatus(user.status || "نشط");
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
    setSelectedUser(null);
    setSettingsStatus("نشط");
    setSettingsLoading(false);
  };

  // Save status change
  const handleSaveSettings = async () => {
    if (!selectedUser) return;
    setSettingsLoading(true);
    setError("");

    const userId = getUserId(selectedUser);

    try {
      await api.put(`/admin/users/${userId}`, {
        status: settingsStatus,
      });

      // Update UI locally
      setUsers((prev) =>
        prev.map((u) =>
          getUserId(u) === userId ? { ...u, status: settingsStatus } : u
        )
      );

      closeSettings();
    } catch (err) {
      console.error("Error updating user", err);
      setError("تعذر تحديث بيانات المستخدم.");
      setSettingsLoading(false);
    }
  };

  // Delete user (inside modal only)
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    const confirmDelete = window.confirm(
      `هل أنت متأكد من حذف المستخدم: ${
        selectedUser.fullName || selectedUser.name || ""
      } ؟`
    );
    if (!confirmDelete) return;

    setSettingsLoading(true);
    setError("");

    const userId = getUserId(selectedUser);

    try {
      await api.delete(`/admin/users/${userId}`);

      setUsers((prev) => prev.filter((u) => getUserId(u) !== userId));
      closeSettings();
    } catch (err) {
      console.error("Error deleting user", err);
      setError("تعذر حذف المستخدم.");
      setSettingsLoading(false);
    }
  };

  const heading = activeTab === "students" ? "إدارة الطلاب" : "إدارة المعلّمين";

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
        <h2
          className="fw-bold mb-4"
          style={{ color: "#4B0082", marginTop: "8px" }}
        >
          {heading}
        </h2>

        {/* Error message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Card */}
        <div
          className="shadow-sm bg-white rounded-3 p-4"
          style={{ minHeight: "300px" }}
        >
          {/* Tabs */}
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

          {/* Filter */}
          <div className="mb-4">
            <input
              type="text"
              className="form-control text-end"
              placeholder="اسم المستخدم أو رقم المستخدم"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table align-middle text-end">
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>رقم المستخدم</th>
                  <th style={{ width: "30%" }}>اسم المستخدم</th>
                  <th style={{ width: "20%" }}>البريد الإلكتروني</th>
                  <th style={{ width: "15%" }}>الحالة</th>
                  <th style={{ width: "25%" }}>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      جاري تحميل المستخدمين...
                    </td>
                  </tr>
                )}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      لا يوجد مستخدمون مطابقون للبحث
                    </td>
                  </tr>
                )}

                {!loading &&
                  filtered.map((user) => (
                    <tr key={getUserId(user)}>
                      <td>#{getUserId(user)}</td>
                      <td>{user.fullName || user.name}</td>
                      <td>{user.email || "-"}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor:
                              user.status === "محظور"
                                ? "#DC2626"
                                : user.status === "غير نشط"
                                ? "#F59E0B"
                                : "#16A34A",
                            padding: "6px 12px",
                            fontSize: "13px",
                          }}
                        >
                          {user.status || "نشط"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-success"
                          onClick={() => openSettings(user)}
                        >
                          إعدادات
                        </button>
                        {/* لا يوجد زر حذف هنا – الحذف فقط من نافذة الإعدادات */}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && selectedUser && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 1050,
            direction: "rtl",
          }}
        >
          <div
            className="bg-white shadow rounded p-4"
            style={{ width: "90%", maxWidth: "500px" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-bold" style={{ color: "#4B0082" }}>
                إعدادات المستخدم
              </h5>
              <button
                className="btn btn-link text-dark p-0 fs-4"
                onClick={closeSettings}
                disabled={settingsLoading}
              >
                ✕
              </button>
            </div>

            <p className="mb-1">
              <strong>الاسم:</strong> {selectedUser.fullName || selectedUser.name}
            </p>
            <p className="mb-3">
              <strong>البريد:</strong> {selectedUser.email || "-"}
            </p>

            <div className="mb-3">
              <label className="form-label fw-bold" style={{ color: "#4B0082" }}>
                حالة المستخدم
              </label>
              <select
                className="form-select text-end"
                value={settingsStatus}
                onChange={(e) => setSettingsStatus(e.target.value)}
                disabled={settingsLoading}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-danger"
                onClick={handleDeleteUser}
                disabled={settingsLoading}
              >
                حذف المستخدم
              </button>
              <button
                className="btn btn-primary"
                style={{ backgroundColor: "#4B0082", borderColor: "#4B0082" }}
                onClick={handleSaveSettings}
                disabled={settingsLoading}
              >
                {settingsLoading ? "جارٍ الحفظ..." : "حفظ التغييرات"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
