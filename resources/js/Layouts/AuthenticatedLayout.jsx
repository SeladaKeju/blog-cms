import { Layout, Menu, Button, Dropdown, Space } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined, FileTextOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
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

    return (
        <Layout style={{ minHeight: '100vh', height: fullHeight ? '100vh' : 'auto' }}>
            <Sider 
                trigger={null} 
                collapsible 
                collapsed={collapsed}
                theme="light"
                width={280}
                collapsedWidth={0}
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    boxShadow: collapsed ? 'none' : '2px 0 8px 0 rgba(29,35,41,.05)',
                    transition: 'all 0.2s',
                }}
            >
                <div className="p-6 mb-4">
                    <h2 className="text-gray-800 font-bold text-3xl">
                        YOURLOGO
                    </h2>
                </div>
                
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[route().current()]}
                    style={{
                        border: 'none',
                        fontSize: '17px'
                    }}
                    items={[
                        {
                            key: 'dashboard',
                            icon: <DashboardOutlined />,
                            label: <Link 
                                href={route("dashboard")}
                                className="hover:#4169e1 transition-colors"
                                style={{ fontSize: '17px', fontWeight: 'bold' }}
                            >
                                Dashboard
                            </Link>,
                            style: { marginBottom: '8px', height: '48px' }
                        },
                        {
                            key: 'article',
                            icon: <FileTextOutlined />,
                            label: <span 
                                onClick={() => {
                                    router.get(route('article'), {}, {
                                        preserveState: false,
                                        replace: true,
                                    });
                                }}
                                className="hover:#4169e1 transition-colors cursor-pointer"
                                style={{ fontSize: '17px', fontWeight: 'bold' }}
                            >
                                Articles
                            </span>,
                            style: { marginBottom: '8px', height: '48px' }
                        },
                    ]}
                />
            </Sider>

            <Layout style={{ 
                marginLeft: collapsed ? 0 : 280,
                transition: 'all 0.2s',
                height: fullHeight ? '100vh' : 'auto',
                display: fullHeight ? 'flex' : 'block',
                flexDirection: fullHeight ? 'column' : 'initial'
            }}>
                <Header style={{ 
                    padding: '0', 
                    background: '#fff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px 0 rgba(29,35,41,.05)',
                    flexShrink: fullHeight ? 0 : 'initial',
                    height: '80px',
                    paddingBottom: '0px'
                }}>
                    <div className="flex items-end gap-4 px-8">
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{ fontSize: '16px', width: 64, height: 64 }}
                        />
                        {title && (
                            <div className="pb-1">
                                <h1 className="text-2xl font-bold mb-0" style={{ color: '#4169e1' }}>{title}</h1>
                                {subtitle && (
                                    <p className="text-base text-gray-500 mb-0">{subtitle}</p>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <Space style={{ marginRight: 32, alignSelf: 'flex-end', paddingBottom: '12px' }}>
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

                <Content style={{ 
                    margin: fullHeight ? 0 : '24px 16px', 
                    padding: fullHeight ? 0 : 24, 
                    minHeight: 280,
                    flex: fullHeight ? 1 : 'initial',
                    overflow: fullHeight ? 'hidden' : 'initial'
                }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
