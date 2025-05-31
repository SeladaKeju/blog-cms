import React from 'react';
import { Card, Form, Input, Typography } from 'antd';

const { TextArea } = Input;
const { Text } = Typography;

export default function SEOSettingsCard({ userRole }) {
    return (
        <Card title="SEO Settings" size="small">
            <div className="space-y-4">
                <Form.Item 
                    name="meta_title" 
                    label="Meta Title"
                    className="mb-2"
                >
                    <Input 
                        placeholder="SEO Title"
                        maxLength={60}
                        showCount
                        disabled={userRole === 'viewer'}
                    />
                </Form.Item>

                <Form.Item 
                    name="meta_description" 
                    label="Meta Description"
                    className="mb-2"
                >
                    <TextArea 
                        placeholder="SEO Description"
                        maxLength={160}
                        showCount
                        rows={3}
                        disabled={userRole === 'viewer'}
                    />
                </Form.Item>

                <Form.Item 
                    name="slug" 
                    label="URL Slug"
                    className="mb-0"
                >
                    <Input 
                        placeholder="url-slug"
                        disabled={userRole === 'viewer'}
                    />
                </Form.Item>

                <div className="text-xs text-gray-500">
                    <Text type="secondary">
                        Good SEO helps your article get discovered in search engines
                    </Text>
                </div>
            </div>
        </Card>
    );
}