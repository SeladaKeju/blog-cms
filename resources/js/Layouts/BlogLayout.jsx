import { useState } from 'react';
import { Layout, Menu, Button, Space, Dropdown, message, Avatar } from 'antd';
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
    EditOutlined
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

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

    // Handle editor application
    const handleEditorApplicationClick = () => {
        if (!auth?.user) {
            message.info('Please login to apply as editor');
            return;
        }
        message.success('Editor application feature will be implemented');
    };

    // User dropdown menu items for authenticated users
    const userMenuItems = [
        {
            key: 'profile',
            icon: <SettingOutlined />,
            label: 'Edit Profile',
            onClick: () => router.get(route('profile.edit'))
        },
        ...(auth?.canBookmark ? [{
            key: 'bookmarks',
            icon: <HeartOutlined />,
            label: 'My Bookmarks',
            onClick: () => message.info('Bookmarks page will be implemented')
        }] : []),
        ...(auth?.canApplyEditor && auth?.userRole === 'viewer' ? [{
            key: 'apply-editor',
            icon: <EditOutlined />,
            label: 'Apply as Editor',
            onClick: handleEditorApplicationClick
        }] : []),
        ...(auth?.userRole === 'admin' || auth?.userRole === 'editor' ? [{
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => router.get(route('dashboard'))
        }] : []),
        {
            type: 'divider'
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: handleLogout,
            danger: true
        }
    ];

    // Guest dropdown menu items
    const guestMenuItems = [
        {
            key: 'login',
            icon: <LoginOutlined />,
            label: 'Login',
            onClick: () => router.get(route('login'))
        }
    ];

    // Main menu items
    const menuItems = [
        {
            key: 'blog',
            icon: <HomeOutlined />,
            label: <Link href="/blog">Blog</Link>
        }
    ];

    return (
        <Layout className="min-h-screen bg-gray-50">
            <Header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-8">
                <div className="flex justify-between items-center h-full max-w-7xl mx-auto">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/blog" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">B</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 hidden sm:block">
                                Blog CMS
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <Menu
                            mode="horizontal"
                            items={menuItems}
                            className="border-none bg-transparent"
                            style={{ lineHeight: '64px' }}
                        />

                        {/* User Profile Dropdown - Always visible */}
                        <Dropdown
                            menu={{ 
                                items: auth?.user ? userMenuItems : guestMenuItems 
                            }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button 
                                type="text"
                                className="flex items-center space-x-2 h-10 px-3 hover:bg-gray-50 rounded-lg"
                            >
                                <Avatar 
                                    size="small" 
                                    icon={<UserOutlined />}
                                    className="bg-blue-600"
                                />
                                <span className="text-gray-700 font-medium">
                                    {auth?.user ? auth.user.name : 'Guest'}
                                </span>
                            </Button>
                        </Dropdown>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <Dropdown
                            menu={{
                                items: [
                                    ...menuItems,
                                    { type: 'divider' },
                                    ...(auth?.user ? userMenuItems : guestMenuItems)
                                ]
                            }}
                            trigger={['click']}
                            placement="bottomRight"
                        >
                            <Button icon={<MenuOutlined />} />
                        </Dropdown>
                    </div>
                </div>
            </Header>

            <Content className="flex-1">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
                    {children}
                </div>
            </Content>

            <Footer className="bg-gray-800 text-gray-300">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Blog CMS</h3>
                            <p className="text-gray-400">
                                A modern content management system for bloggers and content creators.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                                        Blog
                                    </Link>
                                </li>
                                {!auth?.user && (
                                    <li>
                                        <Link href={route('login')} className="text-gray-400 hover:text-white transition-colors">
                                            Login
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-4">Features</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>Rich Content Editor</li>
                                <li>SEO Optimization</li>
                                <li>User Management</li>
                                <li>Role-based Access</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 pt-4 text-center text-gray-400">
                        <p>&copy; 2024 Blog CMS. All rights reserved.</p>
                    </div>
                </div>
            </Footer>
        </Layout>
    );
}