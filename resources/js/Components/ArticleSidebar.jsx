import { Form, Input, Select, Upload, Col } from 'antd';
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
        <Col xs={24} lg={8}>
            <div className="space-y-4 sm:space-y-6">
                {/* Publish Settings */}
                <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish Settings</h3>
                    
                    {showStatus && (
                        <Form.Item
                            label="Status"
                            name="status"
                            className="mb-4"
                        >
                            <Select placeholder="Select status" className="w-full">
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
                    >
                        <Input 
                            type="datetime-local"
                            className="w-full"
                        />
                    </Form.Item>
                </div>

                {/* Excerpt */}
                <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Excerpt</h3>
                    <Form.Item
                        name="excerpt"
                        rules={[{ required: true, message: 'Please input the excerpt!' }]}
                        className="mb-0"
                    >
                        <TextArea 
                            rows={4}
                            placeholder="Write a brief description of your article..."
                            showCount
                            maxLength={200}
                            className="resize-none"
                        />
                    </Form.Item>
                </div>

                {/* Featured Image */}
                <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
                    {currentThumbnail && (
                        <div className="mb-4">
                            <img 
                                src={currentThumbnail} 
                                alt="Current thumbnail"
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <p className="text-sm text-gray-500 mt-2">Current featured image</p>
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
                            className="w-full"
                        >
                            <div className="text-center">
                                <PictureOutlined className="text-2xl text-gray-400 mb-2" />
                                <div className="text-sm text-gray-600">
                                    {currentThumbnail ? 'Change Image' : 'Upload Image'}
                                </div>
                            </div>
                        </Upload>
                    </Form.Item>
                </div>
            </div>
        </Col>
    );
}