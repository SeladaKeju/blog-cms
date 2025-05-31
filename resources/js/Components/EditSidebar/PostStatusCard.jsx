import React from 'react';
import { Card, Form, Select, Tag, Divider, Button, Row, Col, Typography } from 'antd';
import { 
    ClockCircleOutlined,
    CheckCircleOutlined,
    EditOutlined,
    StopOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

export default function PostStatusCard({ 
    post, 
    userRole, 
    onSubmitForReview, 
    onApprove, 
    onReject, 
    loading = false 
}) {
    // Status configurations
    const statusConfig = {
        'draft': { 
            color: 'default', 
            icon: <EditOutlined />, 
            label: 'Draft' 
        },
        'pending_review': { 
            color: 'processing', 
            icon: <ClockCircleOutlined />, 
            label: 'Pending Review' 
        },
        'published': { 
            color: 'success', 
            icon: <CheckCircleOutlined />, 
            label: 'Published' 
        },
        'rejected': { 
            color: 'error', 
            icon: <StopOutlined />, 
            label: 'Rejected' 
        },
        'archived': { 
            color: 'default', 
            icon: <StopOutlined />, 
            label: 'Archived' 
        }
    };

    // Get available status options based on user role and current status
    const getStatusOptions = () => {
        const currentStatus = post?.status || 'draft';
        
        if (userRole === 'admin') {
            return [
                { value: 'draft', label: 'Draft' },
                { value: 'pending_review', label: 'Pending Review' },
                { value: 'published', label: 'Published' },
                { value: 'rejected', label: 'Rejected' },
                { value: 'archived', label: 'Archived' }
            ];
        } else if (userRole === 'editor') {
            if (currentStatus === 'published') {
                return [{ value: 'published', label: 'Published (Read Only)' }];
            }
            return [
                { value: 'draft', label: 'Draft' },
                { value: 'pending_review', label: 'Submit for Review' }
            ];
        }
        
        return [{ value: currentStatus, label: statusConfig[currentStatus]?.label || 'Unknown' }];
    };

    const currentStatus = post?.status || 'draft';
    const statusInfo = statusConfig[currentStatus];

    return (
        <Card title="Post Status" size="small">
            <div className="space-y-4">
                {/* Current Status Display */}
                <div>
                    <Text type="secondary" className="text-sm">Current Status</Text>
                    <div className="mt-1">
                        <Tag 
                            color={statusInfo?.color} 
                            icon={statusInfo?.icon}
                            className="px-3 py-1"
                        >
                            {statusInfo?.label}
                        </Tag>
                    </div>
                </div>

                {/* Status Selector */}
                <Form.Item 
                    name="status" 
                    label="Change Status"
                    className="mb-2"
                >
                    <Select 
                        placeholder="Select status"
                        size="middle"
                        disabled={userRole === 'viewer'}
                    >
                        {getStatusOptions().map(option => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Quick Actions for Admin */}
                {userRole === 'admin' && post?.status === 'pending_review' && (
                    <div className="space-y-2">
                        <Divider className="my-3" />
                        <Text type="secondary" className="text-sm">Quick Actions</Text>
                        <Row gutter={8}>
                            <Col span={12}>
                                <Button 
                                    type="primary" 
                                    size="small" 
                                    block
                                    icon={<CheckCircleOutlined />}
                                    onClick={onApprove}
                                    loading={loading}
                                >
                                    Approve
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button 
                                    danger 
                                    size="small" 
                                    block
                                    icon={<StopOutlined />}
                                    onClick={onReject}
                                    loading={loading}
                                >
                                    Reject
                                </Button>
                            </Col>
                        </Row>
                    </div>
                )}

                {/* Submit for Review Button for Editor */}
                {userRole === 'editor' && post?.status === 'draft' && (
                    <div>
                        <Divider className="my-3" />
                        <Button 
                            type="primary" 
                            block
                            icon={<ClockCircleOutlined />}
                            onClick={onSubmitForReview}
                            loading={loading}
                        >
                            Submit for Review
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
}