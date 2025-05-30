import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, Typography, Row, Col, Button, Statistic, Table, Tag, Space, Alert } from 'antd';
import { 
    UserOutlined, 
    FileTextOutlined, 
    CheckCircleOutlined, 
    ClockCircleOutlined,
    PlusOutlined,
    EyeOutlined,
    EditOutlined,
    TeamOutlined,
    BookOutlined
} from '@ant-design/icons';
import { router } from '@inertiajs/react';
import ArticleCard from '@/Components/ArticleCard';
import EmptyState from '@/Components/EmptyState';

const { Title, Text } = Typography;

export default function Dashboard({ 
    user,
    userRole,
    permissions,
    stats,
    posts = [],
    recentApplications = [],
    pendingPosts = [],
    recentBookmarks = [],
    applicationStatus,
    canApplyEditor = false
}) {
    
    // Navigation helpers
    const navigateTo = (route) => router.get(route);
    
    // Role-based components
    const AdminDashboard = () => (
        <div className="space-y-8">
            {/* Admin Stats */}
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
                    <Col xs={24} sm={12} md={8} lg={6}>
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

    const EditorDashboard = () => (
        <div className="space-y-8">
            {/* Editor Stats */}
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
        </div>
    );

    const ViewerDashboard = () => (
        <div className="space-y-8">
            {/* Application Status */}
            {applicationStatus && (
                <Alert
                    message={`Editor Application ${applicationStatus.status_label}`}
                    description={applicationStatus.status === 'rejected' 
                        ? `Reason: ${applicationStatus.rejection_reason}` 
                        : applicationStatus.status === 'pending'
                        ? 'Your application is being reviewed'
                        : 'You are now an editor!'
                    }
                    type={applicationStatus.status === 'approved' ? 'success' : 
                          applicationStatus.status === 'pending' ? 'info' : 'warning'}
                    showIcon
                />
            )}

            {/* Viewer Stats */}
            <div>
                <Title level={3} className="mb-6">Your Activity</Title>
                <Row gutter={[24, 24]}>
                    <Col xs={24} sm={12}>
                        <Card>
                            <Statistic
                                title="Total Bookmarks"
                                value={stats?.total_bookmarks || 0}
                                prefix={<BookOutlined />}
                                valueStyle={{ color: '#1677ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Card>
                            <Statistic
                                title="Recent Bookmarks"
                                value={stats?.recent_bookmarks || 0}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: '#52c41a' }}
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
                            type="default"
                            block
                            size="large"
                            icon={<EyeOutlined />}
                            onClick={() => window.open('/blog', '_blank')}
                        >
                            View Blog
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
                    {canApplyEditor && (
                        <Col xs={24} sm={12} md={8}>
                            <Button
                                type="primary"
                                block
                                size="large"
                                icon={<TeamOutlined />}
                                onClick={() => navigateTo('/apply-editor')}
                            >
                                Apply for Editor
                            </Button>
                        </Col>
                    )}
                </Row>
            </div>
        </div>
    );

    // Common Recent Posts Section
    const RecentPostsSection = () => (
        <div>
            <div className="flex items-center justify-between mb-6">
                <Title level={3}>Recent Articles</Title>
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
                            showStatus={userRole === 'admin'}
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
                    description={userRole === 'viewer' 
                        ? 'No published articles available' 
                        : 'Create your first article to get started'
                    }
                    buttonText={permissions.includes('create-posts') ? "Create Article" : "View Blog"}
                    buttonIcon={permissions.includes('create-posts') ? <PlusOutlined /> : <EyeOutlined />}
                    onButtonClick={() => permissions.includes('create-posts') 
                        ? navigateTo('/posts/create') 
                        : window.open('/blog', '_blank')
                    }
                />
            )}
        </div>
    );

    // Get dashboard title based on role
    const getDashboardTitle = () => {
        switch (userRole) {
            case 'admin': return 'Admin Dashboard';
            case 'editor': return 'Editor Dashboard';
            case 'viewer': return 'Viewer Dashboard';
            default: return 'Dashboard';
        }
    };

    const getDashboardSubtitle = () => {
        switch (userRole) {
            case 'admin': return 'Manage your blog platform';
            case 'editor': return 'Create and manage your content';
            case 'viewer': return 'Discover and bookmark articles';
            default: return 'Welcome to your dashboard';
        }
    };

    return (
        <AuthenticatedLayout
            title={getDashboardTitle()}
            subtitle={getDashboardSubtitle()}
            fullHeight={true}
        >
            <Head title="Dashboard" />

            <div className="h-full overflow-auto bg-gray-50">
                <div className="p-8 space-y-8">
                    {/* Role-based Dashboard Content */}
                    {userRole === 'admin' && <AdminDashboard />}
                    {userRole === 'editor' && <EditorDashboard />}
                    {userRole === 'viewer' && <ViewerDashboard />}
                    
                    {/* Common Recent Posts Section */}
                    <RecentPostsSection />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
