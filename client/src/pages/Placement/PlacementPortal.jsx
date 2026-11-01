import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/EmptyState';
import StatCard from '../../components/StatCard';
import { StatusChip } from '../../components/Badges';

const PlacementPortal = () => {
    const { user } = useAuth();
    const [drives, setDrives] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applyingId, setApplyingId] = useState(null);

    const fetchPlacements = async () => {
        try {
            setLoading(true);
            const [drivesRes, statsRes] = await Promise.all([
                axiosClient.get('/api/enterprise/placement/drives'),
                axiosClient.get('/api/enterprise/placement/analytics')
            ]);
            setDrives(drivesRes.data?.data || []);
            setAnalytics(statsRes.data?.data || {});
        } catch (err) {
            console.error('Error fetching placement data', err);
            toast.error('Failed to load placement drives');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlacements();
    }, []);

    const handleApply = async (driveId) => {
        setApplyingId(driveId);
        try {
            await axiosClient.post(`/api/enterprise/placement/apply/${driveId}`);
            toast.success('Successfully applied for placement drive!');
            fetchPlacements();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error submitting application');
        } finally {
            setApplyingId(null);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <span>/</span>
                        <span className="text-slate-800 font-medium">Placement & Corporate Relations</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Placement Cell & Internship Opportunities
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Campus recruitment drives, corporate eligibility criteria, and job offers.</p>
                </div>
            </div>

            {/* Placement Executive Analytics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Highest Package" value={`${analytics?.highestCTC || 24.5} LPA`} subtitle="Dream Offer" icon="💎" color="emerald" />
                <StatCard title="Average Package" value={`${analytics?.averageCTC || 8.4} LPA`} subtitle="Cohort Average" icon="📈" color="blue" />
                <StatCard title="Placed Students" value={analytics?.placedStudents || 38} subtitle="Offers Released" icon="🧑‍🎓" color="purple" />
                <StatCard title="Active Drives" value={drives.length} subtitle="Visiting Companies" icon="🏢" color="indigo" />
            </div>

            {/* Drives List */}
            <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900">Upcoming Campus Recruitment Drives</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {drives.map(drive => {
                        const hasApplied = drive.applicants?.some(a => a.user?._id === user?._id || a.user === user?._id);
                        return (
                            <div key={drive._id} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-400 transition flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                                            {drive.jobType}
                                        </span>
                                        <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                            ₹ {drive.packageCTC} LPA
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-extrabold text-slate-900">{drive.companyName}</h4>
                                    <p className="text-sm font-semibold text-slate-700">{drive.roleTitle}</p>
                                    <p className="text-xs text-slate-400 mt-1">📍 {drive.jobLocation}</p>

                                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                                        <p>Drive Date: <strong>{new Date(drive.driveDate).toLocaleDateString()}</strong></p>
                                        <p>Eligibility: <strong>Min {drive.eligibilityCriteria?.minCGPA || 6.5} CGPA</strong> • Max {drive.eligibilityCriteria?.maxBacklogs || 0} Backlogs</p>
                                    </div>
                                </div>

                                <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-xs font-semibold text-slate-400">
                                        {drive.applicants?.length || 0} Candidates Applied
                                    </span>
                                    {user?.role === 'student' && (
                                        <button
                                            disabled={hasApplied || applyingId === drive._id}
                                            onClick={() => handleApply(drive._id)}
                                            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                                                hasApplied 
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                                            }`}
                                        >
                                            {hasApplied ? '✓ Application Submitted' : applyingId === drive._id ? 'Submitting...' : 'Apply for Drive'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PlacementPortal;
