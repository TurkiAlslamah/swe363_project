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

// Helper function to normalize pieceId (null or empty string = standalone)
const normalizePieceId = (pieceId) => {
  if (!pieceId || pieceId.trim() === '') return null;
  return pieceId.trim();
};

// Helper function to get questions by pieceId
const getQuestionsByPiece = (pieceId) => {
  const normalizedPieceId = normalizePieceId(pieceId);
  return questions.filter(q => normalizePieceId(q.passageLink) === normalizedPieceId);
};

// Helper function to shift questions down when inserting at position N
// This shifts all questions with order >= N by +1
const shiftQuestionsDownInPiece = (pieceId, insertAtOrder, excludeQuestionId = null) => {
  const normalizedPieceId = normalizePieceId(pieceId);
  const pieceQuestions = questions.filter(
    q => normalizePieceId(q.passageLink) === normalizedPieceId && 
         q.id !== excludeQuestionId
  );
  
  // Sort by current order to process correctly
  const sortedQuestions = [...pieceQuestions].sort((a, b) => 
    (b.questionOrder || 0) - (a.questionOrder || 0)
  );
  
  // Shift questions with order >= insertAtOrder by +1
  sortedQuestions.forEach(q => {
    if (q.questionOrder >= insertAtOrder) {
      q.questionOrder += 1;
    }
  });
};

// Helper function to shift questions up when removing from position N
// This shifts all questions with order > N by -1
const shiftQuestionsUpInPiece = (pieceId, removedOrder) => {
  const normalizedPieceId = normalizePieceId(pieceId);
  const pieceQuestions = questions.filter(
    q => normalizePieceId(q.passageLink) === normalizedPieceId
  );
  
  // Shift questions with order > removedOrder by -1
  pieceQuestions.forEach(q => {
    if (q.questionOrder > removedOrder) {
      q.questionOrder -= 1;
    }
  });
};

// Helper function to get the next available question number for a piece
const getNextAvailableQuestionNumberForPiece = (pieceId) => {
  const normalizedPieceId = normalizePieceId(pieceId);
  const pieceQuestions = getQuestionsByPiece(normalizedPieceId);
  
  if (pieceQuestions.length === 0) return 1;
  const maxOrder = Math.max(...pieceQuestions.map(q => q.questionOrder || 0));
  return maxOrder + 1;
};

// Get questions sorted by piece and questionOrder
export const getQuestions = () => {
  // Sort by piece (null first, then by pieceId), then by questionOrder
  return [...questions].sort((a, b) => {
    const pieceA = normalizePieceId(a.passageLink);
    const pieceB = normalizePieceId(b.passageLink);
    
    // Compare pieces (null comes first)
    if (pieceA === null && pieceB !== null) return -1;
    if (pieceA !== null && pieceB === null) return 1;
    if (pieceA !== null && pieceB !== null) {
      if (pieceA !== pieceB) {
        return pieceA.localeCompare(pieceB);
      }
    }
    
    // Same piece, sort by order
    return (a.questionOrder || 0) - (b.questionOrder || 0);
  });
};

// Add a new question with automatic reordering within the piece
// When adding question at position N, shift all questions with order >= N by +1
export const addQuestion = (question) => {
  // Get the next available ID
  const nextId = questions.length > 0 
    ? Math.max(...questions.map(q => q.id)) + 1 
    : 1;
  
  // Parse questionOrder
  let questionOrder = parseInt(question.questionOrder);
  if (isNaN(questionOrder) || questionOrder < 1) {
    // Get next available number for this piece
    questionOrder = getNextAvailableQuestionNumberForPiece(question.passageLink);
  }
  
  // Normalize pieceId
  const normalizedPieceId = normalizePieceId(question.passageLink);
  
  // IMPORTANT: First shift all existing questions with order >= questionOrder by +1
  // This makes room for the new question at position questionOrder
  shiftQuestionsDownInPiece(normalizedPieceId, questionOrder);
  
  // Create and add the new question
  const newQuestion = {
    ...question,
    id: nextId,
    passageLink: normalizedPieceId,
    questionOrder: questionOrder,
    createdAt: new Date().toISOString().split('T')[0],
    status: "بانتظار موافقة المشرف"
  };
  
  questions.push(newQuestion);
  
  return newQuestion;
};

// Update an existing question with automatic reordering within the piece
export const updateQuestion = (id, updatedQuestion) => {
  const index = questions.findIndex(q => q.id === id);
  if (index === -1) return null;
  
  const oldQuestion = questions[index];
  const oldOrder = oldQuestion.questionOrder;
  const oldPieceId = normalizePieceId(oldQuestion.passageLink);
  
  // Parse the new questionOrder
  let newOrder = parseInt(updatedQuestion.questionOrder);
  if (isNaN(newOrder) || newOrder < 1) {
    newOrder = oldOrder; // Keep the old order if invalid
  }
  
  const newPieceId = normalizePieceId(updatedQuestion.passageLink);
  
  // Temporarily remove the question from the array to handle reordering
  const questionToUpdate = questions[index];
  questions.splice(index, 1);
  
  // Handle reordering based on piece and order changes
  if (oldPieceId !== newPieceId) {
    // Piece changed: remove from old piece, add to new piece
    
    // 1. Shift up in old piece (remove old position)
    shiftQuestionsUpInPiece(oldPieceId, oldOrder);
    
    // 2. Shift down in new piece (make room for new position)
    shiftQuestionsDownInPiece(newPieceId, newOrder);
  } else {
    // Same piece: handle position change within the piece
    if (newOrder !== oldOrder) {
      // Get all questions in the piece (excluding the one being moved)
      const pieceQuestions = getQuestionsByPiece(oldPieceId);
      
      if (newOrder > oldOrder) {
        // Moving forward: shift questions between old and new position backward
        // Questions with order > oldOrder and <= newOrder need to move back by 1
        pieceQuestions.forEach(q => {
          if (q.questionOrder > oldOrder && q.questionOrder <= newOrder) {
            q.questionOrder -= 1;
          }
        });
      } else {
        // Moving backward: shift questions between new and old position forward
        // Questions with order >= newOrder and < oldOrder need to move forward by 1
        pieceQuestions.forEach(q => {
          if (q.questionOrder >= newOrder && q.questionOrder < oldOrder) {
            q.questionOrder += 1;
          }
        });
      }
    }
  }
  
  // Update and re-add the question with new values
  const updatedQuestionFinal = {
    ...questionToUpdate,
    ...updatedQuestion,
    passageLink: newPieceId,
    questionOrder: newOrder,
    status: "بانتظار مراجعة المشرف"
  };
  
  questions.push(updatedQuestionFinal);
  
  return updatedQuestionFinal;
};

// Delete a question and reorder the piece
export const deleteQuestion = (id) => {
  const questionToDelete = questions.find(q => q.id === id);
  if (!questionToDelete) return false;
  
  const pieceId = normalizePieceId(questionToDelete.passageLink);
  const order = questionToDelete.questionOrder;
  
  // Remove the question
  questions = questions.filter(q => q.id !== id);
  
  // Reorder questions in the same piece by shifting up
  shiftQuestionsUpInPiece(pieceId, order);
  
  return true;
};

// Get a question by ID
export const getQuestionById = (id) => questions.find(q => q.id === id);

// Get the next available question number for standalone questions (for Add Question form)
export const getNextAvailableQuestionNumber = () => {
  return getNextAvailableQuestionNumberForPiece(null);
};

