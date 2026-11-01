import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import CourseManagement from './pages/Admin/CourseManagement';
import SubjectList from './pages/Faculty/SubjectList';
import MarkAttendance from './pages/Faculty/MarkAttendance';
import ExamManagement from './pages/Admin/ExamManagement';
import UploadMarks from './pages/Faculty/UploadMarks';
import AddSubject from './pages/Faculty/AddSubject';
import CreateExam from './pages/Faculty/CreateExam';
import AttendanceHistory from './pages/Faculty/AttendanceHistory';
import Profile from './pages/Faculty/Profile';
import AddStudent from './pages/Faculty/AddStudent';
import AllStudents from './pages/Faculty/AllStudents';
import Announcements from './pages/Faculty/Announcements';
import SubjectInsights from './pages/Faculty/SubjectInsights';
import Timetable from './pages/Faculty/Timetable';
import ActivityTracker from './pages/Faculty/ActivityTracker';
import ExamHistory from './pages/Faculty/ExamHistory';
import FeedbackPortal from './pages/Faculty/FeedbackPortal';
import AdminAcademicManagement from './pages/Admin/AcademicManagement';
import AdminReports from './pages/Admin/Reports';
import StudentDashboard from './pages/Student/StudentDashboard';
import ERPLayout from './components/ERPLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Authenticated ERP Protected Routes with Central ERP Layout */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<ERPLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/admin/courses" element={<CourseManagement />} />
                            <Route path="/admin/exams" element={<ExamManagement />} />
                            <Route path="/admin/academic" element={<AdminAcademicManagement />} />
                            <Route path="/admin/reports" element={<AdminReports />} />

                            {/* Student Dedicated Portal */}
                            <Route path="/student/portal" element={<StudentDashboard />} />

                            {/* Faculty & Academic Operations */}
                            <Route path="/faculty/subjects" element={<SubjectList />} />
                            <Route path="/faculty/add-subject" element={<AddSubject />} />
                            <Route path="/faculty/attendance" element={<MarkAttendance />} />
                            <Route path="/faculty/attendance-history/:subjectId" element={<AttendanceHistory />} />
                            <Route path="/faculty/create-exam" element={<CreateExam />} />
                            <Route path="/faculty/profile" element={<Profile />} />
                            <Route path="/faculty/add-student" element={<AddStudent />} />
                            <Route path="/faculty/student-list" element={<AllStudents />} />
                            <Route path="/faculty/announcements" element={<Announcements />} />
                            <Route path="/faculty/insights/:subjectId" element={<SubjectInsights />} />
                            <Route path="/faculty/timetable" element={<Timetable />} />
                            <Route path="/faculty/activity-tracker" element={<ActivityTracker />} />
                            <Route path="/faculty/exam-history" element={<ExamHistory />} />
                            
                            <Route path="/faculty/marks" element={<UploadMarks />} />
                            <Route path="/faculty/marks/:subjectId" element={<UploadMarks />} />
                            
                            {/* Student & Faculty Quality Feedback Portal */}
                            <Route path="/feedback" element={<FeedbackPortal />} />
                            <Route path="/faculty/feedback" element={<FeedbackPortal />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
