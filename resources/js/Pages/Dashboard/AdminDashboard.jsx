import React from 'react';
import { Card, Typography, Row, Col, Button, Statistic } from 'antd';
import { 
    UserOutlined, 
    FileTextOutlined, 
    ClockCircleOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { router } from '@inertiajs/react';

const { Title } = Typography;

export default function AdminDashboard({ 
    stats, 
    recentApplications = [], 
    pendingPosts = [] 
}) {
    // Navigation helper
    const navigateTo = (route) => router.get(route);

    return (
        <div className="admin-dashboard space-y-8">
            {/* Platform Statistics */}
            <div>
                <Title level={3} className="mb-6">Platform Overview</Title>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Total Users"
                                value={stats?.total_users || 0}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: '#1677ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Total Posts"
                                value={stats?.total_posts || 0}
                                prefix={<FileTextOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Pending Review"
                                value={stats?.pending_posts || 0}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: '#fa8c16' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Editor Applications"
                                value={stats?.pending_applications || 0}
                                prefix={<TeamOutlined />}
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* Quick Actions */}
            <div>
                <Title level={3} className="mb-6">Quick Actions</Title>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Button
                            type="default"
                            block
                            size="large"
                            icon={<UserOutlined />}
                            onClick={() => navigateTo('/admin/users')}
                        >
                            Manage Users
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Button
                            type="default"
                            block
                            size="large"
                            icon={<ClockCircleOutlined />}
                            onClick={() => navigateTo('/admin/posts/pending')}
                        >
                            Review Posts
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Button
                            type="default"
                            block
                            size="large"
                            icon={<TeamOutlined />}
                            onClick={() => navigateTo('/admin/editor-applications')}
                        >
                            Applications
                        </Button>
                    </Col>
                </Row>
            </div>

            {/* Recent Activities */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card title="Pending Applications">
                        {recentApplications.length > 0 ? (
                            <div className="space-y-4">
                                {recentApplications.map(app => (
                                    <div key={app.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <div>
                                            <div className="font-medium">{app.user?.name}</div>
                                            <div className="text-sm text-gray-500">{app.user?.email}</div>
                                        </div>
                                        <Button 
                                            size="small" 
                                            onClick={() => navigateTo(`/admin/editor-applications/${app.id}`)}
                                        >
                                            Review
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">No pending applications</div>
                        )}
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title="Pending Posts">
                        {pendingPosts.length > 0 ? (
                            <div className="space-y-4">
                                {pendingPosts.map(post => (
                                    <div key={post.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                        <div>
                                            <div className="font-medium truncate">{post.title}</div>
                                            <div className="text-sm text-gray-500">by {post.author?.name}</div>
                                        </div>
                                        <Button 
                                            size="small" 
                                            onClick={() => navigateTo(`/posts/${post.id}/edit`)}
                                        >
                                            Review
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">No posts pending review</div>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
}