import api from './api';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

export const courseApi = {
  list: (params) => api.get('/courses', { params }),
  get: (slug) => api.get(`/courses/${slug}`),
  myOwned: () => api.get('/courses/me/owned'),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  remove: (id) => api.delete(`/courses/${id}`),
};

export const lessonApi = {
  byCourse: (courseId) => api.get(`/lessons/course/${courseId}`),
  create: (data) => api.post('/lessons', data),
  update: (id, data) => api.put(`/lessons/${id}`, data),
  remove: (id) => api.delete(`/lessons/${id}`),
};

export const enrollmentApi = {
  list: () => api.get('/enrollments'),
  enroll: (courseId) => api.post(`/enrollments/${courseId}`),
  complete: (courseId, lessonId) =>
    api.put(`/enrollments/${courseId}/lessons/${lessonId}/complete`),
};

export const categoryApi = {
  list: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  remove: (id) => api.delete(`/categories/${id}`),
};

export const assignmentApi = {
  byCourse: (courseId) => api.get(`/assignments/course/${courseId}`),
  create: (data) => api.post('/assignments', data),
  submit: (id, data) => api.post(`/assignments/${id}/submit`, data),
  submissions: (id) => api.get(`/assignments/${id}/submissions`),
  grade: (subId, data) => api.put(`/assignments/submissions/${subId}/grade`, data),
  aiGrade: (subId) => api.post(`/assignments/submissions/${subId}/ai-grade`),
};

export const quizApi = {
  byCourse: (courseId) => api.get(`/quizzes/course/${courseId}`),
  get: (id) => api.get(`/quizzes/${id}`),
  create: (data) => api.post('/quizzes', data),
  submit: (id, answers) => api.post(`/quizzes/${id}/submit`, { answers }),
  myAttempts: () => api.get('/quizzes/me/attempts'),
};

export const certificateApi = {
  issue: (courseId) => api.post(`/certificates/issue/${courseId}`),
  my: () => api.get('/certificates/me'),
  verify: (serial) => api.get(`/certificates/verify/${serial}`),
};

export const notificationApi = {
  list: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read/all'),
};

export const paymentApi = {
  createOrder: (courseId) => api.post('/payments/create-order', { courseId }),
  verify: (data) => api.post('/payments/verify', data),
  history: () => api.get('/payments/history'),
};

export const aiApi = {
  chats: () => api.get('/ai/chats'),
  getChat: (id) => api.get(`/ai/chats/${id}`),
  send: (data) => api.post('/ai/chat', data),
  generate: (mode, prompt) => api.post('/ai/generate', { mode, prompt }),
  deleteChat: (id) => api.delete(`/ai/chats/${id}`),
};

export const ragApi = {
  upload: (data) => api.post('/rag/upload', data),
  documents: () => api.get('/rag/documents'),
  ask: (data) => api.post('/rag/ask', data),
  remove: (id) => api.delete(`/rag/documents/${id}`),
};

// export const agentApi = {
//   studyPlanner: (goal) => api.post('/agents/study-planner', { goal }),
//   career: (profile) => api.post('/agents/career', { profile }),
//   interview: (topic) => api.post('/agents/interview', { topic }),
//   codingMentor: (code) => api.post('/agents/coding-mentor', { code }),
//   recommender: (interests) => api.post('/agents/recommender', { interests }),
//   revision: (topic) => api.post('/agents/revision', { topic }),
// };




export const agentApi = {
  studyPlanner: (data) => api.post('/agents/study-planner', data),
  career: (data) => api.post('/agents/career', data),
  interview: (data) => api.post('/agents/interview', data),
  codingMentor: (data) => api.post('/agents/coding-mentor', data),
  recommender: (data) => api.post('/agents/recommender', data),
  revision: (data) => api.post('/agents/revision', data),

  // history
  listRuns: (agentType) => api.get('/agents/history', { params: agentType ? { agentType } : {} }),
  getRun: (id) => api.get(`/agents/history/${id}`),
  deleteRun: (id) => api.delete(`/agents/history/${id}`),
};

export const adminApi = {
  stats: () => api.get('/admin/stats'),
  aiAnalytics: () => api.get('/admin/ai-analytics'),
};

export const userApi = {
  list: (params) => api.get('/users', { params }),
  get: (id) => api.get(`/users/${id}`),
  updateMe: (data) => api.put('/users/me/update', data),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  toggleActive: (id) => api.put(`/users/${id}/toggle-active`),
  remove: (id) => api.delete(`/users/${id}`),
};
