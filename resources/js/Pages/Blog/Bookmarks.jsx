// Pastikan file ini berada di folder Blog (dengan B kapital)

import React, { useState } from 'react';
import BlogLayout from '@/Layouts/BlogLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Typography, Card, Divider, Button, Avatar, Empty, message } from 'antd';
import { 
    ClockCircleOutlined, 
    UserOutlined,
    DeleteOutlined,
    HeartFilled,
    FileTextOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

export default function Bookmarks({ bookmarks, auth }) {
    const [loading, setLoading] = useState({});

    // Fungsi helper untuk menangani URL thumbnail (sama seperti di ArticleCard)
    const getThumbnailUrl = (thumbnailPath) => {
        if (!thumbnailPath) return null;
        
        // Jika sudah mengandung http/https, gunakan URL lengkap
        if (thumbnailPath.startsWith('http://') || thumbnailPath.startsWith('https://')) {
            return thumbnailPath;
        }
        
        // Jika path berisi "storage/", pastikan ada slash di depannya
        if (thumbnailPath.includes('storage/') && !thumbnailPath.startsWith('/')) {
            return '/' + thumbnailPath;
        }
        
        // Jika tidak ada "storage/" di path, tambahkan prefix
        if (!thumbnailPath.includes('storage/')) {
            if (thumbnailPath.startsWith('/')) {
                return '/storage' + thumbnailPath;
            } else {
                return '/storage/' + thumbnailPath;
            }
        }
        
        // Default case: tambahkan slash di awal jika belum ada
        if (!thumbnailPath.startsWith('/')) {
            return '/' + thumbnailPath;
        }
        
        return thumbnailPath;
    };

    const removeBookmark = async (bookmarkId, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (loading[bookmarkId]) return;
        
        setLoading(prev => ({...prev, [bookmarkId]: true}));
        
        try {
            await axios.delete(`/bookmarks/${bookmarkId}`);
            message.success('Bookmark removed');
            // Refresh halaman dengan Inertia
            router.reload({ only: ['bookmarks'] });
        } catch (error) {
            console.error('Failed to remove bookmark:', error);
            message.error('Failed to remove bookmark');
        } finally {
            setLoading(prev => ({...prev, [bookmarkId]: false}));
        }
    };

    return (
        <BlogLayout>
            <Head title="Your Bookmarks" />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <Title level={2} className="mb-6">Your Bookmarked Articles</Title>

                {bookmarks.data?.length > 0 ? (
                    <div className="space-y-6">
                        {bookmarks.data.map((bookmark) => (
                            <Card 
                                key={bookmark.id} 
                                className="overflow-hidden hover:shadow-md transition-shadow"
                                bordered={true}
                            >
                                <Link href={`/blog/${bookmark.post.slug}`}>
                                    <div className="flex gap-6">
                                        {/* Thumbnail dengan penanganan URL yang benar */}
                                        <div className="flex-shrink-0">
                                            {bookmark.post.thumbnail ? (
                                                <img
                                                    src={getThumbnailUrl(bookmark.post.thumbnail)}
                                                    alt={bookmark.post.title}
                                                    className="w-32 h-32 object-cover rounded"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        // Fallback ke placeholder atau hide image
                                                        e.target.style.display = 'none';
                                                        e.target.parentNode.innerHTML = `
                                                            <div class="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                                                                <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
                                                                </svg>
                                                            </div>
                                                        `;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center">
                                                    <FileTextOutlined className="text-2xl text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Avatar size={24} icon={<UserOutlined />} className="bg-blue-600" />
                                                <Text className="text-sm text-gray-600">
                                                    {bookmark.post.author?.name || 'Admin'}
                                                </Text>
                                                <Text className="text-sm text-gray-400">·</Text>
                                                <Text className="text-sm text-gray-600">
                                                    {bookmark.post.published_date}
                                                </Text>
                                            </div>
                                            
                                            <Title level={4} className="mb-2">
                                                {bookmark.post.title}
                                            </Title>
                                            
                                            <Paragraph 
                                                className="text-gray-600 mb-4"
                                                ellipsis={{ rows: 2 }}
                                            >
                                                {bookmark.post.excerpt}
                                            </Paragraph>
                                            
                                            <div className="flex justify-between items-center mt-4">
                                                <div className="flex items-center gap-2">
                                                    <ClockCircleOutlined className="text-gray-400" />
                                                    <Text className="text-sm text-gray-600">
                                                        {bookmark.post.reading_time || '5 min read'}
                                                    </Text>
                                                </div>
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={(e) => removeBookmark(bookmark.id, e)}
                                                    loading={loading[bookmark.id]}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <span className="text-gray-500">
                                No bookmarked articles yet
                            </span>
                        }
                    >
                        <Link href="/blog">
                            <Button type="primary">Browse Articles</Button>
                        </Link>
                    </Empty>
                )}
            </div>
        </BlogLayout>
    );
}