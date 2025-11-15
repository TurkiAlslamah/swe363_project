// Mock data for questions
let questions = [
  {
    id: 1,
    questionText: "ما هي عاصمة المملكة العربية السعودية؟",
    questionImage: null,
    questionType: "نصي",
    category: "لفظي",
    internalType: "فهم المقروء",
    passageLink: null,
    questionOrder: 1,
    explanation: "الرياض هي عاصمة المملكة العربية السعودية",
    options: [
      { id: 1, text: "الرياض" },
      { id: 2, text: "جدة" },
      { id: 3, text: "الدمام" },
      { id: 4, text: "مكة المكرمة" }
    ],
    correctAnswer: 1,
    status: "مراجعة",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    questionText: "احسب قيمة 5 × 7",
    questionImage: null,
    questionType: "نصي",
    category: "كمي",
    internalType: "حساب",
    passageLink: null,
    questionOrder: 2,
    explanation: "5 × 7 = 35",
    options: [
      { id: 1, text: "30" },
      { id: 2, text: "35" },
      { id: 3, text: "40" },
      { id: 4, text: "42" }
    ],
    correctAnswer: 2,
    status: "مقبول",
    createdAt: "2024-01-16"
  },
  {
    id: 3,
    questionText: "ما معنى كلمة 'التعليم'؟",
    questionImage: null,
    questionType: "نصي",
    category: "لفظي",
    internalType: "مفردات",
    passageLink: null,
    questionOrder: 3,
    explanation: "التعليم هو عملية نقل المعرفة",
    options: [
      { id: 1, text: "التعلم" },
      { id: 2, text: "التدريس" },
      { id: 3, text: "الدراسة" },
      { id: 4, text: "المعرفة" }
    ],
    correctAnswer: 2,
    status: "بانتظار موافقة المشرف",
    createdAt: "2024-01-17"
  }
];

// Helper function to get the next available question number
const getNextQuestionNumber = () => {
  if (questions.length === 0) return 1;
  const maxOrder = Math.max(...questions.map(q => q.questionOrder || 0));
  return maxOrder + 1;
};

// Helper function to recalculate question numbers sequentially
const recalculateQuestionNumbers = () => {
  // Sort questions by current questionOrder to maintain order
  const sortedQuestions = [...questions].sort((a, b) => 
    (a.questionOrder || 0) - (b.questionOrder || 0)
  );
  
  // Reassign sequential numbers starting from 1
  sortedQuestions.forEach((question, index) => {
    question.questionOrder = index + 1;
  });
  
  // Update the questions array to maintain the sorted order
  questions = sortedQuestions;
};

// Get questions sorted by questionOrder
export const getQuestions = () => {
  return [...questions].sort((a, b) => 
    (a.questionOrder || 0) - (b.questionOrder || 0)
  );
};

// Add a new question
export const addQuestion = (question) => {
  // Get the next available ID
  const nextId = questions.length > 0 
    ? Math.max(...questions.map(q => q.id)) + 1 
    : 1;
  
  // Auto-calculate questionOrder if not provided or invalid
  let questionOrder = parseInt(question.questionOrder);
  if (!questionOrder || questionOrder < 1) {
    questionOrder = getNextQuestionNumber();
  }
  
  // If the number is already taken or exceeds current max, shift existing questions
  const maxOrder = questions.length > 0 
    ? Math.max(...questions.map(q => q.questionOrder || 0)) 
    : 0;
  
  if (questionOrder <= maxOrder) {
    // Shift all questions with order >= newOrder
    questions.forEach(q => {
      if (q.questionOrder >= questionOrder) {
        q.questionOrder += 1;
      }
    });
  }
  
  const newQuestion = {
    ...question,
    id: nextId,
    questionOrder: questionOrder,
    createdAt: new Date().toISOString().split('T')[0],
    status: "بانتظار موافقة المشرف"
  };
  
  questions.push(newQuestion);
  
  // Recalculate to ensure sequential numbering (1, 2, 3, ...)
  recalculateQuestionNumbers();
  
  return newQuestion;
};

// Update an existing question
export const updateQuestion = (id, updatedQuestion) => {
  const index = questions.findIndex(q => q.id === id);
  if (index === -1) return null;
  
  const oldQuestion = questions[index];
  const oldOrder = oldQuestion.questionOrder;
  
  // Parse the new questionOrder
  let newOrder = parseInt(updatedQuestion.questionOrder);
  if (!newOrder || newOrder < 1) {
    newOrder = oldOrder; // Keep the old order if invalid
  }
  
  // If the order changed, handle reordering
  if (newOrder !== oldOrder) {
    // Remove the question temporarily
    questions.splice(index, 1);
    
    // Adjust other questions
    if (newOrder > oldOrder) {
      // Moving forward: shift questions between old and new position backward
      questions.forEach(q => {
        if (q.questionOrder > oldOrder && q.questionOrder <= newOrder) {
          q.questionOrder -= 1;
        }
      });
    } else {
      // Moving backward: shift questions between new and old position forward
      questions.forEach(q => {
        if (q.questionOrder >= newOrder && q.questionOrder < oldOrder) {
          q.questionOrder += 1;
        }
      });
    }
    
    // Re-add the question with new order
    questions.push({
      ...oldQuestion,
      ...updatedQuestion,
      questionOrder: newOrder,
      status: "بانتظار مراجعة المشرف"
    });
  } else {
    // Order didn't change, just update the question
    questions[index] = {
      ...oldQuestion,
      ...updatedQuestion,
      questionOrder: newOrder,
      status: "بانتظار مراجعة المشرف"
    };
  }
  
  // Recalculate to ensure sequential numbering
  recalculateQuestionNumbers();
  
  return questions.find(q => q.id === id);
};

// Delete a question
export const deleteQuestion = (id) => {
  const questionToDelete = questions.find(q => q.id === id);
  if (!questionToDelete) return false;
  
  // Remove the question
  questions = questions.filter(q => q.id !== id);
  
  // Recalculate question numbers to fill the gap
  recalculateQuestionNumbers();
  
  return true;
};

// Get a question by ID
export const getQuestionById = (id) => questions.find(q => q.id === id);

// Get the next available question number (for Add Question form)
export const getNextAvailableQuestionNumber = () => {
  return getNextQuestionNumber();
};

