import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Input, Button, Form, message, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RichTextEditor from '@/Components/RichTextEditor';

export default function PostCreate() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        router.get('/article');
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await router.post('/posts', values);
            message.success('Post created successfully');
            form.resetFields();
        } catch (error) {
            message.error('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="absolute top-10">
                        <Button 
                            onClick={handleBack}
                            icon={<ArrowLeftOutlined />}
                            className="flex items-center"
                        >
                        </Button>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mt-12">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label="Title"
                                name="title"
                                rules={[{ required: true, message: 'Please input the title!' }]}
                            >
                                <Input size="large" placeholder="Enter post title" />
                            </Form.Item>

                            <Form.Item
                                label="Content"
                                name="content"
                                rules={[{ required: true, message: 'Please input the content!' }]}
                            >
                                <RichTextEditor />
                            </Form.Item>

                            <Form.Item>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={loading}
                                    size="large"
                                >
                                    Publish Post
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}