import React from 'react';
import { Space } from 'antd';
import PublishSettingsCard from './EditSidebar/PublishSettingsCard';
import FeaturedImageCard from './EditSidebar/FeaturedImageCard';
import PostActionsCard from './EditSidebar/PostActionsCard';
import ExcerptCard from './EditSidebar/ExcerptCard'; // Add this import

export default function EditSidebar({ 
    form, 
    post,
    userRole,
    currentThumbnail, 
    onThumbnailChange,
    onApprove,
    onReject,
    loading = false,
    showSEO = true // Optional prop to show/hide SEO settings
}) {
    return (
        <div className="edit-sidebar space-y-6">
            {/* Publish Settings */}
            <PublishSettingsCard
                post={post}
                userRole={userRole}
            />

            {/* Add Excerpt Card after Publish Settings */}
            <ExcerptCard 
                userRole={userRole}
            />

            {/* Featured Image Management */}
            <FeaturedImageCard
                currentThumbnail={currentThumbnail}
                onThumbnailChange={onThumbnailChange}
                userRole={userRole}
            />

            {/* Admin Actions */}
            <PostActionsCard
                post={post}
                userRole={userRole}
            />

            {/* Global Styles */}
            <style jsx>{`
                .edit-sidebar .ant-card {
                    border-radius: 8px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                
                .edit-sidebar .ant-card-head {
                    border-bottom: 1px solid #f0f0f0;
                    padding: 12px 16px;
                }
                
                .edit-sidebar .ant-card-head-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                }
                
                .edit-sidebar .ant-card-body {
                    padding: 16px;
                }
                
                .edit-sidebar .ant-form-item-label > label {
                    font-size: 12px;
                    font-weight: 500;
                    color: #6b7280;
                }
                
                .edit-sidebar .ant-select,
                .edit-sidebar .ant-picker {
                    font-size: 14px;
                }
                
                .edit-sidebar .ant-tag {
                    font-size: 12px;
                    border-radius: 4px;
                    margin: 0;
                }
            `}</style>
        </div>
    );
}