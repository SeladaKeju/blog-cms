import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import FontSize from 'tiptap-extension-font-size';
import { Button, Upload, message, Dropdown, Tooltip } from 'antd';
import { 
    BoldOutlined, 
    ItalicOutlined, 
    OrderedListOutlined,
    UnorderedListOutlined,
    PictureOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    MenuOutlined,
    FontSizeOutlined
} from '@ant-design/icons';

export default function RichTextEditor({ content, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                    HTMLAttributes: {
                        class: 'list-disc ml-4'
                    }
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                    HTMLAttributes: {
                        class: 'list-decimal ml-4'
                    }
                },
                listItem: {
                    keepMarks: true,
                    keepAttributes: false,
                    HTMLAttributes: {
                        class: 'my-1'
                    }
                }
            }),
            Image,
            TextAlign.configure({
                types: ['heading', 'paragraph', 'bulletList', 'orderedList']
            }),
            TextStyle,
            FontSize.configure({
                types: ['textStyle'],
            })
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6',
            },
        },
        content: content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        }
    });

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: formData,
            });
            
            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            
            if (data.url) {
                editor.chain().focus().setImage({ src: data.url }).run();
                message.success('Image uploaded successfully');
            }
        } catch (error) {
            console.error('Upload error:', error);
            message.error('Failed to upload image');
        }
    };

    const formatItems = [
        {
            key: 'bold',
            icon: <BoldOutlined />,
            onClick: () => editor?.chain().focus().toggleBold().run(),
            isActive: () => editor?.isActive('bold') || false,
            tooltip: 'Bold'
        },
        {
            key: 'italic',
            icon: <ItalicOutlined />,
            onClick: () => editor?.chain().focus().toggleItalic().run(),
            isActive: () => editor?.isActive('italic') || false,
            tooltip: 'Italic'
        }
    ];

    const alignmentItems = {
        items: [
            {
                key: 'left',
                label: 'Left',
                icon: <AlignLeftOutlined />,
                onClick: () => editor.chain().focus().setTextAlign('left').run()
            },
            {
                key: 'center',
                label: 'Center',
                icon: <AlignCenterOutlined />,
                onClick: () => editor.chain().focus().setTextAlign('center').run()
            },
            {
                key: 'right',
                label: 'Right',
                icon: <AlignRightOutlined />,
                onClick: () => editor.chain().focus().setTextAlign('right').run()
            }
        ]
    };

    const fontSizeItems = {
        items: [
            {
                key: '14px',
                label: '14px',
                onClick: () => editor.chain().focus().setFontSize('14px').run()
            },
            {
                key: '16px',
                label: '16px (Normal)',
                onClick: () => editor.chain().focus().setFontSize('16px').run()
            },
            {
                key: '18px',
                label: '18px',
                onClick: () => editor.chain().focus().setFontSize('18px').run()
            },
            {
                key: '24px',
                label: '24px',
                onClick: () => editor.chain().focus().setFontSize('24px').run()
            },
            {
                type: 'divider'
            },
            {
                key: 'unset',
                label: 'Reset Size',
                onClick: () => editor.chain().focus().unsetFontSize().run()
            }
        ]
    };

    const listItems = {
        items: [
            {
                key: 'bullet',
                label: 'Bullet List',
                icon: <UnorderedListOutlined />,
                onClick: () => editor.chain().focus().toggleBulletList().run()
            },
            {
                key: 'ordered',
                label: 'Numbered List',
                icon: <OrderedListOutlined />,
                onClick: () => editor.chain().focus().toggleOrderedList().run()
            }
        ]
    };

    if (!editor) return null;

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Toolbar - Moved to Top */}
            <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 p-3">
                <div className="flex items-center space-x-2">
                    {formatItems.map((item) => (
                        <Tooltip key={item.key} title={item.tooltip}>
                            <Button 
                                type={item.isActive() ? 'primary' : 'text'}
                                icon={item.icon}
                                onClick={item.onClick}
                                size="small"
                                className="border-0"
                            />
                        </Tooltip>
                    ))}
                    
                    <div className="w-px h-6 bg-gray-300 mx-2" />
                    
                    <Dropdown menu={fontSizeItems} trigger={['click']} placement="bottomLeft">
                        <Button type="text" icon={<FontSizeOutlined />} size="small" />
                    </Dropdown>
                    
                    <Dropdown menu={listItems} trigger={['click']} placement="bottomLeft">
                        <Button 
                            type={editor.isActive('bulletList') || editor.isActive('orderedList') ? 'primary' : 'text'}
                            icon={<UnorderedListOutlined />} 
                            size="small"
                        />
                    </Dropdown>
                    
                    <Dropdown menu={alignmentItems} trigger={['click']} placement="bottomLeft">
                        <Button type="text" icon={<AlignLeftOutlined />} size="small" />
                    </Dropdown>
                    
                    <Upload
                        customRequest={({ file }) => handleImageUpload(file)}
                        showUploadList={false}
                    >
                        <Button type="text" icon={<PictureOutlined />} size="small" />
                    </Upload>
                </div>
                
                <div className="text-xs text-gray-400">
                    Auto-saved
                </div>
            </div>

            {/* Editor Content */}
            <EditorContent 
                editor={editor} 
                className="min-h-[500px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20 transition-all"
            />
        </div>
    );
}