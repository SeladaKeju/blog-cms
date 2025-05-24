import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { List, Button, Space, Typography, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function BlogList({ posts }) {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const handleEdit = (post) => {
        setSelectedPost(post);
        setIsModalVisible(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Blog List" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-4 text-right">
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={() => {
                                router.get('/posts/create');
                            }}
                        >
                            New Article
                        </Button>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <List
                                itemLayout="horizontal"
                                dataSource={posts}
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[
                                            <Button 
                                                type="primary" 
                                                icon={<EditOutlined />}
                                                onClick={() => handleEdit(item)}
                                            >
                                                Edit
                                            </Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <img
                                                    width={200}
                                                    alt={item.title}
                                                    src={`/storage/${item.thumbnail}`}
                                                    style={{
                                                        borderRadius: '8px',
                                                        objectFit: 'cover',
                                                        height: '133px'
                                                    }}
                                                />
                                            }
                                            title={<Typography.Title level={4}>{item.title}</Typography.Title>}
                                            description={
                                                <>
                                                    <Typography.Paragraph>{item.excerpt}</Typography.Paragraph>
                                                    <Typography.Text type="secondary">
                                                        Published on: {item.published_date}
                                                    </Typography.Text>
                                                </>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
