import { Outlet } from 'react-router-dom';
import ERPNavbar from './ERPNavbar';

const ERPLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
            <ERPNavbar />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
};

export default ERPLayout;
