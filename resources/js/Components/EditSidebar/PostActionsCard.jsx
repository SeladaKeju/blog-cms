import React from 'react';
import { Card, Button } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';

export default function PostActionsCard({ post, userRole }) {
    if (userRole !== 'admin') return null;

    return (
        <Card title="Post Actions" size="small">
            <div className="space-y-3">
                <Button 
                    block 
                    icon={<EyeOutlined />}
                    onClick={() => window.open(`/blog/${post?.slug}`, '_blank')}
                    disabled={!post?.slug || post?.status !== 'published'}
                >
                    View Live Post
                </Button>
                
                <Button 
                    block 
                    icon={<EditOutlined />}
                    onClick={() => window.open(`/posts/${post?.id}/edit`, '_blank')}
                >
                    Edit in New Tab
                </Button>
            </div>
        </Card>
    );
}