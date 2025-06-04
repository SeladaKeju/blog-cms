import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
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
    Avatar,
    Typography,
    Badge,
    Dropdown,
    Form,
    Checkbox
} from 'antd';
import { 
    UserOutlined, 
    EyeOutlined, 
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    MoreOutlined,
    TeamOutlined,
    CrownOutlined,
    FileTextOutlined,
    PlusOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SearchAndFilters from '@/Components/SearchAndFilters';
import useFilters from '@/Hooks/useFilters';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { Title, Text } = Typography;

export default function UserManager({ users, filters = {}, stats = {} }) {
    // Define state for all filters
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [verifiedFilter, setVerifiedFilter] = useState(filters.verified || '');
    const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
    const [sortOrder, setSortOrder] = useState(filters.sort_order || 'desc');
    
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formMode, setFormMode] = useState('create');
    const [form] = Form.useForm();

    // Apply filters function
    const applyFilters = (newFilters = {}) => {
        router.get(route('admin.users.index'), {
            search: searchTerm,
            role: roleFilter,
            verified: verifiedFilter,
            sort_by: sortBy,
            sort_order: sortOrder,
            page: 1,
            ...newFilters
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Define handlers
    const handleSearch = () => applyFilters({ search: searchTerm });
    
    const handleRoleChange = (value) => {
        setRoleFilter(value);
        applyFilters({ role: value });
    };
    
    const handleVerifiedChange = (value) => {
        setVerifiedFilter(value);
        applyFilters({ verified: value });
    };
    
    const handleSortChange = (value) => {
        setSortBy(value);
        applyFilters({ sort_by: value });
    };
    
    const handleOrderChange = (value) => {
        setSortOrder(value);
        applyFilters({ sort_order: value });
    };
    
    const clearFilters = () => {
        setSearchTerm('');
        setRoleFilter('');
        setVerifiedFilter('');
        setSortBy('created_at');
        setSortOrder('desc');
        applyFilters({
            search: '',
            role: '',
            verified: '',
            sort_by: 'created_at',
            sort_order: 'desc'
        });
    };

    // Open Create Form
    const openCreateForm = () => {
        setFormMode('create');
        setEditingUser(null);
        form.resetFields();
        setIsFormOpen(true);
    };

    // Open Edit Form
    const openEditForm = (user) => {
        setFormMode('edit');
        setEditingUser(user);
        form.setFieldsValue({
            name: user.name,
            email: user.email,
            role: user.roles?.[0]?.name || 'viewer'
        });
        setIsFormOpen(true);
    };

    // Handle form submit
    const handleFormSubmit = (values) => {
        setLoading(true);

        if (formMode === 'create') {
            router.post(route('admin.users.store'), values, {
                onSuccess: () => {
                    message.success('User created successfully!');
                    setIsFormOpen(false);
                    form.resetFields();
                },
                onError: () => {
                    message.error('Failed to create user');
                },
                onFinish: () => setLoading(false)
            });
        } else {
            router.put(route('admin.users.update', editingUser.id), values, {
                onSuccess: () => {
                    message.success('User updated successfully!');
                    setIsFormOpen(false);
                    form.resetFields();
                },
                onError: () => {
                    message.error('Failed to update user');
                },
                onFinish: () => setLoading(false)
            });
        }
    };

    // Handle user deletion
    const handleDeleteUser = (user) => {
        confirm({
            title: `Delete User`,
            content: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
            okText: 'Yes, Delete',
            okType: 'danger',
            onOk() {
                router.delete(route('admin.users.destroy', user.id), {
                    onSuccess: () => {
                        message.success('User deleted successfully!');
                    },
                    onError: () => {
                        message.error('Failed to delete user');
                    }
                });
            }
        });
    };

    // Get role color
    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'red';
            case 'editor': return 'blue';
            case 'viewer': return 'green';
            default: return 'default';
        }
    };

    // Get role icon
    const getRoleIcon = (role) => {
        switch (role) {
            case 'admin': return <CrownOutlined />;
            case 'editor': return <EditOutlined />;
            case 'viewer': return <UserOutlined />;
            default: return <UserOutlined />;
        }
    };

    // Define filter configuration
    const filterConfig = [
        {
            placeholder: "All Roles",
            allowClear: true,
            width: 120,
            value: roleFilter,
            onChange: handleRoleChange,
            options: [
                { value: "admin", label: "Admin" },
                { value: "editor", label: "Editor" },
                { value: "viewer", label: "Viewer" }
            ]
        },
        {
            placeholder: "Verification",
            allowClear: true,
            width: 140,
            value: verifiedFilter,
            onChange: handleVerifiedChange,
            options: [
                { value: "1", label: "Verified" },
                { value: "0", label: "Unverified" }
            ]
        },
        {
            placeholder: "Sort By",
            allowClear: false,
            width: 140,
            value: sortBy,
            onChange: handleSortChange,
            options: [
                { value: "name", label: "Name" },
                { value: "email", label: "Email" },
                { value: "created_at", label: "Join Date" }
            ]
        },
        {
            placeholder: "Order",
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

    // Table columns
    const columns = [
        {
            title: 'User',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => (
                <div className="flex items-center gap-3">
                    <Avatar 
                        size={40} 
                        icon={<UserOutlined />}
                        src={record.avatar}
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{name}</span>
                            {record.email_verified_at ? (
                                <CheckCircleOutlined className="text-green-500" title="Verified" />
                            ) : (
                                <ExclamationCircleOutlined className="text-orange-500" title="Unverified" />
                            )}
                        </div>
                        <div className="text-sm text-gray-500">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles) => {
                const role = roles?.[0]?.name || 'viewer';
                return (
                    <Tag color={getRoleColor(role)} icon={getRoleIcon(role)}>
                        {role.toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <div className="space-y-1">
                    {record.email_verified_at ? (
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                            VERIFIED
                        </Tag>
                    ) : (
                        <Tag color="orange" icon={<ExclamationCircleOutlined />}>
                            UNVERIFIED
                        </Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Joined',
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
            title: 'Actions',
            key: 'actions',
            render: (_, record) => {
                const menuItems = [
                    {
                        key: 'edit',
                        label: 'Edit User',
                        icon: <EditOutlined />,
                        onClick: () => openEditForm(record)
                    },
                    { type: 'divider' },
                    {
                        key: 'delete',
                        label: 'Delete User',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => handleDeleteUser(record)
                    }
                ];

                return (
                    <Dropdown
                        menu={{ items: menuItems }}
                        trigger={['click']}
                    >
                        <Button
                            type="text"
                            icon={<MoreOutlined />}
                            title="More Actions"
                        />
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <AuthenticatedLayout
            title={
                <div className="flex flex-col space-y-1 py-1">
                    <h1 className="text-xl font-semibold text-gray-900 m-0">User Management</h1>
                    <p className="text-sm text-gray-500 m-0">Manage users and their roles</p>
                </div>
            }
        >
            <Head title="User Management" />

            <div className="px-6 py-6 md:px-10">
                <div className="user-management space-y-8 md:pl-[64px]">
                    {/* Header with Stats */}
                    <div className="flex justify-between items-start">
                        <div>
                            <Title level={2} className="mb-2">User Management</Title>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <Badge count={stats.total || 0} showZero color="#1677ff" />
                                    <Text className="text-gray-600">Total Users</Text>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge count={stats.admins || 0} showZero color="#ff4d4f" />
                                    <Text className="text-gray-600">Admins</Text>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge count={stats.editors || 0} showZero color="#1677ff" />
                                    <Text className="text-gray-600">Editors</Text>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge count={stats.viewers || 0} showZero color="#52c41a" />
                                    <Text className="text-gray-600">Viewers</Text>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openCreateForm}
                        >
                            Add User
                        </Button>
                    </div>

                    {/* Updated: SearchAndFilters component replacing the Card filter section */}
                    <div className="bg-white border border-gray-100 rounded-md shadow-sm">
                        <div className="px-6 py-5">
                            <SearchAndFilters
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                onSearch={handleSearch}
                                filters={filterConfig}
                                onClearFilters={clearFilters}
                                showClearButton={searchTerm || roleFilter || verifiedFilter || sortBy !== 'created_at' || sortOrder !== 'desc'}
                                searchPlaceholder="Search users by name or email..."
                            />
                        </div>
                    </div>

                    {/* Users Table */}
                    <Card>
                        <Table
                            columns={columns}
                            dataSource={users.data}
                            rowKey="id"
                            loading={loading}
                            pagination={{
                                current: users.current_page,
                                total: users.total,
                                pageSize: users.per_page,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                showTotal: (total, range) =>
                                    `${range[0]}-${range[1]} of ${total} users`,
                                onChange: (page, pageSize) => {
                                    router.get(route('admin.users.index'), {
                                        page,
                                        per_page: pageSize,
                                        search: searchTerm,
                                        role: roleFilter,
                                        verified: verifiedFilter,
                                        sort_by: sortBy,
                                        sort_order: sortOrder
                                    }, {
                                        preserveState: true,
                                        preserveScroll: true
                                    });
                                }
                            }}
                        />
                    </Card>

                    {/* User Form Modal - no changes needed here */}
                    <Modal
                        title={formMode === 'create' ? 'Create New User' : 'Edit User'}
                        open={isFormOpen}
                        onCancel={() => setIsFormOpen(false)}
                        footer={null}
                        width={600}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleFormSubmit}
                            className="mt-4"
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{ required: true, message: 'Please enter name' }]}
                            >
                                <Input placeholder="Enter user name" />
                            </Form.Item>

                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please enter email' },
                                    { type: 'email', message: 'Please enter valid email' }
                                ]}
                            >
                                <Input placeholder="Enter email address" />
                            </Form.Item>

                            {formMode === 'create' && (
                                <>
                                    <Form.Item
                                        label="Password"
                                        name="password"
                                        rules={[{ required: true, message: 'Please enter password' }]}
                                    >
                                        <Input.Password placeholder="Enter password" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Confirm Password"
                                        name="password_confirmation"
                                        rules={[
                                            { required: true, message: 'Please confirm password' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('Passwords do not match'));
                                                },
                                            }),
                                        ]}
                                    >
                                        <Input.Password placeholder="Confirm password" />
                                    </Form.Item>
                                </>
                            )}

                            <Form.Item
                                label="Role"
                                name="role"
                                rules={[{ required: true, message: 'Please select role' }]}
                            >
                                <Select placeholder="Select user role">
                                    <Option value="admin">Admin</Option>
                                    <Option value="editor">Editor</Option>
                                    <Option value="viewer">Viewer</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item className="mb-0">
                                <div className="flex justify-end gap-2">
                                    <Button onClick={() => setIsFormOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        {formMode === 'create' ? 'Create User' : 'Update User'}
                                    </Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}