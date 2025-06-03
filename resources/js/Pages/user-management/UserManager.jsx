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

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;
const { Title, Text } = Typography;

export default function UserManager({ users, filters = {}, stats = {} }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formMode, setFormMode] = useState('create');
    const [form] = Form.useForm();

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
                    {/* Debug: Show raw value temporarily */}
                    <div className="text-xs text-gray-400">
                        {record.email_verified_at || 'null'}
                    </div>
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

            {/* Updated to match admin dashboard layout structure */}
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

                    {/* Filters */}
                    <Card>
                        <div className="flex gap-4 items-center">
                            <Search
                                placeholder="Search by name or email..."
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