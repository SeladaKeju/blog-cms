import { Form, Input } from 'antd';
import RichTextEditor from '@/Components/RichTextEditor';

export default function ArticleEditor({ content, onContentChange, readOnly = false }) {
    return (
        <div className="article-editor bg-white border border-gray-200 rounded-lg shadow-sm h-full">
            {/* Title Section - Streamlined */}
            <div className="border-b border-gray-200 p-4">
                <Form.Item
                    name="title"
                    rules={[{ required: true, message: 'Judul artikel harus diisi!' }]}
                    className="mb-0"
                >
                    <Input 
                        placeholder="Masukkan judul artikel..." 
                        className="editor-title-input"
                        bordered={false}
                        readOnly={readOnly}
                    />
                </Form.Item>
            </div>

            {/* Content Editor - Optimized padding */}
            <div className="editor-content p-0">
                <Form.Item
                    name="content"
                    className="mb-0 h-full"
                >
                    <RichTextEditor 
                        content={content}
                        onChange={onContentChange}
                        readOnly={readOnly}
                        className="h-full"
                    />
                </Form.Item>
            </div>

            {/* Added styles for better editor appearance */}
            <style jsx global>{`
                .article-editor {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .editor-title-input {
                    font-size: 1.75rem !important;
                    font-weight: 600 !important;
                    padding: 0 !important;
                    line-height: 1.3 !important;
                    height: auto !important;
                    color: #111827 !important;
                }
                
                .editor-title-input::placeholder {
                    color: #9CA3AF !important;
                }
                
                .editor-content {
                    flex: 1;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                
                .editor-content .ant-form-item {
                    height: 100%;
                    margin-bottom: 0 !important;
                }
                
                /* Rich text editor enhancements */
                .tiptap-editor-container {
                    height: 100% !important;
                    display: flex;
                    flex-direction: column;
                }
                
                .tiptap {
                    flex: 1 !important;
                    height: 100% !important;
                    overflow-y: auto !important;
                    padding: 1rem !important;
                }
                
                .ProseMirror {
                    min-height: calc(100vh - 230px) !important;
                    height: 100% !important;
                    padding: 1rem 1.5rem !important;
                    font-size: 1rem !important;
                    line-height: 1.7 !important;
                    color: #374151 !important;
                }
            `}</style>
        </div>
    );
}