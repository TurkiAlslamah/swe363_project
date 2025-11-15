// Mock data for feedback
let feedbacks = [
  {
    id: 1,
    studentId: 1,
    studentName: "أحمد محمد العلي",
    title: "تحسين الأداء في الاختبارات",
    message: "أدائك جيد جداً، لكن يمكنك تحسين النتائج من خلال المزيد من الممارسة",
    sentAt: "2024-01-15"
  },
  {
    id: 2,
    studentId: 2,
    studentName: "فاطمة علي السعيد",
    title: "ممتاز!",
    message: "أدائك ممتاز، استمري في التقدم",
    sentAt: "2024-01-16"
  }
];

export const getFeedbacks = () => feedbacks;
export const addFeedback = (feedback) => {
  const newFeedback = {
    ...feedback,
    id: feedbacks.length + 1,
    sentAt: new Date().toISOString().split('T')[0]
  };
  feedbacks.push(newFeedback);
  return newFeedback;
};
export const getFeedbackByStudentId = (studentId) => 
  feedbacks.filter(f => f.studentId === studentId);

