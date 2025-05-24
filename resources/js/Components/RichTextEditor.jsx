import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { Button, Upload, message, Dropdown } from 'antd';
import { 
    BoldOutlined, 
    ItalicOutlined, 
    OrderedListOutlined,
    UnorderedListOutlined,
    PictureOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    MenuOutlined
} from '@ant-design/icons';

export default function RichTextEditor({ content, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Enable all list-related extensions
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
            })
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none',
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
            },
            {
                type: 'divider'
            },
        ]
    };

    if (!editor) return null;

    return (
        <div className="border rounded-lg overflow-hidden">
            <div className="border-b bg-gray-50 p-2">
                <div className="flex items-center">
                    <Button
                        type={editor.isActive('bold') ? 'primary' : 'default'}
                        icon={<BoldOutlined />}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                    />
                    <Button
                        type={editor.isActive('italic') ? 'primary' : 'default'}
                        icon={<ItalicOutlined />}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                    />
                    
                    <Dropdown
                        menu={listItems}
                        placement="bottomLeft"
                        trigger={['click']}
                    >
                        <Button 
                            icon={<UnorderedListOutlined />}
                            type={editor.isActive('bulletList') || editor.isActive('orderedList') ? 'primary' : 'default'}
                        >
                            List
                        </Button>
                    </Dropdown>

                    <Dropdown
                        menu={alignmentItems}
                        placement="bottomLeft"
                        trigger={['click']}
                    >
                        <Button icon={<MenuOutlined />}>
                            Alignment
                        </Button>
                    </Dropdown>

                    <Upload
                        customRequest={({ file }) => handleImageUpload(file)}
                        showUploadList={false}
                    >
                        <Button icon={<PictureOutlined />}>
                            Image
                        </Button>
                    </Upload>
                </div>
            </div>
            <EditorContent 
                editor={editor} 
                className="prose max-w-none p-4 min-h-[200px]" 
            />
        </div>
    );
}