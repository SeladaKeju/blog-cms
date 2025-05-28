import { Layout, Menu, Button, Dropdown, Space } from 'antd';
import { 
    MenuFoldOutlined, 
    MenuUnfoldOutlined, 
    DashboardOutlined, 
    FileTextOutlined, 
    UserOutlined, 
    LogoutOutlined 
} from '@ant-design/icons';
import { Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";

const { Header, Sider, Content } = Layout;

export default function AuthenticatedLayout({ children, fullHeight = false, title, subtitle }) {
    const user = usePage().props.auth.user;
    const [collapsed, setCollapsed] = useState(false);

    const userMenuItems = [
        {
            key: 'profile',
            label: <Link href={route("profile.edit")}>Profile</Link>,
            icon: <UserOutlined />
        },
        {
            key: 'logout',
            label: (
                <Link href={route("logout")} method="post" as="button">
                    Log Out
                </Link>
            ),
            icon: <LogoutOutlined />
        }
    ];

    // Custom styles for sidebar menu
    const menuStyle = {
        border: 'none',
        padding: '8px 0',
    };

    // Custom CSS class untuk menu items dengan right border indicator
    const menuItemClass = `
        .ant-menu-item {
            position: relative;
            margin: 0;
            padding-left: 24px !important;
            transition: all 0.2s;
        }
        
        .ant-menu-item::after {
            content: '';
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 0;
            background-color: #1890ff;
            transition: width 0.2s;
        }
        
        .ant-menu-item:hover::after {
            width: 3px;
        }
        
        .ant-menu-item-selected::after {
            width: 3px;
            background-color: #1890ff;
        }
        
        .ant-menu-item:hover {
            background-color: rgba(0, 0, 0, 0.03);
        }
        
        .ant-menu-item-selected {
            background-color: rgba(24, 144, 255, 0.1) !important;
        }
    `;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Inject custom CSS */}
            <style>{menuItemClass}</style>
            
            {/* Sidebar - Disederhanakan */}
            <Sider 
                trigger={null} 
                collapsible 
                collapsed={collapsed}
                theme="light"
                width={250}
                collapsedWidth={0}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    boxShadow: collapsed ? 'none' : '0 0 10px rgba(0,0,0,0.05)',
                    zIndex: 999,
                }}
            >
                {/* Logo Area */}
                <div className="p-4 text-center border-b border-gray-100">
                    <h2 className="text-gray-800 font-bold text-xl">
                        MY BLOG CMS
                    </h2>
                </div>
                
                {/* Navigation Menu - Dengan hover effect sederhana */}
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[route().current()]}
                    style={menuStyle}
                    items={[
                        {
                            key: 'dashboard',
                            icon: <DashboardOutlined />,
                            label: <Link href={route("dashboard")}>Dashboard</Link>,
                        },
                        {
                            key: 'article',
                            icon: <FileTextOutlined />,
                            label: <span 
                                onClick={() => router.get(route('article'), {}, {
                                    preserveState: false,
                                    replace: true,
                                })}
                                className="cursor-pointer"
                            >
                                Articles
                            </span>,
                        },
                    ]}
                />
            </Sider>

            {/* Main Layout */}
            <Layout style={{ 
                marginLeft: collapsed ? 0 : 250,
                transition: 'margin 0.2s',
                minHeight: '100vh'
            }}>
                {/* Header - Disederhanakan */}
                <Header style={{ 
                    padding: '0 16px', 
                    background: '#fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    height: '60px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 998,
                }}>
                    <div className="flex items-center gap-3">
                        {/* Toggle Button */}
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ fontSize: '16px' }}
                        />
                        
                        {/* Page Title */}
                        {title && (
                            <div>
                                <h1 className="text-lg font-medium m-0">{title}</h1>
                                {subtitle && (
                                    <p className="text-xs text-gray-500 m-0">{subtitle}</p>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {/* User Menu */}
                    <Dropdown
                        menu={{ items: userMenuItems }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <Button type="text">
                            <Space>
                                <UserOutlined />
                                <span>{user.name}</span>
                            </Space>
                        </Button>
                    </Dropdown>
                </Header>

                {/* Content Area */}
                <Content style={{ 
                    padding: '20px',
                    backgroundColor: '#f5f7fa',
                    minHeight: 'calc(100vh - 60px)'
                }}>
                    <div className="bg-white p-6 rounded-md shadow-sm">
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
