import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMe } from './redux/slices/authSlice';

import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Home from './pages/Home.jsx';
import Courses from './pages/Courses.jsx';
import CourseDetails from './pages/student/CourseDetails.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import NotFound from './pages/NotFound.jsx';

// Student
import StudentDashboard from './pages/student/Dashboard.jsx';
import MyCourses from './pages/student/MyCourses.jsx';
import WatchCourse from './pages/student/WatchCourse.jsx';
import StudentAssignments from './pages/student/Assignments.jsx';
import StudentQuizzes from './pages/student/Quizzes.jsx';
import Certificates from './pages/student/Certificates.jsx';
import AIAssistant from './pages/student/AIAssistant.jsx';
import Roadmap from './pages/student/Roadmap.jsx';
import StudentProfile from './pages/student/Profile.jsx';
import StudentSettings from './pages/student/Settings.jsx';

// Teacher
import TeacherDashboard from './pages/teacher/Dashboard.jsx';
import CreateCourse from './pages/teacher/CreateCourse.jsx';
import EditCourse from './pages/teacher/EditCourse.jsx';
import TeacherCourseList from './pages/teacher/CourseList.jsx';
import TeacherAssignments from './pages/teacher/Assignments.jsx';
import TeacherQuizzes from './pages/teacher/Quizzes.jsx';
import TeacherStudents from './pages/teacher/Students.jsx';
import TeacherAnalytics from './pages/teacher/Analytics.jsx';
import TeacherProfile from './pages/teacher/Profile.jsx';
import TeacherSettings from './pages/teacher/Settings.jsx';

// Admin
import AdminDashboard from './pages/admin/Dashboard.jsx';
import TeacherManagement from './pages/admin/TeacherManagement.jsx';
import StudentManagement from './pages/admin/StudentManagement.jsx';
import CourseManagement from './pages/admin/CourseManagement.jsx';
import CategoryManagement from './pages/admin/CategoryManagement.jsx';
import EnrollmentsAdmin from './pages/admin/Enrollments.jsx';
import PaymentsAdmin from './pages/admin/Payments.jsx';
import CertificatesAdmin from './pages/admin/Certificates.jsx';
import NotificationsAdmin from './pages/admin/Notifications.jsx';
import AIAnalytics from './pages/admin/AIAnalytics.jsx';
import AdminProfile from './pages/admin/Profile.jsx';
import AdminSettings from './pages/admin/Settings.jsx';

export default function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (token && !user) dispatch(loadMe());
  }, [token, user, dispatch]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:slug" element={<CourseDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student */}
        <Route element={<ProtectedRoute roles={['student', 'teacher', 'admin']} />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/learn/:slug" element={<WatchCourse />} />
          <Route path="/assignments" element={<StudentAssignments />} />
          <Route path="/quizzes" element={<StudentQuizzes />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/settings" element={<StudentSettings />} />
        </Route>

        {/* Teacher */}
        <Route element={<ProtectedRoute roles={['teacher', 'admin']} />}>
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/courses" element={<TeacherCourseList />} />
          <Route path="/teacher/courses/new" element={<CreateCourse />} />
          <Route path="/teacher/courses/:id/edit" element={<EditCourse />} />
          <Route path="/teacher/assignments" element={<TeacherAssignments />} />
          <Route path="/teacher/quizzes" element={<TeacherQuizzes />} />
          <Route path="/teacher/students" element={<TeacherStudents />} />
          <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
          <Route path="/teacher/profile" element={<TeacherProfile />} />
          <Route path="/teacher/settings" element={<TeacherSettings />} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/teachers" element={<TeacherManagement />} />
          <Route path="/admin/students" element={<StudentManagement />} />
          <Route path="/admin/courses" element={<CourseManagement />} />
          <Route path="/admin/categories" element={<CategoryManagement />} />
          <Route path="/admin/enrollments" element={<EnrollmentsAdmin />} />
          <Route path="/admin/payments" element={<PaymentsAdmin />} />
          <Route path="/admin/certificates" element={<CertificatesAdmin />} />
          <Route path="/admin/notifications" element={<NotificationsAdmin />} />
          <Route path="/admin/ai-analytics" element={<AIAnalytics />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
