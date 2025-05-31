import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { 
    Modal, 
    Form, 
    Input, 
    Button,
    Space,
    Alert,
    Typography,
    Avatar,
    Descriptions,
    Radio
} from 'antd';
import { 
    UserOutlined,
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

export default function ApplicationForm({ 
    open, 
    application, 
    onClose, 
    onSuccess 
}) {
    const [form] = Form.useForm();

    // Form state
    const { data, setData, post, processing, errors, reset } = useForm({
        status: '',
        rejection_reason: '', // CORRECT - matches controller validation
    });

    // Initialize form when modal opens
    useEffect(() => {
        if (open && application) {
            form.resetFields();
            setData({
                status: '',
                rejection_reason: '', // CORRECT - matches controller validation
            });
        }
    }, [open, application]);

    // Handle form submit
    const handleSubmit = () => {
        if (!data.status) {
            return;
        }

        form.validateFields().then(() => {
            const route = data.status === 'approved' 
                ? route('admin.applications.approve', application.id)
                : route('admin.applications.reject', application.id);

            post(route, {
                onSuccess: () => {
                    const message = data.status === 'approved' 
                        ? 'Application approved successfully!' 
                        : 'Application rejected.';
                    onSuccess?.(message);
                    reset();
                    form.resetFields();
                },
                onError: () => {
                    message.error('Failed to process application.');
                }
            });
        });
    };

    // Handle modal close
    const handleCancel = () => {
        onClose?.();
        reset();
        form.resetFields();
    };

    // ✅ NEW - Fix submit logic
    const handleApprove = () => {
        post(route('admin.editor-applications.approve', application.id), {}, {
            onSuccess: () => {
                onSuccess?.('Application approved successfully!');
                reset();
            },
        });
    };

    const handleReject = () => {
        post(route('admin.editor-applications.reject', application.id), {
            rejection_reason: data.rejection_reason, // CORRECT field
        }, {
            onSuccess: () => {
                onSuccess?.('Application rejected.');
                reset();
            },
        });
    };

    if (!application) return null;

    return (
        <Modal
            title="Review Editor Application"
            open={open}
            onCancel={handleCancel}
            width={700}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button 
                    key="reject" 
                    danger 
                    icon={<CloseOutlined />}
                    loading={processing && data.status === 'rejected'}
                    onClick={() => {
                        setData('status', 'rejected');
                        setTimeout(handleSubmit, 100);
                    }}
                    disabled={!data.rejection_reason && data.status === 'rejected'} // CORRECT field
                >
                    Reject
                </Button>,
                <Button 
                    key="approve" 
                    type="primary" 
                    icon={<CheckOutlined />}
                    loading={processing && data.status === 'approved'}
                    onClick={() => {
                        setData('status', 'approved');
                        setTimeout(handleSubmit, 100);
                    }}
                >
                    Approve
                </Button>,
            ]}
        >
            <div className="space-y-6">
                {/* Applicant Info */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                    <Avatar 
                        size={64} 
                        icon={<UserOutlined />}
                        src={application.user?.avatar}
                    />
                    <div className="flex-1">
                        <Title level={4} className="mb-2">{application.user?.name}</Title>
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Email">
                                {application.user?.email}
                            </Descriptions.Item>
                            <Descriptions.Item label="Current Role">
                                {application.user?.roles?.[0]?.name || 'viewer'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Applied On">
                                {new Date(application.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                </div>

                {/* Application Details */}
                <div>
                    <Title level={5} className="mb-3">Motivation</Title>
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                        <Text>{application.motivation}</Text> {/* CORRECT field */}
                    </div>
                </div>

                {application.experience && (
                    <div>
                        <Title level={5} className="mb-3">Experience</Title>
                        <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                            <Text>{application.experience}</Text>
                        </div>
                    </div>
                )}

                {application.portfolio_url && (
                    <div>
                        <Title level={5} className="mb-3">Portfolio</Title>
                        <a href={application.portfolio_url} target="_blank" rel="noopener noreferrer">
                            {application.portfolio_url}
                        </a>
                    </div>
                )}

                {/* Review Form */}
                <Form
                    form={form}
                    layout="vertical"
                    preserve={false}
                >
                    <Form.Item 
                        label="Decision"
                        required
                    >
                        <Radio.Group 
                            value={data.status} 
                            onChange={(e) => setData('status', e.target.value)}
                        >
                            <Space direction="vertical">
                                <Radio value="approved">
                                    <span className="text-green-600 font-medium">
                                        Approve Application
                                    </span>
                                    <div className="text-sm text-gray-500 ml-6">
                                        Grant editor permissions to this user
                                    </div>
                                </Radio>
                                <Radio value="rejected">
                                    <span className="text-red-600 font-medium">
                                        Reject Application
                                    </span>
                                    <div className="text-sm text-gray-500 ml-6">
                                        Deny editor permissions (requires reason)
                                    </div>
                                </Radio>
                            </Space>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label={data.status === 'rejected' ? "Rejection Reason (Required)" : "Admin Notes (Optional)"}
                        rules={data.status === 'rejected' ? [
                            { required: true, message: 'Please provide a reason for rejection' }
                        ] : []}
                        validateStatus={errors.rejection_reason ? 'error' : ''} // CORRECT field
                        help={errors.rejection_reason}
                    >
                        <TextArea
                            rows={4}
                            placeholder={
                                data.status === 'rejected' 
                                    ? "Please explain why this application is being rejected..."
                                    : "Add any notes about this application (optional)..."
                            }
                            value={data.rejection_reason} // CORRECT field
                            onChange={(e) => setData('rejection_reason', e.target.value)} // CORRECT
                        />
                    </Form.Item>
                </Form>

                {/* Approval Alert */}
                {data.status === 'approved' && (
                    <Alert
                        message="Application Approval"
                        description="The user will be granted editor permissions and will be able to create and manage content on the platform."
                        type="success"
                        showIcon
                    />
                )}

                {/* Rejection Alert */}
                {data.status === 'rejected' && (
                    <Alert
                        message="Application Rejection"
                        description="The user will be notified of the rejection. They can apply again in the future."
                        type="warning"
                        showIcon
                    />
                )}
            </div>
        </Modal>
    );
}