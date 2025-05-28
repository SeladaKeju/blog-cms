import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';

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

    const handleEdit = (post) => {
        router.get(`/posts/${post.id}/edit`);
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

    return (
        <AuthenticatedLayout
            title="Blog: List of Articles" 
            subtitle="Manage your blog posts and articles"
            fullHeight={true}
        >
            <Head title="Article Manager" />

            <div className="h-full flex flex-col">
                {/* Header Section */}
                <div className="bg-white border-b border-gray-100" style={{ paddingLeft: '110px', paddingRight: '32px', paddingTop: '24px', paddingBottom: '24px' }}>
                    <PageHeader
                        title="Articles"
                        subtitle={posts && posts.length > 0 
                            ? `${posts.length} article${posts.length !== 1 ? 's' : ''} found`
                            : 'No articles found'
                        }
                        buttonText="New Article"
                        buttonIcon={<PlusOutlined />}
                        onButtonClick={() => router.get('/posts/create')}
                    />

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

                {/* Content Area */}
                <div className="flex-1 overflow-auto bg-gray-50">
                    <div style={{ paddingLeft: '96px', paddingRight: '32px', paddingTop: '24px', paddingBottom: '24px' }}>
                        {posts && posts.length > 0 ? (
                            <div className="space-y-6">
                                {posts.map((article) => (
                                    <ArticleCard
                                        key={article.id}
                                        article={article}
                                        onClick={handleEdit}
                                        showStatus={true}
                                        imageSize={{ width: 180, height: 120 }}
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
                                onButtonClick={() => router.get('/posts/create')}
                                showButton={!(searchTerm || statusFilter)}
                            />
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .filter-select .ant-select-selector {
                    border-radius: 6px !important;
                    border-color: #e5e7eb !important;
                }
                .filter-select:hover .ant-select-selector {
                    border-color: #d1d5db !important;
                }
                .filter-select.ant-select-focused .ant-select-selector {
                    border-color: #000 !important;
                    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1) !important;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
