import React from 'react';
import { Card, Typography } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

// Define standard thumbnail sizes
const THUMBNAIL_SIZES = {
    small: { width: 120, height: 80 },
    medium: { width: 180, height: 120 },
    large: { width: 240, height: 160 }
};

export default function ArticleCard({ 
    article, 
    onClick, 
    showStatus = true, 
    imageSize = THUMBNAIL_SIZES.medium, // Default to medium size
    thumbnailSize = 'medium', // Accept a size name (small, medium, large)
    titleSize = { level: 4, fontSize: '18px' },
    excerptRows = 3 
}) {
    
    // Determine the actual image size to use
    const actualImageSize = thumbnailSize ? 
        THUMBNAIL_SIZES[thumbnailSize] || THUMBNAIL_SIZES.medium : // Use named size if provided
        imageSize; // Fall back to custom size
    
    // Fungsi untuk menangani klik yang aman
    const handleCardClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (article && article.id && onClick) {
            onClick(article);
        } else {
            console.error("Invalid article data or onClick handler:", article);
        }
    };
    
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'published':
                return '#52c41a';
            case 'draft':
                return '#faad14';
            case 'archived':
                return '#ff4d4f';
            case 'pending_review':
                return '#1677ff';
            default:
                return '#d9d9d9';
        }
    };

    const getStatusText = (status) => {
        if (!status) return '';
        
        if (status.toLowerCase() === 'pending_review') {
            return 'Pending Review';
        }
        
        return status.charAt(0).toUpperCase() + status.slice(1);
    };
    
    // Perbaikan untuk URL thumbnail
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

    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200"
            onClick={handleCardClick}
            bodyStyle={{ padding: '24px' }}
            style={{ borderRadius: '8px' }}
            hoverable
        >
            <div className="flex gap-6">
                {/* Thumbnail dengan ukuran standar */}
                <div 
                    className="flex-shrink-0 rounded-md overflow-hidden"
                    style={{
                        width: `${actualImageSize.width}px`,
                        height: `${actualImageSize.height}px`,
                    }}
                >
                    {article.thumbnail ? (
                        <img
                            alt={article.title}
                            src={getThumbnailUrl(article.thumbnail)}
                            style={{
                                objectFit: 'cover',
                                width: '100%',
                                height: '100%'
                            }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/placeholder.jpg';
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#999',
                                border: '1px dashed #e0e0e0',
                                borderRadius: '6px',
                            }}
                        >
                            <FileTextOutlined style={{ fontSize: '32px' }} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                            <Title 
                                level={titleSize.level} 
                                className="mb-2 text-gray-900"
                                style={{ margin: 0, fontSize: titleSize.fontSize, fontWeight: '600' }}
                            >
                                {article.title}
                            </Title>
                            {showStatus && article.status && (
                                <div className="flex items-center gap-3 mt-2">
                                    <div
                                        style={{
                                            width: '10px',
                                            height: '10px',
                                            borderRadius: '50%',
                                            backgroundColor: getStatusColor(article.status)
                                        }}
                                    />
                                    <Text 
                                        type="secondary" 
                                        className="text-sm uppercase tracking-wide font-semibold"
                                    >
                                        {getStatusText(article.status)}
                                    </Text>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <Paragraph 
                        className="text-gray-600 text-base leading-relaxed mb-0" 
                        ellipsis={{ rows: excerptRows }}
                        style={{ margin: 0 }}
                    >
                        {article.excerpt}
                    </Paragraph>
                </div>
            </div>
        </Card>
    );
}