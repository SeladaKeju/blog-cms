import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// Import role-specific dashboards
import AdminDashboard from './AdminDashboard';
import EditorDashboard from './EditorDashboard';

export default function Dashboard(props) {
    const { userRole } = props;

    // Get dashboard configuration (hanya admin dan editor)
    const getDashboardConfig = () => {
        const configs = {
            admin: {
                title: 'Admin Dashboard',
                subtitle: 'Manage your blog platform'
            },
            editor: {
                title: 'Editor Dashboard', 
                subtitle: 'Create and manage your content'
            },
        };
        return configs[userRole] || configs.editor;
    };

    // Route to appropriate dashboard (hanya admin dan editor)
    const renderDashboard = () => {
        switch (userRole) {
            case 'admin':
                return <AdminDashboard {...props} />;
            case 'editor':
                return <EditorDashboard {...props} />;
            default:
                // Viewer tidak seharusnya sampai ke sini
                return (
                    <div className="text-center py-16">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Access Denied
                        </h3>
                        <p className="text-gray-600 mb-4">
                            You don't have permission to access this dashboard.
                        </p>
                        <a 
                            href="/blog" 
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Visit Blog →
                        </a>
                    </div>
                );
        }
    };

    const config = getDashboardConfig();

    return (
        <AuthenticatedLayout
            title={config.title}
            subtitle={config.subtitle}
            fullHeight={true}
        >
            <Head title="Dashboard" />
            
            <div className="h-full overflow-auto bg-gray-50">
                <div className="p-8 space-y-8">
                    {renderDashboard()}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}