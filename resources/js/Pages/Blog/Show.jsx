import BlogLayout from '@/Layouts/BlogLayout';
import { Head, Link } from '@inertiajs/react';
import { Typography, Card, Row, Col, Divider } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function BlogShow({ post, relatedPosts }) {
    return (
        <BlogLayout>
            <Head title={post.title} />

            <Row gutter={[32, 32]}>
                {/* Main Content */}
                <Col xs={24} lg={16}>
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link href="/blog" className="flex items-center gap-2 text-blue-500 hover:text-blue-700">
                            <ArrowLeftOutlined />
                            <span>Back to Blog</span>
                        </Link>
                    </div>

                    {/* Article Header */}
                    <div className="mb-8">
                        <Title level={1} style={{ marginBottom: '16px', lineHeight: '1.2' }}>
                            {post.title}
                        </Title>
                        
                        <div className="flex items-center gap-6 text-gray-500 mb-6">
                            <div className="flex items-center gap-2">
                                <CalendarOutlined />
                                <span>{post.published_date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ClockCircleOutlined />
                                <span>{post.reading_time}</span>
                            </div>
                        </div>

                        {/* Featured Image */}
                        {post.thumbnail && (
                            <div className="mb-8">
                                <img
                                    src={post.thumbnail}
                                    alt={post.title}
                                    style={{
                                        width: '100%',
                                        height: '400px',
                                        objectFit: 'cover',
                                        borderRadius: '8px'
                                    }}
                                />
                            </div>
                        )}

                        {/* Excerpt */}
                        <div className="mb-8">
                            <Text 
                                style={{ 
                                    fontSize: '18px', 
                                    lineHeight: '1.6',
                                    color: '#666',
                                    fontStyle: 'italic'
                                }}
                            >
                                {post.excerpt}
                            </Text>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div 
                        className="prose max-w-none"
                        style={{ 
                            fontSize: '16px', 
                            lineHeight: '1.7',
                            color: '#333'
                        }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <div className="mt-12">
                            <Divider />
                            <Title level={3} className="mb-6">Related Articles</Title>
                            <Row gutter={[16, 16]}>
                                {relatedPosts.map((relatedPost) => (
                                    <Col xs={24} sm={8} key={relatedPost.id}>
                                        <Link href={`/blog/${relatedPost.slug}`}>
                                            <Card
                                                hoverable
                                                size="small"
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
                                                    ) : (
                                                        <div 
                                                            style={{
                                                                height: 120,
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
                                            >
                                                <Title level={5} style={{ fontSize: '14px' }}>
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
                </Col>

                {/* Sidebar */}
                <Col xs={24} lg={8}>
                    <Card title="Article Info" style={{ borderRadius: '8px' }}>
                        <div className="space-y-3">
                            <div>
                                <Text strong>Published:</Text>
                                <br />
                                <Text type="secondary">{post.published_date}</Text>
                            </div>
                            <div>
                                <Text strong>Reading Time:</Text>
                                <br />
                                <Text type="secondary">{post.reading_time}</Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </BlogLayout>
    );
}