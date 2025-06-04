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
    HeartFilled,
    EditOutlined,
    SearchOutlined,
    DownOutlined  // Add this icon from Ant Design
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
            icon: <SettingOutlined className="text-gray-600" />,
            label: <span className="text-gray-700">Settings</span>,
            onClick: () => router.visit(route('profile.edit')),
            style: { padding: '10px 16px' }
        },
        {
            key: 'bookmarks',
            icon: <HeartFilled className="text-red-500" />,
            label: <span className="text-gray-700">Your bookmarks</span>,
            onClick: () => {
                try {
                    console.log('Navigating to bookmarks');
                    const bookmarksRoute = route('bookmarks.index');
                    console.log('Bookmarks route URL:', bookmarksRoute);
                    router.visit(bookmarksRoute);
                } catch (error) {
                    console.error('Navigation error:', error);
                    // Tambahkan informasi detail error
                    message.error('Failed to navigate: ' + error.message);
                }
            },
            style: { padding: '10px 16px' }
        },
        {
            type: 'divider',
            style: { margin: '4px 0' }
        },
      
        // Only show for viewers
        ...(auth.userRole === 'viewer' ? [
        ] : []),
        {
            type: 'divider',
            style: { margin: '4px 0' }
        },
        {
            key: 'logout',
            icon: <LogoutOutlined className="text-red-600" />,
            label: <span className="text-gray-700">Sign out</span>,
            onClick: handleLogout,
            style: { padding: '10px 16px' }
        }
    ];

    return (
        <Layout className="min-h-screen bg-white">
            {/* Enhanced Header with better proportions */}
            <Header 
                className="bg-white border-b border-gray-200 px-0 sticky top-0 z-50 shadow-sm" 
                style={{ 
                    height: '72px',  // Increased from 57px
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
                                <span className="text-3xl font-bold text-gray-900 tracking-tight">
                                    MyBlog
                                </span>
                            </Link>
                            
                            {/* Enhanced Search Bar */}
                            <div className="hidden md:flex items-center">
                                <Search
                                    placeholder="Search stories..."
                                    allowClear
                                    onSearch={handleSearch}
                                    style={{ 
                                        width: 280,
                                        verticalAlign: 'middle'
                                    }}
                                    size="large"
                                    className="header-search"
                                />
                            </div>
                        </div>

                        {/* Right Side Navigation - Enhanced */}
                        <div className="flex items-center gap-6">
                            {/* Write Button - Larger and more visible */}
                            {auth?.user && (
                                <Button 
                                    type="default" 
                                    icon={<EditOutlined />}
                                    onClick={handleWriteClick}
                                    className="text-gray-800 hover:text-gray-900 flex items-center gap-1 border-gray-300"
                                    style={{ 
                                        height: 'auto',
                                        padding: '8px 16px',
                                        verticalAlign: 'middle',
                                        borderRadius: '20px',
                                        fontSize: '16px'
                                    }}
                                >
                                    Write
                                </Button>
                            )}

                            {/* User Profile or Sign In - Enhanced */}
                            <div className="flex items-center">
                                {auth?.user ? (
                                    <Dropdown
                                        menu={{ items: userMenuItems }}
                                        placement="bottomRight"
                                        trigger={['click']}
                                        dropdownRender={(menu) => (
                                            <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden" style={{ width: '280px' }}>
                                                {/* User info section */}
                                                <div className="p-4 border-b border-gray-200 bg-gray-50">
                                                    <div className="flex items-center space-x-3">
                                                        <Avatar 
                                                            size={48}
                                                            icon={<UserOutlined />}
                                                            className="bg-blue-600"
                                                            style={{ border: '2px solid white' }}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                {auth.user.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">
                                                                {auth.user.email}
                                                            </p>
                                                            <p className="text-xs font-medium text-blue-600 mt-1">
                                                                {auth.userRole?.charAt(0).toUpperCase() + auth.userRole?.slice(1) || 'User'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Menu items */}
                                                <div className="py-1">
                                                    {menu}
                                                </div>
                                            </div>
                                        )}
                                    >
                                        <div className="flex items-center space-x-2 cursor-pointer px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200">
                                            <Avatar 
                                                size={40}
                                                icon={<UserOutlined />}
                                                className="bg-blue-600 transition-transform duration-200 hover:scale-105"
                                                style={{ border: '2px solid #e5e7eb' }}
                                            />
                                            <div className="hidden md:block">
                                                <span className="text-sm font-medium text-gray-700">{auth.user.name?.split(' ')[0]}</span>
                                                <DownOutlined className="h-4 w-4 text-gray-500 inline ml-1" />
                                            </div>
                                        </div>
                                    </Dropdown>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <Link href={route('login')}>
                                            <Button 
                                                type="text"
                                                className="text-gray-600 hover:text-gray-900 text-base"
                                                style={{ 
                                                    height: 'auto',
                                                    padding: '8px 16px',
                                                    verticalAlign: 'middle',
                                                    fontSize: '16px'
                                                }}
                                            >
                                                Sign in
                                            </Button>
                                        </Link>
                                        <Link href={route('register')}>
                                            <Button 
                                                type="primary"
                                                className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 rounded-full"
                                                style={{ 
                                                    height: 'auto',
                                                    padding: '10px 20px',
                                                    verticalAlign: 'middle',
                                                    fontSize: '16px',
                                                    fontWeight: 500
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