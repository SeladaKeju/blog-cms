import { Button } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';

export default function ArticleHeader({ 
    title, 
    subtitle, 
    onSaveDraft, 
    onPublish, 
    onDelete,
    loading,
    deleteLoading,
    showDelete = false,
    publishText = "Publish",
    isPublished = false
}) {
    const handleBack = () => {
        router.get('/posts');
    };

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    {/* Left side - aligned with main header title */}
                    <div>
                        <Button 
                            icon={<ArrowLeftOutlined />} 
                            type="text" 
                            onClick={handleBack}
                            className="text-gray-600 hover:text-gray-900 mr-4"
                        />
                        <div>
                            <h1 className="text-xl font-semibold text-blue-500">{title}</h1>
                            <p className="text-sm text-gray-500">{subtitle}</p>
                        </div>
                    </div>
                    
                    {/* Right side - action buttons */}
                    <div className="flex items-center space-x-3">
                        {showDelete && (
                            <Button 
                                icon={<DeleteOutlined />}
                                danger
                                onClick={onDelete}
                                loading={deleteLoading}
                            >
                                Delete
                            </Button>
                        )}
                        <Button 
                            icon={<SaveOutlined />} 
                            onClick={onSaveDraft}
                            className="border-gray-300"
                            loading={loading}
                        >
                            Save Draft
                        </Button>
                        <Button 
                            type="primary" 
                            onClick={onPublish}
                            loading={loading}
                            className={isPublished ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}
                        >
                            {publishText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}