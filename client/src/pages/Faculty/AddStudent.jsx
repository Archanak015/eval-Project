import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../api/config';

const AddStudent = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        enrollmentNo: '',
        department: '',
        semester: '',
        password: 'student123' // Default password
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...formData,
                role: 'student'
            };
            await axios.post(`${API_BASE_URL}/api/auth/register`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Student registered successfully');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error registering student');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-xl w-full border border-gray-100">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">Register Student</h1>
                    <p className="text-gray-500 mt-2">Add a new student to the system database.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                placeholder="e.g. John Doe"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                placeholder="e.g. john@university.com"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Enrollment Number</label>
                            <input
                                type="text"
                                name="enrollmentNo"
                                required
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                placeholder="e.g. 123456"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                            <input
                                type="text"
                                name="department"
                                required
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                placeholder="e.g. Computer Science"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Semester</label>
                            <input
                                type="number"
                                name="semester"
                                required
                                min="1"
                                max="10"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-4">
                        <p className="text-xs text-indigo-700 font-medium">
                            <strong>Note:</strong> New students will have the default password: <code className="bg-white px-2 py-0.5 rounded border border-indigo-200 ml-1">student123</code>
                        </p>
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-[0.98]"
                        >
                            Register Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudent;
