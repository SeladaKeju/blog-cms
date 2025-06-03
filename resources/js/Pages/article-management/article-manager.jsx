import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';
import { Button } from 'antd';

import ArticleCard from '@/Components/ArticleCard';
import SearchAndFilters from '@/Components/SearchAndFilters';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';
import useFilters from '@/Hooks/useFilters';

export default function ArticleManager({ posts, filters }) {
    const {
        searchTerm,
        setSearchTerm,
        statusFilter,
        sortBy,
        sortOrder,
        handleSearch,
        handleStatusChange,
        handleSortChange,
        handleOrderChange,
        clearFilters
    } = useFilters(filters, 'article');

    const handleEdit = (article) => {
        if (!article) {
            console.error('No article provided to handleEdit function');
            return;
        }
        
        // Use slug instead of id for navigation
        router.get(`/posts/${article.slug}/edit`);
    };

    const handleCreateArticle = () => {
        router.get('/posts/create');
    };

    const filterConfig = [
        {
            placeholder: "All Status",
            allowClear: true,
            width: 120,
            value: statusFilter || undefined,
            onChange: handleStatusChange,
            options: [
                { value: "published", label: "Published" },
                { value: "draft", label: "Draft" },
                { value: "archived", label: "Archived" }
            ]
        },
        {
            placeholder: "Created Date",
            allowClear: false,
            width: 140,
            value: sortBy,
            onChange: handleSortChange,
            options: [
                { value: "created_at", label: "Created Date" },
                { value: "updated_at", label: "Updated Date" },
                { value: "title", label: "Title" }
            ]
        },
        {
            placeholder: "Newest",
            allowClear: false,
            width: 100,
            value: sortOrder,
            onChange: handleOrderChange,
            options: [
                { value: "desc", label: "Newest" },
                { value: "asc", label: "Oldest" }
            ]
        }
    ];

    // Simplified Create Button Component
    const CreateButton = ({ text = "New Article" }) => (
        <Button 
            type="primary"
            size="middle"
            icon={<PlusOutlined />}
            onClick={handleCreateArticle}
            className="create-button"
        >
            {text}
        </Button>
    );

    return (
        <AuthenticatedLayout
            title={
                <div className="flex flex-col space-y-1 py-1">
                    <h1 className="text-xl font-semibold text-gray-900 m-0">Article Manager</h1>
                    <p className="text-sm text-gray-500 m-0">Manage your blog posts and articles</p>
                </div>
            }
            fullHeight={true}
        >
            <Head title="Article Manager" />

            {/* Updated to match dashboard layout structure */}
            <div className="px-6 py-6 md:px-8">
                <div className="article-manager space-y-8 md:pl-[45px]">
                    {/* Header Section */}
                    <div className="bg-white border border-gray-100 rounded-md shadow-sm">
                        <div className="px-6 py-5">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-medium text-gray-800">Articles</h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {posts && posts.length > 0 
                                            ? `${posts.length} article${posts.length !== 1 ? 's' : ''} found`
                                            : 'No articles found'
                                        }
                                    </p>
                                </div>
                                
                                {/* Create button */}
                                <CreateButton />
                            </div>

                            <SearchAndFilters
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                onSearch={handleSearch}
                                filters={filterConfig}
                                onClearFilters={clearFilters}
                                showClearButton={searchTerm || statusFilter}
                                searchPlaceholder="Search articles..."
                            />
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white border border-gray-100 rounded-md shadow-sm">
                        <div className="px-6 py-6">
                            {posts && posts.length > 0 ? (
                                <div className="space-y-6">
                                    {posts.map((article) => (
                                        <ArticleCard
                                            key={article.id}
                                            article={article}
                                            onClick={() => handleEdit(article)}
                                            showStatus={true}
                                            thumbnailSize="medium"
                                            titleSize={{ level: 4, fontSize: '20px' }}
                                            excerptRows={3}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={<FileTextOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
                                    title={searchTerm || statusFilter 
                                        ? 'No articles match your search' 
                                        : 'No articles yet'
                                    }
                                    description={searchTerm || statusFilter 
                                        ? 'Try adjusting your search terms or filters'
                                        : 'Create your first article to get started'
                                    }
                                    buttonText="Create First Article"
                                    buttonIcon={<PlusOutlined />}
                                    onButtonClick={handleCreateArticle}
                                    showButton={!(searchTerm || statusFilter)}
                                    customButton={<CreateButton text="Create First Article" />}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
