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

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { Title, Text } = Typography;

export default function ApplicationList({ applications, filters = {}, stats = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [loading, setLoading] = useState(false);

    // Handle search
    const handleSearch = (value) => {
        router.get(route('admin.editor-applications.index'), {
            search: value,
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
            status: value
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

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
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => router.get(route('admin.editor-applications.show', record.id))}
                        />
                    </Tooltip>
                    {record.status === 'pending' && (
                        <Tooltip title="Approve Application">
                            <Button
                                type="text"
                                icon={<CheckOutlined />}
                                onClick={() => handleApprove(record)}
                                loading={loading}
                                className="text-green-600 hover:text-green-700"
                            />
                        </Tooltip>
                    )}
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

            {/* Updated to match admin dashboard layout structure */}
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

                    {/* Filters */}
                    <Card>
                        <div className="flex gap-4 items-center">
                            <Search
                                placeholder="Search by applicant name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onSearch={handleSearch}
                                style={{ width: 300 }}
                                enterButton={<SearchOutlined />}
                            />
                            <Select
                                placeholder="Filter by status"
                                value={statusFilter}
                                onChange={handleStatusFilter}
                                style={{ width: 150 }}
                                allowClear
                            >
                                <Option value="pending">Pending</Option>
                                <Option value="approved">Approved</Option>
                                <Option value="rejected">Rejected</Option>
                            </Select>
                        </div>
                    </Card>

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