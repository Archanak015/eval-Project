import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/EmptyState';
import Modal from '../../components/Modal';
import { StatusChip } from '../../components/Badges';

const DocumentVaultPortal = () => {
    const { user } = useAuth();
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadData, setUploadData] = useState({
        title: '',
        documentType: 'Aadhaar',
        fileUrl: 'https://cdn.uniconnect.edu/docs/sample_verified.pdf',
        visibility: 'Private'
    });

    const fetchDocs = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('/api/enterprise/documents');
            setDocs(res.data?.data || []);
        } catch (err) {
            console.error('Error fetching vault documents', err);
            toast.error('Failed to load documents');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/api/enterprise/documents', uploadData);
            toast.success('Document uploaded to institutional vault!');
            setShowUpload(false);
            setUploadData({
                title: '',
                documentType: 'Aadhaar',
                fileUrl: 'https://cdn.uniconnect.edu/docs/sample_verified.pdf',
                visibility: 'Private'
            });
            fetchDocs();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error uploading document');
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
                        <span className="text-slate-800 font-medium">Institutional Document Vault</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Verified Credentials & Document Vault
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Role-secured storage for academic certificates, identity credentials, and policies.</p>
                </div>

                <button
                    onClick={() => setShowUpload(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                    + Upload Credential
                </button>
            </div>

            {/* Document Vault Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {docs.map(doc => (
                    <div key={doc._id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                                    {doc.documentType}
                                </span>
                                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                    {doc.fileFormat || 'PDF'}
                                </span>
                            </div>
                            <h4 className="font-bold text-slate-900 text-sm leading-snug">{doc.title}</h4>
                            <p className="text-xs text-slate-500 mt-1">Owner: {doc.ownerUser?.name} ({doc.ownerRole})</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Uploaded: {new Date(doc.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-xs font-semibold text-slate-500">
                                {doc.isVerified ? '✅ Verified' : '⏳ Pending Review'}
                            </span>
                            <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-bold text-xs rounded-lg transition"
                            >
                                Preview ↗
                            </a>
                        </div>
                    </div>
                ))}
                {docs.length === 0 && !loading && (
                    <div className="col-span-full">
                        <EmptyState title="No documents in vault" description="Click + Upload Credential to store your first document." />
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Upload Document to Vault">
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Document Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. 5th Semester Grade Card / Passport Copy"
                            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl"
                            value={uploadData.title}
                            onChange={e => setUploadData({ ...uploadData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Document Category</label>
                        <select
                            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl bg-white"
                            value={uploadData.documentType}
                            onChange={e => setUploadData({ ...uploadData, documentType: e.target.value })}
                        >
                            <option value="Aadhaar">Aadhaar Card</option>
                            <option value="Passport">Passport</option>
                            <option value="Marks Card">Marks Card</option>
                            <option value="Transfer Certificate">Transfer Certificate</option>
                            <option value="Qualification Degree">Qualification Degree</option>
                            <option value="Experience Certificate">Experience Certificate</option>
                            <option value="Institutional Circular">Institutional Circular</option>
                            <option value="Academic Policy">Academic Policy</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Document File URL</label>
                        <input
                            type="url"
                            required
                            placeholder="https://..."
                            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl font-mono text-xs"
                            value={uploadData.fileUrl}
                            onChange={e => setUploadData({ ...uploadData, fileUrl: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition"
                    >
                        Store Document in Vault
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default DocumentVaultPortal;
