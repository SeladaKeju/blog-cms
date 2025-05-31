import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Layout, Menu, Dropdown, Avatar, Button, Space, Typography } from 'antd';
import { 
    UserOutlined, 
    DashboardOutlined, 
    FileTextOutlined, 
    BookOutlined,
    TeamOutlined,
    SettingOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';
import { router } from '@inertiajs/react';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function AuthenticatedLayout({ 
    title = "Dashboard", 
    subtitle = "", 
    fullHeight = false, 
    children 
}) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [collapsed, setCollapsed] = useState(false);

    // Get user role
    const userRole = user.roles?.[0]?.name || 'viewer';
    const permissions = user.permissions || [];

    // Logout function
    const handleLogout = () => {
        router.post('/logout');
    };

    // User dropdown menu
    const userMenuItems = [
        {
            key: 'profile',
            icon: <UserOutlined />,
            label: 'Profile',
            onClick: () => router.get('/profile'),
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            onClick: () => router.get('/profile'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: handleLogout,
            danger: true,
        },
    ];

    // Navigation menu items based on role
    const getMenuItems = () => {
        const baseItems = [
            {
                key: 'dashboard',
                icon: <DashboardOutlined />,
                label: 'Dashboard',
                onClick: () => router.get('/dashboard'),
            },
        ];

        // Add role-specific menu items
        if (userRole === 'admin') {
            baseItems.push(
                {
                    key: 'users',
                    icon: <TeamOutlined />,
                    label: 'Users',
                    onClick: () => router.get('/admin/users'),
                },
                {
                    key: 'applications',
                    icon: <UserOutlined />,
                    label: 'Applications',
                    onClick: () => router.get('/admin/editor-applications'),
                },
                {
                    key: 'posts',
                    icon: <FileTextOutlined />,
                    label: 'All Posts',
                    onClick: () => router.get('/article'),
                },
                {
                    key: 'pending-posts',
                    icon: <FileTextOutlined />,
                    label: 'Pending Posts',
                    onClick: () => router.get('/admin/posts/pending'),
                }
            );
        } else if (userRole === 'editor') {
            baseItems.push(
                {
                    key: 'posts',
                    icon: <FileTextOutlined />,
                    label: 'My Posts',
                    onClick: () => router.get('/article'),
                },
                {
                    key: 'bookmarks',
                    icon: <BookOutlined />,
                    label: 'Bookmarks',
                    onClick: () => router.get('/bookmarks'),
                }
            );
        } else if (userRole === 'viewer') {
            baseItems.push(
                {
                    key: 'bookmarks',
                    icon: <BookOutlined />,
                    label: 'Bookmarks',
                    onClick: () => router.get('/bookmarks'),
                },
                {
                    key: 'apply-editor',
                    icon: <UserOutlined />,
                    label: 'Apply Editor',
                    onClick: () => router.get('/apply-editor'),
                }
            );
        }

        // Add blog link for all users
        baseItems.push({
            key: 'blog',
            icon: <BookOutlined />,
            label: 'View Blog',
            onClick: () => window.open('/blog', '_blank'),
        });

        return baseItems;
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider 
                trigger={null} 
                collapsible 
                collapsed={collapsed}
                style={{
                    background: '#fff',
                    borderRight: '1px solid #f0f0f0'
                }}
                className="custom-sidebar"
            >
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <Avatar size="large" icon={<UserOutlined />} />
                        {!collapsed && (
                            <div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500 capitalize">{userRole}</div>
                            </div>
                        )}
                    </div>
                </div>
                
                <Menu
                    mode="inline"
                    style={{ borderRight: 0, marginTop: 16 }}
                    items={getMenuItems()}
                    className="sidebar-menu"
                />
            </Sider>
            
            <Layout>
                <Header 
                    style={{ 
                        padding: '0 24px', 
                        background: '#fff',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <div className="flex items-center gap-4">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 m-0">{title}</h1>
                            {subtitle && (
                                <Text type="secondary" className="text-sm">{subtitle}</Text>
                            )}
                        </div>
                    </div>

                    <Space size="middle">
                        {/* Quick Actions based on role */}
                        {(userRole === 'admin' || userRole === 'editor') && (
                            <Button 
                                type="primary"
                                icon={<FileTextOutlined />}
                                onClick={() => router.get('/posts/create')}
                            >
                                New Post
                            </Button>
                        )}

                        {/* User Profile Dropdown */}
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomRight"
                            arrow
                        >
                            <Button type="text" className="flex items-center gap-2">
                                <Avatar size="small" icon={<UserOutlined />} />
                                <span className="hidden md:inline">{user.name}</span>
                            </Button>
                        </Dropdown>
                    </Space>
                </Header>
                
                <Content
                    style={{
                        margin: 0,
                        minHeight: fullHeight ? 'calc(100vh - 64px)' : 'auto',
                        background: '#f5f5f5',
                    }}
                >
                    {children}
                </Content>
            </Layout>

            {/* Simple Modern Hover - Garis Kanan Only */}
            <style jsx global>{`
                /* Base Menu Item - Clean & Simple */
                .custom-sidebar .sidebar-menu .ant-menu-item {
                    @apply relative mx-2 mb-1 transition-all duration-200 ease-out;
                    border-radius: 8px !important;
                    height: 44px !important;
                    line-height: 44px !important;
                    padding: 0 16px !important;
                    margin-bottom: 4px !important;
                    color: #6b7280 !important;
                    background: transparent !important;
                    border: none !important;
                    outline: none !important;
                }

                /* Hover - Simple Background + Garis Kanan */
                .custom-sidebar .sidebar-menu .ant-menu-item:hover {
                    @apply bg-gray-50;
                    transform: translateX(2px);
                }

                /* Garis Kanan saat Hover - Smooth Animation */
                .custom-sidebar .sidebar-menu .ant-menu-item::after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translateY(-50%) scaleY(0);
                    width: 3px;
                    height: 70%;
                    background: #1677ff;
                    border-radius: 2px 0 0 2px;
                    transition: transform 0.2s ease-out;
                    transform-origin: center;
                }

                .custom-sidebar .sidebar-menu .ant-menu-item:hover::after {
                    transform: translateY(-50%) scaleY(1);
                }

                /* Active/Selected State */
                .custom-sidebar .sidebar-menu .ant-menu-item-selected {
                    @apply bg-blue-50;
                    color: #1677ff !important;
                    font-weight: 500 !important;
                }

                .custom-sidebar .sidebar-menu .ant-menu-item-selected::after {
                    transform: translateY(-50%) scaleY(1) !important;
                    background: #1677ff !important;
                    width: 4px !important;
                }

                /* Icon Styling */
                .custom-sidebar .sidebar-menu .ant-menu-item .anticon {
                    color: #9ca3af !important;
                    font-size: 16px !important;
                    transition: color 0.2s ease-out;
                }

                .custom-sidebar .sidebar-menu .ant-menu-item:hover .anticon {
                    color: #1677ff !important;
                }

                .custom-sidebar .sidebar-menu .ant-menu-item-selected .anticon {
                    color: #1677ff !important;
                }

                /* Text Styling */
                .custom-sidebar .sidebar-menu .ant-menu-item .ant-menu-title-content {
                    transition: color 0.2s ease-out;
                }

                .custom-sidebar .sidebar-menu .ant-menu-item:hover .ant-menu-title-content {
                    color: #1677ff !important;
                }

                .custom-sidebar .sidebar-menu .ant-menu-item-selected .ant-menu-title-content {
                    color: #1677ff !important;
                }

                /* Collapsed State */
                .custom-sidebar.ant-layout-sider-collapsed .sidebar-menu .ant-menu-item {
                    @apply justify-center;
                    padding: 0 !important;
                }

                /* Focus State - Remove Outline */
                .custom-sidebar .sidebar-menu .ant-menu-item:focus {
                    outline: none !important;
                    box-shadow: none !important;
                }

                .custom-sidebar .sidebar-menu .ant-menu-item:focus-visible {
                    @apply bg-gray-50;
                }

                .custom-sidebar .sidebar-menu .ant-menu-item:focus-visible::after {
                    transform: translateY(-50%) scaleY(1);
                }

                /* Remove Default Ant Design Styles */
                .custom-sidebar .sidebar-menu .ant-menu-item:active {
                    background: transparent !important;
                }

                .custom-sidebar .sidebar-menu .ant-menu-item-selected:hover {
                    @apply bg-blue-50;
                }

                /* Clean up any default borders/outlines */
                .custom-sidebar .sidebar-menu {
                    border-right: none !important;
                }

                .custom-sidebar .sidebar-menu .ant-menu-item,
                .custom-sidebar .sidebar-menu .ant-menu-item:hover,
                .custom-sidebar .sidebar-menu .ant-menu-item:focus,
                .custom-sidebar .sidebar-menu .ant-menu-item:active,
                .custom-sidebar .sidebar-menu .ant-menu-item-selected {
                    border: none !important;
                    outline: none !important;
                    box-shadow: none !important;
                }
            `}</style>
        </Layout>
    );
}
