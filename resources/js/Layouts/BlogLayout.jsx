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
    DownOutlined,
    StarOutlined
} from '@ant-design/icons';

const { Header, Content } = Layout;
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

    // Handle write button click
    const handleWriteClick = () => {
        if (!auth?.user) {
            message.info('Please login to start writing');
            return;
        }
        
        // If user is editor or admin, go directly to dashboard
        if (auth.userRole === 'editor' || auth.userRole === 'admin') {
            router.visit(route('dashboard'));
            return;
        }

        // If user is viewer, go to application form
        if (auth.userRole === 'viewer') {
            router.visit(route('editor-application.create'));
            return;
        }

        message.info('You need to be a viewer to apply as editor');
    };

    // User dropdown menu items - Add black icons
    const userMenuItems = [
        {
            key: 'profile',
            icon: <SettingOutlined style={{ color: '#000000', fontSize: '18px' }} />, // Black icon
            label: <span className="text-gray-700 text-lg font-medium">Settings</span>, // Increased to text-lg
            onClick: () => router.visit(route('profile.edit') + '?from=blog'),
            style: { padding: '16px 24px', fontSize: '18px', minHeight: '56px' } // Larger padding and font
        },
        {
            key: 'bookmarks',
            icon: <StarOutlined style={{ color: '#000000', fontSize: '18px' }} />, // Black icon
            label: <span className="text-gray-700 text-lg font-medium">Bookmarks</span>, // Increased to text-lg
            onClick: () => {
                try {
                    console.log('Navigating to bookmarks');
                    const bookmarksRoute = route('bookmarks.index');
                    console.log('Bookmarks route URL:', bookmarksRoute);
                    router.visit(bookmarksRoute);
                } catch (error) {
                    console.error('Navigation error:', error);
                    message.error('Failed to navigate: ' + error.message);
                }
            },
            style: { padding: '16px 24px', fontSize: '18px', minHeight: '56px' } // Larger padding and font
        },
        {
            type: 'divider',
            style: { margin: '12px 0' } // Increased margin
        },
        {
            key: 'logout',
            icon: <LogoutOutlined style={{ color: '#000000', fontSize: '18px' }} />, // Black icon
            label: <span className="text-gray-700 text-lg font-medium">Sign out</span>, // Increased to text-lg
            onClick: handleLogout,
            style: { padding: '16px 24px', fontSize: '18px', minHeight: '56px' } // Larger padding and font
        }
    ];

    return (
        <Layout className="min-h-screen bg-white">
            {/* Header */}
            <Header 
                className="bg-white border-b border-gray-200 px-0 sticky top-0 z-50 shadow-sm" 
                style={{ 
                    height: '80px',
                    lineHeight: 'normal',
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <div className="w-full px-6">
                    <div className="flex justify-between items-center h-full">
                        {/* Left Side - Logo dan Search */}
                        <div className="flex items-center gap-8">
                            <Link href="/blog" className="flex items-center">
                                <span className="text-4xl font-bold text-gray-900 tracking-tight">
                                    Notionary 
                                </span>
                            </Link>
                            
                            {/* Search Bar di sebelah title */}
                            <div className="hidden md:flex items-center">
                                <Search
                                    placeholder="Search stories..."
                                    allowClear
                                    onSearch={handleSearch}
                                    style={{ 
                                        width: 320,
                                        verticalAlign: 'middle'
                                    }}
                                    size="large"
                                    className="header-search"
                                />
                            </div>
                        </div>

                        {/* Right Side - Navigation */}
                        <div className="flex items-center gap-6">
                            {/* Write Button */}
                            {auth?.user && (
                                <Button 
                                    type="text" 
                                    icon={<EditOutlined />}
                                    onClick={handleWriteClick}
                                    className="text-gray-700 hover:text-gray-900 flex items-center gap-2 font-medium"
                                    style={{ 
                                        height: 'auto',
                                        padding: '8px 0',
                                        border: 'none',
                                        background: 'transparent',
                                        fontSize: '16px'
                                    }}
                                >
                                    Write
                                </Button>
                            )}

                            {/* User Profile atau Sign In */}
                            {auth?.user ? (
                                <Dropdown
                                    menu={{ items: userMenuItems }}
                                    placement="bottomRight"
                                    trigger={['click']}
                                    dropdownRender={(menu) => (
                                        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden" style={{ width: '320px' }}>
                                            
                                            {/* Menu items with larger fonts */}
                                            <div className="py-3">
                                                {menu}
                                            </div>
                                        </div>
                                    )}
                                >
                                    {/* Keep avatar in header trigger */}
                                    <div className="flex items-center space-x-2 cursor-pointer px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200">
                                        <Avatar 
                                            size={42}
                                            icon={<UserOutlined />}
                                            className="bg-blue-600 transition-transform duration-200 hover:scale-105"
                                            style={{ border: '2px solid #e5e7eb' }}
                                        />
                                        {/* Remove user name display */}
                                    </div>
                                </Dropdown>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link href={route('login')}>
                                        <Button 
                                            type="text"
                                            className="text-gray-600 hover:text-gray-900 font-medium"
                                            style={{ 
                                                height: 'auto',
                                                padding: '8px 16px',
                                                fontSize: '16px',
                                                border: 'none'
                                            }}
                                        >
                                            Sign in
                                        </Button>
                                    </Link>
                                    <Link href={route('register')}>
                                        <Button 
                                            type="primary"
                                            className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 rounded-full font-medium"
                                            style={{ 
                                                height: 'auto',
                                                padding: '12px 24px',
                                                fontSize: '16px'
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

                {/* Mobile Search */}
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4">
                    <Search
                        placeholder="Search stories..."
                        allowClear
                        onSearch={handleSearch}
                        size="large"
                        className="w-full"
                    />
                </div>
            </Header>

            {/* Main Content - Full Space */}
            <Content className="flex-1 bg-white">
                {children}
            </Content>
        </Layout>
    );
}