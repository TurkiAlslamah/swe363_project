import React, { useState, useEffect } from 'react';
import DashboardCard from './components/DashboardCard';
import { getTeacherDashboard } from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_questions: 0,
    total_students: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard stats from API
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');
      // apiCall returns data.data from ApiResponse, so response is already the stats object
      const statsData = await getTeacherDashboard();
      setStats({
        total_questions: statsData?.total_questions || 0,
        total_students: statsData?.total_students || 0
      });
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء جلب الإحصائيات');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load stats on mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Listen for question added/updated/deleted events to refresh stats
  useEffect(() => {
    const handleQuestionChange = () => {
      fetchDashboardStats();
    };

    window.addEventListener('questionAdded', handleQuestionChange);
    window.addEventListener('questionUpdated', handleQuestionChange);
    window.addEventListener('questionDeleted', handleQuestionChange);
    
    return () => {
      window.removeEventListener('questionAdded', handleQuestionChange);
      window.removeEventListener('questionUpdated', handleQuestionChange);
      window.removeEventListener('questionDeleted', handleQuestionChange);
    };
  }, []);

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f4e6ff 0%, #ffffff 100%)",
      direction: "rtl",
      paddingTop: "80px"
    }}>
      <div className="container py-4 px-2 px-md-4">
        <h2 className="mb-4 fw-bold" style={{ color: "#6B46C1", fontSize: "clamp(1.25rem, 4vw, 1.75rem)" }}>
          لوحة تحكم المعلم
        </h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm border-0">
                <div className="card-body text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">جاري التحميل...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-4">
              <DashboardCard
                title="عدد الأسئلة"
                value={stats.total_questions}
                icon="📝"
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <DashboardCard
                title="عدد الطلاب"
                value={stats.total_students}
                icon="👥"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
