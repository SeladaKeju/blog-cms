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
            title={
                <div className="flex flex-col space-y-1 py-1">
                    <h1 className="text-xl font-semibold text-gray-900 m-0">Editor Dashboard</h1>
                    <p className="text-sm text-gray-500 m-0">Manage your articles and content</p>
                </div>
            }
        >
            <Head title="Dashboard" />

            {/* Fixed content alignment to match header title */}
            <div className="px-6 py-6 md:px-10">
                <div className="editor-dashboard space-y-8 md:pl-16">
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
                            <Title level={3}>Your Published Articles</Title>
                        </div>

                        {posts && posts.filter(post => post.status === 'published').length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {posts
                                    .filter(post => post.status === 'published')
                                    .slice(0, 5)
                                    .map((post) => (
                                        <ArticleCard
                                            key={post.id}
                                            article={post}
                                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                                            showStatus={true}
                                            thumbnailSize="medium"  // Use standard medium size
                                            titleSize={{ level: 4, fontSize: '18px' }}
                                            excerptRows={2}
                                        />
                                    ))}
                            </div>
                        ) : (
                            <Card>
                                <div className="text-center py-16">
                                    <FileTextOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
                                    <Title level={4} className="mt-4 mb-2" type="secondary">
                                        No published articles yet
                                    </Title>
                                    <p className="text-gray-500 mb-6">
                                        Publish your first article to see it here
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