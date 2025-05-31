import BlogLayout from '@/Layouts/BlogLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, Typography, Row, Col, Button, message, Input } from 'antd';
import { 
    ClockCircleOutlined, 
    CalendarOutlined, 
    HeartOutlined,
    SearchOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

export default function BlogIndex({ posts, recentPosts, filters, auth }) {
    
    // Handle bookmark action
    const handleBookmarkClick = (e) => {
        e.stopPropagation();
        if (!auth?.user) {
            message.info('Please login to bookmark articles');
            return;
        }
        message.success('Bookmark feature will be implemented');
    };

    // Handle search
    const handleSearch = (value) => {
        if (value.trim()) {
            router.get('/blog', { search: value }, { preserveState: true });
        } else {
            router.get('/blog', {}, { preserveState: true });
        }
    };

    return (
        <BlogLayout>
            <Head title="Blog" />

            {/* Clean Header with Search */}
            <div className="mb-8">
                <div className="text-center mb-6">
                    <Title level={2} style={{ marginBottom: '8px' }}>
                        Latest Articles
                    </Title>
                    <Text type="secondary" style={{ fontSize: '16px' }}>
                        Discover insights, tutorials, and stories
                    </Text>
                </div>
                
                {/* Search Bar */}
                <div className="max-w-md mx-auto">
                    <Search
                        placeholder="Search articles..."
                        size="large"
                        allowClear
                        defaultValue={filters.search}
                        onSearch={handleSearch}
                        style={{ width: '100%' }}
                    />
                </div>
            </div>

            <Row gutter={[32, 32]}>
                {/* Main Content */}
                <Col xs={24} lg={16}>
                    {/* Search Results Info */}
                    {filters.search && (
                        <div className="mb-6">
                            <Text type="secondary">
                                Search results for: <strong>"{filters.search}"</strong>
                            </Text>
                        </div>
                    )}

                    {/* Blog Posts Grid */}
                    <Row gutter={[24, 24]}>
                        {posts?.data && posts.data.length > 0 ? (
                            posts.data.map((post) => (
                                <Col xs={24} sm={12} key={post.id}>
                                    <Card
                                        hoverable
                                        className="h-full"
                                        cover={
                                            post.thumbnail ? (
                                                <img
                                                    alt={post.title}
                                                    src={post.thumbnail}
                                                    style={{ 
                                                        height: 200, 
                                                        objectFit: 'cover' 
                                                    }}
                                                />
                                            ) : (
                                                <div 
                                                    style={{
                                                        height: 200,
                                                        backgroundColor: '#f5f5f5',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#999'
                                                    }}
                                                >
                                                    No Image
                                                </div>
                                            )
                                        }
                                        actions={[
                                            <Button 
                                                key="bookmark"
                                                type="text" 
                                                icon={<HeartOutlined />}
                                                onClick={handleBookmarkClick}
                                                title={auth?.user ? 'Bookmark this article' : 'Login to bookmark'}
                                            >
                                                Bookmark
                                            </Button>,
                                            <Link key="read" href={`/blog/${post.slug}`}>
                                                <Button type="primary">Read More</Button>
                                            </Link>
                                        ]}
                                        style={{ borderRadius: '8px' }}
                                    >
                                        <div className="flex flex-col h-full">
                                            <Title level={4} className="mb-2" style={{ lineHeight: '1.4' }}>
                                                {post.title}
                                            </Title>
                                            
                                            <Paragraph 
                                                ellipsis={{ rows: 3 }} 
                                                style={{ 
                                                    flex: 1,
                                                    color: '#666',
                                                    marginBottom: '16px'
                                                }}
                                            >
                                                {post.excerpt}
                                            </Paragraph>
                                            
                                            <div className="flex justify-between items-center text-sm text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <CalendarOutlined />
                                                    <span>{post.published_date}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <ClockCircleOutlined />
                                                    <span>{post.reading_time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col xs={24}>
                                <div className="text-center py-16">
                                    <Title level={4} type="secondary">
                                        {filters.search ? 'No articles found' : 'No articles published yet'}
                                    </Title>
                                    <Text type="secondary">
                                        {filters.search 
                                            ? 'Try searching with different keywords'
                                            : 'Check back later for new content'
                                        }
                                    </Text>
                                </div>
                            </Col>
                        )}
                    </Row>

                    {/* Pagination */}
                    {posts?.links && (
                        <div className="mt-8 text-center">
                            {posts.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`inline-block px-3 py-2 mx-1 border rounded ${
                                        link.active 
                                            ? 'bg-blue-500 text-white border-blue-500' 
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </Col>

                {/* Sidebar */}
                <Col xs={24} lg={8}>
                    {/* Recent Posts */}
                    <Card title="Recent Posts" style={{ borderRadius: '8px' }}>
                        <div className="space-y-4">
                            {recentPosts && recentPosts.length > 0 ? (
                                recentPosts.map((post) => (
                                    <Link key={post.id} href={`/blog/${post.slug}`}>
                                        <div className="flex gap-3 p-2 rounded hover:bg-gray-50 transition-colors">
                                            {post.thumbnail && (
                                                <img
                                                    src={post.thumbnail}
                                                    alt={post.title}
                                                    style={{
                                                        width: 60,
                                                        height: 60,
                                                        objectFit: 'cover',
                                                        borderRadius: '6px'
                                                    }}
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <Title level={5} className="mb-1" style={{ fontSize: '14px' }}>
                                                    {post.title}
                                                </Title>
                                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                                    {post.published_date}
                                                </Text>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <Text type="secondary">No recent posts available</Text>
                            )}
                        </div>
                    </Card>
                    
                </Col>
            </Row>
        </BlogLayout>
    );
}