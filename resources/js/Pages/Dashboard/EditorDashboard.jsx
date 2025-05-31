import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, Typography, Row, Col, Button, Statistic } from 'antd';
import { 
    FileTextOutlined, 
    CheckCircleOutlined, 
    EditOutlined,
    BookOutlined,
    PlusOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { router } from '@inertiajs/react';
import ArticleCard from '@/Components/ArticleCard';
import EmptyState from '@/Components/EmptyState';

const { Title } = Typography;

export default function EditorDashboard({ 
    stats, 
    posts = [], 
    permissions = [] 
}) {
    // Navigation helper
    const navigateTo = (route) => router.get(route);

    return (
        <AuthenticatedLayout
            title="Editor Dashboard"
            subtitle="Manage your articles and content"
        >
            <Head title="Dashboard" />

            <div className="p-6">
                <div className="editor-dashboard space-y-8">
                    {/* Content Statistics */}
                    <div>
                        <Title level={3} className="mb-6">Your Content Overview</Title>
                        <Row gutter={[24, 24]}>
                            <Col xs={24} sm={12} lg={6}>
                                <Card>
                                    <Statistic
                                        title="Total Posts"
                                        value={stats?.total_posts || 0}
                                        prefix={<FileTextOutlined />}
                                        valueStyle={{ color: '#1677ff' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <Card>
                                    <Statistic
                                        title="Published"
                                        value={stats?.published_posts || 0}
                                        prefix={<CheckCircleOutlined />}
                                        valueStyle={{ color: '#52c41a' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <Card>
                                    <Statistic
                                        title="Drafts"
                                        value={stats?.draft_posts || 0}
                                        prefix={<EditOutlined />}
                                        valueStyle={{ color: '#fa8c16' }}
                                    />
                                </Card>
                            </Col>
                            <Col xs={24} sm={12} lg={6}>
                                <Card>
                                    <Statistic
                                        title="Total Views"
                                        value={0}
                                        prefix={<EyeOutlined />}
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
                            <Col xs={24} sm={12} md={8}>
                                <Button
                                    type="primary"
                                    block
                                    size="large"
                                    icon={<PlusOutlined />}
                                    onClick={() => navigateTo('/posts/create')}
                                >
                                    New Article
                                </Button>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Button
                                    type="default"
                                    block
                                    size="large"
                                    icon={<FileTextOutlined />}
                                    onClick={() => navigateTo('/posts')}
                                >
                                    Manage Articles
                                </Button>
                            </Col>
                            <Col xs={24} sm={12} md={8}>
                                <Button
                                    type="default"
                                    block
                                    size="large"
                                    icon={<BookOutlined />}
                                    onClick={() => window.open('/blog', '_blank')}
                                >
                                    View Blog
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {/* Recent Articles */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <Title level={3}>Your Recent Articles</Title>
                            <div className="flex gap-3">
                                <Button 
                                    icon={<EyeOutlined />}
                                    onClick={() => window.open('/blog', '_blank')}
                                >
                                    View Blog
                                </Button>
                                {permissions.includes('create-posts') && (
                                    <Button 
                                        onClick={() => navigateTo('/posts')}
                                    >
                                        Manage Articles
                                    </Button>
                                )}
                            </div>
                        </div>

                        {posts && posts.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {posts.slice(0, 5).map((post) => (
                                    <Card 
                                        key={post.id}
                                        hoverable
                                        className="cursor-pointer"
                                        onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <Title level={4} className="mb-2">
                                                    {post.title}
                                                </Title>
                                                <p className="text-gray-600 mb-4 line-clamp-2">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span>Status: <span className={`font-medium ${post.status === 'published' ? 'text-green-600' : 'text-orange-600'}`}>
                                                        {post.status}
                                                    </span></span>
                                                    <span>•</span>
                                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <Button
                                                    type="text"
                                                    icon={<EditOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigateTo(`/posts/${post.id}/edit`);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card>
                                <div className="text-center py-16">
                                    <FileTextOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
                                    <Title level={4} className="mt-4 mb-2" type="secondary">
                                        No articles yet
                                    </Title>
                                    <p className="text-gray-500 mb-6">
                                        Create your first article to get started
                                    </p>
                                    <Button 
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => navigateTo('/posts/create')}
                                    >
                                        Create Article
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}