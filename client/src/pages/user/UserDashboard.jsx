import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaStar, FaBullseye, FaEdit, FaBook } from "react-icons/fa";

const API_URL = "http://localhost:5005/api";
const getToken = () => localStorage.getItem("token");

export default function UserDashboard() {
  // Load goal from localStorage
  const [dailyGoal, setDailyGoal] = useState(() => {
    const saved = localStorage.getItem('dailyGoal');
    return saved ? parseInt(saved) : 50;
  });
  
  const [completed, setCompleted] = useState(0); // Changed from 25 to 0
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(dailyGoal);

  // Load today's attempts on mount
  useEffect(() => {
    loadAttemptsToday();
    
    // Reload when user comes back to this page
    const handleFocus = () => {
      loadAttemptsToday();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const loadAttemptsToday = async () => {
    try {
      const res = await fetch(`${API_URL}/training/attempts/today`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (data.success) {
        setCompleted(data.data.attempts_today);
      }
    } catch (error) {
      console.error("Error loading attempts:", error);
    }
  };
 
  const progress = (completed / dailyGoal) * 100;
  const remaining = Math.max(0, dailyGoal - completed);
 
  const handleSaveGoal = () => {
    const goal = typeof tempGoal === 'string' ? parseInt(tempGoal) : tempGoal;
    if (goal > 0 && goal <= 200) {
      setDailyGoal(goal);
      localStorage.setItem('dailyGoal', goal.toString()); // Save to localStorage
      if (completed > goal) {
        setCompleted(goal);
      }
      setIsEditingGoal(false);
    }
  };

 
  return (
<div className="min-vh-100 bg-light py-4" dir="rtl">
<div className="container" style={{ maxWidth: '800px' }}>
        {/* Banner */}
<div className="card border-0 shadow-lg mb-4" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px'
        }}>
<div className="card-body p-4 p-md-5">
<h1 className="text-white fw-bold mb-3" style={{ fontSize: '2rem' }}>
  <FaStar className="me-2" /> مرحباً، طالبنا المجتهد
</h1>

<p className="text-white mb-0" style={{ fontSize: '1.1rem', opacity: 0.95 }}>
              اليوم يوم جديد لتطوير مهاراتك في اختبار القدرات. هيا نبدأ!
</p>
</div>
</div>
 
        {/* Student Plan Card */}
<div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
<div className="card-body p-4 p-md-5">
            {/* Header */}
<div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
<h2 className="fw-bold mb-0" style={{ fontSize: '1.75rem' }}>
                خطتك
</h2>
              {!isEditingGoal ? (
<button 
                  className="btn btn-light border"
                  onClick={() => {
                    setIsEditingGoal(true);
                    setTempGoal(dailyGoal);
                  }}
                  style={{ borderRadius: '12px' }}
>
                  ✏️ تعديل الهدف
</button>
              ) : (
<div className="d-flex gap-2">
<input
                    type="number"
                    value={tempGoal}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setTempGoal('');
                      } else {
                        const num = parseInt(value);
                        if (!isNaN(num)) {
                          setTempGoal(num);
                        }
                      }
                    }}
                    className="form-control text-center fw-bold"
                    style={{ width: '80px', borderRadius: '10px' }}
                    min="1"
                    max="200"
                  />
<button 
                    className="btn btn-primary"
                    onClick={handleSaveGoal}
                    style={{ borderRadius: '10px' }}
>
                    حفظ
</button>
<button 
                    className="btn btn-secondary"
                    onClick={() => setIsEditingGoal(false)}
                    style={{ borderRadius: '10px' }}
>
                    إلغاء
</button>
</div>
              )}
</div>
 
            {/* Progress Section */}
<div>
              {/* Main Numbers */}
<div className="text-center py-4 mb-4">
<div className="d-flex justify-content-center align-items-baseline gap-2 mb-2">
<span className="fw-bold text-primary" style={{ fontSize: '4.5rem', lineHeight: 1 }}>
                    {completed}
</span>
<span className="text-muted fw-bold" style={{ fontSize: '3rem' }}>
                    /
</span>
<span className="fw-bold text-dark" style={{ fontSize: '4.5rem', lineHeight: 1 }}>
                    {dailyGoal}
</span>
</div>
<p className="text-muted fs-5 mb-0">سؤال</p>
</div>
 
              {/* Simple Progress Bar */}
<div className="mb-4">
<div className="d-flex justify-content-between align-items-center mb-2">
<span className="fw-semibold">التقدم اليومي</span>
<span className="fw-bold text-primary fs-4">{Math.round(progress)}%</span>
</div>
<div className="progress" style={{ height: '16px', borderRadius: '10px', backgroundColor: '#e9ecef' }}>
<div 
                    className="progress-bar"
                    role="progressbar"
                    style={{ 
                      width: `${Math.min(progress, 100)}%`,
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '10px',
                      transition: 'width 0.5s ease'
                    }}
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
></div>
</div>
<p className="text-center text-muted small mt-2 mb-0">مكتمل</p>
</div>
 
              {/* Stats Cards */}
<div className="row g-3">
<div className="col-4">
<div className="card border-0 bg-danger bg-opacity-10 text-center" style={{ borderRadius: '15px' }}>
<div className="card-body py-4">
<h3 className="fw-bold text-danger mb-1" style={{ fontSize: '2.5rem' }}>
                        {remaining}
</h3>
<p className="text-dark small fw-semibold mb-0">متبقي</p>
</div>
</div>
</div>
<div className="col-4">
<div className="card border-0 bg-primary bg-opacity-10 text-center" style={{ borderRadius: '15px' }}>
<div className="card-body py-4">
<h3 className="fw-bold text-primary mb-1" style={{ fontSize: '2.5rem' }}>
                        {completed}
</h3>
<p className="text-dark small fw-semibold mb-0">منجز</p>
</div>
</div>
</div>
<div className="col-4">
<div className="card border-0 bg-success bg-opacity-10 text-center" style={{ borderRadius: '15px' }}>
<div className="card-body py-4">
<h3 className="fw-bold text-success mb-1" style={{ fontSize: '2.5rem' }}>
                        {dailyGoal}
</h3>
<p className="text-dark small fw-semibold mb-0">الهدف</p>
</div>
</div>
</div>
</div>
 
            </div>
</div>
</div>
 
        {/* Action Buttons */}
<div className="row g-3 mt-4">
<div className="col-md-6">
<Link
              to="/training"
              className="btn btn-primary btn-lg w-100 text-decoration-none"
              style={{ borderRadius: '12px', fontWeight: 'bold' }}
>
              📚 ابدأ التدريب الآن
</Link>
</div>
<div className="col-md-6">
<Link
              to="/daily-test"
              className="btn btn-success btn-lg w-100 text-decoration-none"
              style={{ borderRadius: '12px', fontWeight: 'bold' }}
>
              🎯 الاختبار اليومي
</Link>
</div>
</div>
 
      </div>
</div>
  );
}