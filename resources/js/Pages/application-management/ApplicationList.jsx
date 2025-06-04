import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { 
    Card, 
    Table, 
    Button, 
    Space, 
    Tag, 
    Input, 
    Select, 
    Modal, 
    message,
    Tooltip,
    Avatar,
    Badge,
    Typography
} from 'antd';
import { 
    EyeOutlined, 
    CheckOutlined, 
    SearchOutlined,
    UserOutlined,
    ClockCircleOutlined,
    CloseOutlined
} from '@ant-design/icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SearchAndFilters from '@/Components/SearchAndFilters';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { Title, Text } = Typography;

export default function ApplicationList({ applications, filters = {}, stats = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [loading, setLoading] = useState(false);

    // Handle search
    const handleSearch = () => {
        router.get(route('admin.editor-applications.index'), {
            search: searchTerm,
            status: statusFilter
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Handle status filter
    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        router.get(route('admin.editor-applications.index'), {
            search: searchTerm,
            status: value,
            page: 1
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Clear filters function
    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
        router.get(route('admin.editor-applications.index'), {
            search: '',
            status: ''
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Define filter configuration
    const filterConfig = [
        {
            placeholder: "Filter by Status",
            allowClear: true,
            width: 150,
            value: statusFilter,
            onChange: handleStatusFilter,
            options: [
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" }
            ]
        }
    ];

    // Regular approve with confirmation
    const handleApprove = (application) => {
        confirm({
            title: 'Approve Application',
            content: (
                <div>
                    <p>Approve <strong>{application.user?.name}</strong> as editor?</p>
                    <p className="text-sm text-gray-600">
                        User will get editor access and email verification.
                    </p>
                </div>
            ),
            okText: 'Yes, Approve',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk() {
                setLoading(true);
                router.post(route('admin.editor-applications.approve', application.id), {}, {
                    onSuccess: () => {
                        message.success(`${application.user.name} is now an editor!`);
                        setLoading(false);
                    },
                    onError: () => {
                        message.error('Failed to approve application');
                        setLoading(false);
                    }
                });
            }
        });
    };

    // Table columns
    const columns = [
        {
            title: 'Applicant',
            dataIndex: 'user',
            key: 'user',
            render: (user) => (
                <div className="flex items-center gap-3">
                    <Avatar 
                        size={40} 
                        icon={<UserOutlined />}
                        src={user?.avatar}
                    />
                    <div>
                        <div className="font-medium text-gray-900">{user?.name}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Motivation',
            dataIndex: 'motivation',
            key: 'motivation',
            render: (text) => (
                <div className="max-w-xs">
                    <Text className="text-sm" ellipsis={{ tooltip: text }}>
                        {text || 'No motivation provided'}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Applied',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => (
                <div className="text-sm">
                    <div>{new Date(date).toLocaleDateString()}</div>
                    <div className="text-gray-500">
                        {new Date(date).toLocaleTimeString()}
                    </div>
                </div>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const colors = {
                    pending: 'orange',
                    approved: 'green',
                    rejected: 'red'
                };
                const icons = {
                    pending: <ClockCircleOutlined />,
                    approved: <CheckOutlined />,
                    rejected: <CloseOutlined />
                };
                return (
                    <Tag color={colors[status]} icon={icons[status]}>
                        {status.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="View Details">
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => router.get(route('admin.editor-applications.show', record.id))}
                            size="small"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            title={
                <div className="flex flex-col space-y-1 py-1">
                    <h1 className="text-xl font-semibold text-gray-900 m-0">Editor Applications</h1>
                    <p className="text-sm text-gray-500 m-0">Review and manage editor applications</p>
                </div>
            }
        >
            <Head title="Editor Applications" />

            <div className="px-6 py-6 md:px-10">
                <div className="application-management space-y-8 md:pl-[64px]">
                    {/* Header with Stats */}
                    <div className="flex justify-between items-start">
                        <div>
                            <Title level={2} className="mb-2">Editor Applications</Title>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <Badge count={stats.total || 0} showZero color="#1677ff" />
                                    <Text className="text-gray-600">Total Applications</Text>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge count={stats.pending || 0} showZero color="#fa8c16" />
                                    <Text className="text-gray-600">Pending Review</Text>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge count={stats.approved || 0} showZero color="#52c41a" />
                                    <Text className="text-gray-600">Approved</Text>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Replace the Card with SearchAndFilters component */}
                    <div className="bg-white border border-gray-100 rounded-md shadow-sm">
                        <div className="px-6 py-5">
                            <SearchAndFilters
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                onSearch={handleSearch}
                                filters={filterConfig}
                                onClearFilters={clearFilters}
                                showClearButton={searchTerm || statusFilter}
                                searchPlaceholder="Search by applicant name or email..."
                            />
                        </div>
                    </div>

                    {/* Applications Table */}
                    <Card>
                        <Table
                            columns={columns}
                            dataSource={applications.data}
                            rowKey="id"
                            loading={loading}
                            pagination={{
                                current: applications.current_page,
                                total: applications.total,
                                pageSize: applications.per_page,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} applications`,
                                onChange: (page, pageSize) => {
                                    router.get(route('admin.editor-applications.index'), {
                                        page,
                                        per_page: pageSize,
                                        search: searchTerm,
                                        status: statusFilter
                                    }, {
                                        preserveState: true,
                                        preserveScroll: true
                                    });
                                }
                            }}
                        />
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}