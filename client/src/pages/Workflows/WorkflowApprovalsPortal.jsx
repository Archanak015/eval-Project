import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';

const WorkflowApprovalsPortal = () => {
    const { user } = useAuth();
    const [workflows, setWorkflows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [actionModalOpen, setActionModalOpen] = useState(false);
    const [selectedWorkflow, setSelectedWorkflow] = useState(null);
    const [actionComments, setActionComments] = useState('');

    const [form, setForm] = useState({
        workflowType: 'Leave Application',
        title: '',
        description: ''
    });

    const fetchWorkflows = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get('/api/final/workflows');
            setWorkflows(res.data.data || []);
        } catch (err) {
            console.error('Error fetching workflows:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkflows();
    }, []);

    const handleCreateWorkflow = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/api/final/workflows', form);
            setModalOpen(false);
            fetchWorkflows();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating workflow request');
        }
    };

    const handleWorkflowAction = async (action) => {
        try {
            await axiosClient.patch(`/api/final/workflows/${selectedWorkflow._id}/action`, {
                action,
                comments: actionComments
            });
            setActionModalOpen(false);
            setSelectedWorkflow(null);
            setActionComments('');
            fetchWorkflows();
        } catch (err) {
            alert(err.response?.data?.message || 'Error processing workflow action');
        }
    };

    const pendingCount = workflows.filter(w => w.status === 'Pending Review').length;
    const approvedCount = workflows.filter(w => w.status === 'Approved').length;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Breadcrumb items={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Automated Approvals & Workflows' }]} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-2xl">⚡</span>
                        Multi-Stage Workflow & Approval Engine
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Automated document routing for leave applications, seat allocations, purchase approvals, and fee waivers.
                    </p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 text-sm"
                >
                    <span>➕</span>
                    Initiate Approval Request
                </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Workflows" value={workflows.length} icon="📋" color="blue" />
                <StatCard title="Pending Review" value={pendingCount} icon="⏳" color="yellow" subtitle="Action Required" />
                <StatCard title="Sanctioned / Approved" value={approvedCount} icon="✅" color="green" subtitle="Completed Cycles" />
                <StatCard title="SLA Turnaround" value="< 24 Hrs" icon="⚡" color="purple" subtitle="Institutional Average" />
            </div>

            {/* Workflow List */}
            {loading ? (
                <div className="p-12 text-center text-slate-500">Loading workflows...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {workflows.map((item) => (
                        <div key={item._id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="text-xs uppercase font-extrabold px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950 text-blue-600">
                                            {item.workflowType}
                                        </span>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">{item.title}</h3>
                                        <p className="text-xs text-slate-500">Submitted by: <strong>{item.applicant?.name}</strong> ({item.applicant?.role})</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                        item.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                                        item.status === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                                    }`}>
                                        {item.status}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                                    {item.description}
                                </p>

                                {/* Audit Trail */}
                                <div className="space-y-1.5 pt-2">
                                    <span className="text-[11px] uppercase font-bold text-slate-400">Audit Trail:</span>
                                    {item.auditTrail?.map((trail, i) => (
                                        <div key={i} className="text-xs flex items-center justify-between text-slate-500 border-l-2 border-blue-500 pl-2">
                                            <span><strong>{trail.actionBy}:</strong> {trail.action}</span>
                                            <span className="text-[10px] text-slate-400">{new Date(trail.timestamp).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {['admin', 'superadmin'].includes(user?.role) && item.status === 'Pending Review' && (
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                                    <button
                                        onClick={() => { setSelectedWorkflow(item); setActionModalOpen(true); }}
                                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                                    >
                                        Review & Decide
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Create Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Initiate Approval Workflow">
                <form onSubmit={handleCreateWorkflow} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Workflow Category</label>
                        <select
                            value={form.workflowType}
                            onChange={e => setForm({...form, workflowType: e.target.value})}
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                        >
                            <option value="Leave Application">Leave Application</option>
                            <option value="Admission Seat Approval">Admission Seat Approval</option>
                            <option value="Fee Concession">Fee Concession</option>
                            <option value="Document Verification">Document Verification</option>
                            <option value="Equipment Purchase">Equipment Purchase</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Subject / Summary</label>
                        <input
                            required
                            type="text"
                            value={form.title}
                            onChange={e => setForm({...form, title: e.target.value})}
                            placeholder="e.g. On-Duty Leave Request for Hackathon"
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Detailed Justification</label>
                        <textarea
                            rows={3}
                            required
                            value={form.description}
                            onChange={e => setForm({...form, description: e.target.value})}
                            placeholder="Provide details..."
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                        />
                    </div>
                    <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm">
                        Submit into Approval Chain
                    </button>
                </form>
            </Modal>

            {/* Action Modal */}
            <Modal isOpen={actionModalOpen} onClose={() => setActionModalOpen(false)} title="Review Application">
                <div className="space-y-4">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                        Reviewing request: <strong>{selectedWorkflow?.title}</strong>
                    </p>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Administrative Remarks</label>
                        <textarea
                            rows={3}
                            value={actionComments}
                            onChange={e => setActionComments(e.target.value)}
                            placeholder="Add evaluation comments..."
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => handleWorkflowAction('Approved')}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm"
                        >
                            Approve Request
                        </button>
                        <button
                            onClick={() => handleWorkflowAction('Rejected')}
                            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm"
                        >
                            Reject Request
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default WorkflowApprovalsPortal;
