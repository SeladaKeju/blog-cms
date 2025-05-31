import { Form, Row, Col } from 'antd';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ArticleHeader from '@/Components/ArticleHeader';
import ArticleEditor from '@/Components/ArticleEditor';
import ArticleSidebar from '@/Components/ArticleSidebar'; // Keep original for create
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
        <AuthenticatedLayout
            title="Create New Article"
            subtitle="Write and publish your new blog post"
        >
            <Head title="Create Article" />

            {/* Main Content Area */}
            <div className="flex flex-col h-full">
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
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
                <div className="flex-1 bg-gray-50 overflow-auto">
                    <div className="container mx-auto px-6 py-8 max-w-7xl">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            className="article-form"
                        >
                            <Row gutter={[32, 32]} className="flex-wrap">
                                {/* Main Editor */}
                                <Col xs={24} lg={16}>
                                    <ArticleEditor 
                                        content={content}
                                        onContentChange={setContent}
                                    />
                                </Col>

                                {/* Original Sidebar for Create */}
                                <Col xs={24} lg={8}>
                                    <div className="sticky top-4">
                                        <ArticleSidebar 
                                            form={form}
                                            handleThumbnailChange={(fileList) => handleThumbnailChange(fileList, form)}
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
            `}</style>
        </AuthenticatedLayout>
    );
}