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

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'حدث خطأ في الطلب');
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

