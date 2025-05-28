import { Form, Row } from 'antd';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ArticleHeader from '@/Components/ArticleHeader';
import ArticleEditor from '@/Components/ArticleEditor';
import ArticleSidebar from '@/Components/ArticleSidebar';
import { useArticleForm } from '@/Hooks/useArticleForm';

export default function PostCreate() {
    const [form] = Form.useForm();
    const {
        loading,
        content,
        setContent,
        handleSubmit,
        handleSaveDraft,
        handlePublish,
        handleThumbnailChange
    } = useArticleForm();

    return (
        <AuthenticatedLayout>
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
                <ArticleHeader
                    title="Create Article"
                    subtitle="Write and publish your new blog post"
                    onSaveDraft={() => handleSaveDraft(form)}
                    onPublish={() => handlePublish(form)}
                    loading={loading}
                    publishText="Publish"
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
                            />
                        </Row>
                    </Form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}