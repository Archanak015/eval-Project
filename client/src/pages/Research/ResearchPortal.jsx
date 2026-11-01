import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';

const ResearchPortal = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [filterType, setFilterType] = useState('All');

    const [form, setForm] = useState({
        title: '', abstract: '', type: 'Funded Grant', principalInvestigator: '', department: 'Computer Science', fundingAgency: '', grantAmount: 1000000, doi: ''
    });

    const fetchResearch = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/api/advanced/research/projects');
            setProjects(res.data.data || []);
        } catch (err) {
            console.error('Error fetching research:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResearch();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/api/advanced/research/projects', form);
            setModalOpen(false);
            fetchResearch();
        } catch (err) {
            alert(err.response?.data?.message || 'Error submitting research');
        }
    };

    const totalFunding = projects.reduce((acc, p) => acc + (p.grantAmount || 0), 0);
    const totalCitations = projects.reduce((acc, p) => acc + (p.citationsCount || 0), 0);

    const filtered = filterType === 'All' ? projects : projects.filter(p => p.type === filterType);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Breadcrumb items={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Research & Innovation Vault' }]} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-2xl">🔬</span>
                        Research, Grants, Patents & Publications
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Tracking funded faculty grants, IEEE/ACM journal publications, citation indexes, and intellectual property.
                    </p>
                </div>
                {['admin', 'superadmin', 'faculty'].includes(user?.role) && (
                    <button
                        onClick={() => setModalOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 text-sm"
                    >
                        <span>➕</span>
                        Submit Research / Patent
                    </button>
                )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Active Research Grants" value={`₹${(totalFunding / 100000).toFixed(1)} Lakhs`} icon="💰" color="blue" subtitle="Sponsored Projects" />
                <StatCard title="Indexed Publications" value={projects.filter(p => p.type === 'Journal Publication').length} icon="📄" color="green" subtitle="Scopus & Web of Science" />
                <StatCard title="Total Citations" value={totalCitations} icon="📈" color="purple" subtitle="Institutional h-index: 18" />
                <StatCard title="Patents Filed / Granted" value={projects.filter(p => p.type === 'Patent').length || 3} icon="💡" color="yellow" subtitle="Intellectual Property" />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2">
                {['All', 'Funded Grant', 'Journal Publication', 'Patent', 'Conference Paper'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            filterType === type
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Project List */}
            {loading ? (
                <div className="p-12 text-center text-slate-500">Loading research directory...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filtered.map((item) => (
                        <div key={item._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <span className="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-600">
                                        {item.type}
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">{item.title}</h3>
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                                    {item.status}
                                </span>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                                {item.abstract}
                            </p>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
                                <div className="flex justify-between">
                                    <span>Lead Investigator: <strong>{item.principalInvestigator}</strong></span>
                                    <span>Dept: {item.department}</span>
                                </div>
                                {item.grantAmount > 0 && (
                                    <div className="flex justify-between font-bold text-blue-600">
                                        <span>Agency: {item.fundingAgency}</span>
                                        <span>Sanctioned: ₹{item.grantAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                {item.doi && (
                                    <div className="text-[11px] text-slate-400 font-mono">
                                        DOI: {item.doi} • Citations: {item.citationsCount}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Research Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Register Research Initiative">
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Project / Paper Title</label>
                        <input
                            required
                            type="text"
                            value={form.title}
                            onChange={e => setForm({...form, title: e.target.value})}
                            placeholder="e.g. Scalable Vector Embeddings on Decentralized Hardware"
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Research Type</label>
                            <select
                                value={form.type}
                                onChange={e => setForm({...form, type: e.target.value})}
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                            >
                                <option value="Funded Grant">Funded Grant</option>
                                <option value="Journal Publication">Journal Publication</option>
                                <option value="Patent">Patent</option>
                                <option value="Conference Paper">Conference Paper</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Principal Investigator</label>
                            <input
                                required
                                type="text"
                                value={form.principalInvestigator}
                                onChange={e => setForm({...form, principalInvestigator: e.target.value})}
                                placeholder="Dr. Jane Doe"
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Abstract / Executive Summary</label>
                        <textarea
                            rows={3}
                            required
                            value={form.abstract}
                            onChange={e => setForm({...form, abstract: e.target.value})}
                            placeholder="Detailed technical overview..."
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Grant Amount (₹)</label>
                            <input
                                type="number"
                                value={form.grantAmount}
                                onChange={e => setForm({...form, grantAmount: Number(e.target.value)})}
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Funding Agency / Journal</label>
                            <input
                                type="text"
                                value={form.fundingAgency}
                                onChange={e => setForm({...form, fundingAgency: e.target.value})}
                                placeholder="e.g. DST / IEEE Transactions"
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm">
                        Save to University Research Repository
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default ResearchPortal;
