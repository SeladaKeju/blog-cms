import { Form, Input, Col } from 'antd';
import RichTextEditor from '@/Components/RichTextEditor';

export default function ArticleEditor({ content, onContentChange }) {
    return (
        <Col xs={24} lg={16} className="mb-6 lg:mb-0">
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
                {/* Title Section */}
                <div className="border-b p-4 sm:p-6">
                    <Form.Item
                        name="title"
                        rules={[{ required: true, message: 'Please input the title!' }]}
                        className="mb-0"
                    >
                        <Input 
                            placeholder="Enter your article title..." 
                            className="text-xl sm:text-2xl font-bold border-0 px-0 focus:shadow-none"
                            bordered={false}
                            style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: '600' }}
                        />
                    </Form.Item>
                </div>

                {/* Content Editor */}
                <div className="p-4 sm:p-6">
                    <Form.Item
                        name="content"
                        className="mb-0"
                    >
                        <RichTextEditor 
                            content={content}
                            onChange={onContentChange}
                        />
                    </Form.Item>
                </div>
            </div>
        </Col>
    );
}