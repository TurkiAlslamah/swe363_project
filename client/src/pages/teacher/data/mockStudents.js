// Mock data for students
let students = [
  {
    id: 1,
    studentNumber: "2021001",
    studentName: "أحمد محمد العلي",
    email: "ahmed@example.com",
    performance: 85,
    lastActivity: "2024-01-20"
  },
  {
    id: 2,
    studentNumber: "2021002",
    studentName: "فاطمة علي السعيد",
    email: "fatima@example.com",
    performance: 92,
    lastActivity: "2024-01-19"
  },
  {
    id: 3,
    studentNumber: "2021003",
    studentName: "خالد عبدالله النور",
    email: "khalid@example.com",
    performance: 78,
    lastActivity: "2024-01-18"
  },
  {
    id: 4,
    studentNumber: "2021004",
    studentName: "سارة حسن المالكي",
    email: "sara@example.com",
    performance: 95,
    lastActivity: "2024-01-21"
  },
  {
    id: 5,
    studentNumber: "2021005",
    studentName: "محمد يوسف القحطاني",
    email: "mohammed@example.com",
    performance: 88,
    lastActivity: "2024-01-20"
  }
];

export const getStudents = () => students;
export const getStudentById = (id) => students.find(s => s.id === id);
export const searchStudents = (query) => {
  const lowerQuery = query.toLowerCase();
  return students.filter(s => 
    s.studentName.toLowerCase().includes(lowerQuery) ||
    s.studentNumber.includes(query)
  );
};

