import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { 
    Modal, 
    Form, 
    Input, 
    Select, 
    Switch,
    Divider,
    Alert,
    message
} from 'antd';
import { 
    UserOutlined, 
    MailOutlined, 
    LockOutlined
} from '@ant-design/icons';

const { Option } = Select;

export default function UserForm({ 
    open, 
    mode = 'create', // 'create' | 'edit'
    user = null, 
    onClose, 
    onSuccess 
}) {
    const [form] = Form.useForm();

    // Form state
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'viewer',
        change_password: false,
    });

    // Initialize form when modal opens
    useEffect(() => {
        if (open) {
            if (mode === 'edit' && user) {
                // Edit mode - populate with user data
                const userData = {
                    name: user.name,
                    email: user.email,
                    role: user.roles?.[0]?.name || 'viewer',
                    password: '',
                    password_confirmation: '',
                    change_password: false,
                };
                setData(userData);
                form.setFieldsValue(userData);
            } else {
                // Create mode - reset form
                const emptyData = {
                    name: '',
                    email: '',
                    password: '',
                    password_confirmation: '',
                    role: 'viewer',
                    change_password: false,
                };
                setData(emptyData);
                form.setFieldsValue(emptyData);
            }
        }
    }, [open, mode, user]);

    // Handle form submit
    const handleSubmit = () => {
        form.validateFields().then(() => {
            if (mode === 'edit' && user) {
                // Update existing user
                put(route('admin.users.update', user.id), {
                    onSuccess: () => {
                        onSuccess?.('User updated successfully!');
                        reset();
                        form.resetFields();
                    },
                    onError: () => {
                        message.error('Failed to update user.');
                    }
                });
            } else {
                // Create new user
                post(route('admin.users.store'), {
                    onSuccess: () => {
                        onSuccess?.('User created successfully!');
                        reset();
                        form.resetFields();
                    },
                    onError: () => {
                        message.error('Failed to create user.');
                    }
                });
            }
        }).catch(() => {
            message.error('Please check all required fields.');
        });
    };

    // Handle modal close
    const handleCancel = () => {
        onClose?.();
        reset();
        form.resetFields();
    };

    return (
        <Modal
            title={mode === 'edit' ? `Edit User: ${user?.name}` : 'Create New User'}
            open={open}
            onOk={handleSubmit}
            onCancel={handleCancel}
            confirmLoading={processing}
            width={600}
            okText={mode === 'edit' ? 'Update User' : 'Create User'}
            destroyOnClose={true}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={data}
                preserve={false}
            >
                {/* Basic Information */}
                <div className="space-y-4">
                    {/* Name */}
                    <Form.Item
                        label="Full Name"
                        name="name"
                        rules={[
                            { required: true, message: 'Please enter full name' },
                            { min: 2, message: 'Name must be at least 2 characters' }
                        ]}
                        validateStatus={errors.name ? 'error' : ''}
                        help={errors.name}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder="Enter full name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter email address' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                        validateStatus={errors.email ? 'error' : ''}
                        help={errors.email}
                    >
                        <Input
                            prefix={<MailOutlined />}
                            type="email"
                            placeholder="Enter email address"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                    </Form.Item>

                    {/* Role */}
                    <Form.Item
                        label="User Role"
                        name="role"
                        rules={[
                            { required: true, message: 'Please select user role' }
                        ]}
                        validateStatus={errors.role ? 'error' : ''}
                        help={errors.role}
                    >
                        <Select
                            value={data.role}
                            onChange={(value) => setData('role', value)}
                            placeholder="Select user role"
                        >
                            <Option value="viewer">
                                <div>
                                    <div className="font-medium">Viewer</div>
                                    <div className="text-xs text-gray-500">Can read and bookmark articles</div>
                                </div>
                            </Option>
                            <Option value="editor">
                                <div>
                                    <div className="font-medium">Editor</div>
                                    <div className="text-xs text-gray-500">Can create and manage content</div>
                                </div>
                            </Option>
                            <Option value="admin">
                                <div>
                                    <div className="font-medium">Admin</div>
                                    <div className="text-xs text-gray-500">Full platform access</div>
                                </div>
                            </Option>
                        </Select>
                    </Form.Item>
                </div>

                <Divider />

                {/* Password Section */}
                <div className="space-y-4">
                    {/* Password Toggle for Edit Mode */}
                    {mode === 'edit' && (
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-700">Change Password</span>
                            <Switch
                                checked={data.change_password}
                                onChange={(checked) => setData('change_password', checked)}
                            />
                        </div>
                    )}

                    {/* Password Fields */}
                    {(mode === 'create' || data.change_password) && (
                        <>
                            <Form.Item
                                label={mode === 'edit' ? "New Password" : "Password"}
                                name="password"
                                rules={[
                                    { 
                                        required: mode === 'create', 
                                        message: 'Please enter password' 
                                    },
                                    { 
                                        min: 8, 
                                        message: 'Password must be at least 8 characters' 
                                    }
                                ]}
                                validateStatus={errors.password ? 'error' : ''}
                                help={errors.password}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Enter password (min. 8 characters)"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </Form.Item>

                            <Form.Item
                                label={mode === 'edit' ? "Confirm New Password" : "Confirm Password"}
                                name="password_confirmation"
                                rules={[
                                    { 
                                        required: mode === 'create', 
                                        message: 'Please confirm password' 
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Passwords do not match'));
                                        },
                                    }),
                                ]}
                                validateStatus={errors.password_confirmation ? 'error' : ''}
                                help={errors.password_confirmation}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Confirm password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                            </Form.Item>
                        </>
                    )}
                </div>

                {/* Info Alert */}
                <Alert
                    message={mode === 'edit' ? "Account Modification" : "User Account Setup"}
                    description={
                        mode === 'edit' 
                            ? "Changes to user role will affect their access permissions immediately. Password changes will require the user to log in again."
                            : "The new user will receive email verification automatically. They can log in immediately with the provided credentials."
                    }
                    type={mode === 'edit' ? "warning" : "info"}
                    showIcon
                    className="mt-4"
                />
            </Form>
        </Modal>
    );
}