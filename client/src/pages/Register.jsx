import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'faculty',
        employeeId: '',
        enrollmentNo: '',
        department: '',
        semester: 1
    });
    const [submitting, setSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const success = await register(formData);
            if (success) {
                navigate('/dashboard');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-200/80">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-xl mb-4 shadow-sm">
                        U
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Create an Account
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Join UniConnect Smart Campus System
                    </p>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="role">
                            Account Role
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                        >
                            <option value="faculty">Faculty Member</option>
                            <option value="student">Student</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="name">
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="e.g. Dr. Alex Johnson"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="name@campus.edu"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {formData.role === 'student' ? (
                            <>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="enrollmentNo">
                                        Enrollment No
                                    </label>
                                    <input
                                        id="enrollmentNo"
                                        name="enrollmentNo"
                                        type="text"
                                        required
                                        placeholder="STU2026-001"
                                        value={formData.enrollmentNo}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="semester">
                                        Semester
                                    </label>
                                    <input
                                        id="semester"
                                        name="semester"
                                        type="number"
                                        min="1"
                                        max="8"
                                        required
                                        value={formData.semester}
                                        onChange={handleChange}
                                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    />
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="employeeId">
                                    Employee ID
                                </label>
                                <input
                                    id="employeeId"
                                    name="employeeId"
                                    type="text"
                                    required={formData.role !== 'admin'}
                                    placeholder="EMP-4402"
                                    value={formData.employeeId}
                                    onChange={handleChange}
                                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1" htmlFor="department">
                                Department
                            </label>
                            <input
                                id="department"
                                name="department"
                                type="text"
                                required
                                placeholder="CS / IT / EE"
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-2 flex justify-center py-2.5 px-4 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 shadow-sm transition disabled:opacity-60"
                    >
                        {submitting ? 'Creating Account...' : 'Complete Registration'}
                    </button>

                    <div className="text-center pt-2">
                        <p className="text-sm text-slate-600">
                            Already registered?{' '}
                            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 transition">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
