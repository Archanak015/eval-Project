import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const SystemSettings = () => {
    const [settings, setSettings] = useState({
        institutionName: 'UniConnect Central University',
        institutionCode: 'UNI-2026',
        attendanceThresholdPct: 75,
        gradingSystem: '10-Point CGPA (CBCS / NEP)',
        emailAlertsEnabled: true,
        twoFactorAuthEnabled: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get('/api/enterprise/settings');
                if (res.data?.data) setSettings(res.data.data);
            } catch (err) {
                console.error('Error fetching settings', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axiosClient.put('/api/enterprise/settings', settings);
            toast.success('System settings saved successfully!');
        } catch (err) {
            toast.error('Failed to update system settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
            <div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                    <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-medium">Administration</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Institutional Governance & System Configuration
                </h1>
                <p className="text-slate-500 text-sm mt-1">Configure campus branding, grading frameworks, and operational security thresholds.</p>
            </div>

            <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Institution Legal Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl"
                            value={settings.institutionName}
                            onChange={e => setSettings({ ...settings, institutionName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Institution Code</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl font-mono uppercase"
                            value={settings.institutionCode}
                            onChange={e => setSettings({ ...settings, institutionCode: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Grading Framework</label>
                        <select
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl bg-white"
                            value={settings.gradingSystem}
                            onChange={e => setSettings({ ...settings, gradingSystem: e.target.value })}
                        >
                            <option value="10-Point CGPA (CBCS / NEP)">10-Point CGPA (CBCS / NEP 2020)</option>
                            <option value="Letter Grade (A+ to F)">Letter Grade (A+ to F)</option>
                            <option value="Percentage">Percentage (Marks System)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Attendance Threshold (%)</label>
                        <input
                            type="number"
                            min="50"
                            max="100"
                            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl"
                            value={settings.attendanceThresholdPct}
                            onChange={e => setSettings({ ...settings, attendanceThresholdPct: Number(e.target.value) })}
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-3">
                    <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer">
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Automated Email Circulars</p>
                            <p className="text-xs text-slate-500">Dispatch automated exam and attendance notifications to students and staff</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.emailAlertsEnabled}
                            onChange={e => setSettings({ ...settings, emailAlertsEnabled: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                    </label>
                    <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 cursor-pointer">
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Two-Factor Authentication (2FA Ready)</p>
                            <p className="text-xs text-slate-500">Require OTP confirmation for sensitive administrative logins and grade publishing</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.twoFactorAuthEnabled}
                            onChange={e => setSettings({ ...settings, twoFactorAuthEnabled: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded"
                        />
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition"
                >
                    {saving ? 'Saving Changes...' : 'Save Institutional Configuration'}
                </button>
            </form>
        </div>
    );
};

export default SystemSettings;
