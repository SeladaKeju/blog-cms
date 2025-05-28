import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Form, Row } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ArticleHeader from '@/Components/ArticleHeader';
import ArticleEditor from '@/Components/ArticleEditor';
import ArticleSidebar from '@/Components/ArticleSidebar';
import { useArticleForm } from '@/Hooks/useArticleForm';

export default function PostEdit({ post }) {
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
                published_at: post.published_at,
            });
            setContent(post.content || '');
        }
    }, [post, form, setContent]);

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
                        showDelete={true}
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
                                <ArticleEditor 
                                    content={content}
                                    onContentChange={setContent}
                                />
                                <ArticleSidebar 
                                    form={form}
                                    handleThumbnailChange={(fileList) => handleThumbnailChange(fileList, form)}
                                    currentThumbnail={post.thumbnail}
                                
                                />
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
                
                /* Action buttons styling */
                .article-action-btn {
                    border-radius: 6px;
                    height: 36px;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                
                .article-action-btn.ant-btn-primary {
                    background-color: #1677ff;
                    border: none;
                    box-shadow: 0 2px 0 rgba(5, 125, 255, 0.1);
                }
                
                .article-action-btn.ant-btn-primary:hover {
                    background-color: #4096ff;
                    transform: translateY(-1px);
                    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
                }
                
                .article-action-btn.ant-btn-default {
                    border-color: #d9d9d9;
                }
                
                .article-action-btn.ant-btn-default:hover {
                    border-color: #4096ff;
                    color: #4096ff;
                }
                
                .article-action-btn.ant-btn-danger {
                    background-color: #ff4d4f;
                    border: none;
                    color: #fff;
                }
                
                .article-action-btn.ant-btn-danger:hover {
                    background-color: #ff7875;
                    transform: translateY(-1px);
                    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </AuthenticatedLayout>
    );
}