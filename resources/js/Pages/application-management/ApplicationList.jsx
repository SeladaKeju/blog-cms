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
    CloseOutlined,
    SearchOutlined,
    UserOutlined,
    ClockCircleOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ApplicationForm from './ApplicationForm';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { Title, Text } = Typography;

export default function ApplicationList({ applications, filters = {}, stats = {} }) {
    // States
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [loading, setLoading] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [reviewingApplication, setReviewingApplication] = useState(null);

    // Handle search
    const handleSearch = (value) => {
        router.get(route('editor-applications.index'), {
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
        router.get(route('editor-applications.index'), {
            search: searchTerm,
            status: value
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Open Review Modal
    const openReviewModal = (application) => {
        setReviewingApplication(application);
        setIsReviewOpen(true);
    };

    // Quick approve
    const handleQuickApprove = (application) => {
        confirm({
            title: `Approve Application from ${application.user?.name}?`,
            content: 'This will grant editor permissions to the user.',
            okText: 'Yes, Approve',
            okType: 'primary',
            cancelText: 'Cancel',
            onOk() {
                setLoading(true);
                router.post(route('editor-applications.approve', application.id), {}, {
                    onSuccess: () => {
                        message.success('Application approved successfully!');
                        setLoading(false);
                    },
                    onError: () => {
                        message.error('Failed to approve application.');
                        setLoading(false);
                    }
                });
            }
        });
    };

    // Quick reject
    const handleQuickReject = (application) => {
        confirm({
            title: `Reject Application from ${application.user?.name}?`,
            content: 'This action will deny the editor application.',
            okText: 'Yes, Reject',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                setLoading(true);
                router.post(route('editor-applications.reject', application.id), {
                    rejection_reason: 'Quick rejection'
                }, {
                    onSuccess: () => {
                        message.success('Application rejected.');
                        setLoading(false);
                    },
                    onError: () => {
                        message.error('Failed to reject application.');
                        setLoading(false);
                    }
                });
            }
        });
    };

    // Handle review close
    const handleReviewClose = () => {
        setIsReviewOpen(false);
        setReviewingApplication(null);
    };

    // Handle review success
    const handleReviewSuccess = (message) => {
        setIsReviewOpen(false);
        setReviewingApplication(null);
        message.success(message);
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
                            onClick={() => router.get(route('editor-applications.show', record.id))}
                        />
                    </Tooltip>
                    {record.status === 'pending' && (
                        <>
                            <Tooltip title="Review Application">
                                <Button
                                    type="text"
                                    icon={<FileTextOutlined />}
                                    onClick={() => openReviewModal(record)}
                                />
                            </Tooltip>
                            <Tooltip title="Quick Approve">
                                <Button
                                    type="text"
                                    icon={<CheckOutlined />}
                                    onClick={() => handleQuickApprove(record)}
                                    className="text-green-600 hover:text-green-700"
                                />
                            </Tooltip>
                            <Tooltip title="Quick Reject">
                                <Button
                                    type="text"
                                    icon={<CloseOutlined />}
                                    onClick={() => handleQuickReject(record)}
                                    className="text-red-600 hover:text-red-700"
                                />
                            </Tooltip>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            title="Editor Applications"
            subtitle="Review and manage editor applications"
        >
            <Head title="Editor Applications" />

            <div className="space-y-6">
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
                                router.get(route('editor-applications.index'), {
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

                {/* Review Modal */}
                <ApplicationForm
                    open={isReviewOpen}
                    application={reviewingApplication}
                    onClose={handleReviewClose}
                    onSuccess={handleReviewSuccess}
                />
            </div>
        </AuthenticatedLayout>
    );
}