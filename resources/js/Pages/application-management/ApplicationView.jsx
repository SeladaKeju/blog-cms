import React from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { 
    Card, 
    Button, 
    Avatar, 
    Descriptions,
    Tag,
    Typography,
    Space,
    Alert,
    message
} from 'antd';
import { 
    ArrowLeftOutlined,
    UserOutlined,
    EditOutlined,
    CheckOutlined,
    CloseOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const { Title, Text } = Typography;

export default function ApplicationView({ application }) {
    const statusColors = {
        pending: 'orange',
        approved: 'green',
        rejected: 'red'
    };

    const statusIcons = {
        pending: <ClockCircleOutlined />,
        approved: <CheckOutlined />,
        rejected: <CloseOutlined />
    };

    return (
        <AuthenticatedLayout
            title="Application Details"
            subtitle={`Editor application from ${application.user?.name}`}
        >
            <Head title={`Application - ${application.user?.name}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button 
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.get(route('admin.editor-applications.index'))}
                        >
                            Back to Applications
                        </Button>
                        <div>
                            <Title level={2} className="mb-0">Application Details</Title>
                            <Text className="text-gray-600">
                                Review editor application and take action
                            </Text>
                        </div>
                    </div>
                    {application.status === 'pending' && (
                        <Space>
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                onClick={() => {
                                    router.post(route('admin.editor-applications.approve', application.id), {}, {
                                        onSuccess: () => {
                                            message.success('Application approved!');
                                            // Auto refresh or redirect
                                        },
                                    });
                                }}
                            >
                                Approve
                            </Button>
                            <Button
                                danger
                                icon={<CloseOutlined />}
                                onClick={() => {
                                    const reason = prompt('Please provide a reason for rejection:');
                                    if (reason) {
                                        router.post(route('admin.editor-applications.reject', application.id), {
                                            rejection_reason: reason
                                        }, {
                                            onSuccess: () => {
                                                message.success('Application rejected!');
                                            },
                                        });
                                    }
                                }}
                            >
                                Reject
                            </Button>
                        </Space>
                    )}
                </div>

                {/* Application Status */}
                <Alert
                    message={`Application Status: ${application.status.toUpperCase()}`}
                    description={
                        application.status === 'pending' 
                            ? 'This application is awaiting review.'
                            : application.status === 'approved'
                            ? 'This application has been approved and the user has been granted editor permissions.'
                            : 'This application has been rejected.'
                    }
                    type={
                        application.status === 'approved' ? 'success' :
                        application.status === 'rejected' ? 'error' : 'info'
                    }
                    showIcon
                />

                {/* Applicant Information */}
                <Card title="Applicant Information">
                    <div className="flex items-start gap-6">
                        <Avatar 
                            size={80} 
                            icon={<UserOutlined />}
                            src={application.user?.avatar}
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <Title level={3} className="mb-0">{application.user?.name}</Title>
                                <Tag color={statusColors[application.status]} icon={statusIcons[application.status]}>
                                    {application.status.toUpperCase()}
                                </Tag>
                            </div>
                            
                            <Descriptions column={2}>
                                <Descriptions.Item label="Email">
                                    {application.user?.email}
                                </Descriptions.Item>
                                <Descriptions.Item label="Current Role">
                                    {application.user?.roles?.[0]?.name || 'viewer'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Member Since">
                                    {new Date(application.user?.created_at).toLocaleDateString()}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email Verified">
                                    {application.user?.email_verified_at ? 'Yes' : 'No'}
                                </Descriptions.Item>
                            </Descriptions>
                        </div>
                    </div>
                </Card>

                {/* Application Details */}
                <Card title="Application Details">
                    <Descriptions column={1}>
                        <Descriptions.Item label="Application Date">
                            {new Date(application.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Descriptions.Item>
                        <Descriptions.Item label="Reason for Application">
                            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                                {application.reason}
                            </div>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Review Information */}
                {(application.status === 'approved' || application.status === 'rejected') && (
                    <Card title="Review Information">
                        <Descriptions column={1}>
                            <Descriptions.Item label="Reviewed Date">
                                {new Date(application.updated_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </Descriptions.Item>
                            {application.admin_notes && (
                                <Descriptions.Item label="Admin Notes">
                                    <div className="p-4 bg-gray-50 border-l-4 border-gray-400 rounded">
                                        {application.admin_notes}
                                    </div>
                                </Descriptions.Item>
                            )}
                        </Descriptions>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}