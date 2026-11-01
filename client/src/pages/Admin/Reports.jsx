import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/EmptyState';

const AdminReports = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get('/api/analytics/dashboard');
                setAnalytics(res.data?.data || res.data);
            } catch (err) {
                console.error('Error fetching institutional reports', err);
                toast.error('Failed to load reports data');
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-3 text-slate-500 text-sm">Generating institutional analytics & reports...</p>
                </div>
            </div>
        );
    }

    const stats = analytics?.stats || {};
    const departmentBreakdown = analytics?.departmentBreakdown || [];
    const recentActivities = analytics?.recentActivities || [];

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <span>/</span>
                        <span className="text-slate-800 font-medium">Reports & Analytics</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Institutional Governance & Accreditation Reports
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Comprehensive campus metrics covering enrollment quotas, attendance benchmarks, pass ratios, and audit logs.
                    </p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
                >
                    🖨️ Export / Print Report
                </button>
            </div>

            {/* KPI Executive Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{stats.students || 0}</p>
                    <span className="text-[11px] font-semibold text-emerald-600">Active Students</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Teaching Faculty</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{stats.faculty || 0}</p>
                    <span className="text-[11px] font-semibold text-blue-600">Staff Capacity</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campus Attendance</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">{stats.averageAttendance || 85}%</p>
                    <span className="text-[11px] font-semibold text-emerald-700">Verified Sessions</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evaluation Pass Rate</p>
                    <p className="text-2xl font-black text-blue-600 mt-1">{stats.passPercentage || 90}%</p>
                    <span className="text-[11px] font-semibold text-blue-700">Cumulative Average</span>
                </div>
            </div>

            {/* Department Enrollment Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
                <h3 className="text-base font-bold text-slate-900 mb-4">Department Student Distribution</h3>
                <div className="space-y-3">
                    {departmentBreakdown.map((dept, idx) => {
                        const total = stats.students || 1;
                        const pct = Math.round((dept.count / total) * 100);
                        return (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-xs font-bold text-slate-700">
                                    <span>{dept.department || 'General Department'}</span>
                                    <span>{dept.count} Students ({pct}%)</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${pct}%` }}></div>
                                </div>
                            </div>
                        );
                    })}
                    {departmentBreakdown.length === 0 && (
                        <p className="text-xs text-slate-400 italic">No departmental enrollment data recorded yet.</p>
                    )}
                </div>
            </div>

            {/* Audit Log Activities */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Recent Institutional System Audit Stream</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-bold">
                            <tr>
                                <th className="px-6 py-3 text-left">Initiated By</th>
                                <th className="px-6 py-3 text-left">Action Event</th>
                                <th className="px-6 py-3 text-left">Module Scope</th>
                                <th className="px-6 py-3 text-left">Description Details</th>
                                <th className="px-6 py-3 text-left">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white text-xs">
                            {recentActivities.map(act => (
                                <tr key={act._id} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 font-semibold text-slate-800">{act.user?.name || 'System User'}</td>
                                    <td className="px-6 py-3 font-mono font-bold text-blue-600">{act.action}</td>
                                    <td className="px-6 py-3 text-slate-600">{act.module}</td>
                                    <td className="px-6 py-3 text-slate-500">{act.details}</td>
                                    <td className="px-6 py-3 text-slate-400 font-mono">
                                        {new Date(act.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {recentActivities.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-6 text-center text-slate-400 italic">No recent system activity.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
