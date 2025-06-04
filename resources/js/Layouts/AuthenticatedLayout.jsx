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
    MenuUnfoldOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { router } from '@inertiajs/react';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function AuthenticatedLayout({ 
    title = "Dashboard", 
    subtitle = "", 
    fullHeight = false,
    articleMode = false, // New prop to enable article-focused mode
    children 
}) {
    const { auth } = usePage().props;
    const user = auth.user;
    // Auto-collapse sidebar in article mode for more focus
    const [collapsed, setCollapsed] = useState(articleMode);

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
            );
        } else if (userRole === 'editor') {
            baseItems.push(
                {
                    key: 'posts',
                    icon: <FileTextOutlined />,
                    label: 'My Posts',
                    onClick: () => router.get('/posts'),
                },
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
        return baseItems;
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Conditionally show sidebar based on article mode */}
            {!articleMode ? (
                <Sider 
                    trigger={null} 
                    collapsible 
                    collapsed={collapsed}
                    collapsedWidth={collapsed ? 0 : 80}  // Set to 0 to completely hide
                    style={{
                        background: '#fff',
                        borderRight: '1px solid #f0f0f0',
                        position: collapsed ? 'fixed' : 'relative',
                        left: collapsed ? -250 : 0,  // Move completely off-screen when collapsed
                        transition: 'all 0.3s',
                        zIndex: 1000,
                        height: '100%',
                        overflow: 'hidden'
                    }}
                    className="custom-sidebar"
                >
                    {/* Regular sidebar content */}
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
            ) : (
                // Minimalist sidebar for article mode
                <Sider 
                    trigger={null} 
                    collapsible 
                    collapsed={true}
                    collapsedWidth={0}
                    zeroWidthTriggerStyle={{ display: 'none' }}
                    style={{ 
                        position: 'fixed',
                        height: '100%',
                        zIndex: 1000,
                        left: -250,  // Move it completely off-screen (not just -80px)
                        width: 0,
                        minWidth: 0,
                        maxWidth: 0,
                        overflow: 'hidden',
                        transition: 'all 0.2s',
                        display: 'none'  // Add display none for good measure
                    }}
                    className="custom-sidebar article-sidebar"
                >
                    <Menu
                        mode="inline"
                        style={{ borderRight: 0, marginTop: 16 }}
                        items={getMenuItems()}
                        className="sidebar-menu"
                    />
                </Sider>
            )}
            
            <Layout className={articleMode ? 'article-layout' : ''}>
                {/* Simplified header for article mode */}
                <Header 
                    style={{ 
                        padding: '0 24px', 
                        background: '#fff',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: articleMode ? '56px' : '64px'
                    }}
                    className={articleMode ? 'article-header' : ''}
                >
                    <div className="flex items-center gap-4">
                        {!articleMode ? (
                            // Regular toggle button
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
                        ) : (
                            // Back button for article mode
                            <Button
                                type="text"
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.get('/article')}
                                style={{
                                    fontSize: '16px',
                                }}
                            >
                                Back to Articles
                            </Button>
                        )}
                        
                        <div>
                            <h1 className={`font-semibold text-gray-900 m-0 ${articleMode ? 'text-lg' : 'text-xl'}`}>
                                {title}
                            </h1>
                            {subtitle && (
                                <Text type="secondary" className="text-sm">{subtitle}</Text>
                            )}
                        </div>
                    </div>

                    <Space size="middle">
                        {/* Simplified actions for article mode */}
                        {articleMode ? (
                            <Dropdown
                                menu={{ items: userMenuItems }}
                                placement="bottomRight"
                                arrow
                            >
                                <Avatar size="small" icon={<UserOutlined />} />
                            </Dropdown>
                        ) : (
                            <>
                                {/* Regular actions */}
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
                            </>
                        )}
                    </Space>
                </Header>
                
                {/* Optimized content area for article mode */}
                <Content
                    style={{
                        margin: 0,
                        minHeight: fullHeight ? 'calc(100vh - 64px)' : 'auto',
                        background: articleMode ? '#f8fafc' : '#f5f5f5',
                        padding: articleMode ? 0 : undefined,
                    }}
                    className={articleMode ? 'article-content' : ''}
                >
                    {children}
                </Content>
            </Layout>

            {/* Add article-specific styles */}
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

                /* Enhanced article mode styles */
                .article-layout {
                    margin-left: 0 !important;
                    width: 100% !important;
                }
                
                .article-header {
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                    z-index: 10;
                    height: auto !important;
                    padding: 0 !important;
                }
                
                .article-content {
                    max-width: 100% !important;
                    width: 100% !important;
                    overflow-x: hidden !important;
                    padding: 0 !important;
                }
                
                /* Remove max-width constraints in article mode */
                .article-layout .ProseMirror {
                    min-height: calc(100vh - 230px);
                    padding: 1.5rem;
                    max-width: none !important;
                    margin: 0 !important;
                    color: #374151;
                }
                
                .article-layout .editor-content {
                    background-color: #ffffff;
                    width: 100% !important;
                    max-width: none !important;
                }
                
                /* Make article containers full width */
                .article-layout .container,
                .article-layout .container-fluid {
                    max-width: 100% !important;
                    width: 100% !important;
                    padding: 0 !important;
                }
                
                /* Title input in article mode */
                .article-layout .article-form input[type="text"] {
                    font-size: 2.25rem;
                    font-weight: 700;
                    padding: 1rem 0;
                    line-height: 1.2;
                    max-width: 50rem;
                    margin: 0 auto;
                }
                
                /* Container width for article editing */
                .article-layout .container {
                    max-width: 1400px;
                    padding-left: 1rem;
                    padding-right: 1rem;
                }
                
                /* Better focus for editor in article mode */
                .article-layout .editor-main-container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                /* Enhanced responsive styling */
                @media (max-width: 768px) {
                    .article-layout .ProseMirror {
                        padding: 1.5rem 1rem;
                    }
                    
                    .article-layout .article-form input[type="text"] {
                        font-size: 1.75rem;
                    }
                }
            `}</style>
        </Layout>
    );
}
