import BlogLayout from '@/Layouts/BlogLayout';
import { Head, Link } from '@inertiajs/react';
import { Typography, Button, Space, message, Divider } from 'antd';
import { 
    CalendarOutlined, 
    ClockCircleOutlined, 
    ArrowLeftOutlined,
    UserOutlined,
    StarOutlined,
    StarFilled,
    ShareAltOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;

export default function BlogShow({ post, relatedPosts, auth }) {
    const [readingProgress, setReadingProgress] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

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

    // Tambahkan useEffect untuk mengecek status bookmark
    useEffect(() => {
        if (auth?.user) {
            checkBookmarkStatus();
        }
    }, []);

    // Fungsi untuk mengecek status bookmark
    const checkBookmarkStatus = async () => {
        try {
            const response = await axios.get(`/api/bookmarks/check/${post.id}`);
            setIsBookmarked(response.data.bookmarked);
        } catch (error) {
            console.error('Error checking bookmark status:', error);
        }
    };

    // Fungsi untuk toggle bookmark
    const handleBookmarkToggle = async () => {
        if (!auth?.user) {
            message.info('Please login to bookmark articles');
            return;
        }
        
        setIsBookmarkLoading(true);
        try {
            const response = await axios.post(`/api/bookmarks/toggle/${post.id}`);
            setIsBookmarked(response.data.bookmarked);
            message.success(response.data.message);
        } catch (error) {
            message.error('Failed to update bookmark: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsBookmarkLoading(false);
        }
    };

    return (
        <BlogLayout>
            <Head title={post.title} />

            {/* Reading Progress Bar */}
            <div 
                className="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all duration-300"
                style={{ width: `${readingProgress}%` }}
            />

            {/* Main Content */}
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Link href="/blog" className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center">
                            <ArrowLeftOutlined /> <span className="ml-1">Back to Stories</span>
                        </Link>
                    </div>

                    {/* Article Container */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Featured Image */}
                        {post.thumbnail && (
                            <div className="w-full h-64 md:h-80 bg-gray-100">
                                <img
                                    src={post.thumbnail}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Article Content */}
                        <div className="p-8 md:p-12">
                            {/* Article Header */}
                            <div className="mb-8">
                                <Title 
                                    level={1} 
                                    className="text-gray-900 mb-4"
                                    style={{ 
                                        fontSize: '36px', 
                                        fontWeight: '700',
                                        lineHeight: '1.2',
                                        margin: 0
                                    }}
                                >
                                    {post.title}
                                </Title>
                                
                                <div className="flex items-center gap-4 text-gray-600 mb-6">
                                    <div className="flex items-center gap-2">
                                        <UserOutlined />
                                        <span>{post.author || 'Admin'}</span>
                                    </div>
                                    <Text className="text-gray-400">·</Text>
                                    <div className="flex items-center gap-2">
                                        <CalendarOutlined />
                                        <span>{post.published_date}</span>
                                    </div>
                                    <Text className="text-gray-400">·</Text>
                                    <div className="flex items-center gap-2">
                                        <ClockCircleOutlined />
                                        <span>{post.reading_time || '5 min read'}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
                                    <Button 
                                        type={isBookmarked ? "primary" : "default"}
                                        icon={isBookmarked ? <StarFilled /> : <StarOutlined />}
                                        onClick={handleBookmarkToggle}
                                        loading={isBookmarkLoading}
                                        className={isBookmarked ? "bg-blue-600 border-blue-600" : "border-gray-300"}
                                    >
                                        {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                                    </Button>
                                    <Button 
                                        type="default"
                                        icon={<ShareAltOutlined />}
                                        className="border-gray-300"
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
                            </div>

                            {/* Excerpt */}
                            {post.excerpt && (
                                <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
                                    <Text 
                                        style={{ 
                                            fontSize: '18px', 
                                            lineHeight: '1.6',
                                            color: '#1e40af',
                                            fontStyle: 'italic',
                                            display: 'block'
                                        }}
                                    >
                                        {post.excerpt}
                                    </Text>
                                </div>
                            )}

                            {/* Article Content */}
                            <div 
                                className="prose max-w-none blog-content"
                                style={{ 
                                    fontSize: '18px', 
                                    lineHeight: '1.8',
                                    color: '#374151'
                                }}
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </div>
                    </div>

                    {/* Related Posts */}
                    {relatedPosts.length > 0 && (
                        <div className="mt-12">
                            <Title level={3} className="mb-6 text-gray-900">
                                Related Stories
                            </Title>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedPosts.slice(0, 3).map((relatedPost) => (
                                    <div 
                                        key={relatedPost.id} 
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                                    >
                                        {relatedPost.thumbnail && (
                                            <div className="w-full h-32 bg-gray-100">
                                                <img
                                                    src={relatedPost.thumbnail}
                                                    alt={relatedPost.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <Title 
                                                level={5} 
                                                className="mb-2 hover:text-blue-600 transition-colors"
                                                style={{ 
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    margin: 0,
                                                    color: '#1f2937'
                                                }}
                                            >
                                                {relatedPost.title}
                                            </Title>
                                            <Text className="text-sm text-gray-500">
                                                {relatedPost.published_date}
                                            </Text>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BlogLayout>
    );
}