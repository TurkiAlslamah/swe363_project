import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import Modal from './components/Modal';
import FeedbackForm from './components/FeedbackForm';
import { getStudents, searchStudents } from './data/mockStudents';
import { addFeedback } from './data/mockFeedback';

export default function Feedback() {
  const [students, setStudents] = useState(getStudents());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setStudents(getStudents());
    } else {
      setStudents(searchStudents(query));
    }
  };

  const handleSendFeedback = (student) => {
    setSelectedStudent(student);
    setShowFeedbackModal(true);
  };

  const handleViewPerformance = (student) => {
    setSelectedStudent(student);
    setShowPerformanceModal(true);
  };

  const handleSubmitFeedback = (formData) => {
    try {
      addFeedback({
        ...formData,
        studentId: selectedStudent.id,
        studentName: selectedStudent.studentName
      });
      setSuccessMessage(`تم إرسال التقييم للطالب ${selectedStudent.studentName} بنجاح`);
      setShowFeedbackModal(false);
      setSelectedStudent(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('حدث خطأ أثناء إرسال التقييم');
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)",
      direction: "rtl",
      paddingTop: "80px"
    }}>
      <div className="container py-4 px-2 px-md-4">
        <h2 className="mb-4 fw-bold" style={{ color: "#6B46C1", fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}>
          التقييم
        </h2>

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <div className="mb-3">
          <SearchBar
            placeholder="ابحث عن طالب بالاسم أو الرقم..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-body p-2 p-md-4">
            <div className="table-responsive" style={{ overflowX: "auto" }}>
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th style={{ color: "#6B46C1", fontWeight: "bold", whiteSpace: "nowrap", minWidth: "100px" }}>
                      رقم الطالب
                    </th>
                    <th style={{ color: "#6B46C1", fontWeight: "bold", minWidth: "150px" }}>
                      اسم الطالب
                    </th>
                    <th style={{ color: "#6B46C1", fontWeight: "bold", whiteSpace: "nowrap", minWidth: "200px" }}>
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-4">
                        لا توجد نتائج
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id}>
                        <td style={{ whiteSpace: "nowrap" }}>{student.studentNumber}</td>
                        <td>{student.studentName}</td>
                        <td>
                          <div className="d-flex flex-wrap gap-1">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleViewPerformance(student)}
                              style={{ whiteSpace: "nowrap" }}
                            >
                              الأداء
                            </button>
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleSendFeedback(student)}
                              style={{ whiteSpace: "nowrap" }}
                            >
                              إرسال تقييم
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <Modal
        isOpen={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          setSelectedStudent(null);
        }}
        title="إرسال تقييم"
        size="lg"
      >
        {selectedStudent && (
          <FeedbackForm
            studentName={selectedStudent.studentName}
            onSubmit={handleSubmitFeedback}
            onCancel={() => {
              setShowFeedbackModal(false);
              setSelectedStudent(null);
            }}
          />
        )}
      </Modal>

      {/* Performance Modal */}
      <Modal
        isOpen={showPerformanceModal}
        onClose={() => {
          setShowPerformanceModal(false);
          setSelectedStudent(null);
        }}
        title="أداء الطالب"
      >
        {selectedStudent && (
          <div style={{ direction: "rtl" }}>
            <div className="mb-3">
              <label className="form-label fw-bold">اسم الطالب</label>
              <p>{selectedStudent.studentName}</p>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">رقم الطالب</label>
              <p>{selectedStudent.studentNumber}</p>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">معدل الأداء</label>
              <div className="progress" style={{ height: "30px" }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${selectedStudent.performance}%` }}
                >
                  {selectedStudent.performance}%
                </div>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">آخر نشاط</label>
              <p>{selectedStudent.lastActivity}</p>
            </div>
            <button
              className="btn btn-secondary w-100"
              onClick={() => {
                setShowPerformanceModal(false);
                setSelectedStudent(null);
              }}
            >
              إغلاق
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

