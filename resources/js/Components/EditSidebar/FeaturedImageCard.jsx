import React from 'react';
import { Card, Form, Upload, Button, Image } from 'antd';
import { UploadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

export default function FeaturedImageCard({ 
    currentThumbnail, 
    onThumbnailChange, 
    userRole 
}) {
    // Handle thumbnail upload
    const handleThumbnailUpload = ({ fileList }) => {
        onThumbnailChange(fileList);
    };

    return (
        <Card title="Featured Image" size="small">
            <div className="space-y-4">
                {/* Current Thumbnail Display */}
                {currentThumbnail && (
                    <div className="text-center">
                        <Image
                            src={currentThumbnail}
                            alt="Current thumbnail"
                            style={{ 
                                width: '100%', 
                                maxHeight: '150px', 
                                objectFit: 'cover',
                                borderRadius: '6px'
                            }}
                        />
                        <div className="mt-2">
                            <Button 
                                size="small" 
                                icon={<EyeOutlined />}
                                onClick={() => window.open(currentThumbnail, '_blank')}
                            >
                                View Full Size
                            </Button>
                        </div>
                    </div>
                )}

                {/* Upload Component */}
                <Form.Item 
                    name="thumbnail" 
                    className="mb-0"
                >
                    <Upload
                        listType="picture-card"
                        showUploadList={false}
                        onChange={handleThumbnailUpload}
                        accept="image/*"
                        disabled={userRole === 'viewer'}
                        className="thumbnail-upload"
                    >
                        <div className="upload-content">
                            <UploadOutlined className="text-lg mb-2" />
                            <div className="text-sm">
                                {currentThumbnail ? 'Change Image' : 'Upload Image'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                                JPG, PNG, GIF up to 5MB
                            </div>
                        </div>
                    </Upload>
                </Form.Item>

                {/* Remove Thumbnail Button */}
                {currentThumbnail && userRole !== 'viewer' && (
                    <Button 
                        danger 
                        size="small" 
                        icon={<DeleteOutlined />}
                        onClick={() => onThumbnailChange([])}
                        block
                    >
                        Remove Image
                    </Button>
                )}

                <style jsx>{`
                    .thumbnail-upload .ant-upload {
                        width: 100% !important;
                    }
                    
                    .upload-content {
                        padding: 20px;
                        text-align: center;
                        border: 2px dashed #d9d9d9;
                        border-radius: 6px;
                        transition: border-color 0.3s;
                    }
                    
                    .upload-content:hover {
                        border-color: #1677ff;
                    }
                `}</style>
            </div>
        </Card>
    );
}