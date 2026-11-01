import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';

const AddSubject = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        department: 'CS',
        semester: 1,
        course: 'B.Tech',
        credits: 3,
        faculty: user?._id
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axiosClient.post('/api/academic/subjects', {
                ...formData,
                semester: Number(formData.semester),
                credits: Number(formData.credits)
            });
            toast.success('Subject registered successfully');
            navigate('/faculty/subjects');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error registering subject');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-8 flex items-center justify-center">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200/80 max-w-lg w-full">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                        <span>/</span>
                        <Link to="/faculty/subjects" className="hover:text-blue-600 transition">Subjects</Link>
                        <span>/</span>
                        <span className="text-slate-800 font-medium">New</span>
                    </div>
                    <Link
                        to="/faculty/subjects"
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                        ← Back to List
                    </Link>
                </div>

                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add New Subject</h1>
                    <p className="text-slate-500 text-xs mt-1">Register a new curriculum subject into the academic database.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                            Subject Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="e.g. Operating Systems"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Subject Code
                            </label>
                            <input
                                type="text"
                                name="code"
                                required
                                placeholder="CS301"
                                value={formData.code}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Department
                            </label>
                            <input
                                type="text"
                                name="department"
                                required
                                placeholder="CS"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Semester
                            </label>
                            <input
                                type="number"
                                name="semester"
                                min="1"
                                max="8"
                                required
                                value={formData.semester}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Credits
                            </label>
                            <input
                                type="number"
                                name="credits"
                                min="1"
                                max="10"
                                required
                                value={formData.credits}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                                Course
                            </label>
                            <input
                                type="text"
                                name="course"
                                required
                                placeholder="B.Tech"
                                value={formData.course}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm shadow-sm transition disabled:opacity-50"
                    >
                        {submitting ? 'Creating Subject...' : 'Register Subject'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddSubject;
