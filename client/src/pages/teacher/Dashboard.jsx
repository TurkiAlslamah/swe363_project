import React from 'react';
import DashboardCard from './components/DashboardCard';
import { getQuestions } from './data/mockQuestions';
import { getStudents } from './data/mockStudents';

export default function Dashboard() {
  const questions = getQuestions();
  const students = getStudents();

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

        <div className="row g-3">
          <div className="col-12 col-md-6 col-lg-4">
            <DashboardCard
              title="عدد الأسئلة"
              value={questions.length}
              icon="📝"
            />
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <DashboardCard
              title="عدد الطلاب"
              value={students.length}
              icon="👥"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

