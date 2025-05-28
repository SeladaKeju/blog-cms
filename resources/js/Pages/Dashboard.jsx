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

    return (
        <AuthenticatedLayout
            title="Dashboard" 
            subtitle="Overview of your blog performance"
            fullHeight={true}
        >
            <Head title="Dashboard" />

            <div className="h-full flex flex-col">
                {/* Header Section */}
                <div className="bg-white border-b border-gray-100" style={{ paddingLeft: '110px', paddingRight: '32px', paddingTop: '24px', paddingBottom: '24px' }}>
                    {/* Statistics Cards */}
                    <Row gutter={[24, 24]} className="mb-6">
                        <Col xs={24} sm={8}>
                            <Card
                                style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                bodyStyle={{ padding: '20px' }}
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div 
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '8px',
                                                backgroundColor: '#f0f9ff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <FileTextOutlined style={{ fontSize: '24px', color: '#0284c7' }} />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <Text type="secondary" className="text-sm font-medium">Total Articles</Text>
                                        <Title level={3} className="mb-0" style={{ color: '#0284c7', margin: 0 }}>
                                            {stats.total_articles}
                                        </Title>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card
                                style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                bodyStyle={{ padding: '20px' }}
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div 
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '8px',
                                                backgroundColor: '#f0fdf4',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <CheckCircleOutlined style={{ fontSize: '24px', color: '#16a34a' }} />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <Text type="secondary" className="text-sm font-medium">Published</Text>
                                        <Title level={3} className="mb-0" style={{ color: '#16a34a', margin: 0 }}>
                                            {stats.published_articles}
                                        </Title>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col xs={24} sm={8}>
                            <Card
                                style={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                bodyStyle={{ padding: '20px' }}
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div 
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '8px',
                                                backgroundColor: '#fefce8',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <EditOutlined style={{ fontSize: '24px', color: '#ca8a04' }} />
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <Text type="secondary" className="text-sm font-medium">Drafts</Text>
                                        <Title level={3} className="mb-0" style={{ color: '#ca8a04', margin: 0 }}>
                                            {stats.draft_articles}
                                        </Title>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    {/* Section Header */}
                    <div className="flex justify-between items-start gap-6 mb-6">
                        <div>
                            <Title level={4} className="mb-1">Recent Published Articles</Title>
                            <Text type="secondary">
                                {posts && posts.length > 0 
                                    ? `${posts.length} recent published article${posts.length !== 1 ? 's' : ''}`
                                    : 'No published articles yet'
                                }
                            </Text>
                        </div>
                        
                        <div className="flex gap-3">
                            <Button 
                                type="default"
                                icon={<EyeOutlined />}
                                onClick={() => window.open('/blog', '_blank')}
                                style={{
                                    borderRadius: '6px',
                                    height: '36px',
                                    fontWeight: '500'
                                }}
                            >
                                View Blog
                            </Button>
                            <Button 
                                type="default"
                                onClick={() => router.get('/article')}
                                style={{
                                    borderRadius: '6px',
                                    height: '36px',
                                    fontWeight: '500'
                                }}
                            >
                                Manage Articles
                            </Button>
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

                {/* Content Area */}
                <div className="flex-1 overflow-auto bg-gray-50">
                    <div style={{ paddingLeft: '96px', paddingRight: '32px', paddingTop: '24px', paddingBottom: '24px' }}>
                        {posts && posts.length > 0 ? (
                            <div className="space-y-4">
                                {posts.map((article) => (
                                    <div key={article.id} className="relative group">
                                        <ArticleCard
                                            article={article}
                                            onClick={() => handleViewPost(article)}
                                            showStatus={false}
                                            imageSize={{ width: 120, height: 80 }}
                                            titleSize={{ level: 5, fontSize: '16px' }}
                                            excerptRows={2}
                                        />
                                        {/* Edit Button Overlay */}
                                        <Button
                                            type="default"
                                            icon={<EditOutlined />}
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditPost(article);
                                            }}
                                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                            style={{
                                                borderRadius: '4px',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                backgroundColor: 'white'
                                            }}
                                        >
                                            Edit
                                        </Button>
                                    </div>
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
