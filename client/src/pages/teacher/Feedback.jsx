import React, { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import Modal from './components/Modal';
import FeedbackForm from './components/FeedbackForm';
import { getStudents, getStudentPerformance, createEvaluation } from '../../services/api';

export default function Feedback() {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]); // Store all students for search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentPerformance, setStudentPerformance] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch students on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      // apiCall returns the data field from ApiResponse, so response is already the array
      const studentsList = await getStudents();
      console.log('Fetched students:', studentsList); // Debug log
      
      // Ensure we have an array
      if (!Array.isArray(studentsList)) {
        console.error('Expected array but got:', studentsList);
        setError('تنسيق البيانات غير صحيح');
        setStudents([]);
        return;
      }
      
      setAllStudents(studentsList);
      setStudents(studentsList);
    } catch (err) {
      console.error('Error fetching students:', err); // Debug log
      setError(err.message || 'حدث خطأ أثناء تحميل الطلاب');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality - filter by name or student_id
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setStudents(allStudents);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = allStudents.filter(student => 
        student.name.toLowerCase().includes(lowerQuery) ||
        student.student_id.includes(query)
      );
      setStudents(filtered);
    }
  };

  const handleSendFeedback = (student) => {
    setSelectedStudent(student);
    setShowFeedbackModal(true);
  };

  const handleViewPerformance = async (student) => {
    setSelectedStudent(student);
    setShowPerformanceModal(true);
    setPerformanceLoading(true);
    setStudentPerformance(null);

    try {
      const response = await getStudentPerformance(student._id);
      setStudentPerformance(response.data);
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تحميل أداء الطالب');
    } finally {
      setPerformanceLoading(false);
    }
  };

  const handleSubmitFeedback = async (formData) => {
    try {
      await createEvaluation({
        student_id: selectedStudent._id,
        title: formData.title,
        message: formData.message
      });
      
      setSuccessMessage(`تم إرسال التقييم للطالب ${selectedStudent.name} بنجاح`);
      setShowFeedbackModal(false);
      setSelectedStudent(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert(error.message || 'حدث خطأ أثناء إرسال التقييم');
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'لا يوجد';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

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
            {loading ? (
              <div className="text-center text-muted py-4">
                جاري تحميل الطلاب...
              </div>
            ) : (
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
                          {searchQuery ? 'لا توجد نتائج للبحث' : 'لا يوجد طلاب'}
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student._id}>
                          <td style={{ whiteSpace: "nowrap" }}>{student.student_id}</td>
                          <td>{student.name}</td>
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
            )}
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
            studentName={selectedStudent.name}
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
          setStudentPerformance(null);
        }}
        title="أداء الطالب"
      >
        {selectedStudent && (
          <div style={{ direction: "rtl" }}>
            {performanceLoading ? (
              <div className="text-center text-muted py-4">
                جاري تحميل بيانات الأداء...
              </div>
            ) : studentPerformance ? (
              <>
                <div className="mb-3">
                  <label className="form-label fw-bold">اسم الطالب</label>
                  <p>{selectedStudent.name}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">رقم الطالب</label>
                  <p>{selectedStudent.student_id}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">معدل الأداء</label>
                  <div className="progress" style={{ height: "30px" }}>
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${studentPerformance.accuracy_percentage}%` }}
                    >
                      {studentPerformance.accuracy_percentage}%
                    </div>
                  </div>
                  <small className="text-muted">
                    الإجابات الصحيحة: {studentPerformance.correct_answers} من {studentPerformance.total_questions}
                  </small>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">إجمالي الأسئلة</label>
                  <p>{studentPerformance.total_questions}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">الإجابات الصحيحة</label>
                  <p className="text-success">{studentPerformance.correct_answers}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">الإجابات الخاطئة</label>
                  <p className="text-danger">{studentPerformance.wrong_answers}</p>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">آخر نشاط</label>
                  <p>{formatDate(studentPerformance.last_activity)}</p>
                </div>
                <button
                  className="btn btn-secondary w-100"
                  onClick={() => {
                    setShowPerformanceModal(false);
                    setSelectedStudent(null);
                    setStudentPerformance(null);
                  }}
                >
                  إغلاق
                </button>
              </>
            ) : (
              <div className="text-center text-muted py-4">
                لا توجد بيانات أداء متاحة
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
