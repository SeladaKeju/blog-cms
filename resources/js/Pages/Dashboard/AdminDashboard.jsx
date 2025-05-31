import React from 'react';
import { Card, Row, Col, Statistic, Table, Typography, Button, Space, Tag, Avatar, message, Modal } from 'antd';
import { Link, router } from '@inertiajs/react';
import { 
    UserOutlined, 
    FileTextOutlined, 
    ClockCircleOutlined,
    CheckCircleOutlined,
    EyeOutlined,
    TeamOutlined,
    EditOutlined,
    BellOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

export default function AdminDashboard({ 
    stats, 
    recentApplications = [], 
    pendingPosts = [],
    recentUsers = [],
    recentPosts = []
}) {
    // Navigation helper
    const navigateTo = (route) => router.get(route);

    // Handle application approval
    const handleApproveApplication = async (applicationId) => {
        try {
            const response = await fetch(route('admin.editor-applications.quick-approve', applicationId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                credentials: 'same-origin'
            });

            const data = await response.json();

            if (data.success) {
                message.success('Application approved!');
                // Refresh dashboard stats
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                throw new Error(data.error || 'Failed to approve');
            }
        } catch (error) {
            message.error('Failed to approve: ' + error.message);
        }
    };

    // Handle application rejection
    const handleRejectApplication = (applicationId) => {
        Modal.confirm({
            title: 'Quick Reject',
            content: 'Reject this editor application?',
            onOk() {
                router.post(route('admin.editor-applications.reject', applicationId), {
                    rejection_reason: 'Rejected from dashboard'
                }, {
                    onSuccess: () => {
                        message.success('Application rejected!');
                        window.location.reload(); // Simple refresh
                    },
                    onError: () => {
                        message.error('Failed to reject');
                    }
                });
            }
        });
    };

    // Pending applications table columns
    const applicationColumns = [
        {
            title: 'Applicant',
            dataIndex: 'user',
            key: 'user',
            render: (user) => (
                <div className="flex items-center gap-2">
                    <Avatar size="small" icon={<UserOutlined />} />
                    <div>
                        <div className="font-medium">{user?.name}</div>
                        <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Applied',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => (
                <div className="text-sm">
                    {new Date(date).toLocaleDateString()}
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color="orange" icon={<ClockCircleOutlined />}>
                    PENDING
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => router.get(route('admin.editor-applications.show', record.id))}
                    >
                        View
                    </Button>
                    <Button
                        type="primary"
                        size="small"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleApproveApplication(record.id)}
                    >
                        Approve
                    </Button>
                    <Button
                        danger
                        size="small"
                        icon={<CloseCircleOutlined />}
                        onClick={() => handleRejectApplication(record.id)}
                    >
                        Reject
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Users"
                            value={stats?.totalUsers || stats?.total_users || 0}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#1677ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Total Posts"
                            value={stats?.totalPosts || stats?.total_posts || 0}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Pending Applications"
                            value={stats?.pendingApplications || stats?.pending_applications || 0}
                            prefix={<BellOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Statistic
                            title="Active Editors"
                            value={stats?.activeEditors || stats?.active_editors || 0}
                            prefix={<EditOutlined />}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Quick Actions */}
            <Card title="Quick Actions">
                <Space wrap>
                    <Button 
                        type="primary" 
                        icon={<TeamOutlined />}
                        onClick={() => navigateTo('/admin/users')}
                    >
                        Manage Users
                    </Button>
                    <Button 
                        icon={<BellOutlined />}
                        onClick={() => navigateTo('/admin/editor-applications')}
                    >
                        Review Applications
                        {(stats?.pendingApplications || stats?.pending_applications) > 0 && (
                            <span className="ml-1 bg-red-500 text-white text-xs px-1 rounded-full">
                                {stats?.pendingApplications || stats?.pending_applications}
                            </span>
                        )}
                    </Button>
                    <Button 
                        icon={<FileTextOutlined />}
                        onClick={() => navigateTo('/posts')}
                    >
                        View All Posts
                    </Button>
                    <Button 
                        icon={<ClockCircleOutlined />}
                        onClick={() => navigateTo('/posts/create')}
                    >
                        Create New Post
                    </Button>
                </Space>
            </Card>

            <Row gutter={[16, 16]}>
                {/* Pending Editor Applications */}
                <Col xs={24} lg={12}>
                    <Card 
                        title={
                            <div className="flex items-center justify-between">
                                <span>Pending Editor Applications</span>
                                {(stats?.pendingApplications || stats?.pending_applications) > 0 && (
                                    <Tag color="orange">{stats?.pendingApplications || stats?.pending_applications} pending</Tag>
                                )}
                            </div>
                        }
                        extra={
                            <Button 
                                type="link" 
                                size="small"
                                onClick={() => navigateTo('/admin/editor-applications')}
                            >
                                View All
                            </Button>
                        }
                    >
                        {recentApplications && recentApplications.length > 0 ? (
                            <Table
                                columns={applicationColumns}
                                dataSource={recentApplications}
                                pagination={false}
                                size="small"
                                rowKey="id"
                            />
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <BellOutlined className="text-2xl mb-2" />
                                <div>No pending applications</div>
                            </div>
                        )}
                    </Card>
                </Col>

                {/* Recent Users */}
                <Col xs={24} lg={12}>
                    <Card 
                        title="Recent Users"
                        extra={
                            <Button 
                                type="link" 
                                size="small"
                                onClick={() => navigateTo('/admin/users')}
                            >
                                View All
                            </Button>
                        }
                    >
                        {recentUsers && recentUsers.length > 0 ? (
                            <div className="space-y-3">
                                {recentUsers.slice(0, 5).map((user) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Avatar size="small" icon={<UserOutlined />} />
                                            <div>
                                                <div className="font-medium text-sm">{user.name}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <TeamOutlined className="text-2xl mb-2" />
                                <div>No recent users</div>
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Recent Posts */}
            <Card 
                title="Recent Posts"
                extra={
                    <Button 
                        type="link" 
                        size="small"
                        onClick={() => navigateTo('/posts')}
                    >
                        View All
                    </Button>
                }
            >
                {recentPosts && recentPosts.length > 0 ? (
                    <div className="space-y-3">
                        {recentPosts.slice(0, 5).map((post) => (
                            <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div>
                                    <div className="font-medium">{post.title}</div>
                                    <div className="text-sm text-gray-500">
                                        By {post.author?.name || 'Unknown'} • {new Date(post.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <Tag color={post.status === 'published' ? 'green' : 'orange'}>
                                    {post.status}
                                </Tag>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <FileTextOutlined className="text-2xl mb-2" />
                        <div>No recent posts</div>
                    </div>
                )}
            </Card>
        </div>
    );
}