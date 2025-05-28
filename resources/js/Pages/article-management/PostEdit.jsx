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
            <AuthenticatedLayout>
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
        <AuthenticatedLayout>
            <Head title={`Edit - ${post.title}`} />
            
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
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
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
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
                                showStatus={true}
                            />
                        </Row>
                    </Form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}