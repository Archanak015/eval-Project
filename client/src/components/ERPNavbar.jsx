import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ERPNavbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Navigation links per role
    const getNavLinks = () => {
        if (user?.role === 'admin' || user?.role === 'superadmin') {
            return [
                { name: 'Dashboard', path: '/dashboard', icon: '📊' },
                { name: 'Academic ERP', path: '/admin/academic', icon: '🏛️' },
                { name: 'Courses', path: '/admin/courses', icon: '🎓' },
                { name: 'Examinations', path: '/admin/exams', icon: '📝' },
                { name: 'Students', path: '/faculty/student-list', icon: '🧑‍🎓' },
                { name: 'Subjects', path: '/faculty/subjects', icon: '📚' },
                { name: 'Timetable', path: '/faculty/timetable', icon: '🗓️' },
                { name: 'Feedback', path: '/feedback', icon: '💬' }
            ];
        }

        if (user?.role === 'faculty') {
            return [
                { name: 'Dashboard', path: '/dashboard', icon: '📊' },
                { name: 'My Subjects', path: '/faculty/subjects', icon: '📚' },
                { name: 'Take Attendance', path: '/faculty/attendance', icon: '✅' },
                { name: 'Upload Marks', path: '/faculty/marks', icon: '📝' },
                { name: 'Student Directory', path: '/faculty/student-list', icon: '🧑‍🎓' },
                { name: 'Timetable', path: '/faculty/timetable', icon: '🗓️' },
                { name: 'Announcements', path: '/faculty/announcements', icon: '📢' },
                { name: 'Feedback', path: '/feedback', icon: '💬' },
                { name: 'Profile & Settings', path: '/faculty/profile', icon: '⚙️' }
            ];
        }

        if (user?.role === 'student') {
            return [
                { name: 'Academic Portal', path: '/student/portal', icon: '🎓' },
                { name: 'Campus Hub', path: '/dashboard', icon: '🏛️' },
                { name: 'Quality Feedback', path: '/feedback', icon: '💬' },
                { name: 'Settings & Profile', path: '/faculty/profile', icon: '⚙️' }
            ];
        }

        return [{ name: 'Dashboard', path: '/dashboard', icon: '📊' }];
    };

    const links = getNavLinks();

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <div className="flex items-center gap-6">
                        <Link to="/dashboard" className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-blue-500/30">
                                U
                            </div>
                            <div>
                                <span className="text-lg font-black text-slate-900 tracking-tight">UniConnect</span>
                                <span className="hidden sm:inline-block ml-1.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                                    ERP
                                </span>
                            </div>
                        </Link>

                        {/* Navigation Items (Desktop) */}
                        <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-1">
                            {links.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-xs'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                        }`}
                                    >
                                        <span>{link.icon}</span>
                                        <span>{link.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* User Profile & Actions */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'User'}</p>
                            <span className="text-[10px] font-semibold text-blue-600 capitalize bg-blue-50 px-2 py-0.5 rounded-full">
                                {user?.role || 'Member'}
                            </span>
                        </div>

                        <Link
                            to="/faculty/profile"
                            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm transition"
                            title="Profile & Settings"
                        >
                            {user?.name?.charAt(0) || 'U'}
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation bar */}
                <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 text-xs">
                    {links.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap flex items-center gap-1 ${
                                    isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <span>{link.icon}</span>
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </header>
    );
};

export default ERPNavbar;
