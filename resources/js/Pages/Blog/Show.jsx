import BlogLayout from '@/Layouts/BlogLayout';
import { Head, Link } from '@inertiajs/react';
import { Typography, Card, Row, Col, Button, Space, message } from 'antd';
import { 
    CalendarOutlined, 
    ClockCircleOutlined, 
    ArrowLeftOutlined,
    EditOutlined,
    HeartOutlined,
    ShareAltOutlined,
    UserOutlined,
    UserAddOutlined,
    LoginOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Title, Paragraph, Text } = Typography;

export default function BlogShow({ post, relatedPosts, auth }) {
    const [readingProgress, setReadingProgress] = useState(0);

    // Track reading progress
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const progress = (window.scrollY / totalHeight) * 100;
            setReadingProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <BlogLayout>
            <Head title={post.title} />

            {/* Reading Progress Bar */}
            <div 
                className="fixed top-0 left-0 h-1 bg-blue-500 z-50 transition-all duration-300"
                style={{ width: `${readingProgress}%` }}
            />

            <Row gutter={[32, 32]}>
                {/* Main Content */}
                <Col xs={24} lg={16}>
                    <div className="max-w-4xl mx-auto px-4">
                        {/* Back Button */}
                        <div className="mb-8 mt-6">
                            <Link href="/blog" className="text-gray-500 hover:text-gray-700 transition-colors">
                                <ArrowLeftOutlined /> <span className="ml-1">Back to Blog</span>
                            </Link>
                        </div>

                        {/* Article Header */}
                        <div className="mb-10">
                            <Title 
                                level={1} 
                                style={{ 
                                    marginBottom: '16px', 
                                    lineHeight: '1.2',
                                    fontSize: '2.5rem',
                                    fontWeight: 'normal'
                                }}
                            >
                                {post.title}
                            </Title>
                            
                            <div className="flex items-center gap-6 text-gray-500 mb-8">
                                <div className="flex items-center gap-2">
                                    <CalendarOutlined />
                                    <span>{post.published_date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ClockCircleOutlined />
                                    <span>{post.reading_time}</span>
                                </div>
                                {post.author && (
                                    <div className="flex items-center gap-2">
                                        <UserOutlined />
                                        <span>By {post.author}</span>
                                    </div>
                                )}
                            </div>

                            {/* Article Actions */}
                            <div className="flex items-center gap-3 mb-8">
                                <Button 
                                    type="text" 
                                    icon={<HeartOutlined />}
                                    onClick={() => {
                                        if (!auth?.user) {
                                            message.info('Please login to bookmark articles');
                                        } else {
                                            message.success('Bookmark feature will be implemented');
                                        }
                                    }}
                                >
                                    Bookmark
                                </Button>
                                <Button 
                                    type="text" 
                                    icon={<ShareAltOutlined />}
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: post.title,
                                                url: window.location.href
                                            });
                                        } else {
                                            navigator.clipboard.writeText(window.location.href);
                                            message.success('Link copied to clipboard!');
                                        }
                                    }}
                                >
                                    Share
                                </Button>
                            </div>

                            {/* Featured Image */}
                            {post.thumbnail && (
                                <div className="mb-10">
                                    <img
                                        src={post.thumbnail}
                                        alt={post.title}
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            maxHeight: '500px',
                                            objectFit: 'cover',
                                            borderRadius: '8px'
                                        }}
                                    />
                                </div>
                            )}

                            {/* Excerpt */}
                            <div className="mb-10 p-5 border-l-4 border-gray-200 bg-gray-50">
                                <Text 
                                    style={{ 
                                        fontSize: '18px', 
                                        lineHeight: '1.6',
                                        color: '#444',
                                        fontStyle: 'italic',
                                        display: 'block'
                                    }}
                                >
                                    {post.excerpt}
                                </Text>
                            </div>
                        </div>

                        {/* Article Content */}
                        <div 
                            className="prose max-w-none blog-content"
                            style={{ 
                                fontSize: '18px', 
                                lineHeight: '1.8',
                                color: '#333',
                                '--heading-color': '#111827',
                                letterSpacing: '0.01em',
                            }}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />

                        {/* Call to Action After Article - For Viewers Only */}
                        {auth?.userRole === 'viewer' && (
                            <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                                <div className="text-center py-6">
                                    <Title level={4} className="mb-4">
                                        Enjoyed this article? Share your knowledge too!
                                    </Title>
                                    <Paragraph className="mb-6 text-gray-600">
                                        Join our team of content creators and help shape the future of our blog community. 
                                        Apply to become an editor and start publishing your own insights.
                                    </Paragraph>
                                    <Link href={route('editor-application.create')}>
                                        <Button type="primary" size="large" icon={<EditOutlined />}>
                                            Apply to Become an Editor
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        )}

                        {/* Related Posts */}
                        {relatedPosts.length > 0 && (
                            <div className="mt-16 pt-8 border-t border-gray-200">
                                <Title level={4} style={{ marginBottom: '16px', fontWeight: 'normal' }}>
                                    You might also like
                                </Title>
                                <Row gutter={[24, 24]}>
                                    {relatedPosts.map((relatedPost) => (
                                        <Col xs={24} sm={8} key={relatedPost.id}>
                                            <Link href={`/blog/${relatedPost.slug}`}>
                                                <Card
                                                    hoverable
                                                    bordered={false}
                                                    className="transition-all duration-300 hover:shadow-md"
                                                    cover={
                                                        relatedPost.thumbnail ? (
                                                            <img
                                                                alt={relatedPost.title}
                                                                src={relatedPost.thumbnail}
                                                                style={{ 
                                                                    height: 120, 
                                                                    objectFit: 'cover' 
                                                                }}
                                                            />
                                                        ) : null
                                                    }
                                                >
                                                    <Title level={5} style={{ 
                                                        fontSize: '16px',
                                                        marginBottom: '8px' 
                                                    }}>
                                                        {relatedPost.title}
                                                    </Title>
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        {relatedPost.published_date}
                                                    </Text>
                                                </Card>
                                            </Link>
                                        </Col>
                                    ))}
                                </Row>
                            </div>
                        )}
                    </div>
                </Col>

                {/* Sidebar */}
                <Col xs={24} lg={8}>
                    <div className="sticky top-8">
                        {/* Apply CTA for Viewers */}
                        {auth?.userRole === 'viewer' ? (
                            <Card title="Become a Contributor" className="mb-6 border-blue-200">
                                <Paragraph>
                                    Do you have insights to share? Join our community of content creators and start publishing your expertise.
                                </Paragraph>
                                <Link href={route('editor-application.create')}>
                                    <Button type="primary" block icon={<EditOutlined />} size="large">
                                        Apply as Editor
                                    </Button>
                                </Link>
                                <div className="mt-3 space-y-1 text-xs text-gray-500">
                                    <div>✓ Write your own articles</div>
                                    <div>✓ Access editorial tools</div>
                                    <div>✓ Build your audience</div>
                                    <div>✓ Join our content team</div>
                                </div>
                            </Card>
                        ) : !auth?.user ? (
                            <Card title="Join Our Community" className="mb-6">
                                <Paragraph>
                                    Create an account to bookmark articles, apply as an editor, and engage with our community.
                                </Paragraph>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Link href={route('register')}>
                                        <Button type="primary" block icon={<UserAddOutlined />}>
                                            Sign Up Free
                                        </Button>
                                    </Link>
                                    <Link href={route('login')}>
                                        <Button block icon={<LoginOutlined />}>
                                            Already have an account?
                                        </Button>
                                    </Link>
                                </Space>
                            </Card>
                        ) : auth?.userRole === 'editor' || auth?.userRole === 'admin' ? (
                            <Card title="Creator Tools" className="mb-6">
                                <Paragraph>
                                    Access your dashboard to manage content and explore editorial features.
                                </Paragraph>
                                <Link href={route('dashboard')}>
                                    <Button type="primary" block icon={<EditOutlined />}>
                                        Go to Dashboard
                                    </Button>
                                </Link>
                            </Card>
                        ) : null}

                        {/* Related Articles Preview */}
                        {relatedPosts.length > 0 && (
                            <Card title="Related Articles" className="mb-6">
                                <div className="space-y-3">
                                    {relatedPosts.slice(0, 3).map((relatedPost) => (
                                        <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                                            <div className="flex gap-2 p-2 rounded hover:bg-gray-50 transition-colors">
                                                {relatedPost.thumbnail && (
                                                    <img
                                                        src={relatedPost.thumbnail}
                                                        alt={relatedPost.title}
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                            objectFit: 'cover',
                                                            borderRadius: '4px'
                                                        }}
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium line-clamp-2">
                                                        {relatedPost.title}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {relatedPost.published_date}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </Card>
                        )}

                        {/* About/Newsletter */}
                        <Card title="Stay Updated">
                            <Paragraph>
                                Get the latest articles and insights delivered to your inbox.
                            </Paragraph>
                            <Button block>Subscribe to Newsletter</Button>
                        </Card>
                    </div>
                </Col>
            </Row>
        </BlogLayout>
    );
}