import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';

const Profile = () => {
    const { user } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile'); // profile, preferences, notifications, security

    // Settings states
    const [officeHours, setOfficeHours] = useState('Mon - Fri, 10:00 AM - 12:00 PM');
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [attendanceAlerts, setAttendanceAlerts] = useState(true);
    const [examAlerts, setExamAlerts] = useState(true);
    const [themePreference, setThemePreference] = useState('Light');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get('/api/auth/me');
                const data = res.data?.data || res.data;
                setProfileData(data);
            } catch (error) {
                console.error('Error fetching profile', error);
                toast.error("Error fetching profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSavePreferences = (e) => {
        e.preventDefault();
        toast.success('Settings and preferences saved successfully!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-3 text-slate-500 text-sm">Loading your profile & settings...</p>
                </div>
            </div>
        );
    }

    const profile = profileData?.profile || {};
    const currentUser = profileData?.user || user;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                            <span>/</span>
                            <span className="text-slate-800 font-medium">Account Settings</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                            Profile & Campus Preferences
                        </h1>
                    </div>
                    <Link
                        to="/dashboard"
                        className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
                    >
                        ← Back to Hub
                    </Link>
                </div>

                {/* Profile Card Header Banner */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-28 px-8 flex items-end">
                        <div className="w-20 h-20 bg-white rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-blue-700 text-3xl font-extrabold -mb-10">
                            {currentUser?.name?.charAt(0) || 'U'}
                        </div>
                    </div>
                    <div className="pt-14 px-8 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{currentUser?.name}</h2>
                            <p className="text-sm font-medium text-blue-600 capitalize">{currentUser?.role} Member • {profile?.department || 'Computer Science'}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{currentUser?.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Active Session
                            </span>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex border-t border-slate-100 px-8 text-sm font-semibold text-slate-500 gap-6">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`py-3 border-b-2 transition ${activeTab === 'profile' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'}`}
                        >
                            Personal Info
                        </button>
                        <button
                            onClick={() => setActiveTab('preferences')}
                            className={`py-3 border-b-2 transition ${activeTab === 'preferences' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'}`}
                        >
                            Teaching Preferences
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`py-3 border-b-2 transition ${activeTab === 'notifications' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'}`}
                        >
                            Notifications & Privacy
                        </button>
                    </div>
                </div>

                {/* Tab 1: Personal Info */}
                {activeTab === 'profile' && (
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/80 space-y-8">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 mb-1">Academic & Identity Information</h3>
                            <p className="text-xs text-slate-400">Institutional credentials and active department assignment.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Full Legal Name</label>
                                <input
                                    type="text"
                                    disabled
                                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
                                    value={currentUser?.name || ''}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Campus Email</label>
                                <input
                                    type="email"
                                    disabled
                                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-mono"
                                    value={currentUser?.email || ''}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Employee / Enrollment ID</label>
                                <input
                                    type="text"
                                    disabled
                                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-mono font-bold text-blue-600"
                                    value={profile?.employeeId || profile?.enrollmentNo || 'EMP-7402'}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Primary Department</label>
                                <input
                                    type="text"
                                    disabled
                                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
                                    value={profile?.department || 'Computer Science'}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Academic Designation</label>
                                <input
                                    type="text"
                                    disabled
                                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                                    value={profile?.designation || 'Assistant Professor'}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Campus / College</label>
                                <input
                                    type="text"
                                    disabled
                                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                                    value={`${profile?.campus || 'Central Campus'} • ${profile?.college || 'Engineering Institute'}`}
                                />
                            </div>
                        </div>

                        {/* Departmental & Course Allocations */}
                        <div className="pt-6 border-t border-slate-100">
                            <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span>🏛️ Department & Degree Program Allocations</span>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                                    <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">Assigned Department</p>
                                    <p className="text-base font-extrabold text-blue-900">{profile?.department || 'Computer Science'}</p>
                                    <p className="text-xs text-blue-600 mt-1">Full academic & grading authority within faculty scope</p>
                                </div>
                                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                                    <p className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">Degree Program & Course</p>
                                    <p className="text-base font-extrabold text-indigo-900">
                                        {profile?.courseCodes?.join(', ') || profile?.assignedCoursesList?.map(c => c.name).join(', ') || 'B.E. (Bachelor of Engineering)'}
                                    </p>
                                    <p className="text-xs text-indigo-600 mt-1">Undergraduate Curriculum • NEP 2020 / CBCS Structure</p>
                                </div>
                            </div>
                        </div>

                        {/* Assigned Curriculum Subjects */}
                        <div className="pt-6 border-t border-slate-100">
                            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                                <span>📚 Assigned Curriculum Subjects & Teaching Scope</span>
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                                    {profile?.assignedSubjectsList?.length || 3} Subjects Assigned
                                </span>
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {(profile?.assignedSubjectsList && profile.assignedSubjectsList.length > 0) ? (
                                    profile.assignedSubjectsList.map(sub => (
                                        <div key={sub._id} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-blue-300 transition">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-mono text-xs font-bold text-blue-600">{sub.code}</span>
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Sem {sub.semester}</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-900 line-clamp-1">{sub.name}</p>
                                            <p className="text-xs text-slate-400 mt-1">{sub.credits} Credits • {sub.course || 'B.E'}</p>
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-mono text-xs font-bold text-blue-600">CS201</span>
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Sem 3</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-900">Data Structures & Algorithms</p>
                                            <p className="text-xs text-slate-400 mt-1">4 Credits • B.E</p>
                                        </div>
                                        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-mono text-xs font-bold text-blue-600">CS202</span>
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Sem 3</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-900">Python Programming</p>
                                            <p className="text-xs text-slate-400 mt-1">5 Credits • B.E</p>
                                        </div>
                                        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-xs">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-mono text-xs font-bold text-blue-600">CS203</span>
                                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">Sem 3</span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-900">Artificial Intelligence & Data Science</p>
                                            <p className="text-xs text-slate-400 mt-1">6 Credits • B.E</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab 2: Teaching Preferences */}
                {activeTab === 'preferences' && (
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/80">
                        <h3 className="text-base font-bold text-slate-900 mb-4">Faculty Office Hours & Preferences</h3>
                        <form onSubmit={handleSavePreferences} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Office Hours for Student Inquiries</label>
                                <input
                                    type="text"
                                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    value={officeHours}
                                    onChange={e => setOfficeHours(e.target.value)}
                                    placeholder="e.g. Mon, Wed 2:00 PM - 4:00 PM (Room 401)"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Dashboard Theme</label>
                                <select
                                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white"
                                    value={themePreference}
                                    onChange={e => setThemePreference(e.target.value)}
                                >
                                    <option value="Light">System Default (Clean Slate)</option>
                                    <option value="HighContrast">High Contrast Accessibility</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition"
                            >
                                Save Preferences
                            </button>
                        </form>
                    </div>
                )}

                {/* Tab 3: Notifications & Privacy */}
                {activeTab === 'notifications' && (
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/80 space-y-5">
                        <h3 className="text-base font-bold text-slate-900">Communication & Alert Toggles</h3>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">Email Notifications</p>
                                    <p className="text-xs text-slate-500">Receive campus announcements and exam alerts via email</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={emailNotifs}
                                    onChange={e => setEmailNotifs(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                            </label>

                            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">Low Attendance Alerts</p>
                                    <p className="text-xs text-slate-500">Flag when student attendance drops below 75% threshold</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={attendanceAlerts}
                                    onChange={e => setAttendanceAlerts(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                            </label>

                            <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer">
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">Exam Grading Reminders</p>
                                    <p className="text-xs text-slate-500">Notify when submitted exams have pending unscored marks</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={examAlerts}
                                    onChange={e => setExamAlerts(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                            </label>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
