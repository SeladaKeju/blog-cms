import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Button, Typography, Card, Input, Select, Space } from 'antd';
import { PlusOutlined, FileTextOutlined, SearchOutlined } from '@ant-design/icons';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function ArticleManager({ posts, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [sortBy, setSortBy] = useState(filters?.sort || 'created_at');
    const [sortOrder, setSortOrder] = useState(filters?.order || 'desc');

    const handleEdit = (post) => {
        router.get(`/posts/${post.id}/edit`);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'published':
                return '#52c41a';
            case 'draft':
                return '#faad14';
            case 'archived':
                return '#ff4d4f';
            default:
                return '#d9d9d9';
        }
    };

    const getStatusText = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const applyFilters = (newFilters = {}) => {
        const params = {
            search: searchTerm,
            status: statusFilter,
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

        router.get(route('article'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        applyFilters({ search: value });
    };

    const handleStatusChange = (value) => {
        setStatusFilter(value);
        applyFilters({ status: value });
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
        setStatusFilter('');
        setSortBy('created_at');
        setSortOrder('desc');
        
        router.get(route('article'), {}, {
            preserveState: false,
            replace: true,
        });
    };

    // Sync state with URL parameters
    useEffect(() => {
        setSearchTerm(filters?.search || '');
        setStatusFilter(filters?.status || '');
        setSortBy(filters?.sort || 'created_at');
        setSortOrder(filters?.order || 'desc');
    }, [filters]);

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
                    <div className="flex justify-between items-start gap-6 mb-6">
                        <div>
                            <Title level={3} className="mb-1">Articles</Title>
                            <Text type="secondary">
                                {posts && posts.length > 0 
                                    ? `${posts.length} article${posts.length !== 1 ? 's' : ''} found`
                                    : 'No articles found'
                                }
                            </Text>
                        </div>
                        
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={() => router.get('/posts/create')}
                            style={{
                                background: '#000',
                                borderColor: '#000',
                                borderRadius: '6px',
                                height: '40px',
                                fontWeight: '500'
                            }}
                        >
                            New Article
                        </Button>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex items-center gap-4 justify-between">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <Search
                                placeholder="Search"
                                allowClear
                                size="large"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onSearch={handleSearch}
                                onClear={() => handleSearch('')}
                                style={{ maxWidth: '500px' }}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-3 items-center flex-shrink-0">
                            <Text type="secondary" className="text-sm">Filter:</Text>
                            
                            <Select
                                placeholder="All Status"
                                allowClear
                                size="middle"
                                style={{ width: 120 }}
                                value={statusFilter || undefined}
                                onChange={handleStatusChange}
                                className="filter-select"
                            >
                                <Option value="published">Published</Option>
                                <Option value="draft">Draft</Option>
                                <Option value="archived">Archived</Option>
                            </Select>

                            <Select
                                size="middle"
                                style={{ width: 140 }}
                                value={sortBy}
                                onChange={handleSortChange}
                                className="filter-select"
                            >
                                <Option value="created_at">Created Date</Option>
                                <Option value="updated_at">Updated Date</Option>
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

                            {(searchTerm || statusFilter) && (
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
                            <div className="space-y-6">
                                {posts.map((item) => (
                                    <Card
                                        key={item.id}
                                        className="cursor-pointer hover:shadow-lg transition-all duration-200 border border-gray-200"
                                        onClick={() => handleEdit(item)}
                                        bodyStyle={{ padding: '24px' }}
                                        style={{ borderRadius: '8px' }}
                                    >
                                        <div className="flex gap-6">
                                            {/* Thumbnail */}
                                            <div className="flex-shrink-0">
                                                {item.thumbnail ? (
                                                    <img
                                                        width={180}
                                                        height={120}
                                                        alt={item.title}
                                                        src={item.thumbnail}
                                                        style={{
                                                            objectFit: 'cover',
                                                            width: '180px',
                                                            height: '120px'
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '180px',
                                                            height: '120px',
                                                            backgroundColor: '#f5f5f5',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#999'
                                                        }}
                                                    >
                                                        <FileTextOutlined style={{ fontSize: '32px' }} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <Title 
                                                            level={4} 
                                                            className="mb-2 text-gray-900"
                                                            style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}
                                                        >
                                                            {item.title}
                                                        </Title>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <div
                                                                style={{
                                                                    width: '10px',
                                                                    height: '10px',
                                                                    borderRadius: '50%',
                                                                    backgroundColor: getStatusColor(item.status)
                                                                }}
                                                            />
                                                            <Text 
                                                                type="secondary" 
                                                                className="text-sm uppercase tracking-wide font-semibold"
                                                            >
                                                                {getStatusText(item.status)}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                    <Text type="secondary" className="text-sm whitespace-nowrap ml-6">
                                                        {item.created_at}
                                                    </Text>
                                                </div>
                                                
                                                <Paragraph 
                                                    className="text-gray-600 text-base leading-relaxed mb-0" 
                                                    ellipsis={{ rows: 3 }}
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
                            <div className="text-center py-20">
                                <div className="mb-6">
                                    <FileTextOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />
                                </div>
                                <Title level={3} type="secondary" className="mb-3">
                                    {searchTerm || statusFilter 
                                        ? 'No articles match your search' 
                                        : 'No articles yet'
                                    }
                                </Title>
                                <Paragraph type="secondary" className="mb-8 text-lg">
                                    {searchTerm || statusFilter 
                                        ? 'Try adjusting your search terms or filters'
                                        : 'Create your first article to get started'
                                    }
                                </Paragraph>
                                {!(searchTerm || statusFilter) && (
                                    <Button 
                                        type="primary" 
                                        icon={<PlusOutlined />}
                                        onClick={() => router.get('/posts/create')}
                                        size="large"
                                        style={{
                                            background: '#000',
                                            borderColor: '#000',
                                            borderRadius: '6px',
                                            height: '48px',
                                            fontWeight: '500',
                                            fontSize: '16px'
                                        }}
                                    >
                                        Create First Article
                                    </Button>
                                )}
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
