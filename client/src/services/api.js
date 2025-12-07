const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle body for POST/PUT requests
  if (options.body && typeof options.body === 'object') {
    options.body = JSON.stringify(options.body);
  }

  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log('API Call:', fullUrl); // Debug log

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('Non-JSON response received:', text.substring(0, 200));
    throw new Error(`الاستجابة غير صالحة (تلقينا HTML بدلاً من JSON). URL: ${fullUrl}. الخطأ: ${text.substring(0, 100)}`);
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.data?.message || 'حدث خطأ في الطلب');
  }

  // ApiResponse structure: { statusCode, success, message, data }
  // Return the data field directly for easier access in components
  // If data has a 'data' property (ApiResponse format), return it, otherwise return the whole object
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data;
  }
  return data;
};

// Question Types API
export const getQuestionTypes = () => apiCall('/questions/types');
export const getInternalTypes = () => apiCall('/questions/internal-types');
export const getInternalTypesByTypeId = (typeId) => apiCall(`/questions/internal-types/${typeId}`);

// Passages API
export const getPassages = () => apiCall('/passages');
export const getPassageById = (id) => apiCall(`/passages/${id}`);
export const createPassage = (data) => apiCall('/passages', {
  method: 'POST',
  body: JSON.stringify(data),
});
export const updatePassage = (id, data) => apiCall(`/passages/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});
export const deletePassage = (id) => apiCall(`/passages/${id}`, {
  method: 'DELETE',
});

// Questions API
export const getQuestions = (filters = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.type_id) queryParams.append('type_id', filters.type_id);
  if (filters.internal_type_id) queryParams.append('internal_type_id', filters.internal_type_id);
  if (filters.passage_id) queryParams.append('passage_id', filters.passage_id);
  
  const queryString = queryParams.toString();
  return apiCall(`/questions${queryString ? `?${queryString}` : ''}`);
};

export const getQuestionById = (id) => apiCall(`/questions/${id}`);
export const createQuestion = (data) => apiCall('/questions', {
  method: 'POST',
  body: JSON.stringify(data),
});
export const updateQuestion = (id, data) => apiCall(`/questions/${id}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});
export const deleteQuestion = (id) => apiCall(`/questions/${id}`, {
  method: 'DELETE',
});

// Dashboard API
export const getTeacherDashboard = () => apiCall('/questions/dashboard');

// Students API
export const getStudents = () => apiCall('/students');
export const getStudentById = (id) => apiCall(`/students/${id}`);
export const getStudentPerformance = (id) => apiCall(`/students/${id}/performance`);

// Evaluations API
export const createEvaluation = (data) => apiCall('/evaluations', {
  method: 'POST',
  body: JSON.stringify(data),
});
export const getEvaluationsByStudent = (studentId) => apiCall(`/evaluations/student/${studentId}`);
export const getEvaluationsByTeacher = () => apiCall('/evaluations/teacher');

