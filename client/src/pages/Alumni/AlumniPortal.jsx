import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';

const AlumniPortal = () => {
    const { user } = useAuth();
    const [alumni, setAlumni] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [form, setForm] = useState({
        fullName: '', graduationYear: 2022, degree: 'B.E Computer Science', currentCompany: '', currentDesignation: '', location: 'Bengaluru, India', email: '', mentorshipAvailable: true, donationContributed: 25000, successStory: ''
    });

    const fetchAlumni = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/api/advanced/alumni');
            setAlumni(res.data.data || []);
        } catch (err) {
            console.error('Error fetching alumni:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlumni();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/api/advanced/alumni', form);
            setModalOpen(false);
            fetchAlumni();
        } catch (err) {
            alert(err.response?.data?.message || 'Error registering alumni profile');
        }
    };

    const totalDonations = alumni.reduce((acc, a) => acc + (a.donationContributed || 0), 0);
    const mentorsCount = alumni.filter(a => a.mentorshipAvailable).length;

    const filtered = alumni.filter(a => 
        a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.currentCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.degree.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Breadcrumb items={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Global Alumni Network' }]} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-2xl">🌐</span>
                        Alumni Relations & Mentorship Network
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Connect with global graduates across Tier-1 tech firms, access 1-on-1 career guidance, and review endowment funds.
                    </p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 text-sm"
                >
                    <span>➕</span>
                    Join Alumni Directory
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Registered Alumni" value={alumni.length} icon="🧑‍🎓" color="blue" subtitle="Across 24+ Countries" />
                <StatCard title="Active Mentors" value={mentorsCount} icon="🤝" color="green" subtitle="Available for Guidance" />
                <StatCard title="Endowment Fund" value={`₹${(totalDonations / 100000).toFixed(1)} Lakhs`} icon="💰" color="yellow" subtitle="Student Scholarships" />
                <StatCard title="Placement Referrals" value="184+" icon="💼" color="purple" subtitle="Annual Job Openings" />
            </div>

            {/* Search Bar */}
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name, company (Google, Microsoft), or degree..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
            </div>

            {/* Alumni Cards */}
            {loading ? (
                <div className="p-12 text-center text-slate-500">Loading alumni network...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filtered.map((item) => (
                        <div key={item._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.fullName}</h3>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{item.currentDesignation}</p>
                                        <p className="text-xs text-slate-500 font-bold">{item.currentCompany}</p>
                                    </div>
                                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                        Class of {item.graduationYear}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                                    "{item.successStory || 'Proud UniConnect graduate giving back to student innovation.'}"
                                </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
                                <span>📍 {item.location}</span>
                                {item.mentorshipAvailable && (
                                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold">
                                        Open for Mentoring
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Alumni Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Join Alumni Registry">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                        <input
                            required
                            type="text"
                            value={form.fullName}
                            onChange={e => setForm({...form, fullName: e.target.value})}
                            placeholder="e.g. Ramesh Kumar"
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Graduation Year</label>
                            <input
                                required
                                type="number"
                                value={form.graduationYear}
                                onChange={e => setForm({...form, graduationYear: Number(e.target.value)})}
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Degree Earned</label>
                            <input
                                required
                                type="text"
                                value={form.degree}
                                onChange={e => setForm({...form, degree: e.target.value})}
                                placeholder="B.E Computer Science"
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Current Company</label>
                            <input
                                required
                                type="text"
                                value={form.currentCompany}
                                onChange={e => setForm({...form, currentCompany: e.target.value})}
                                placeholder="Amazon / Apple"
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Designation</label>
                            <input
                                required
                                type="text"
                                value={form.currentDesignation}
                                onChange={e => setForm({...form, currentDesignation: e.target.value})}
                                placeholder="Tech Lead / VP"
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm">
                        Submit Alumni Profile
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default AlumniPortal;
