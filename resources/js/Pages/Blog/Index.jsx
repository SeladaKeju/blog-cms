import BlogLayout from '@/Layouts/BlogLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Typography, Button, message, Divider, Avatar } from 'antd';
import axios from 'axios';
import { 
    ClockCircleOutlined, 
    HeartOutlined,
    HeartFilled,
    UserOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function BlogIndex({ posts, filters, auth }) {
    
    const handleBookmarkClick = async (e, postId) => {
        e.stopPropagation();
        if (!auth?.user) {
            message.info('Please sign in to bookmark articles');
            return;
        }
        
        try {
            const response = await axios.post(`/api/bookmarks/toggle/${postId}`);
            message.success(response.data.message);
            
            // Update bookmark status in post list (no full page reload)
            const updatedPosts = {...posts};
            updatedPosts.data = posts.data.map(post => {
                if (post.id === postId) {
                    return {...post, is_bookmarked: !post.is_bookmarked};
                }
                return post;
            });
            // Jika kita memiliki state untuk posts, kita bisa update di sini
            // setPosts(updatedPosts);
            
            // Alternatif: force refresh halaman
            // window.location.reload();
        } catch (error) {
            message.error('Failed to update bookmark');
        }
    };

    return (
        <BlogLayout>
            <Head title="Blog" />

            {/* Hero Section - Simplified */}
            <div className="border-b border-gray-200 bg-yellow-400 text-black">
                <div className="max-w-4xl mx-auto px-6 py-20">
                    <div className="max-w-2xl">
                        <Title 
                            level={1} 
                            className="text-black mb-4"
                            style={{ 
                                fontSize: '106px', 
                                fontWeight: '400',
                                lineHeight: '106px',
                                letterSpacing: '-6px',
                                margin: 0
                            }}
                        >
                            Human stories & ideas
                        </Title>
                        <Text 
                            className="text-black text-xl mb-8 block"
                            style={{ fontSize: '20px', lineHeight: '28px' }}
                        >
                            A place to read, write, and deepen your understanding
                        </Text>
                        {!auth?.user && (
                            <Link href={route('register')}>
                                <Button 
                                    type="primary"
                                    size="large"
                                    className="bg-black hover:bg-gray-800 border-black hover:border-gray-800 rounded-full px-12 py-2 h-12 text-base font-medium"
                                >
                                    Start reading
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content - Articles Only */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Search Results Info */}
                {filters.search && (
                    <div className="mb-8">
                        <Text type="secondary">
                            Results for "<strong>{filters.search}</strong>"
                        </Text>
                    </div>
                )}

                {/* Articles List */}
                <div className="space-y-8">
                    {posts?.data && posts.data.length > 0 ? (
                        posts.data.map((post, index) => (
                            <article key={post.id} className="group">
                                <Link href={`/blog/${post.slug}`}>
                                    <div className="flex gap-6 cursor-pointer">
                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="mb-2">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Avatar 
                                                        size={20} 
                                                        icon={<UserOutlined />}
                                                        className="bg-blue-600"
                                                    />
                                                    <Text className="text-sm text-gray-600">
                                                        {post.author || 'Admin'}
                                                    </Text>
                                                    <Text className="text-sm text-gray-400">·</Text>
                                                    <Text className="text-sm text-gray-600">
                                                        {post.published_date}
                                                    </Text>
                                                </div>
                                                
                                                <Title 
                                                    level={3} 
                                                    className="mb-2 group-hover:text-gray-600 transition-colors"
                                                    style={{ 
                                                        fontSize: index === 0 ? '28px' : '22px',
                                                        lineHeight: index === 0 ? '32px' : '28px',
                                                        fontWeight: '700',
                                                        margin: 0,
                                                        color: '#1a1a1a'
                                                    }}
                                                >
                                                    {post.title}
                                                </Title>
                                                
                                                <Paragraph 
                                                    className="text-gray-600 mb-4"
                                                    style={{ 
                                                        fontSize: '16px',
                                                        lineHeight: '24px',
                                                        margin: 0
                                                    }}
                                                    ellipsis={{ rows: 2 }}
                                                >
                                                    {post.excerpt}
                                                </Paragraph>
                                            </div>

                                            {/* Article Meta */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1">
                                                        <ClockCircleOutlined className="text-gray-400 text-xs" />
                                                        <Text className="text-xs text-gray-600">
                                                            {post.reading_time}
                                                        </Text>
                                                    </div>
                                                </div>
                                                
                                                <Button 
                                                    type="text" 
                                                    size="small"
                                                    icon={post.is_bookmarked ? <HeartFilled className="text-red-500" /> : <HeartOutlined />}
                                                    onClick={(e) => handleBookmarkClick(e, post.id)}
                                                    className={post.is_bookmarked ? "text-red-500" : "text-gray-400 hover:text-gray-600"}
                                                />
                                            </div>
                                        </div>

                                        {/* Thumbnail */}
                                        {post.thumbnail && (
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={post.thumbnail}
                                                    alt={post.title}
                                                    className="w-32 h-32 object-cover rounded"
                                                    style={{ 
                                                        aspectRatio: '1/1'
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                
                                {index < posts.data.length - 1 && (
                                    <Divider className="my-8" />
                                )}
                            </article>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <Title level={4} type="secondary">
                                {filters.search ? 'No stories found' : 'No stories published yet'}
                            </Title>
                            <Text type="secondary">
                                {filters.search 
                                    ? 'Try searching with different keywords'
                                    : 'Check back later for new content'
                                }
                            </Text>
                        </div>
                    )}
                </div>

                {/* Load More / Pagination */}
                {posts?.next_page_url && (
                    <div className="mt-16 text-center">
                        <Button 
                            size="large" 
                            className="rounded-full px-8"
                            onClick={() => router.get(posts.next_page_url)}
                        >
                            Load more stories
                        </Button>
                    </div>
                )}

                {/* Bottom CTA for Guests */}
                {!auth?.user && posts?.data && posts.data.length > 3 && (
                    <div className="mt-16 p-8 bg-gray-50 rounded-lg text-center">
                        <Title level={4} className="mb-4">
                            Ready to dive deeper?
                        </Title>
                        <Text className="text-gray-600 mb-6 block">
                            Join our community to unlock unlimited stories and start your own writing journey.
                        </Text>
                        <div className="flex gap-4 justify-center">
                            <Link href={route('register')}>
                                <Button 
                                    type="primary" 
                                    size="large"
                                    className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 rounded-full px-8"
                                >
                                    Get started
                                </Button>
                            </Link>
                            <Link href={route('login')}>
                                <Button 
                                    size="large"
                                    className="rounded-full px-8"
                                >
                                    Sign in
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </BlogLayout>
    );
}