import { useState, useEffect } from 'react';

const API_URL = "/api";
const getToken = () => localStorage.getItem("token");

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, solved, ignored

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const res = await fetch(`${API_URL}/reports`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        setReports(data.data);
      } else {
        alert("فشل تحميل البلاغات: " + data.message);
      }
    } catch (error) {
      console.error("Error loading reports:", error);
      alert("حدث خطأ أثناء تحميل البلاغات");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId) => {
    const notes = prompt("ملاحظات (اختياري):");
    try {
      const res = await fetch(`${API_URL}/reports/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ 
          status: "solved",
          admin_notes: notes || ""
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("تم وضع البلاغ كـ 'تم الحل'");
        loadReports();
      } else {
        alert("فشل التحديث: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ أثناء التحديث");
    }
  };

  const handleIgnore = async (reportId) => {
    const notes = prompt("سبب التجاهل (اختياري):");
    try {
      const res = await fetch(`${API_URL}/reports/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ 
          status: "ignored",
          admin_notes: notes || ""
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("تم تجاهل البلاغ");
        loadReports();
      } else {
        alert("فشل التحديث: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ أثناء التحديث");
    }
  };

  const handleDelete = async (reportId) => {
    if (!confirm("هل تريد حذف هذا البلاغ نهائياً؟")) return;
    
    try {
      const res = await fetch(`${API_URL}/reports/${reportId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        alert("تم حذف البلاغ");
        loadReports();
      } else {
        alert("فشل الحذف: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: { label: "قيد المراجعة", bg: "#F59E0B" },
      solved: { label: "تم الحل", bg: "#16A34A" },
      ignored: { label: "تم التجاهل", bg: "#6B7280" }
    };
    return styles[status] || { label: status, bg: "#6B7280" };
  };

  const filteredReports = reports.filter(r => 
    filter === 'all' ? true : r.status === filter
  );

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
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
        paddingTop: "80px",
      }}
    >
      <div className="container text-end">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold" style={{ color: "#4B0082", marginTop: "8px" }}>
            بلاغات الأسئلة
          </h2>
          <span className="badge bg-primary" style={{ fontSize: '16px', padding: '10px 20px' }}>
            {reports.length} بلاغ
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="mb-3">
          <div className="btn-group" role="group">
            <button 
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setFilter('all')}
            >
              الكل ({reports.length})
            </button>
            <button 
              className={`btn ${filter === 'pending' ? 'btn-warning' : 'btn-outline-secondary'}`}
              onClick={() => setFilter('pending')}
            >
              قيد المراجعة ({reports.filter(r => r.status === 'pending').length})
            </button>
            <button 
              className={`btn ${filter === 'solved' ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={() => setFilter('solved')}
            >
              تم الحل ({reports.filter(r => r.status === 'solved').length})
            </button>
            <button 
              className={`btn ${filter === 'ignored' ? 'btn-secondary' : 'btn-outline-secondary'}`}
              onClick={() => setFilter('ignored')}
            >
              تم التجاهل ({reports.filter(r => r.status === 'ignored').length})
            </button>
          </div>
        </div>

        <div className="shadow-sm bg-white rounded-3 p-4" style={{ minHeight: "300px" }}>
          {filteredReports.length === 0 ? (
            <p className="text-center text-muted mt-3">
              لا توجد بلاغات.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle text-end">
                <thead>
                  <tr>
                    <th style={{ width: "8%" }}>رقم البلاغ</th>
                    <th style={{ width: "8%" }}>رقم السؤال</th>
                    <th style={{ width: "22%" }}>السؤال</th>
                    <th style={{ width: "18%" }}>نص البلاغ</th>
                    <th style={{ width: "10%" }}>المبلِّغ</th>
                    <th style={{ width: "10%" }}>التاريخ</th>
                    <th style={{ width: "8%" }}>النوع</th>
                    <th style={{ width: "8%" }}>الحالة</th>
                    <th style={{ width: "8%" }}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((r) => {
                    const { label, bg } = getStatusBadge(r.status);
                    return (
                      <tr key={r._id}>
                        <td>#{r.report_number}</td>
                        <td>#{r.q_no}</td>
                        <td style={{ whiteSpace: "pre-wrap", fontSize: "14px" }}>
                          {r.question_text.substring(0, 60)}...
                        </td>
                        <td style={{ whiteSpace: "pre-wrap", fontSize: "14px" }}>
                          {r.report_text}
                        </td>
                        <td>{r.user_name}</td>
                        <td>{new Date(r.created_at).toLocaleDateString('ar-SA')}</td>
                        <td>
                          <span className="badge bg-info">{r.question_type}</span>
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor: bg,
                              padding: "6px 12px",
                              fontSize: "13px",
                            }}
                          >
                            {label}
                          </span>
                        </td>
                        <td>
                          {r.status === 'pending' && (
                            <>
                              <button
                                className="btn btn-success btn-sm mb-1"
                                onClick={() => handleResolve(r._id)}
                                style={{ fontSize: '12px' }}
                              >
                                ✓ حل
                              </button>
                              <br />
                              <button
                                className="btn btn-warning btn-sm mb-1"
                                onClick={() => handleIgnore(r._id)}
                                style={{ fontSize: '12px' }}
                              >
                                ⊘ تجاهل
                              </button>
                              <br />
                            </>
                          )}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(r._id)}
                            style={{ fontSize: '12px' }}
                          >
                            🗑️ حذف
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}