import React from 'react';
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
                                title="Bookmarks"
                                value={stats?.total_bookmarks || 0}
                                prefix={<BookOutlined />}
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
                            onClick={() => navigateTo('/article')}
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
                            onClick={() => navigateTo('/bookmarks')}
                        >
                            My Bookmarks
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
                                onClick={() => navigateTo('/article')}
                            >
                                Manage Articles
                            </Button>
                        )}
                    </div>
                </div>

                {posts && posts.length > 0 ? (
                    <div className="space-y-6">
                        {posts.slice(0, 5).map((article) => (
                            <ArticleCard
                                key={article.id}
                                article={article}
                                onClick={() => window.open(`/blog/${article.slug}`, '_blank')}
                                showStatus={true}
                                actionButtons={permissions.includes('create-posts') ? [
                                    <Button
                                        key="edit"
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigateTo(`/posts/${article.id}/edit`);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                ] : []}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<FileTextOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
                        title="No articles yet"
                        description="Create your first article to get started"
                        buttonText="Create Article"
                        buttonIcon={<PlusOutlined />}
                        onButtonClick={() => navigateTo('/posts/create')}
                    />
                )}
            </div>
        </div>
    );
}