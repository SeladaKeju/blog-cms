import { Card, Typography } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function ArticleCard({ 
    article, 
    onClick, 
    showStatus = true, 
    imageSize = { width: 180, height: 120 },
    titleSize = { level: 4, fontSize: '20px' },
    excerptRows = 3 
}) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'published':
                return '#52c41a';
            case 'draft':
                return '#faad14';
            case 'archived':
                return '#ff4d4f';
            default:
                return '#d9d9d9';
        }
    };

    const getStatusText = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200"
            onClick={() => onClick(article)}
            bodyStyle={{ padding: '24px' }}
            style={{ borderRadius: '8px' }}
        >
            <div className="flex gap-6">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                    {article.thumbnail ? (
                        <img
                            width={imageSize.width}
                            height={imageSize.height}
                            alt={article.title}
                            src={article.thumbnail}
                            style={{
                                objectFit: 'cover',
                                width: `${imageSize.width}px`,
                                height: `${imageSize.height}px`
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: `${imageSize.width}px`,
                                height: `${imageSize.height}px`,
                                backgroundColor: '#f5f5f5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#999'
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
                                style={{ margin: 0, fontSize: titleSize.fontSize, fontWeight: '700' }}
                            >
                                {article.title}
                            </Title>
                            {showStatus && (
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
                        <Text type="secondary" className="text-sm whitespace-nowrap ml-6">
                            {article.created_at || article.published_date}
                        </Text>
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