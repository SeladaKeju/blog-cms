import { Form, Input, Select, Upload, Space, Card } from 'antd';
import { PictureOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

export default function ArticleSidebar({ 
    form,
    handleThumbnailChange,
    currentThumbnail = null,
    showStatus = false
}) {
    return (
        <div className="article-sidebar space-y-3">
            {/* Publish Settings */}
            <Card
                title="Publish Settings"
                className="sidebar-card"
                headStyle={{ padding: '12px 16px', fontSize: '15px', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}
                bodyStyle={{ padding: '12px 16px' }}
                size="small"
            >
                <Space direction="vertical" className="w-full">
                    {showStatus && (
                        <Form.Item
                            label="Status"
                            name="status"
                            className="mb-3"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                        >
                            <Select placeholder="Select status">
                                <Option value="draft">Draft</Option>
                                <Option value="published">Published</Option>
                                <Option value="archived">Archived</Option>
                            </Select>
                        </Form.Item>
                    )}

                    <Form.Item
                        label="Publish Date"
                        name="published_at"
                        className="mb-0"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                    >
                        <Input type="datetime-local" />
                    </Form.Item>
                </Space>
            </Card>

            {/* Excerpt - Increased size */}
            <Card
                title="Excerpt"
                className="sidebar-card"
                headStyle={{ padding: '12px 16px', fontSize: '15px', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}
                bodyStyle={{ padding: '12px 16px' }}
                size="small"
            >
                <Form.Item
                    name="excerpt"
                    rules={[{ required: true, message: 'Please input the excerpt!' }]}
                    className="mb-0"
                >
                    <TextArea 
                        rows={6}
                        placeholder="Tulis ringkasan singkat artikel Anda..."
                        showCount
                        maxLength={200}
                        className="sidebar-excerpt resize-none"
                    />
                </Form.Item>
            </Card>

            {/* Featured Image */}
            <Card
                title="Featured Image"
                className="sidebar-card"
                headStyle={{ padding: '12px 16px', fontSize: '15px', fontWeight: 500, borderBottom: '1px solid #f0f0f0' }}
                bodyStyle={{ padding: '12px 16px' }}
                size="small"
            >
                {currentThumbnail && (
                    <div className="mb-3">
                        <img 
                            src={currentThumbnail} 
                            alt="Current thumbnail"
                            className="w-full h-32 object-cover rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">Current featured image</p>
                    </div>
                )}
                <Form.Item
                    name="thumbnail"
                    className="mb-0"
                >
                    <Upload
                        listType="picture-card"
                        maxCount={1}
                        beforeUpload={() => false}
                        onChange={handleThumbnailChange}
                        accept="image/*"
                    >
                        <div className="text-center py-2">
                            <PictureOutlined className="text-xl text-gray-400" />
                            <div className="text-sm text-gray-600 mt-1">
                                {currentThumbnail ? 'Change Image' : 'Upload Image'}
                            </div>
                        </div>
                    </Upload>
                </Form.Item>
            </Card>

            <style jsx global>{`
                /* Better sidebar styling */
                .article-sidebar {
                    height: 100%;
                }
                
                .sidebar-card {
                    border: 1px solid #e5e7eb !important;
                    border-radius: 6px !important;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
                }
                
                .sidebar-card .ant-card-head-title {
                    padding: 0 !important;
                }

                /* Larger excerpt field */
                .sidebar-excerpt {
                    font-size: 0.9rem !important;
                    padding: 8px 12px !important;
                    line-height: 1.6 !important;
                    min-height: 160px !important;
                }
                
                /* Better form styling */
                .article-sidebar .ant-form-item-label > label {
                    font-size: 0.9rem !important;
                    color: #4b5563 !important;
                    height: auto !important;
                    margin-bottom: 3px !important;
                }
                
                /* Better input styling */
                .article-sidebar .ant-input,
                .article-sidebar .ant-select-selector,
                .article-sidebar .ant-picker {
                    padding: 6px 12px !important;
                    border-radius: 6px !important;
                    height: auto !important;
                    min-height: 38px !important;
                    font-size: 0.9rem !important;
                }
                
                /* Image uploader styling */
                .article-sidebar .ant-upload-select {
                    width: 100% !important;
                    margin-right: 0 !important;
                }
                
                /* Make the upload button look better */
                .ant-upload.ant-upload-select-picture-card {
                    width: 100% !important;
                    border-style: dashed !important;
                    margin-right: 0 !important;
                    margin-bottom: 0 !important;
                }
            `}</style>
        </div>
    );
}