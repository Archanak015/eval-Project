import { Link } from 'react-router-dom';
import { ChevronRightIcon, AcademicCapIcon, UserGroupIcon, ChartBarIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
    return (
        <div className="bg-white">
            {/* Navigation */}
            <nav className="bg-white shadow-sm fixed w-full z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">Faculty Center</span>
                        </div>
                        <div className="flex space-x-4">
                            <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">
                                Login
                            </Link>
                            <Link to="/register" className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md font-medium transition duration-300">
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden pt-16">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Empowering Educators</span>{' '}
                                    <span className="block text-indigo-600 xl:inline">With Faculty Center</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    A dedicated platform designed for faculty members to manage academics, track attendance, and update results with ease. Streamline your teaching experience today.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg">
                                            Register for Faculty
                                        </Link>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg">
                                            Log In
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-gray-50 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
                        <AcademicCapIcon className="h-64 w-64 text-indigo-200 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything a Faculty member needs
                        </p>
                    </div>

                    <div className="mt-10">
                        <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
                            {[
                                {
                                    name: 'Course Management',
                                    description: 'View and manage your assigned subjects and curriculum details effortlessly.',
                                    icon: ClipboardDocumentCheckIcon,
                                },
                                {
                                    name: 'Attendance Tracking',
                                    description: 'Mark and monitor student attendance with real-time digital records.',
                                    icon: ChartBarIcon,
                                },
                                {
                                    name: 'Result Management',
                                    description: 'Easily upload and update exam marks for your students in one secure place.',
                                    icon: AcademicCapIcon,
                                },
                            ].map((feature) => (
                                <div key={feature.name} className="relative">
                                    <dt>
                                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                                            <feature.icon className="h-6 w-6" aria-hidden="true" />
                                        </div>
                                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                                    </dt>
                                    <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <section className="py-12 bg-white overflow-hidden md:py-20 lg:py-24">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative">
                        <blockquote className="mt-10">
                            <div className="max-w-3xl mx-auto text-center text-2xl leading-9 font-medium text-gray-900">
                                <p>
                                    &ldquo;Faculty Center has completely changed how I manage my classes. All my tools are now in one place.&rdquo;
                                </p>
                            </div>
                            <footer className="mt-8">
                                <div className="md:flex md:items-center md:justify-center">
                                    <div className="mt-3 text-center md:mt-0 md:ml-4 md:flex md:items-center">
                                        <div className="text-base font-medium text-gray-900">Prof. Alan Turing</div>
                                        <div className="text-base font-medium text-gray-500 ml-2">, Computer Science Department</div>
                                    </div>
                                </div>
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex justify-between items-center">
                    <p>&copy; 2024 Faculty Center. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-gray-300">Support</a>
                        <a href="#" className="hover:text-gray-300">Help Center</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
