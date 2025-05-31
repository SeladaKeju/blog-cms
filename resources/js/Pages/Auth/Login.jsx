import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserOutlined, LockOutlined, EyeOutlined, DashboardOutlined } from '@ant-design/icons';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            // Hapus onSuccess karena redirect sudah dihandle di AuthenticatedSessionController
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout fullScreen={true}>
            <Head title="CMS Login" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="relative z-10 flex flex-col justify-center items-start text-left p-12 text-white min-h-screen">
                        <div className="max-w-lg ml-16">
                            <div className="mb-12">
                                <h1 className="text-5xl font-bold mb-6">
                                    Welcome to Blog CMS
                                </h1>
                                <p className="text-xl text-blue-100 mb-8">
                                    Powerful content management system for modern bloggers
                                </p>
                            </div>
                            
                            <div className="space-y-6 text-blue-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-blue-300 rounded-full flex-shrink-0"></div>
                                    <span className="text-lg">Rich text editor with media support</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-blue-300 rounded-full flex-shrink-0"></div>
                                    <span className="text-lg">SEO optimization tools</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-blue-300 rounded-full flex-shrink-0"></div>
                                    <span className="text-lg">Advanced analytics dashboard</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-10 right-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute bottom-10 left-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-white bg-opacity-5 rounded-full"></div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
                    <div className="max-w-md w-full space-y-8">
                        {/* Mobile Header */}
                        <div className="text-center lg:hidden">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mb-4 shadow-lg">
                                <DashboardOutlined className="text-white text-2xl" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                                Blog CMS
                            </h1>
                            <p className="text-gray-600 font-medium">Sign in to access your account</p>
                        </div>

                        {/* Desktop Header */}
                        <div className="hidden lg:block text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Sign In
                            </h2>
                            <p className="text-gray-600">Welcome back! Please enter your details.</p>
                        </div>

                        {/* Card Container */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
                            {status && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="text-sm font-medium text-green-800">
                                        {status}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <InputLabel htmlFor="email" value="Email Address" className="text-gray-700 font-medium" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <UserOutlined className="text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            autoComplete="username"
                                            isFocused={true}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <InputLabel htmlFor="password" value="Password" className="text-gray-700 font-medium" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <LockOutlined className="text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            autoComplete="current-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Enter your password"
                                        />
                                    </div>
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-600 font-medium">
                                            Remember me
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="pt-2">
                                    <PrimaryButton
                                        className="w-full justify-center py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Signing in...
                                            </div>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </PrimaryButton>
                                </div>
                            </form>

                            {/* Footer Links */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <div className="text-center space-y-4">
                                    <div className="text-sm text-gray-600">
                                        Don't have an account?{' '}
                                        <Link
                                            href={route('register')}
                                            className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                        >
                                            Create one here
                                        </Link>
                                    </div>

                                    {/* Public Blog Link with Icon */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-sm text-gray-500 mb-2">
                                            Want to browse without signing in?
                                        </p>
                                        <Link
                                            href="/blog"
                                            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200 group"
                                        >
                                            <EyeOutlined className="mr-1 group-hover:scale-110 transition-transform duration-200" />
                                            Visit Blog
                                            <span className="ml-1 group-hover:translate-x-1 transition-transform duration-200">→</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Features Info */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500">
                                Secure authentication with modern encryption
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx global>{`
                /* Custom input styling */
                input[type="email"]:focus,
                input[type="password"]:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                
                /* Loading animation */
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
                
                /* Gradient text */
                .bg-clip-text {
                    -webkit-background-clip: text;
                    background-clip: text;
                }
                
                /* Hover effects */
                .group:hover .group-hover\\:scale-110 {
                    transform: scale(1.1);
                }
                
                .group:hover .group-hover\\:translate-x-1 {
                    transform: translateX(0.25rem);
                }
                
                /* Checkbox custom styling */
                input[type="checkbox"] {
                    border-radius: 4px;
                }
                
                /* Button disabled state */
                button:disabled {
                    cursor: not-allowed;
                    opacity: 0.6;
                }
                
                /* Smooth transitions for all interactive elements */
                a, button, input {
                    transition: all 0.2s ease-in-out;
                }
                
                /* Modern shadows */
                .shadow-xl {
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                
                /* Background gradient */
                .bg-gradient-to-br {
                    background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
                }
                
                /* Backdrop blur support */
                .backdrop-blur-sm {
                    backdrop-filter: blur(4px);
                }
                
                /* Mobile responsiveness */
                @media (max-width: 1024px) {
                    .min-h-screen {
                        padding: 1rem;
                    }
                }
            `}</style>
        </GuestLayout>
    );
}
