import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';

const AdmissionPortal = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    const [form, setForm] = useState({
        applicantName: '', email: '', phone: '', desiredCourse: 'B.E Computer Science & Engineering', previousScorePercentage: 92.5, entranceRank: 1200
    });

    const fetchAdmissions = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/api/advanced/admissions/applications');
            setApplications(res.data.data || []);
        } catch (err) {
            console.error('Error fetching admission applications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmissions();
    }, []);

    const handleApply = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/api/advanced/admissions/apply', form);
            setModalOpen(false);
            fetchAdmissions();
        } catch (err) {
            alert(err.response?.data?.message || 'Error submitting application');
        }
    };

    const admittedCount = applications.filter(a => a.status === 'Seat Allocated' || a.status === 'Fee Paid / Admitted').length;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Breadcrumb items={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Admissions & Seat Allotment' }]} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-2xl">📋</span>
                        University Admission, Merit Roster & Counselling
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Application lifecycle management, automated rank-based merit sorting, document verification, and seat allocation.
                    </p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 text-sm"
                >
                    <span>➕</span>
                    Submit Online Application
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Applications Received" value={applications.length} icon="📥" color="blue" subtitle="Academic Cycle 2026-27" />
                <StatCard title="Merit Cutoff Score" value="94.2%" icon="🎯" color="green" subtitle="General Merit Round 1" />
                <StatCard title="Seats Allocated" value={admittedCount} icon="🪑" color="purple" subtitle="Provisional Allotment" />
                <StatCard title="Counselling Status" value="Round 2 Active" icon="🗓️" color="yellow" subtitle="Document Scrutiny" />
            </div>

            {/* Application Ledger */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Merit Ranked Applicants</h2>
                    <span className="text-xs font-semibold text-slate-500">Sorted by Composite Merit Index</span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-500">Loading admissions ledger...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                            <thead className="bg-slate-50 dark:bg-slate-800/60 text-xs uppercase font-extrabold text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4">App No.</th>
                                    <th className="px-6 py-4">Applicant</th>
                                    <th className="px-6 py-4">Desired Program</th>
                                    <th className="px-6 py-4">Merit Score</th>
                                    <th className="px-6 py-4">State/JEE Rank</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {applications.map((app) => (
                                    <tr key={app._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 font-mono font-bold text-xs text-blue-600">{app.applicationNumber}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 dark:text-white">{app.applicantName}</div>
                                            <div className="text-xs text-slate-400">{app.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-semibold">{app.desiredCourse}</td>
                                        <td className="px-6 py-4 font-bold text-emerald-600">{app.meritScore}%</td>
                                        <td className="px-6 py-4 font-mono text-xs">#{app.entranceRank || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                                app.status === 'Seat Allocated' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                                            }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Application Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="New Admission Application">
                <form onSubmit={handleApply} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Applicant Full Name</label>
                        <input
                            required
                            type="text"
                            value={form.applicantName}
                            onChange={e => setForm({...form, applicantName: e.target.value})}
                            placeholder="Student Name"
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label>
                            <input
                                required
                                type="email"
                                value={form.email}
                                onChange={e => setForm({...form, email: e.target.value})}
                                placeholder="name@domain.com"
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile Phone</label>
                            <input
                                required
                                type="text"
                                value={form.phone}
                                onChange={e => setForm({...form, phone: e.target.value})}
                                placeholder="+91 98000 12345"
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Desired Course</label>
                        <select
                            value={form.desiredCourse}
                            onChange={e => setForm({...form, desiredCourse: e.target.value})}
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                        >
                            <option value="B.E Computer Science & Engineering">B.E Computer Science & Engineering</option>
                            <option value="B.E Artificial Intelligence & Data Science">B.E Artificial Intelligence & Data Science</option>
                            <option value="B.E Electronics & Communication">B.E Electronics & Communication</option>
                            <option value="M.Tech Software Engineering">M.Tech Software Engineering</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">12th / Qualifying Score (%)</label>
                            <input
                                required
                                type="number"
                                step="0.1"
                                value={form.previousScorePercentage}
                                onChange={e => setForm({...form, previousScorePercentage: Number(e.target.value)})}
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Entrance Examination Rank</label>
                            <input
                                type="number"
                                value={form.entranceRank}
                                onChange={e => setForm({...form, entranceRank: Number(e.target.value)})}
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm">
                        Submit & Calculate Merit Position
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default AdmissionPortal;
