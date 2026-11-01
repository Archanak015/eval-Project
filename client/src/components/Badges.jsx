export const RoleBadge = ({ role }) => {
    const roleLower = (role || 'user').toLowerCase();
    
    let colorClass = 'bg-slate-100 text-slate-700 border-slate-200';
    if (roleLower === 'superadmin') colorClass = 'bg-purple-100 text-purple-800 border-purple-200';
    else if (roleLower === 'admin') colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
    else if (roleLower === 'faculty') colorClass = 'bg-indigo-100 text-indigo-800 border-indigo-200';
    else if (roleLower === 'student') colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${colorClass}`}>
            {role || 'User'}
        </span>
    );
};

export const AttendanceBadge = ({ percentage }) => {
    const pct = Number(percentage) || 0;
    let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (pct < 75) badgeClass = 'bg-rose-50 text-rose-700 border-rose-200';
    else if (pct < 85) badgeClass = 'bg-amber-50 text-amber-700 border-amber-200';

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${badgeClass}`}>
            {pct}%
        </span>
    );
};

export const StatusChip = ({ status }) => {
    const st = (status || 'Active').toLowerCase();
    let chipClass = 'bg-slate-100 text-slate-700 border-slate-200';
    if (['active', 'approved', 'published', 'present', 'passed'].includes(st)) {
        chipClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (['pending', 'submitted', 'under review', 'upcoming'].includes(st)) {
        chipClass = 'bg-amber-50 text-amber-700 border-amber-200';
    } else if (['suspended', 'absent', 'rejected', 'cancelled', 'failed'].includes(st)) {
        chipClass = 'bg-rose-50 text-rose-700 border-rose-200';
    }

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize border ${chipClass}`}>
            {status || 'Active'}
        </span>
    );
};
