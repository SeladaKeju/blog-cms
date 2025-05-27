import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { List, Button, Typography, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';

const { Title, Paragraph, Text } = Typography;

export default function ArticleManager({ posts }) {
    const handleEdit = (post) => {
        router.get(`/posts/${post.id}/edit`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published':
                return 'green';
            case 'draft':
                return 'orange';
            case 'archived':
                return 'red';
            default:
                return 'default';
        }
    };

    const getStatusText = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Article Manager" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <Title level={2} className="mb-0">Article Manager</Title>
                            <Text type="secondary">Manage your blog posts and articles</Text>
                        </div>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={() => {
                                router.get('/posts/create');
                            }}
                        >
                            New Article
                        </Button>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {posts && posts.length > 0 ? (
                                <List
                                    itemLayout="horizontal"
                                    dataSource={posts}
                                    pagination={{
                                        pageSize: 10,
                                        showSizeChanger: true,
                                        showQuickJumper: true,
                                        showTotal: (total, range) => 
                                            `${range[0]}-${range[1]} of ${total} articles`,
                                    }}
                                    renderItem={(item) => (
                                        <List.Item
                                            className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 rounded-lg p-4 -m-4 mb-4"
                                            onClick={() => handleEdit(item)}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    item.thumbnail ? (
                                                        <img
                                                            width={200}
                                                            alt={item.title}
                                                            src={item.thumbnail}
                                                            style={{
                                                                borderRadius: '8px',
                                                                objectFit: 'cover',
                                                                height: '133px'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{
                                                                width: 200,
                                                                height: 133,
                                                                backgroundColor: '#f0f0f0',
                                                                borderRadius: '8px',
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
                                                title={
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Title level={4} className="mb-0 hover:text-blue-600 transition-colors">
                                                            {item.title}
                                                        </Title>
                                                        <Tag color={getStatusColor(item.status)}>
                                                            {getStatusText(item.status)}
                                                        </Tag>
                                                    </div>
                                                }
                                                description={
                                                    <div>
                                                        <Paragraph className="mb-2" ellipsis={{ rows: 2 }}>
                                                            {item.excerpt}
                                                        </Paragraph>
                                                        <div className="flex flex-col gap-1">
                                                            <Text type="secondary" className="text-sm">
                                                                Created: {item.created_at}
                                                            </Text>
                                                            {item.is_published && (
                                                                <Text type="secondary" className="text-sm">
                                                                    Published: {item.published_date}
                                                                </Text>
                                                            )}
                                                            <Text type="secondary" className="text-sm">
                                                                Slug: /{item.slug}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            ) : (
                                <div className="text-center py-12">
                                    <Title level={4} type="secondary">No articles found</Title>
                                    <Paragraph type="secondary">
                                        Get started by creating your first blog post.
                                    </Paragraph>
                                    <Button 
                                        type="primary" 
                                        icon={<PlusOutlined />}
                                        onClick={() => router.get('/posts/create')}
                                    >
                                        Create First Article
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
