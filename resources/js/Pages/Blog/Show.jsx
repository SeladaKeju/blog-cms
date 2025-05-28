import BlogLayout from '@/Layouts/BlogLayout';
import { Head, Link } from '@inertiajs/react';
import { Typography, Card, Row, Col, Divider } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Title, Paragraph, Text } = Typography;

export default function BlogShow({ post, relatedPosts }) {
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

            <Row justify="center">
                {/* Main Content */}
                <Col xs={24} lg={18} xl={16}>
                    <div className="max-w-3xl mx-auto px-4">
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

                        {/* Article Content - Enhanced readability by default */}
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
            </Row>
        </BlogLayout>
    );
}