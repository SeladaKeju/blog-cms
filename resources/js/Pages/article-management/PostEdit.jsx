import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Input, Button, Form, message, Select, Upload, Row, Col, Modal } from 'antd';
import { ArrowLeftOutlined, PictureOutlined, SaveOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RichTextEditor from '@/Components/RichTextEditor';

const { TextArea } = Input;
const { Option } = Select;
const { confirm } = Modal;

export default function PostEdit({ post }) {
    console.log('PostEdit component rendered!');
    console.log('Post data:', post);

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [content, setContent] = useState(post?.content || '');

    useEffect(() => {
        if (post) {
            form.setFieldsValue({
                title: post.title,
                excerpt: post.excerpt,
                status: post.status,
                published_at: post.published_at,
            });
            setContent(post.content || '');
        }
    }, [post, form]);

    const handleBack = () => {
        router.get('/article');
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            
            // Append all form fields
            Object.keys(values).forEach(key => {
                if (key === 'thumbnail' && values[key]?.file) {
                    formData.append('thumbnail', values[key].file);
                } else if (values[key] !== undefined && values[key] !== null) {
                    formData.append(key, values[key]);
                }
            });
            
            // Add content from rich text editor
            formData.append('content', content);
            
            // Method spoofing untuk PUT request
            formData.append('_method', 'PUT');

            router.post(`/posts/${post.id}`, formData, {
                forceFormData: true,
                onSuccess: () => {
                    message.success('Post updated successfully');
                },
                onError: (errors) => {
                    console.error('Update errors:', errors);
                    message.error('Failed to update post');
                }
            });
        } catch (error) {
            console.error('Update error:', error);
            message.error('Failed to update post');
        } finally {
            setLoading(false);
        }
    };

    const handleThumbnailChange = ({ fileList }) => {
        form.setFieldsValue({ thumbnail: fileList[0] });
    };

    const saveDraft = () => {
        form.setFieldsValue({ status: 'draft' });
        form.submit();
    };

    const publishPost = () => {
        form.setFieldsValue({ 
            status: 'published',
            published_at: new Date().toISOString().slice(0, 16)
        });
        form.submit();
    };

    const handleDelete = () => {
        confirm({
            title: 'Delete Article',
            icon: <ExclamationCircleOutlined />,
            content: (
                <div>
                    <p>Are you sure you want to delete this article?</p>
                    <p><strong>"{post.title}"</strong></p>
                    <p className="text-red-500">This action cannot be undone.</p>
                </div>
            ),
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                setDeleteLoading(true);
                router.delete(`/posts/${post.id}`, {
                    onSuccess: () => {
                        message.success('Post deleted successfully');
                        router.get('/article');
                    },
                    onError: () => {
                        message.error('Failed to delete post');
                        setDeleteLoading(false);
                    }
                });
            },
        });
    };

    if (!post) {
        return (
            <AuthenticatedLayout>
                <Head title="Error" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h1 className="text-2xl font-bold text-red-500">Error: No post data</h1>
                                <pre>{JSON.stringify(post, null, 2)}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Edit - ${post.title}`} />
            
            <div className="min-h-screen bg-gray-50">
                {/* Header Section */}
                <div className="bg-white border-b sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <Button 
                                    icon={<ArrowLeftOutlined />} 
                                    type="text" 
                                    onClick={handleBack}
                                    className="text-gray-600 hover:text-gray-900"
                                />
                                <div>
                                    <h1 className="text-xl font-semibold text-blue-500">Edit Article</h1>
                                    <p className="text-sm text-gray-500">Update your blog post</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button 
                                    icon={<DeleteOutlined />}
                                    danger
                                    onClick={handleDelete}
                                    loading={deleteLoading}
                                >
                                    Delete
                                </Button>
                                <Button 
                                    icon={<SaveOutlined />} 
                                    onClick={saveDraft}
                                    className="border-gray-300"
                                    loading={loading}
                                >
                                    Save Draft
                                </Button>
                                {post.status !== 'published' ? (
                                    <Button 
                                        type="primary" 
                                        onClick={publishPost}
                                        loading={loading}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        Publish
                                    </Button>
                                ) : (
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        loading={loading}
                                        onClick={() => form.submit()}
                                        className="bg-blue-600 hover:bg-blue-700"
                                    >
                                        Update
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        className="space-y-0"
                    >
                        <Row gutter={32}>
                            {/* Main Editor Column */}
                            <Col xs={24} lg={16}>
                                <div className="bg-white rounded-lg shadow-sm border">
                                    {/* Title Section */}
                                    <div className="border-b p-6">
                                        <Form.Item
                                            name="title"
                                            rules={[{ required: true, message: 'Please input the title!' }]}
                                            className="mb-0"
                                        >
                                            <Input 
                                                placeholder="Enter your article title..." 
                                                className="text-2xl font-bold border-0 px-0 focus:shadow-none"
                                                bordered={false}
                                                style={{ fontSize: '24px', fontWeight: '600' }}
                                            />
                                        </Form.Item>
                                    </div>

                                    {/* Content Editor */}
                                    <div className="p-6">
                                        <Form.Item
                                            name="content"
                                            className="mb-0"
                                        >
                                            <RichTextEditor 
                                                content={content}
                                                onChange={setContent}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </Col>

                            {/* Sidebar */}
                            <Col xs={24} lg={8}>
                                <div className="space-y-6">
                                    {/* Publish Settings */}
                                    <div className="bg-white rounded-lg shadow-sm border p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish Settings</h3>
                                        
                                        <Form.Item
                                            label="Status"
                                            name="status"
                                            className="mb-4"
                                        >
                                            <Select placeholder="Select status" className="w-full">
                                                <Option value="draft">Draft</Option>
                                                <Option value="published">Published</Option>
                                                <Option value="archived">Archived</Option>
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="Publish Date"
                                            name="published_at"
                                            className="mb-0"
                                        >
                                            <Input 
                                                type="datetime-local"
                                                className="w-full"
                                            />
                                        </Form.Item>
                                    </div>

                                    {/* Excerpt */}
                                    <div className="bg-white rounded-lg shadow-sm border p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Excerpt</h3>
                                        <Form.Item
                                            name="excerpt"
                                            rules={[{ required: true, message: 'Please input the excerpt!' }]}
                                            className="mb-0"
                                        >
                                            <TextArea 
                                                rows={4}
                                                placeholder="Write a brief description of your article..."
                                                showCount
                                                maxLength={200}
                                                className="resize-none"
                                            />
                                        </Form.Item>
                                    </div>

                                    {/* Featured Image */}
                                    <div className="bg-white rounded-lg shadow-sm border p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
                                        {post.thumbnail && (
                                            <div className="mb-4">
                                                <img 
                                                    src={post.thumbnail} 
                                                    alt="Current thumbnail"
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <p className="text-sm text-gray-500 mt-2">Current featured image</p>
                                            </div>
                                        )}
                                        <Form.Item
                                            name="thumbnail"
                                            className="mb-0"
                                        >
                                            <Upload
                                                listType="picture-card"
                                                maxCount={1}
                                                beforeUpload={() => false}
                                                onChange={handleThumbnailChange}
                                                accept="image/*"
                                                className="w-full"
                                            >
                                                <div className="text-center">
                                                    <PictureOutlined className="text-2xl text-gray-400 mb-2" />
                                                    <div className="text-sm text-gray-600">
                                                        {post.thumbnail ? 'Change Image' : 'Upload Image'}
                                                    </div>
                                                </div>
                                            </Upload>
                                        </Form.Item>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}