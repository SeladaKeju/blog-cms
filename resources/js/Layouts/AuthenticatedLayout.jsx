import { Layout, Menu, Button, Dropdown, Space } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined, FileTextOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

const { Header, Sider, Content } = Layout;

export default function AuthenticatedLayout({ children }) {
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

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider 
                trigger={null} 
                collapsible 
                collapsed={collapsed}
                theme="light"
                width={280}
                collapsedWidth={80}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)',
                }}
            >
                <div className="p-6 mb-4">
                    <h2 className={`text-gray-800 font-bold ${collapsed ? 'text-sm' : 'text-3xl'}`}>
                        YOURLOGO
                    </h2>
                </div>
                
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[route().current()]}
                    items={[
                        {
                            key: 'dashboard',
                            icon: <DashboardOutlined />,
                            label: <Link 
                                href={route("dashboard")}
                                className="hover:text-blue-500 transition-colors"
                                style={{ fontSize: '16px' }}
                            >
                                Dashboard
                            </Link>,
                        },
                        {
                            key: 'article',
                            icon: <FileTextOutlined />,
                            label: <Link 
                                href={route("article")}
                                className="hover:text-blue-500 transition-colors"
                                style={{ fontSize: '16px' }}
                            >
                                New Article
                            </Link>,
                        },
                    ]}
                    style={{
                        '.ant-menu-item': {
                            height: '60px',
                            lineHeight: '60px',
                            fontSize: '18px',
                            margin: 0,
                            padding: '0 24px',
                        },
                        '.ant-menu-item-icon': {
                            fontSize: '20px',
                        },
                        '.ant-menu-item-selected': {
                            backgroundColor: '#f0f2f5',
                        }
                    }}
                />
            </Sider>

            <Layout style={{ 
                marginLeft: collapsed ? 80 : 200,  // Update this line to match new width
                transition: 'all 0.2s' 
            }}>
                <Header style={{ padding: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: '16px', width: 64, height: 64 }}
                    />
                    
                    <Space style={{ marginRight: 24 }}>
                        <Dropdown
                            menu={{ items: userMenuItems }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button type="text" icon={<UserOutlined />}>
                                {user.name}
                            </Button>
                        </Dropdown>
                    </Space>
                </Header>

                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
