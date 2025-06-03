import BlogLayout from '@/Layouts/BlogLayout';
import { Head, Link } from '@inertiajs/react';
import { Typography, Button, Space, message, Divider } from 'antd';
import { 
    CalendarOutlined, 
    ClockCircleOutlined, 
    ArrowLeftOutlined,
    UserOutlined,
    HeartOutlined,
    ShareAltOutlined
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

            {/* Article Header - Matching the yellow hero from Index */}
            <div className="border-b border-gray-200 bg-yellow-400 text-black">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="max-w-3xl">
                        <div className="mb-4">
                            <Link href="/blog" className="text-black hover:text-gray-800 transition-colors inline-flex items-center">
                                <ArrowLeftOutlined /> <span className="ml-1">Back to Blog</span>
                            </Link>
                        </div>
                        
                        <Title 
                            level={1} 
                            className="text-black mb-4"
                            style={{ 
                                fontSize: '42px', 
                                fontWeight: '700',
                                lineHeight: '1.2',
                                margin: 0,
                                letterSpacing: '-1px'
                            }}
                        >
                            {post.title}
                        </Title>
                        
                        <div className="flex items-center gap-4 text-black mt-4">
                            <div className="flex items-center gap-2">
                                <UserOutlined />
                                <span>{post.author || 'Admin'}</span>
                            </div>
                            <Text className="text-black">·</Text>
                            <div className="flex items-center gap-2">
                                <CalendarOutlined />
                                <span>{post.published_date}</span>
                            </div>
                            <Text className="text-black">·</Text>
                            <div className="flex items-center gap-2">
                                <ClockCircleOutlined />
                                <span>{post.reading_time || '5 min read'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Article Only */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="max-w-3xl mx-auto">
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

                    {/* Article Content */}
                    <div 
                        className="prose max-w-none blog-content"
                        style={{ 
                            fontSize: '18px', 
                            lineHeight: '1.8',
                            color: '#333',
                            letterSpacing: '0.01em',
                        }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Article Actions - Simple */}
                    <div className="flex items-center justify-center gap-6 mt-12 py-6 border-t border-gray-200">
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

                    {/* Related Posts - Simplified */}
                    {relatedPosts.length > 0 && (
                        <div className="mt-12 pt-6 border-t border-gray-200">
                            <Title level={3} style={{ marginBottom: '24px', fontWeight: '700' }}>
                                You might also like
                            </Title>
                            <div className="space-y-8">
                                {relatedPosts.slice(0, 3).map((relatedPost) => (
                                    <article key={relatedPost.id} className="group">
                                        <Link href={`/blog/${relatedPost.slug}`}>
                                            <div className="flex gap-6 cursor-pointer">
                                                <div className="flex-1">
                                                    <Title 
                                                        level={4} 
                                                        className="mb-2 group-hover:text-gray-600 transition-colors"
                                                        style={{ 
                                                            fontSize: '20px',
                                                            lineHeight: '26px',
                                                            fontWeight: '700',
                                                            margin: 0,
                                                            color: '#1a1a1a'
                                                        }}
                                                    >
                                                        {relatedPost.title}
                                                    </Title>
                                                    <Text className="text-sm text-gray-600">
                                                        {relatedPost.published_date}
                                                    </Text>
                                                </div>
                                                {relatedPost.thumbnail && (
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={relatedPost.thumbnail}
                                                            alt={relatedPost.title}
                                                            className="w-24 h-24 object-cover rounded"
                                                            style={{ aspectRatio: '1/1' }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                        {relatedPosts.indexOf(relatedPost) < relatedPosts.length - 1 && (
                                            <Divider className="my-8" />
                                        )}
                                    </article>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BlogLayout>
    );
}