import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BlogLayout from '@/Layouts/BlogLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { url } = usePage();
    const [fromBlog, setFromBlog] = useState(false);

    useEffect(() => {
        // Check if coming from blog (referrer contains /blog or url params)
        const referrer = document.referrer;
        const urlParams = new URLSearchParams(window.location.search);
        const fromParam = urlParams.get('from');
        
        // Check if coming from blog pages or has from=blog parameter
        const isBlogReferrer = referrer.includes('/blog') || fromParam === 'blog';
        setFromBlog(isBlogReferrer);
    }, []);

    const profileContent = (
        <div className="py-12">
            <div className={`mx-auto space-y-6 sm:px-6 lg:px-8 ${fromBlog ? 'max-w-4xl' : 'max-w-7xl'}`}>
                <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </div>
    );

    // If coming from blog, use BlogLayout
    if (fromBlog) {
        return (
            <BlogLayout>
                <Head title="Profile Settings" />
                
                <div className="min-h-screen bg-gray-50">
                    <div className="max-w-4xl mx-auto px-6 py-12">
                        {/* Blog-style header */}
                        <div className="mb-12">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                Profile Settings
                            </h1>
                            <p className="text-xl text-gray-600">
                                Manage your profile information and account settings
                            </p>
                        </div>

                        {/* Content with blog styling */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-xl"
                                />
                            </div>

                            <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
                                <UpdatePasswordForm className="max-w-xl" />
                            </div>

                            <div className="bg-white p-6 shadow-sm rounded-lg border border-gray-200">
                                <DeleteUserForm className="max-w-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </BlogLayout>
        );
    }

    // If coming from dashboard, use AuthenticatedLayout with sidebar
    return (
        <AuthenticatedLayout
           title={
                <div className="flex flex-col space-y-1 py-1">
                    <h1 className="text-xl font-semibold text-gray-900 m-0">Profile Settings</h1>
                    <p className="text-sm text-gray-500 m-0">Manage your profile information and settings</p>
                </div>
            }
            fullHeight={true}
        >
            <Head title="Profile" />
            {profileContent}
        </AuthenticatedLayout>
    );
}
