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
    Avatar
} from 'antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined,
    SearchOutlined,
    UserOutlined
} from '@ant-design/icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserForm from './UserForm';

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

export default function UserManager({ users, filters = {} }) {
    // States
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formMode, setFormMode] = useState('create'); // 'create' | 'edit'

    // Handle search
    const handleSearch = (value) => {
        router.get(route('admin.users.index'), {
            search: value,
            role: roleFilter
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Handle role filter
    const handleRoleFilter = (value) => {
        setRoleFilter(value);
        router.get(route('admin.users.index'), {
            search: searchTerm,
            role: value
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    // Open Create Form
    const openCreateForm = () => {
        setFormMode('create');
        setEditingUser(null);
        setIsFormOpen(true);
    };

    // Open Edit Form
    const openEditForm = (user) => {
        setFormMode('edit');
        setEditingUser(user);
        setIsFormOpen(true);
    };

    // Handle Delete
    const handleDelete = (user) => {
        confirm({
            title: `Delete User: ${user.name}?`,
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                setLoading(true);
                router.delete(route('admin.users.destroy', user.id), {
                    onSuccess: () => {
                        message.success('User deleted successfully!');
                        setLoading(false);
                    },
                    onError: () => {
                        message.error('Failed to delete user.');
                        setLoading(false);
                    }
                });
            }
        });
    };

    // Close Form
    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingUser(null);
        setFormMode('create');
    };

    // Handle Form Success
    const handleFormSuccess = (message) => {
        setIsFormOpen(false);
        setEditingUser(null);
        setFormMode('create');
        message.success(message);
    };

    // Table columns
    const columns = [
        {
            title: 'User',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <Avatar 
                        size={40} 
                        icon={<UserOutlined />}
                        src={record.avatar}
                    />
                    <div>
                        <div className="font-medium text-gray-900">{text}</div>
                        <div className="text-sm text-gray-500">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'roles',
            key: 'role',
            render: (roles) => {
                const role = roles?.[0]?.name || 'No Role';
                const colors = {
                    admin: 'red',
                    editor: 'blue',
                    viewer: 'green'
                };
                return <Tag color={colors[role]}>{role.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Joined',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Status',
            dataIndex: 'email_verified_at',
            key: 'status',
            render: (verified) => (
                <Tag color={verified ? 'green' : 'orange'}>
                    {verified ? 'Verified' : 'Unverified'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Edit User">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openEditForm(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete User">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record)}
                            disabled={record.id === window.Laravel?.user?.id}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            title="User Management"
            subtitle="Manage platform users and their roles"
        >
            <Head title="User Management" />

            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                        <p className="text-gray-600 mt-1">
                            Total: {users.total} users
                        </p>
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={openCreateForm}
                    >
                        Add New User
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <div className="flex gap-4 items-center">
                        <Search
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onSearch={handleSearch}
                            style={{ width: 300 }}
                            enterButton={<SearchOutlined />}
                        />
                        <Select
                            placeholder="Filter by role"
                            value={roleFilter}
                            onChange={handleRoleFilter}
                            style={{ width: 150 }}
                            allowClear
                        >
                            <Option value="admin">Admin</Option>
                            <Option value="editor">Editor</Option>
                            <Option value="viewer">Viewer</Option>
                        </Select>
                    </div>
                </Card>

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
                                    role: roleFilter
                                }, {
                                    preserveState: true,
                                    preserveScroll: true
                                });
                            }
                        }}
                    />
                </Card>

                {/* User Form Modal */}
                <UserForm
                    open={isFormOpen}
                    mode={formMode}
                    user={editingUser}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                />
            </div>
        </AuthenticatedLayout>
    );
}