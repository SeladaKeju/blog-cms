import React from 'react';
import BlogLayout from '@/Layouts/BlogLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Typography, Button, message, Divider, Avatar, Card } from 'antd';
import axios from 'axios';
import { 
    ClockCircleOutlined, 
    StarOutlined,
    StarFilled,
    UserOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function BlogIndex({ posts = {}, filters = {}, auth = null }) {
    
    const handleBookmarkClick = async (e, postId) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!auth?.user) {
            message.info('Please sign in to bookmark articles');
            return;
        }
        
        try {
            const response = await axios.post(`/api/bookmarks/toggle/${postId}`);
            message.success(response.data.message);
            
            // Refresh dengan Inertia
            router.reload({ only: ['posts'] });
        } catch (error) {
            console.error('Bookmark error:', error);
            message.error('Failed to update bookmark');
        }
    };

    // Pastikan posts.data ada
    const postsData = posts?.data || [];
    const hasSearch = filters?.search;

    return (
        <BlogLayout>
            <Head title="Blog" />

            <div className="min-h-screen bg-gray-50">
                {/* Container full width untuk list */}
                <div className="max-w-6xl mx-auto px-6 py-12">
                    {/* Header Section */}
                    <div className="mb-12">
                        <Title 
                            level={1} 
                            className="text-gray-900 mb-4"
                            style={{ 
                                fontSize: '42px', 
                                fontWeight: '700',
                                margin: 0,
                                lineHeight: '1.2'
                            }}
                        >
                            Latest Stories
                        </Title>
                        <Text className="text-gray-600 text-xl">
                            Discover stories, thinking, and expertise from writers on any topic.
                        </Text>
                    </div>

                    {/* Search Results Info */}
                    {hasSearch && (
                        <div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-lg">
                            <Text className="text-blue-800 text-lg">
                                Showing results for "<strong>{filters.search}</strong>"
                            </Text>
                        </div>
                    )}

                    {/* Articles List Layout - Full space */}
                    <div className="space-y-8">
                        {postsData.length > 0 ? (
                            postsData.map((post) => {
                                if (!post || !post.id) {
                                    return null;
                                }

                                return (
                                    <Card
                                        key={post.id} 
                                        className="hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden border border-gray-200"
                                        onClick={() => {
                                            try {
                                                router.visit(`/blog/${post.slug}`);
                                            } catch (error) {
                                                console.error('Navigation error:', error);
                                            }
                                        }}
                                    >
                                        <div className="flex gap-8 p-4">
                                            {/* Content */}
                                            <div className="flex-1">
                                                {/* Author Info */}
                                                <div className="flex items-center gap-3 mb-4">
                                                    <Avatar 
                                                        size={28} 
                                                        icon={<UserOutlined />}
                                                        className="bg-blue-600"
                                                    />
                                                    <Text className="text-sm text-gray-600 font-medium">
                                                        {post.author?.name || post.author || 'Admin'}
                                                    </Text>
                                                    <Text className="text-sm text-gray-400">·</Text>
                                                    <Text className="text-sm text-gray-600">
                                                        {post.published_date || 'Recent'}
                                                    </Text>
                                                </div>
                                                
                                                {/* Title */}
                                                <Title 
                                                    level={2} 
                                                    className="mb-4 hover:text-blue-600 transition-colors"
                                                    style={{ 
                                                        fontSize: '28px',
                                                        lineHeight: '34px',
                                                        fontWeight: '700',
                                                        margin: 0,
                                                        color: '#1f2937'
                                                    }}
                                                >
                                                    {post.title || 'Untitled'}
                                                </Title>
                                                
                                                {/* Excerpt */}
                                                {post.excerpt && (
                                                    <Paragraph 
                                                        className="text-gray-600 mb-6"
                                                        style={{ 
                                                            fontSize: '18px',
                                                            lineHeight: '28px',
                                                            margin: 0
                                                        }}
                                                        ellipsis={{ rows: 2 }}
                                                    >
                                                        {post.excerpt}
                                                    </Paragraph>
                                                )}

                                                {/* Footer */}
                                                <div className="flex items-center justify-between pt-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <ClockCircleOutlined className="text-gray-400 text-base" />
                                                            <Text className="text-sm text-gray-500 font-medium">
                                                                {post.reading_time || '5 min read'}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                    
                                                    {auth?.user && (
                                                        <Button 
                                                            type="text" 
                                                            size="large"
                                                            icon={post.is_bookmarked ? <StarFilled className="text-blue-600" /> : <StarOutlined />}
                                                            onClick={(e) => handleBookmarkClick(e, post.id)}
                                                            className={post.is_bookmarked ? "text-blue-600" : "text-gray-400 hover:text-blue-600"}
                                                            style={{ fontSize: '18px' }}
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Thumbnail */}
                                            {post.thumbnail && (
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={post.thumbnail}
                                                        alt={post.title || 'Article'}
                                                        className="w-52 h-36 object-cover rounded-lg"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="text-center py-20">
                                <Card className="p-16">
                                    <Title level={3} className="text-gray-500 mb-4">
                                        {hasSearch ? 'No stories found' : 'No stories published yet'}
                                    </Title>
                                    <Text className="text-gray-400 text-lg">
                                        {hasSearch 
                                            ? 'Try searching with different keywords'
                                            : 'Check back later for new content'
                                        }
                                    </Text>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* Load More */}
                    {posts?.next_page_url && (
                        <div className="mt-16 text-center">
                            <Button 
                                size="large" 
                                className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white rounded-lg px-12 py-3 text-lg font-medium"
                                onClick={() => {
                                    try {
                                        router.get(posts.next_page_url);
                                    } catch (error) {
                                        console.error('Load more error:', error);
                                    }
                                }}
                            >
                                Load more stories
                            </Button>
                        </div>
                    )}

                    {/* Minimal Bottom Spacing */}
                    <div className="pb-8"></div>
                </div>
            </div>
        </BlogLayout>
    );
}