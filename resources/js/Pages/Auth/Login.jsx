import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onSuccess: () => {
                // Redirect to dashboard after successful login
                window.location.href = route('dashboard');
            },
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="CMS Login" />

            {/* Header dengan Branding */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Blog CMS
                </h1>
                <p className="text-gray-600">Sign in to manage your content</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Enter your email"
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Enter your password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-6">
                    <PrimaryButton
                        className="w-full justify-center"
                        disabled={processing}
                        style={{
                            background: '#000',
                            borderColor: '#000',
                            height: '48px',
                            fontSize: '16px',
                            fontWeight: '500',
                        }}
                    >
                        {processing ? 'Signing in...' : 'Sign In'}
                    </PrimaryButton>
                </div>

                <div className="mt-6 text-center">
                    <div className="text-sm text-gray-600 mb-3">
                        Don't have an account?{' '}
                        <Link
                            href={route('register')}
                            className="font-medium text-black hover:text-gray-700 underline"
                        >
                            Create one here
                        </Link>
                    </div>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-gray-600 underline hover:text-gray-900"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                {/* Public Blog Link */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                        Want to view the public blog?
                    </p>
                    <Link
                        href="/blog"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
                    >
                        Visit Blog →
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
