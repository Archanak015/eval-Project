import { useState } from 'react';
import { Link } from 'react-router-dom';

const PublicUniversityWebsite = () => {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            {/* Top Bar */}
            <div className="bg-slate-900 text-slate-300 text-xs py-2 px-6 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span>📍 University Main Campus, Tech Boulevard, Silicon District</span>
                    <span>📞 Admissions Helpline: +91 800-UNICONNECT</span>
                </div>
                <div className="flex items-center gap-4 font-semibold">
                    <span className="text-emerald-400">● NAAC Grade A++ Accredited</span>
                    <Link to="/parent/portal" className="hover:text-white transition-colors">Parent Portal</Link>
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-bold">ERP Portal Login ↗</Link>
                </div>
            </div>

            {/* Main Public Navigation */}
            <header className="bg-white sticky top-0 z-50 border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-md shadow-blue-500/30">
                            U
                        </div>
                        <div>
                            <span className="text-2xl font-black text-slate-900 tracking-tight">UniConnect</span>
                            <span className="block text-xs uppercase tracking-wider text-slate-500 font-bold">Global Institute of Technology & Sciences</span>
                        </div>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700">
                        <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'text-blue-600' : 'hover:text-blue-600'}>Home</button>
                        <button onClick={() => setActiveTab('academics')} className={activeTab === 'academics' ? 'text-blue-600' : 'hover:text-blue-600'}>Programs & Departments</button>
                        <button onClick={() => setActiveTab('research')} className={activeTab === 'research' ? 'text-blue-600' : 'hover:text-blue-600'}>Research & Grants</button>
                        <button onClick={() => setActiveTab('placements')} className={activeTab === 'placements' ? 'text-blue-600' : 'hover:text-blue-600'}>Placements & Careers</button>
                        <button onClick={() => setActiveTab('campus')} className={activeTab === 'campus' ? 'text-blue-600' : 'hover:text-blue-600'}>Campus Life & Facilities</button>
                        <button onClick={() => setActiveTab('admissions')} className={activeTab === 'admissions' ? 'text-blue-600' : 'hover:text-blue-600'}>Admissions 2026</button>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/admissions"
                            className="px-4 py-2.5 rounded-xl border border-blue-600 text-blue-600 font-bold text-xs hover:bg-blue-50 transition-colors"
                        >
                            Apply Online
                        </Link>
                        <Link
                            to="/login"
                            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all"
                        >
                            Sign In to ERP
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            {activeTab === 'home' && (
                <>
                    <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white py-24 px-6 overflow-hidden">
                        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <span className="px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-400 font-mono text-xs font-bold border border-blue-500/30">
                                    Admissions Open for Academic Year 2026–27
                                </span>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                                    Innovating the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Engineering & Technology</span>
                                </h1>
                                <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
                                    UniConnect University is ranked #1 in Innovation & Industry Immersion. Experience cutting-edge research facilities, world-renowned faculty, and 98% placement track records with top global employers.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    <Link
                                        to="/admissions"
                                        className="px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/40 transition-all"
                                    >
                                        Explore Programs & Apply
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="px-8 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-extrabold text-sm border border-slate-700 backdrop-blur-sm transition-all"
                                    >
                                        Student & Faculty Portal ↗
                                    </Link>
                                </div>
                            </div>

                            {/* Stat Showcase */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2">
                                    <div className="text-4xl font-black text-blue-400">98.4%</div>
                                    <div className="text-sm font-bold text-white">Campus Placements</div>
                                    <p className="text-xs text-slate-400">Top recruiters: Google, Microsoft, Amazon, Nvidia</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2">
                                    <div className="text-4xl font-black text-cyan-400">3.82</div>
                                    <div className="text-sm font-bold text-white">NAAC CGPA (A++)</div>
                                    <p className="text-xs text-slate-400">Highest tier institutional quality accreditation</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2">
                                    <div className="text-4xl font-black text-emerald-400">₹38.5 Cr</div>
                                    <div className="text-sm font-bold text-white">Funded Research Grants</div>
                                    <p className="text-xs text-slate-400">DST-SERB, ISRO, AICTE, and Industry Hubs</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2">
                                    <div className="text-4xl font-black text-amber-400">14:1</div>
                                    <div className="text-sm font-bold text-white">Student to Faculty Ratio</div>
                                    <p className="text-xs text-slate-400">Personalized mentorship and project guidance</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Academic Faculties & Programs */}
                    <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
                        <div className="text-center max-w-2xl mx-auto space-y-3">
                            <span className="text-xs uppercase font-extrabold text-blue-600 tracking-wider">World-Class Curricula</span>
                            <h2 className="text-3xl font-black text-slate-900">Departments & Academic Programs</h2>
                            <p className="text-slate-500 text-sm">Rigorous, industry-aligned engineering and technology degree tracks.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'Computer Science & Engineering', code: 'CSE', desc: 'Distributed computing, Cloud architectures, OS kernels, and scalable algorithms.' },
                                { title: 'Artificial Intelligence & Data Science', code: 'AIML', desc: 'Deep learning, Natural Language Processing, computer vision, and neural accelerators.' },
                                { title: 'Electronics & Communication', code: 'ECE', desc: 'VLSI chip design, embedded microcontrollers, IoT, and high-frequency RF systems.' },
                                { title: 'Information Science & Tech', code: 'ISE', desc: 'Information security, full-stack software development, and enterprise database systems.' },
                                { title: 'Mechanical & Robotics Engg', code: 'MECH', desc: 'Computational fluid dynamics, CAD/CAM robotics, and sustainable thermal designs.' },
                                { title: 'Civil & Infrastructure Engg', code: 'CIVIL', desc: 'Smart city structures, geotechnics, and earthquake-resistant architecture.' }
                            ].map((dept, i) => (
                                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700">{dept.code}</span>
                                        <span className="text-xs text-slate-400 font-semibold">4-Year B.E / B.Tech</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">{dept.title}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">{dept.desc}</p>
                                    <Link to="/admissions" className="inline-block text-xs font-bold text-blue-600 hover:text-blue-700">View Curriculum & Syllabus →</Link>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Campus Facilities & Infrastructure */}
                    <section className="bg-slate-100 py-20 px-6">
                        <div className="max-w-7xl mx-auto space-y-12">
                            <div className="text-center max-w-2xl mx-auto space-y-3">
                                <span className="text-xs uppercase font-extrabold text-blue-600 tracking-wider">Campus Life & Ecosystem</span>
                                <h2 className="text-3xl font-black text-slate-900">State-of-the-Art Infrastructure</h2>
                                <p className="text-slate-500 text-sm">A holistic living and learning campus environment designed for student excellence.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                {[
                                    { icon: '🏛️', title: 'Smart Classrooms', desc: '4K interactive displays and lecture recording capabilities.' },
                                    { icon: '🛏️', title: 'Residential Hostels', desc: 'Separate boys and girls residential blocks with automated dining registers.' },
                                    { icon: '🚌', title: 'GPS Transit Fleet', desc: '30+ university bus routes connecting city metro and central hubs.' },
                                    { icon: '🔬', title: 'Advanced Research Labs', desc: 'NVIDIA GPU clusters, robotics labs, and IoT testbeds.' }
                                ].map((fac, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                                        <div className="text-3xl">{fac.icon}</div>
                                        <h3 className="font-bold text-slate-900 text-base">{fac.title}</h3>
                                        <p className="text-xs text-slate-500">{fac.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* Other Dynamic Tab Views */}
            {activeTab !== 'home' && (
                <div className="max-w-7xl mx-auto py-16 px-6 space-y-6">
                    <button onClick={() => setActiveTab('home')} className="text-xs font-bold text-blue-600">← Back to Homepage</button>
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-2xl font-black text-slate-900 capitalize">{activeTab} Overview & Information</h2>
                        <p className="text-slate-500 text-sm">
                            Detailed admissions criteria, faculty directories, research repositories, and campus placement details are accessible through our dedicated online portals.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link to="/admissions" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs">Admissions Portal</Link>
                            <Link to="/research" className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Research Directory</Link>
                            <Link to="/login" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs">Log In to ERP</Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-16 px-6 border-t border-slate-800 text-xs">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-3">
                        <span className="text-lg font-black text-white">UniConnect University</span>
                        <p className="text-slate-500">Autonomous Institute of Technology & Engineering Sciences. Approved by AICTE, UGC, and NIRF Ranked.</p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Quick Portals</h4>
                        <p><Link to="/login" className="hover:text-white">ERP Student Portal</Link></p>
                        <p><Link to="/login" className="hover:text-white">Faculty Center</Link></p>
                        <p><Link to="/parent/portal" className="hover:text-white">Parent Portal</Link></p>
                        <p><Link to="/alumni" className="hover:text-white">Alumni Network</Link></p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Academics</h4>
                        <p><Link to="/admissions" className="hover:text-white">Admissions & Eligibility</Link></p>
                        <p><Link to="/research" className="hover:text-white">Research & Publications</Link></p>
                        <p><Link to="/placements" className="hover:text-white">Placement Drives</Link></p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Campus Contact</h4>
                        <p>Tech Knowledge Park, Phase 1</p>
                        <p>Bengaluru, Karnataka - 560100</p>
                        <p>Email: registrar@uniconnect.edu</p>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-slate-900 text-center text-slate-600">
                    © 2026 UniConnect University ERP. All Rights Reserved. Version 3.0 Global Enterprise Edition.
                </div>
            </footer>
        </div>
    );
};

export default PublicUniversityWebsite;
