import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, Typography, Input, Select, Row, Col, Button } from 'antd';
import { FileTextOutlined, CheckCircleOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function Dashboard({ stats, posts, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [dateRange, setDateRange] = useState(filters?.date_range || '');
    const [sortBy, setSortBy] = useState(filters?.sort || 'published_at');
    const [sortOrder, setSortOrder] = useState(filters?.order || 'desc');

    const handleEdit = (post) => {
        router.get(`/posts/${post.id}/edit`);
    };

    const applyFilters = (newFilters = {}) => {
        const params = {
            search: searchTerm,
            date_range: dateRange,
            sort: sortBy,
            order: sortOrder,
            ...newFilters
        };

        // Remove empty values
        Object.keys(params).forEach(key => {
            if (!params[key] || params[key] === '') {
                delete params[key];
            }
        });

        router.get(route('dashboard'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        applyFilters({ search: value });
    };

    const handleDateRangeChange = (value) => {
        setDateRange(value);
        applyFilters({ date_range: value });
    };

    const handleSortChange = (value) => {
        setSortBy(value);
        applyFilters({ sort: value });
    };

    const handleOrderChange = (value) => {
        setSortOrder(value);
        applyFilters({ order: value });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setDateRange('');
        setSortBy('published_at');
        setSortOrder('desc');
        
        router.get(route('dashboard'), {}, {
            preserveState: false,
            replace: true,
        });
    };

    // Sync state with URL parameters
    useEffect(() => {
        setSearchTerm(filters?.search || '');
        setDateRange(filters?.date_range || '');
        setSortBy(filters?.sort || 'published_at');
        setSortOrder(filters?.order || 'desc');
    }, [filters]);

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

                    {/* Published Articles Header */}
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
                        
                        <Button 
                            type="default"
                            onClick={() => router.get('/article')}
                            style={{
                                borderRadius: '6px',
                                height: '36px',
                                fontWeight: '500'
                            }}
                        >
                            View All Articles
                        </Button>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex items-center gap-4 justify-between">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <Search
                                placeholder="Search published articles..."
                                allowClear
                                size="large"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onSearch={handleSearch}
                                onClear={() => handleSearch('')}
                                style={{ maxWidth: '400px' }}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-3 items-center flex-shrink-0">
                            <Text type="secondary" className="text-sm">Filter:</Text>
                            
                            <Select
                                placeholder="All Time"
                                allowClear
                                size="middle"
                                style={{ width: 120 }}
                                value={dateRange || undefined}
                                onChange={handleDateRangeChange}
                                className="filter-select"
                            >
                                <Option value="today">Today</Option>
                                <Option value="week">This Week</Option>
                                <Option value="month">This Month</Option>
                                <Option value="year">This Year</Option>
                            </Select>

                            <Select
                                size="middle"
                                style={{ width: 140 }}
                                value={sortBy}
                                onChange={handleSortChange}
                                className="filter-select"
                            >
                                <Option value="published_at">Published Date</Option>
                                <Option value="created_at">Created Date</Option>
                                <Option value="title">Title</Option>
                            </Select>

                            <Select
                                size="middle"
                                style={{ width: 100 }}
                                value={sortOrder}
                                onChange={handleOrderChange}
                                className="filter-select"
                            >
                                <Option value="desc">Newest</Option>
                                <Option value="asc">Oldest</Option>
                            </Select>

                            {(searchTerm || dateRange) && (
                                <Button 
                                    onClick={clearFilters}
                                    size="middle"
                                    type="link"
                                    style={{ padding: 0, height: 'auto' }}
                                >
                                    Clear
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto bg-gray-50">
                    <div style={{ paddingLeft: '96px', paddingRight: '32px', paddingTop: '24px', paddingBottom: '24px' }}>
                        {posts && posts.length > 0 ? (
                            <div className="space-y-4">
                                {posts.map((item) => (
                                    <Card
                                        key={item.id}
                                        className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200"
                                        onClick={() => handleEdit(item)}
                                        bodyStyle={{ padding: '20px' }}
                                        style={{ borderRadius: '8px' }}
                                    >
                                        <div className="flex gap-4">
                                            {/* Thumbnail */}
                                            <div className="flex-shrink-0">
                                                {item.thumbnail ? (
                                                    <img
                                                        width={120}
                                                        height={80}
                                                        alt={item.title}
                                                        src={item.thumbnail}
                                                        style={{
                                                            objectFit: 'cover',
                                                            width: '120px',
                                                            height: '80px'
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '120px',
                                                            height: '80px',
                                                            backgroundColor: '#f5f5f5',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#999'
                                                        }}
                                                    >
                                                        <FileTextOutlined style={{ fontSize: '24px' }} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1 min-w-0">
                                                        <Title 
                                                            level={5} 
                                                            className="mb-1 text-gray-900"
                                                            style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}
                                                        >
                                                            {item.title}
                                                        </Title>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <div
                                                                style={{
                                                                    width: '8px',
                                                                    height: '8px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: '#52c41a'
                                                                }}
                                                            />
                                                            <Text 
                                                                type="secondary" 
                                                                className="text-xs uppercase tracking-wide font-medium"
                                                            >
                                                                Published
                                                            </Text>
                                                        </div>
                                                    </div>
                                                    <Text type="secondary" className="text-xs whitespace-nowrap ml-4">
                                                        {item.published_date}
                                                    </Text>
                                                </div>
                                                
                                                <Paragraph 
                                                    className="text-gray-600 text-sm leading-relaxed mb-0" 
                                                    ellipsis={{ rows: 2 }}
                                                    style={{ margin: 0 }}
                                                >
                                                    {item.excerpt}
                                                </Paragraph>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="mb-4">
                                    <CheckCircleOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                                </div>
                                <Title level={4} type="secondary" className="mb-2">
                                    {searchTerm || dateRange 
                                        ? 'No published articles match your search' 
                                        : 'No published articles yet'
                                    }
                                </Title>
                                <Paragraph type="secondary" className="mb-6">
                                    {searchTerm || dateRange 
                                        ? 'Try adjusting your search terms or filters'
                                        : 'Publish your first article to see it here'
                                    }
                                </Paragraph>
                            </div>
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
