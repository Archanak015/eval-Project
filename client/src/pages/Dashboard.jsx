import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import NotificationPanel from '../components/NotificationPanel';
import axiosClient from '../api/axiosClient';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [analytics, setAnalytics] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await axiosClient.get('/api/analytics/dashboard');
                const payload = res.data?.data || res.data;
                if (payload) {
                    setAnalytics(payload);
                }
            } catch (err) {
                console.warn('Dashboard analytics request note:', err?.message || err);
            }
        };
        fetchDashboardData();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setSearchResults(null);
            return;
        }

        setSearching(true);
        try {
            const res = await axiosClient.get(`/api/analytics/search?query=${encodeURIComponent(searchQuery)}`);
            const payload = res.data?.data || res.data;
            if (payload) {
                setSearchResults(payload);
            }
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setSearching(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const stats = analytics?.stats || {
        students: 0,
        faculty: 3,
        courses: 2,
        subjects: 4,
        averageAttendance: 85,
        passPercentage: 90
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            {/* Header */}
            <header className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center space-x-3">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">UniConnect Hub</h1>
                        <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                            {user?.role || 'User'}
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.name || 'Academic User'}</p>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                    <Link
                        to="/faculty/profile"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition"
                    >
                        My Profile
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Global Search Bar */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            🔍
                        </span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search students by Name, Enrollment No, Department, Semester, Division..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={searching}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition"
                    >
                        {searching ? 'Searching...' : 'Search'}
                    </button>
                    {searchResults && (
                        <button
                            type="button"
                            onClick={() => { setSearchResults(null); setSearchQuery(''); }}
                            className="text-gray-500 hover:text-gray-700 px-3 text-sm font-medium"
                        >
                            Clear
                        </button>
                    )}
                </form>

                {/* Rich Student Search Visualizer Table */}
                {searchResults && searchResults.students && searchResults.students.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                                <span>🎓 Student Search Results</span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[11px]">
                                    {searchResults.students.length} Matches
                                </span>
                            </h4>
                            <Link to="/faculty/student-list" className="text-xs text-blue-600 hover:underline font-semibold">
                                View in Full Directory →
                            </Link>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-50/40">
                            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                                <thead className="bg-slate-100/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3">Student Name</th>
                                        <th className="px-4 py-3">Enrollment No</th>
                                        <th className="px-4 py-3">Department</th>
                                        <th className="px-4 py-3">Semester & Division</th>
                                        <th className="px-4 py-3">Attendance</th>
                                        <th className="px-4 py-3">Email Address</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {searchResults.students.map(s => {
                                        const rate = s.attendancePercentage ?? 100;
                                        return (
                                            <tr key={s._id} className="hover:bg-blue-50/40 transition">
                                                <td className="px-4 py-3 font-semibold text-slate-900 flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                                                        {s.user?.name?.charAt(0) || 'S'}
                                                    </div>
                                                    <span>{s.user?.name || 'Student'}</span>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-blue-600 font-bold">
                                                    {s.enrollmentNo}
                                                </td>
                                                <td className="px-4 py-3 text-slate-700">
                                                    {s.department}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold text-[11px]">
                                                        Semester {s.semester} • Division {s.section || 'A'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                                                        rate >= 75 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                    }`}>
                                                        {rate}%
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 font-mono">
                                                    {s.user?.email || 'N/A'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Additional Matched Entities (Faculty, Courses, Subjects) */}
                {searchResults && (
                    <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                            <h4 className="text-[11px] font-bold text-purple-900 uppercase">Faculty ({searchResults.faculty?.length || 0})</h4>
                            <div className="mt-1.5 space-y-1">
                                {searchResults.faculty?.slice(0, 3).map(f => (
                                    <p key={f._id} className="text-xs text-gray-700 font-medium truncate">{f.user?.name || f.name || 'Faculty Member'}</p>
                                ))}
                                {(!searchResults.faculty || searchResults.faculty.length === 0) && (
                                    <p className="text-xs text-gray-400">None found</p>
                                )}
                            </div>
                        </div>
                        <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                            <h4 className="text-[11px] font-bold text-emerald-900 uppercase">Courses ({searchResults.courses?.length || 0})</h4>
                            <div className="mt-1.5 space-y-1">
                                {searchResults.courses?.slice(0, 3).map(c => (
                                    <p key={c._id} className="text-xs text-gray-700 font-medium truncate">{c.name} ({c.code})</p>
                                ))}
                                {(!searchResults.courses || searchResults.courses.length === 0) && (
                                    <p className="text-xs text-gray-400">None found</p>
                                )}
                            </div>
                        </div>
                        <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                            <h4 className="text-[11px] font-bold text-amber-900 uppercase">Subjects ({searchResults.subjects?.length || 0})</h4>
                            <div className="mt-1.5 space-y-1">
                                {searchResults.subjects?.slice(0, 3).map(sub => (
                                    <p key={sub._id} className="text-xs text-gray-700 font-medium truncate">{sub.name} ({sub.code})</p>
                                ))}
                                {(!searchResults.subjects || searchResults.subjects.length === 0) && (
                                    <p className="text-xs text-gray-400">None found</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Notification Bar */}
            <NotificationPanel />

            {/* Top Operational Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Students</p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats.students}</h2>
                    <span className="text-emerald-600 text-xs font-semibold">Enrolled</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Faculty</p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats.faculty}</h2>
                    <span className="text-blue-600 text-xs font-semibold">Staff Members</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Courses</p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats.courses}</h2>
                    <span className="text-purple-600 text-xs font-semibold">Programs</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Subjects</p>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1">{stats.subjects}</h2>
                    <span className="text-indigo-600 text-xs font-semibold">Active Syllabus</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Attendance</p>
                    <h2 className="text-2xl font-bold text-emerald-600 mt-1">{stats.averageAttendance}%</h2>
                    <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs font-semibold">Avg Rate</span>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Pass Rate</p>
                    <h2 className="text-2xl font-bold text-blue-600 mt-1">{stats.passPercentage}%</h2>
                    <span className="text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-xs font-semibold">Exams</span>
                </div>
            </div>

            {/* Quick Actions Navigation */}
            <h3 className="text-base font-bold text-gray-800 mb-4 tracking-tight">Academic Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {user?.role === 'admin' && (
                    <>
                        <Link to="/admin/academic" className="bg-white p-5 rounded-2xl shadow-sm border border-blue-200 bg-blue-50/20 hover:border-blue-400 hover:shadow-md transition group">
                            <h4 className="font-semibold text-blue-900 group-hover:text-blue-600 flex items-center gap-1.5">
                                <span>🏛️ Academic Structure ERP</span>
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">Assign faculty, departments, courses, and approve subjects.</p>
                        </Link>
                        <Link to="/admin/courses" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition group">
                            <h4 className="font-semibold text-gray-900 group-hover:text-blue-600">Course Management</h4>
                            <p className="text-xs text-gray-500 mt-1">Add, edit, or configure course programs.</p>
                        </Link>
                        <Link to="/admin/exams" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-orange-300 hover:shadow-md transition group">
                            <h4 className="font-semibold text-gray-900 group-hover:text-orange-600">Schedule Exams</h4>
                            <p className="text-xs text-gray-500 mt-1">Configure mid-sem & finals dates.</p>
                        </Link>
                    </>
                )}

                {user?.role === 'student' && (
                    <Link to="/student/portal" className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-200 bg-emerald-50/20 hover:border-emerald-400 hover:shadow-md transition group">
                        <h4 className="font-semibold text-emerald-900 group-hover:text-emerald-600 flex items-center gap-1.5">
                            <span>🎓 Student Academic Portal</span>
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">View official registered subjects, attendance rates, and grades.</p>
                    </Link>
                )}

                {(user?.role === 'faculty' || user?.role === 'admin') && (
                    <>
                        <Link to="/faculty/subjects" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-300 hover:shadow-md transition group">
                            <h4 className="font-semibold text-gray-900 group-hover:text-purple-600">My Subjects</h4>
                            <p className="text-xs text-gray-500 mt-1">Manage subjects and curriculum.</p>
                        </Link>
                        <Link to="/faculty/attendance" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-pink-300 hover:shadow-md transition group">
                            <h4 className="font-semibold text-gray-900 group-hover:text-pink-600">Mark Attendance</h4>
                            <p className="text-xs text-gray-500 mt-1">Take daily lecture attendance.</p>
                        </Link>
                        <Link to="/faculty/marks" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-rose-300 hover:shadow-md transition group">
                            <h4 className="font-semibold text-gray-900 group-hover:text-rose-600">Upload Marks</h4>
                            <p className="text-xs text-gray-500 mt-1">Record student test and exam marks.</p>
                        </Link>
                        <Link to="/faculty/student-list" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-300 hover:shadow-md transition group">
                            <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600">Student Directory</h4>
                            <p className="text-xs text-gray-500 mt-1">Directory of enrolled students.</p>
                        </Link>
                        <Link to="/faculty/timetable" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-teal-300 hover:shadow-md transition group">
                            <h4 className="font-semibold text-gray-900 group-hover:text-teal-600">Weekly Timetable</h4>
                            <p className="text-xs text-gray-500 mt-1">Class timings & lecture schedule.</p>
                        </Link>
                        <Link to="/faculty/announcements" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-amber-300 hover:shadow-md transition group">
                            <h4 className="font-semibold text-gray-900 group-hover:text-amber-600">Campus Notices</h4>
                            <p className="text-xs text-gray-500 mt-1">Post announcements and bulletins.</p>
                        </Link>
                        <Link to="/feedback" className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-300 hover:shadow-md transition group">
                            <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600">Quality Feedback</h4>
                            <p className="text-xs text-gray-500 mt-1">Review student & institutional feedback.</p>
                        </Link>
                    </>
                )}
            </div>

            {/* Recent Campus Activity Logs */}
            {analytics?.recentActivities && analytics.recentActivities.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Audit Stream & Campus Activity</h3>
                    <div className="divide-y divide-gray-100">
                        {analytics.recentActivities.map((act) => (
                            <div key={act._id} className="py-2.5 flex items-center justify-between text-xs">
                                <div>
                                    <span className="font-semibold text-gray-900">{act.user?.name || 'System User'}</span>
                                    <span className="text-gray-500 mx-1.5">•</span>
                                    <span className="text-gray-600">{act.details}</span>
                                </div>
                                <span className="text-gray-400 font-mono text-[11px]">
                                    {act.createdAt ? new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
