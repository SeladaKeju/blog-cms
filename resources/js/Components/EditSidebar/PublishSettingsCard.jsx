import React from 'react';
import { Card, Form, DatePicker, Typography } from 'antd';
import dayjs from 'dayjs';

const { Text } = Typography;

export default function PublishSettingsCard({ post, userRole }) {
    return (
        <Card title="Publish Settings" size="small">
            <div className="space-y-4">
                {/* Published Date */}
                <Form.Item 
                    name="published_at" 
                    label="Publish Date"
                    className="mb-2"
                >
                    <DatePicker 
                        showTime
                        format="YYYY-MM-DD HH:mm"
                        placeholder="Select publish date"
                        className="w-full"
                        disabled={userRole === 'viewer'}
                    />
                </Form.Item>

                {/* Post Info */}
                <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex justify-between">
                        <span>Created:</span>
                        <span>{post?.created_at ? dayjs(post.created_at).format('MMM DD, YYYY') : '-'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Updated:</span>
                        <span>{post?.updated_at ? dayjs(post.updated_at).format('MMM DD, YYYY') : '-'}</span>
                    </div>
                    {post?.author && (
                        <div className="flex justify-between">
                            <span>Author:</span>
                            <span>{post.author.name}</span>
                        </div>
                    )}
                    {post?.approver && (
                        <div className="flex justify-between">
                            <span>Approved by:</span>
                            <span>{post.approver.name}</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}