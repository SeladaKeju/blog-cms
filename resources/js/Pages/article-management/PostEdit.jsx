import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Form, Row, Col } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ArticleHeader from '@/Components/ArticleHeader';
import ArticleEditor from '@/Components/ArticleEditor';
import EditSidebar from '@/Components/EditSidebar';
import { useArticleForm } from '@/Hooks/useArticleForm';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import dayjs from 'dayjs';

export default function PostEdit({ post }) {
    const { auth } = usePage().props;
    const userRole = auth.user?.roles?.[0]?.name || 'viewer';
    
    const [form] = Form.useForm();
    const {
        loading,
        deleteLoading,
        content,
        setContent,
        handleSubmit,
        handleSaveDraft,
        handlePublish,
        handleDelete,
        handleThumbnailChange
    } = useArticleForm(post);

    useEffect(() => {
        if (post) {
            form.setFieldsValue({
                title: post.title,
                excerpt: post.excerpt,
                status: post.status,
                published_at: post.published_at ? dayjs(post.published_at) : null,
            });
            setContent(post.content || '');
        }
    }, [post, form, setContent]);

    // Handle post status actions
    const handleSubmitForReview = () => {
        router.post(`/posts/${post.id}/submit-review`, {}, {
            onSuccess: () => {
                router.reload();
            }
        });
    };

    const handleApprove = () => {
        router.post(`/posts/${post.id}/approve`, {}, {
            onSuccess: () => {
                router.reload();
            }
        });
    };

    const handleReject = () => {
        router.post(`/posts/${post.id}/reject`, {}, {
            onSuccess: () => {
                router.reload();
            }
        });
    };

    if (!post) {
        return (
            <AuthenticatedLayout
                title="Error" 
                subtitle="The requested post could not be found"
            >
                <Head title="Error" />
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center">
                                <h1 className="text-2xl font-bold text-red-500">Error: No post data</h1>
                                <p className="text-gray-600 mt-2">The requested post could not be found.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            title={`Edit: ${post.title}`}
            subtitle={`Last updated: ${new Date(post.updated_at).toLocaleDateString()}`}
        >
            <Head title={`Edit - ${post.title}`} />
            
            {/* Main Content Area */}
            <div className="flex flex-col h-full">
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
                    <ArticleHeader
                        title="Edit Article"
                        subtitle="Update your blog post"
                        onSaveDraft={() => handleSaveDraft(form)}
                        onPublish={post.status !== 'published' ? () => handlePublish(form) : () => form.submit()}
                        onDelete={handleDelete}
                        loading={loading}
                        deleteLoading={deleteLoading}
                        showDelete={userRole === 'admin' || post.author_id === auth.user.id}
                        publishText={post.status !== 'published' ? "Publish" : "Update"}
                        isPublished={post.status === 'published'}
                    />
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 bg-gray-50 overflow-auto">
                    <div className="container mx-auto px-6 py-8 max-w-7xl">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            className="article-form"
                        >
                            <Row gutter={[32, 32]} className="flex-wrap">
                                {/* Main Editor - 2/3 width */}
                                <Col xs={24} lg={16}>
                                    <ArticleEditor 
                                        content={content}
                                        onContentChange={setContent}
                                        readOnly={userRole === 'viewer'}
                                    />
                                </Col>

                                {/* Edit Sidebar - 1/3 width */}
                                <Col xs={24} lg={8}>
                                    <div className="sticky top-4">
                                        <EditSidebar
                                            form={form}
                                            post={post}
                                            userRole={userRole}
                                            currentThumbnail={post.thumbnail}
                                            onThumbnailChange={(fileList) => handleThumbnailChange(fileList, form)}
                                            onSubmitForReview={handleSubmitForReview}
                                            onApprove={handleApprove}
                                            onReject={handleReject}
                                            loading={loading}
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>

            {/* Consistent Form Styling */}
            <style jsx global>{`
                .article-form .ant-form-item-label > label {
                    font-weight: 500;
                    color: #374151;
                }
                
                .article-form .ant-input, 
                .article-form .ant-picker,
                .article-form .ant-select-selector {
                    border-radius: 6px;
                    border-color: #e5e7eb;
                }
                
                .article-form .ant-input:hover, 
                .article-form .ant-picker:hover,
                .article-form .ant-select-selector:hover {
                    border-color: #d1d5db;
                }
                
                .article-form .ant-input:focus, 
                .article-form .ant-input-focused,
                .article-form .ant-picker-focused,
                .article-form .ant-select-focused .ant-select-selector {
                    border-color: #1677ff;
                    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
                }
            `}</style>
        </AuthenticatedLayout>
    );
}