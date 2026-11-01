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
import SystemSettings from './pages/Admin/SystemSettings';
import StudentDashboard from './pages/Student/StudentDashboard';
import LibraryPortal from './pages/Library/LibraryPortal';
import PlacementPortal from './pages/Placement/PlacementPortal';
import DocumentVaultPortal from './pages/Documents/DocumentVaultPortal';
import AIAcademicInsights from './pages/AI/AIAcademicInsights';
import FeeManagementPortal from './pages/Finance/FeeManagementPortal';
import HostelTransportPortal from './pages/Campus/HostelTransportPortal';
import CompliancePortal from './pages/Admin/CompliancePortal';
import LMSPortal from './pages/LMS/LMSPortal';
import ResearchPortal from './pages/Research/ResearchPortal';
import AlumniPortal from './pages/Alumni/AlumniPortal';
import AdmissionPortal from './pages/Admission/AdmissionPortal';
import SystemAdminPortal from './pages/Admin/SystemAdminPortal';
import WorkflowApprovalsPortal from './pages/Workflows/WorkflowApprovalsPortal';
import UniversalSearchPortal from './pages/Search/UniversalSearchPortal';
import PublicUniversityWebsite from './pages/Public/PublicUniversityWebsite';
import ParentPortal from './pages/Parent/ParentPortal';
import ERPLayout from './components/ERPLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                    <Route path="/" element={<PublicUniversityWebsite />} />
                    <Route path="/public" element={<PublicUniversityWebsite />} />
                    <Route path="/parent/portal" element={<ParentPortal />} />
                    <Route path="/legacy-landing" element={<LandingPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Authenticated ERP Protected Routes with Central ERP Layout */}
                    <Route element={<ProtectedRoute />}>
                        <Route element={<ERPLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            
                            {/* Administrator Portals */}
                            <Route path="/admin/courses" element={<CourseManagement />} />
                            <Route path="/admin/exams" element={<ExamManagement />} />
                            <Route path="/admin/academic" element={<AdminAcademicManagement />} />
                            <Route path="/admin/reports" element={<AdminReports />} />
                            <Route path="/admin/settings" element={<SystemSettings />} />

                            {/* Phase 14 - AI Academic Insights */}
                            <Route path="/ai/insights" element={<AIAcademicInsights />} />

                            {/* Phase 8 - Library Management */}
                            <Route path="/library" element={<LibraryPortal />} />

                            {/* Phase 9 - Placement & Internship Cell */}
                            <Route path="/placements" element={<PlacementPortal />} />

                            {/* Phase 10 - Institutional Document Vault */}
                            <Route path="/documents" element={<DocumentVaultPortal />} />

                            {/* Phase 19 - Finance & Fees */}
                            <Route path="/fees" element={<FeeManagementPortal />} />

                            {/* Phases 21 & 22 - Campus Facilities & Logistics */}
                            <Route path="/campus/logistics" element={<HostelTransportPortal />} />

                            {/* Phase 24 - NAAC / NBA Compliance & Accreditation */}
                            <Route path="/admin/compliance" element={<CompliancePortal />} />

                            {/* Phase 26 - Learning Management System */}
                            <Route path="/lms" element={<LMSPortal />} />

                            {/* Phase 27 - Research & Innovation */}
                            <Route path="/research" element={<ResearchPortal />} />

                            {/* Phase 28 - Alumni Relations */}
                            <Route path="/alumni" element={<AlumniPortal />} />

                            {/* Phase 29 - Admissions Management */}
                            <Route path="/admissions" element={<AdmissionPortal />} />

                            {/* Phases 34 & 35 - System Administration & BI */}
                            <Route path="/admin/system" element={<SystemAdminPortal />} />

                            {/* Phase 42 - Universal Enterprise Search */}
                            <Route path="/search" element={<UniversalSearchPortal />} />

                            {/* Phase 43 - Workflow & Approval Engine */}
                            <Route path="/workflows" element={<WorkflowApprovalsPortal />} />

                            {/* Module 5 - Parent Guardian Portal (Inside ERP layout option) */}
                            <Route path="/parent" element={<ParentPortal />} />

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
