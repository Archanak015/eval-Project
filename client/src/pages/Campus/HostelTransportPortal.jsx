import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import Breadcrumb from '../../components/Breadcrumb';
import Modal from '../../components/Modal';

const HostelTransportPortal = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('hostel'); // 'hostel' | 'transport'
    const [hostels, setHostels] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    // New entity state
    const [hostelForm, setHostelForm] = useState({
        blockName: '', blockCode: '', genderAllowed: 'Boys', totalRooms: 40, totalBeds: 120, monthlyMessFee: 4200, wardenName: '', wardenContact: ''
    });

    const [routeForm, setRouteForm] = useState({
        routeName: '', routeCode: '', vehicleNumber: '', driverName: '', driverPhone: '', annualFee: 16000, gpsDeviceId: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [hostelRes, transportRes] = await Promise.all([
                axiosClient.get('/api/saas/hostels'),
                axiosClient.get('/api/saas/transport')
            ]);
            setHostels(hostelRes.data.data || []);
            setRoutes(transportRes.data.data || []);
        } catch (err) {
            console.error('Error fetching campus logistics:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateHostel = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/api/saas/hostels', hostelForm);
            setModalOpen(false);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create hostel block');
        }
    };

    const handleCreateRoute = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/api/saas/transport', routeForm);
            setModalOpen(false);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create transport route');
        }
    };

    const totalBeds = hostels.reduce((sum, h) => sum + (h.totalBeds || 0), 0);
    const occupiedBeds = hostels.reduce((sum, h) => sum + (h.occupiedBeds || 0), 0);
    const totalVehicles = routes.length;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <Breadcrumb items={[{ label: 'Dashboard', link: '/dashboard' }, { label: 'Campus Logistics & Facilities' }]} />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-2xl">🏛️</span>
                        Campus Facilities & Fleet Logistics
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Residential halls, occupancy meters, bus fleet dispatch, and automated fee tracking.
                    </p>
                </div>
                {['admin', 'superadmin'].includes(user?.role) && (
                    <button
                        onClick={() => setModalOpen(true)}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 text-sm"
                    >
                        <span>➕</span>
                        {activeTab === 'hostel' ? 'Register Hostel Block' : 'Add Bus Route'}
                    </button>
                )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Hostel Blocks" value={hostels.length} icon="🏛️" color="blue" />
                <StatCard title="Bed Occupancy" value={`${occupiedBeds} / ${totalBeds}`} icon="🛏️" color="green" subtitle={`${totalBeds > 0 ? Math.round((occupiedBeds/totalBeds)*100) : 0}% Capacity`} />
                <StatCard title="Active Transport Routes" value={totalVehicles} icon="🚌" color="yellow" />
                <StatCard title="Transit Coverage" value="99.4%" icon="📍" color="purple" subtitle="On-time dispatch rate" />
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-8">
                <button
                    onClick={() => setActiveTab('hostel')}
                    className={`pb-4 px-2 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors ${
                        activeTab === 'hostel'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                    <span>🛏️</span>
                    Hostel & Residential Halls ({hostels.length})
                </button>
                <button
                    onClick={() => setActiveTab('transport')}
                    className={`pb-4 px-2 font-bold text-sm border-b-2 flex items-center gap-2 transition-colors ${
                        activeTab === 'transport'
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                >
                    <span>🚌</span>
                    University Bus Fleet & Routes ({routes.length})
                </button>
            </div>

            {loading ? (
                <div className="p-12 text-center text-slate-500">Loading campus logistics data...</div>
            ) : activeTab === 'hostel' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {hostels.map((hostel) => (
                        <div key={hostel._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs uppercase font-extrabold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                                        {hostel.genderAllowed} Hostel
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">{hostel.blockName}</h3>
                                    <p className="text-xs text-slate-500 font-mono">Code: {hostel.blockCode}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-400">Monthly Mess</span>
                                    <p className="text-sm font-bold text-emerald-600">₹{hostel.monthlyMessFee.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300">
                                <div className="flex justify-between text-xs">
                                    <span>Occupancy</span>
                                    <span className="font-semibold">{hostel.occupiedBeds} / {hostel.totalBeds} Beds</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${Math.min(100, Math.round((hostel.occupiedBeds / (hostel.totalBeds || 1)) * 100))}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
                                <div className="flex items-center gap-1.5">
                                    <span>🛡️</span>
                                    <span>Warden: <strong className="text-slate-700 dark:text-slate-300">{hostel.wardenName}</strong></span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span>📞</span>
                                    <span>{hostel.wardenContact}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {routes.map((route) => (
                        <div key={route._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                                        {route.routeCode}
                                    </span>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">{route.routeName}</h3>
                                    <p className="text-xs text-slate-500">Bus No: {route.vehicleNumber}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-400">Annual Pass</span>
                                    <p className="text-sm font-bold text-blue-600">₹{route.annualFee.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                                <p className="font-semibold text-slate-700 dark:text-slate-300">Stops & Route Path:</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {route.stops && route.stops.map((stop, i) => (
                                        <span key={i} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                                            {stop.stopName} ({stop.pickupTime})
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <span>Driver: <strong className="text-slate-700 dark:text-slate-300">{route.driverName}</strong> ({route.driverPhone})</span>
                                <span className="font-mono text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 px-2 py-0.5 rounded">GPS Active</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Creation Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={activeTab === 'hostel' ? 'Register Hostel Block' : 'Register New Bus Route'}>
                {activeTab === 'hostel' ? (
                    <form onSubmit={handleCreateHostel} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Block Name</label>
                            <input
                                required
                                type="text"
                                value={hostelForm.blockName}
                                onChange={e => setHostelForm({...hostelForm, blockName: e.target.value})}
                                placeholder="e.g. Visvesvaraya Hall of Residence"
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Block Code</label>
                                <input
                                    required
                                    type="text"
                                    value={hostelForm.blockCode}
                                    onChange={e => setHostelForm({...hostelForm, blockCode: e.target.value})}
                                    placeholder="H-BLOCK-C"
                                    className="w-full px-3 py-2 border rounded-xl text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Gender</label>
                                <select
                                    value={hostelForm.genderAllowed}
                                    onChange={e => setHostelForm({...hostelForm, genderAllowed: e.target.value})}
                                    className="w-full px-3 py-2 border rounded-xl text-sm"
                                >
                                    <option value="Boys">Boys</option>
                                    <option value="Girls">Girls</option>
                                    <option value="Co-ed">Co-ed</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Total Rooms</label>
                                <input
                                    type="number"
                                    value={hostelForm.totalRooms}
                                    onChange={e => setHostelForm({...hostelForm, totalRooms: Number(e.target.value)})}
                                    className="w-full px-3 py-2 border rounded-xl text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Total Beds</label>
                                <input
                                    type="number"
                                    value={hostelForm.totalBeds}
                                    onChange={e => setHostelForm({...hostelForm, totalBeds: Number(e.target.value)})}
                                    className="w-full px-3 py-2 border rounded-xl text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Mess Fee (₹)</label>
                                <input
                                    type="number"
                                    value={hostelForm.monthlyMessFee}
                                    onChange={e => setHostelForm({...hostelForm, monthlyMessFee: Number(e.target.value)})}
                                    className="w-full px-3 py-2 border rounded-xl text-sm"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Warden Name</label>
                                <input
                                    required
                                    type="text"
                                    value={hostelForm.wardenName}
                                    onChange={e => setHostelForm({...hostelForm, wardenName: e.target.value})}
                                    placeholder="Prof. Ramesh Rao"
                                    className="w-full px-3 py-2 border rounded-xl text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Warden Phone</label>
                                <input
                                    required
                                    type="text"
                                    value={hostelForm.wardenContact}
                                    onChange={e => setHostelForm({...hostelForm, wardenContact: e.target.value})}
                                    placeholder="+91 98860 12345"
                                    className="w-full px-3 py-2 border rounded-xl text-sm"
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm">
                            Save Hostel Block
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleCreateRoute} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Route Name</label>
                            <input
                                required
                                type="text"
                                value={routeForm.routeName}
                                onChange={e => setRouteForm({...routeForm, routeName: e.target.value})}
                                placeholder="e.g. Central Station - Tech Campus Express"
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Route Code</label>
                                <input
                                    required
                                    type="text"
                                    value={routeForm.routeCode}
                                    onChange={e => setRouteForm({...routeForm, routeCode: e.target.value})}
                                    placeholder="ROUTE-12"
                                    className="w-full px-3 py-2 border rounded-xl text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Vehicle Number</label>
                                <input
                                    required
                                    type="text"
                                    value={routeForm.vehicleNumber}
                                    onChange={e => setRouteForm({...routeForm, vehicleNumber: e.target.value})}
                                    placeholder="KA-04-E-4512"
                                    className="w-full px-3 py-2 border rounded-xl text-sm"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Driver Name</label>
                                <input
                                    required
                                    type="text"
                                    value={routeForm.driverName}
                                    onChange={e => setRouteForm({...routeForm, driverName: e.target.value})}
                                    placeholder="Somanna K"
                                    className="w-full px-3 py-2 border rounded-xl text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Driver Phone</label>
                                <input
                                    required
                                    type="text"
                                    value={routeForm.driverPhone}
                                    onChange={e => setRouteForm({...routeForm, driverPhone: e.target.value})}
                                    placeholder="+91 94480 55667"
                                    className="w-full px-3 py-2 border rounded-xl text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Annual Fee (₹)</label>
                            <input
                                type="number"
                                value={routeForm.annualFee}
                                onChange={e => setRouteForm({...routeForm, annualFee: Number(e.target.value)})}
                                className="w-full px-3 py-2 border rounded-xl text-sm"
                            />
                        </div>
                        <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm">
                            Save Transport Route
                        </button>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default HostelTransportPortal;
