import React from 'react';
import { Card, Form, Input } from 'antd';

const { TextArea } = Input;

export default function ExcerptCard({ userRole }) {
    const readOnly = userRole === 'viewer';
    
    return (
        <Card 
            title="Excerpt" 
            size="small"
            className="excerpt-card"
        >
            <Form.Item 
                name="excerpt" 
                className="mb-0"
            >
                <TextArea 
                    placeholder="Write a brief summary of your post..." 
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    disabled={readOnly}
                    className="w-full"
                />
            </Form.Item>
        </Card>
    );
}