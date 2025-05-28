import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { UserOutlined, MailOutlined, LockOutlined, EyeOutlined, DashboardOutlined } from '@ant-design/icons';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout fullScreen={true}>
            <Head title="Register" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="relative z-10 flex flex-col justify-center items-start text-left p-12 text-white min-h-screen">
                        <div className="max-w-lg ml-16">
                            <div className="mb-12">
                                <h1 className="text-5xl font-bold mb-6">
                                    Start Your Blogging Journey
                                </h1>
                                <p className="text-xl text-indigo-100 mb-8">
                                    Join thousands of content creators using our powerful CMS platform
                                </p>
                            </div>
                            
                            <div className="space-y-6 text-indigo-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-indigo-300 rounded-full flex-shrink-0"></div>
                                    <span className="text-lg">Intuitive content creation tools</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-indigo-300 rounded-full flex-shrink-0"></div>
                                    <span className="text-lg">Built-in SEO optimization</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-indigo-300 rounded-full flex-shrink-0"></div>
                                    <span className="text-lg">Real-time collaboration features</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-indigo-300 rounded-full flex-shrink-0"></div>
                                    <span className="text-lg">Advanced analytics & insights</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-10 right-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute bottom-10 left-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-white bg-opacity-5 rounded-full"></div>
                </div>

                {/* Right Side - Register Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
                    <div className="max-w-md w-full space-y-8">
                        {/* Mobile Header */}
                        <div className="text-center lg:hidden">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mb-4 shadow-lg">
                                <DashboardOutlined className="text-white text-2xl" />
                            </div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                                Join Blog CMS
                            </h1>
                            <p className="text-gray-600 font-medium">Create your account to start blogging</p>
                        </div>

                        {/* Desktop Header */}
                        <div className="hidden lg:block text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Create Account
                            </h2>
                            <p className="text-gray-600">Join our community of content creators</p>
                        </div>

                        {/* Card Container */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
                            <form onSubmit={submit} className="space-y-5">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <InputLabel htmlFor="name" value="Full Name" className="text-gray-700 font-medium" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <UserOutlined className="text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            autoComplete="name"
                                            isFocused={true}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <InputLabel htmlFor="email" value="Email Address" className="text-gray-700 font-medium" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MailOutlined className="text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            autoComplete="username"
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter your email address"
                                            required
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
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Create a strong password"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Confirm Password"
                                        className="text-gray-700 font-medium"
                                    />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <LockOutlined className="text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            autoComplete="new-password"
                                            onChange={(e) =>
                                                setData('password_confirmation', e.target.value)
                                            }
                                            placeholder="Confirm your password"
                                            required
                                        />
                                    </div>
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
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
                                                Creating Account...
                                            </div>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </PrimaryButton>
                                </div>
                            </form>

                            {/* Footer Links */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="text-center space-y-4">
                                    <div className="text-sm text-gray-600">
                                        Already have an account?{' '}
                                        <Link
                                            href={route('login')}
                                            className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                        >
                                            Sign in here
                                        </Link>
                                    </div>

                                    {/* Public Blog Link with Icon */}
                                    <div className="pt-4 border-t border-gray-100">
                                        <p className="text-sm text-gray-500 mb-2">
                                            Want to view the public blog?
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
                                Secure registration with modern encryption
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx global>{`
                /* Custom input styling */
                input[type="email"]:focus,
                input[type="password"]:focus,
                input[type="text"]:focus {
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
