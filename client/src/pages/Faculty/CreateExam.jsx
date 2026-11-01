import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../api/config';
import { useAuth } from '../../context/AuthContext';

const CreateExam = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        date: '',
        totalMarks: 100,
        description: ''
    });

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${API_BASE_URL}/api/academic/subjects`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Filter subjects assigned to this faculty
                const mySubjects = data.filter(sub => (sub.faculty?._id === user._id || sub.faculty === user._id));
                setSubjects(mySubjects);
                if (mySubjects.length > 0) {
                    setFormData(prev => ({ ...prev, subject: mySubjects[0]._id }));
                }
            } catch (error) {
                toast.error("Error fetching subjects");
            }
        };
        fetchSubjects();
    }, [user._id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE_URL}/api/exams/exams`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Exam scheduled successfully');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error scheduling exam');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-lg w-full border border-gray-100">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Schedule Exam</h1>
                    <p className="text-gray-600 mt-2">Create a new exam for one of your subjects.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            placeholder="e.g. Mid-Term Examination"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                        <select
                            name="subject"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                            value={formData.subject}
                            onChange={handleChange}
                        >
                            {subjects.map(sub => (
                                <option key={sub._id} value={sub._id}>{sub.name} ({sub.code})</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                            <input
                                type="date"
                                name="date"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Total Marks</label>
                            <input
                                type="number"
                                name="totalMarks"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                value={formData.totalMarks}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition h-24"
                            placeholder="Optional exam description or instructions..."
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="pt-6 flex space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-lg transition"
                        >
                            Schedule Exam
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateExam;
