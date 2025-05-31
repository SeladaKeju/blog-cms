import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, Button, Typography, Space, Tag, Avatar, Modal, Input, message, Descriptions, Spin } from 'antd';
import { 
    UserOutlined, 
    CheckCircleOutlined, 
    CloseCircleOutlined,
    ArrowLeftOutlined,
    LinkOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

export default function ApplicationDetail({ application }) {
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);

    // Simple approve handler
    const handleApprove = () => {
        confirm({
            title: 'Approve Application',
            content: `Approve ${application.user.name}'s editor application?`,
            okText: 'Approve',
            cancelText: 'Cancel',
            onOk() {
                setProcessing(true);
                
                router.post(route('admin.editor-applications.approve', application.id), {}, {
                    onFinish: () => setProcessing(false),
                    onSuccess: () => {
                        message.success('Application approved!');
                    },
                    onError: () => {
                        message.error('Failed to approve application');
                    }
                });
            },
        });
    };

    // Simple reject handler
    const handleReject = () => {
        setProcessing(true);
        
        router.post(route('admin.editor-applications.reject', application.id), {
            rejection_reason: rejectionReason || 'No reason provided'
        }, {
            onFinish: () => {
                setProcessing(false);
                setRejectModalVisible(false);
                setRejectionReason('');
            },
            onSuccess: () => {
                message.success('Application rejected!');
            },
            onError: () => {
                message.error('Failed to reject application');
            }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'orange';
            case 'approved': return 'green';
            case 'rejected': return 'red';
            default: return 'default';
        }
    };

    return (
        <AuthenticatedLayout
            title="Application Review"
            subtitle="Review editor application details"
        >
            <Head title="Application Detail" />

            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <Button 
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.get(route('admin.editor-applications.index'))}
                        className="mb-4"
                    >
                        Back to Applications
                    </Button>
                    
                    <div className="flex justify-between items-start">
                        <div>
                            <Title level={2} className="mb-2">
                                Editor Application Review
                            </Title>
                            <Text type="secondary">
                                Submitted on {new Date(application.created_at).toLocaleDateString()}
                            </Text>
                        </div>
                        <Tag color={getStatusColor(application.status)} className="text-sm py-1 px-3">
                            {application.status.toUpperCase()}
                        </Tag>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Applicant Information */}
                        <Card title="Applicant Information">
                            <Descriptions column={1} size="small">
                                <Descriptions.Item label="Name">
                                    <div className="flex items-center gap-2">
                                        <Avatar icon={<UserOutlined />} />
                                        <span className="font-medium">{application.user.name}</span>
                                    </div>
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    {application.user.email}
                                </Descriptions.Item>
                                <Descriptions.Item label="Member Since">
                                    {new Date(application.user.created_at).toLocaleDateString()}
                                </Descriptions.Item>
                                <Descriptions.Item label="Current Role">
                                    <Tag color="blue">Viewer</Tag>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>

                        {/* Application Details */}
                        <Card title="Application Details">
                            <div className="space-y-4">
                                <div>
                                    <Title level={5} className="mb-2">Motivation</Title>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
                                            {application.motivation}
                                        </Paragraph>
                                    </div>
                                </div>

                                {application.experience && (
                                    <div>
                                        <Title level={5} className="mb-2">Experience</Title>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <Paragraph style={{ marginBottom: 0, whiteSpace: 'pre-wrap' }}>
                                                {application.experience}
                                            </Paragraph>
                                        </div>
                                    </div>
                                )}

                                {application.portfolio_url && (
                                    <div>
                                        <Title level={5} className="mb-2">Portfolio</Title>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <a 
                                                href={application.portfolio_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                                            >
                                                <LinkOutlined />
                                                {application.portfolio_url}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        {/* Action Buttons */}
                        {application.status === 'pending' && (
                            <Card title="Actions" loading={processing}>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Button
                                        type="primary"
                                        icon={<CheckCircleOutlined />}
                                        onClick={handleApprove}
                                        disabled={processing}
                                        block
                                        size="large"
                                    >
                                        Approve Application
                                    </Button>
                                    <Button
                                        danger
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => setRejectModalVisible(true)}
                                        disabled={processing}
                                        block
                                        size="large"
                                    >
                                        Reject Application
                                    </Button>
                                </Space>
                            </Card>
                        )}

                        {/* Quick Info */}
                        <Card title="Quick Info">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Application ID:</span>
                                    <span className="font-mono">{application.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Status:</span>
                                    <Tag color={getStatusColor(application.status)} size="small">
                                        {application.status}
                                    </Tag>
                                </div>
                                <div className="flex justify-between">
                                    <span>Word Count:</span>
                                    <span>{application.motivation.split(' ').length} words</span>
                                </div>
                            </div>
                        </Card>

                        {/* Timeline */}
                        <Card title="Timeline">
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <div>
                                        <div className="font-medium">Application Submitted</div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(application.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                
                                {application.reviewed_at && (
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 ${
                                            application.status === 'approved' ? 'bg-green-500' : 'bg-red-500'
                                        }`}></div>
                                        <div>
                                            <div className="font-medium">
                                                Application {application.status === 'approved' ? 'Approved' : 'Rejected'}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(application.reviewed_at).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Simple Reject Modal */}
                <Modal
                    title="Reject Application"
                    open={rejectModalVisible}
                    onOk={handleReject}
                    onCancel={() => setRejectModalVisible(false)}
                    okText="Reject"
                    okButtonProps={{ danger: true, loading: processing }}
                    cancelButtonProps={{ disabled: processing }}
                >
                    <div className="py-4">
                        <Paragraph>
                            Provide a reason for rejecting this application:
                        </Paragraph>
                        <TextArea
                            rows={3}
                            placeholder="Enter rejection reason (optional)..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            maxLength={200}
                            disabled={processing}
                        />
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}