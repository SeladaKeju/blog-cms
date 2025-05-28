import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, Typography, Row, Col, Button } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, EditOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';
import ArticleCard from '@/Components/ArticleCard';
import SearchAndFilters from '@/Components/SearchAndFilters';
import EmptyState from '@/Components/EmptyState';
import useFilters from '@/Hooks/useFilters';

const { Title, Text } = Typography;

export default function Dashboard({ stats, posts, filters }) {
    const {
        searchTerm,
        setSearchTerm,
        dateRange,
        sortBy,
        sortOrder,
        handleSearch,
        handleDateRangeChange,
        handleSortChange,
        handleOrderChange,
        clearFilters
    } = useFilters(filters, 'dashboard');

    // View blog post on landing page
    const handleViewPost = (post) => {
        window.open(`/blog/${post.slug}`, '_blank');
    };

    // Edit post in CMS
    const handleEditPost = (post) => {
        router.get(`/posts/${post.id}/edit`);
    };

    const filterConfig = [
        {
            placeholder: "All Time",
            allowClear: true,
            width: 120,
            value: dateRange || undefined,
            onChange: handleDateRangeChange,
            options: [
                { value: "today", label: "Today" },
                { value: "week", label: "This Week" },
                { value: "month", label: "This Month" },
                { value: "year", label: "This Year" }
            ]
        },
        {
            placeholder: "Published Date",
            allowClear: false,
            width: 140,
            value: sortBy,
            onChange: handleSortChange,
            options: [
                { value: "published_at", label: "Published Date" },
                { value: "created_at", label: "Created Date" },
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

    // Consistent button component for viewing blog
    const ViewBlogButton = ({ text = "View Blog" }) => (
        <Button 
            type="default"
            icon={<EyeOutlined />}
            onClick={() => window.open('/blog', '_blank')}
            className="dashboard-btn"
        >
            {text}
        </Button>
    );

    // Consistent button component for managing articles
    const ManageArticlesButton = ({ text = "Manage Articles" }) => (
        <Button 
            type="default"
            onClick={() => router.get('/article')}
            className="dashboard-btn"
        >
            {text}
        </Button>
    );

    // Consistent create button component
    const CreateButton = ({ text = "New Article" }) => (
        <Button 
            type="primary"
            size="middle"
            icon={<PlusOutlined />}
            onClick={() => router.get('/posts/create')}
            className="create-button"
        >
            {text}
        </Button>
    );

    return (
        <AuthenticatedLayout
            title="Dashboard" 
            subtitle="Overview of your blog performance"
            fullHeight={true}
        >
            <Head title="Dashboard" />

            <div className="h-full flex flex-col">
                {/* Header Section - with consistent padding */}
                <div className="bg-white border-b border-gray-100 px-8 py-6">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-medium text-gray-800">Recent Published Articles</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {posts && posts.length > 0 
                                    ? `${posts.length} recent published article${posts.length !== 1 ? 's' : ''}`
                                    : 'No published articles yet'
                                }
                            </p>
                        </div>
                        
                        <div className="flex gap-3">
                            <ViewBlogButton />
                            <ManageArticlesButton />
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <SearchAndFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onSearch={handleSearch}
                        filters={filterConfig}
                        onClearFilters={clearFilters}
                        showClearButton={searchTerm || dateRange}
                        searchPlaceholder="Search published articles..."
                        searchMaxWidth="400px"
                    />
                </div>

                {/* Content Area - with consistent padding */}
                <div className="flex-1 overflow-auto bg-gray-50">
                    <div className="px-8 py-6">
                        {posts && posts.length > 0 ? (
                            <div className="space-y-6">
                                {posts.map((article) => (
                                    <ArticleCard
                                        key={article.id}
                                        article={article}
                                        onClick={() => handleViewPost(article)}
                                        showStatus={false}
                                        imageSize={{ width: 180, height: 120 }}
                                        titleSize={{ level: 4, fontSize: '20px' }}
                                        excerptRows={3}
                                        actionButtons={[
                                            <Button
                                                key="edit"
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditPost(article);
                                                }}
                                                className="card-action-btn"
                                            >
                                                Edit
                                            </Button>,
                                            <Button
                                                key="view"
                                                type="text"
                                                icon={<EyeOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewPost(article);
                                                }}
                                                className="card-action-btn"
                                            >
                                                View
                                            </Button>
                                        ]}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                icon={<CheckCircleOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
                                title={searchTerm || dateRange 
                                    ? 'No published articles match your search' 
                                    : 'No published articles yet'
                                }
                                description={searchTerm || dateRange 
                                    ? 'Try adjusting your search terms or filters'
                                    : 'Publish your first article to see it here'
                                }
                                buttonText="Create First Article"
                                buttonIcon={<PlusOutlined />}
                                onButtonClick={() => router.get('/posts/create')}
                                showButton={!(searchTerm || dateRange)}
                                customButton={<CreateButton text="Create First Article" />}
                            />
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                /* Styling for filters */
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
                
                /* Enhanced Create Button */
                .create-button {
                    border-radius: 6px !important;
                    background-color: #1677ff !important;
                    border: none !important;
                    box-shadow: 0 2px 0 rgba(5, 125, 255, 0.1) !important;
                    font-weight: 500 !important;
                    height: 36px !important;
                    padding: 0 16px !important;
                }
                
                .create-button:hover {
                    background-color: #4096ff !important;
                    transform: translateY(-1px);
                    box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1) !important;
                }
                
                .create-button:active {
                    transform: translateY(0);
                }
                
                /* Dashboard buttons */
                .dashboard-btn {
                    border-radius: 6px !important;
                    height: 36px !important;
                    font-weight: 500 !important;
                    border-color: #d9d9d9 !important;
                }
                
                .dashboard-btn:hover {
                    border-color: #4096ff !important;
                    color: #4096ff !important;
                }
                
                /* Card action buttons */
                .card-action-btn {
                    border-radius: 4px !important;
                    padding: 4px 12px !important;
                }
                
                .card-action-btn:hover {
                    color: #4096ff !important;
                    background-color: rgba(64, 150, 255, 0.1) !important;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
