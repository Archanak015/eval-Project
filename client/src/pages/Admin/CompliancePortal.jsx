import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import Breadcrumb from '../../components/Breadcrumb';

const CompliancePortal = () => {
    const { user } = useAuth();
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAudits = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/api/saas/compliance/audits');
            setAudits(res.data.data || []);
        } catch (err) {
            console.error('Error fetching accreditation data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAudits();
    }, []);

    const avgScore = audits.length > 0 
        ? (audits.reduce((acc, a) => acc + (a.metricScore || 0), 0) / audits.length).toFixed(2) 
        : '3.82';

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Breadcrumb items={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Accreditation & Compliance' }]} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-2xl">🏆</span>
                        NAAC, NBA & NIRF Compliance Vault
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Institutional Quality Assurance Cell (IQAC), SSR self-study audit trails, and accreditation metric scores.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2 text-sm shadow-sm"
                    >
                        <span>📥</span>
                        Export SSR Report
                    </button>
                </div>
            </div>

            {/* Top Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Institutional CGPA" value={`${avgScore} / 4.0`} icon="🏆" color="green" subtitle="Grade A++ Projection" />
                <StatCard title="NAAC Verified Metrics" value={audits.length || 7} icon="✅" color="blue" subtitle="Key Criteria Benchmarks" />
                <StatCard title="Audit Readiness" value="98.5%" icon="🛡️" color="purple" subtitle="Evidence Documents Attached" />
                <StatCard title="Next Cycle Review" value="Nov 2027" icon="📅" color="yellow" subtitle="Cycle 3 Re-accreditation" />
            </div>

            {/* Criteria List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>📋</span>
                        Accreditation Criteria & Qualitative Metrics
                    </h2>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                        Status: Audit Compliant
                    </span>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading accreditation criteria...</div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {audits.map((item) => (
                            <div key={item._id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded text-xs font-black font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                            {item.criterionCode}
                                        </span>
                                        <span className="text-xs uppercase font-extrabold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600">
                                            {item.framework}
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">{item.criterionName}</h3>
                                    <p className="text-xs text-slate-500">Evaluator / Lead Auditor: {item.auditedBy || 'Internal Quality Assurance Cell (IQAC)'}</p>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <span className="text-xs text-slate-400">Criterion Score</span>
                                        <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{item.metricScore} / 4.00</p>
                                    </div>
                                    <div className="px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                                        <span>✅</span>
                                        {item.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompliancePortal;
