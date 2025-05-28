import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Input, Button, Form, message, Select, Upload, Row, Col, Tag } from 'antd';
import { ArrowLeftOutlined, PictureOutlined, SaveOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RichTextEditor from '@/Components/RichTextEditor';

const { TextArea } = Input;
const { Option } = Select;

export default function PostCreate() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');

    const handleBack = () => {
        router.get('/article');
    };

    const onFinish = async (values) => {
        setLoading(true);
        console.log('Form values:', values); // Debug
        
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
            
            // Set default status if not provided
            if (!values.status) {
                formData.append('status', 'draft');
            }

            console.log('Sending data...'); // Debug

            // Gunakan router.post dengan callback yang benar
            router.post('/posts', formData, {
                forceFormData: true,
                onSuccess: (page) => {
                    console.log('Success response:', page); // Debug
                    message.success('Post created successfully');
                    form.resetFields();
                    setContent('');
                    // Redirect ke article list
                    router.get('/article');
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors); // Debug
                    message.error('Failed to create post: ' + Object.values(errors).join(', '));
                },
                onFinish: () => {
                    setLoading(false);
                }
            });
        } catch (error) {
            console.error('Create error:', error);
            message.error('Failed to create post');
            setLoading(false);
        }
    };

    const handleThumbnailChange = ({ fileList }) => {
        form.setFieldsValue({ thumbnail: fileList[0] });
    };

    const saveDraft = () => {
        // Set status to draft dan submit form
        form.setFieldsValue({ status: 'draft' });
        form.submit();
    };

    const publishPost = () => {
        // Set status to published dan submit form
        form.setFieldsValue({ 
            status: 'published',
            published_at: new Date().toISOString().slice(0, 16)
        });
        form.submit();
    };

    return (
        <AuthenticatedLayout>
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
                                    <h1 className="text-xl font-semibold text-blue-500">Create Article</h1>
                                    <p className="text-sm text-gray-500">Write and publish your new blog post</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Button 
                                    icon={<SaveOutlined />} 
                                    onClick={saveDraft}
                                    className="border-gray-300"
                                >
                                    Save Draft
                                </Button>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={loading}
                                    onClick={() => form.submit()}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    Publish
                                </Button>
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
                                                    <div className="text-sm text-gray-600">Upload Image</div>
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