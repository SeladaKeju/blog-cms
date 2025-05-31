import { useState } from 'react';
import { Layout, Menu, Button, Space, Dropdown, message, Avatar, Input } from 'antd';
import { Link, router, usePage } from '@inertiajs/react';
import { 
    HomeOutlined, 
    LoginOutlined, 
    UserOutlined,
    LogoutOutlined,
    DashboardOutlined,
    MenuOutlined,
    SettingOutlined,
    HeartOutlined,
    EditOutlined,
    SearchOutlined
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Search } = Input;

export default function BlogLayout({ children }) {
    const { props } = usePage();
    const auth = props.auth || {};

    // Handle logout
    const handleLogout = () => {
        router.post(route('logout'), {}, {
            onSuccess: () => {
                message.success('Logged out successfully!');
            },
            onError: () => {
                message.error('Failed to logout. Please try again.');
            }
        });
    };

    // Handle search
    const handleSearch = (value) => {
        if (value.trim()) {
            router.get('/blog', { search: value }, { preserveState: true });
        } else {
            router.get('/blog', {}, { preserveState: true });
        }
    };

    // Handle write button click - Fixed for editor
    const handleWriteClick = () => {
        if (!auth?.user) {
            message.info('Please login to start writing');
            return;
        }
        
        // If user is editor or admin, go directly to dashboard
        if (auth.userRole === 'editor' || auth.userRole === 'admin') {
            router.visit(route('dashboard')); // Use router.visit instead of window.location
            return;
        }

        // If user is viewer, go to application form
        if (auth.userRole === 'viewer') {
            router.visit(route('editor-application.create'));
            return;
        }

        message.info('You need to be a viewer to apply as editor');
    };

    // User dropdown menu items
    const userMenuItems = [
        {
            key: 'profile',
            icon: <SettingOutlined />,
            label: 'Settings',
            onClick: () => router.visit(route('profile.edit'))
        },
        {
            key: 'bookmarks',
            icon: <HeartOutlined />,
            label: 'Your library',
            onClick: () => router.visit(route('profile.bookmarks'))
        },
        // Show different menu item based on role
        ...(auth?.userRole === 'viewer' ? [{
            key: 'apply-editor',
            icon: <EditOutlined />,
            label: 'Apply to Write',
            onClick: () => router.visit(route('editor-application.create'))
        }] : []),
        ...(auth?.userRole === 'admin' || auth?.userRole === 'editor' ? [{
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => router.visit(route('dashboard'))
        }] : []),
        {
            type: 'divider'
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Sign out',
            onClick: handleLogout
        }
    ];

    return (
        <Layout className="min-h-screen bg-white">
            {/* Medium-style Header */}
            <Header 
                className="bg-white border-b border-gray-200 px-0" 
                style={{ 
                    height: '57px',
                    lineHeight: 'normal',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <div className="max-w-6xl mx-auto px-6 w-full">
                    <div className="flex justify-between items-center h-full">
                        {/* Left Side - Logo and Search */}
                        <div className="flex items-center gap-8">
                            <Link href="/blog" className="flex items-center">
                                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                                    Blog
                                </span>
                            </Link>
                            
                            {/* Search Bar */}
                            <div className="hidden md:flex items-center">
                                <Search
                                    placeholder="Search"
                                    allowClear
                                    onSearch={handleSearch}
                                    style={{ 
                                        width: 240,
                                        verticalAlign: 'middle'
                                    }}
                                    size="middle"
                                />
                            </div>
                        </div>

                        {/* Right Side Navigation */}
                        <div className="flex items-center gap-6">
                            {/* Write Button - Single unified button */}
                            {auth?.user && (
                                <Button 
                                    type="text" 
                                    icon={<EditOutlined />}
                                    onClick={handleWriteClick}
                                    className="text-gray-600 hover:text-gray-900 flex items-center gap-1"
                                    style={{ 
                                        height: 'auto',
                                        padding: '4px 8px',
                                        verticalAlign: 'middle'
                                    }}
                                >
                                    Write
                                </Button>
                            )}

                            {/* User Profile or Sign In */}
                            <div className="flex items-center">
                                {auth?.user ? (
                                    <Dropdown
                                        menu={{ items: userMenuItems }}
                                        placement="bottomRight"
                                        trigger={['click']}
                                    >
                                        <Avatar 
                                            size={32}
                                            icon={<UserOutlined />}
                                            className="bg-blue-600 cursor-pointer"
                                            style={{ border: '1px solid #e5e7eb' }}
                                        />
                                    </Dropdown>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <Link href={route('login')}>
                                            <Button 
                                                type="text"
                                                className="text-gray-600 hover:text-gray-900"
                                                style={{ 
                                                    height: 'auto',
                                                    padding: '4px 8px',
                                                    verticalAlign: 'middle'
                                                }}
                                            >
                                                Sign in
                                            </Button>
                                        </Link>
                                        <Link href={route('register')}>
                                            <Button 
                                                type="primary"
                                                className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 rounded-full px-4"
                                                style={{ 
                                                    height: 'auto',
                                                    padding: '6px 16px',
                                                    verticalAlign: 'middle'
                                                }}
                                            >
                                                Get started
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Header>

            {/* Main Content */}
            <Content className="flex-1 bg-white">
                {children}
            </Content>

            {/* Footer */}
            <Footer className="bg-gray-50 border-t border-gray-200 py-12">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Help</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                                <li><a href="#" className="hover:text-gray-900">Contact us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">About</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-gray-900">About us</a></li>
                                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-gray-900">Terms</a></li>
                                <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3">Connect</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><a href="#" className="hover:text-gray-900">Twitter</a></li>
                                <li><a href="#" className="hover:text-gray-900">LinkedIn</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-500">
                            © 2024 Blog CMS. All rights reserved.
                        </p>
                    </div>
                </div>
            </Footer>
        </Layout>
    );
}