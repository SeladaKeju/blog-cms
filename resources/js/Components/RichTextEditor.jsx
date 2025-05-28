import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
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
    FontSizeOutlined
} from '@ant-design/icons';

export default function RichTextEditor({ content, onChange }) {
    // Fungsi untuk mengubah paste content menjadi heading
    const convertStylesToHeadings = (html) => {
        if (!html) return html;
        
        // Konversi dari berbagai sumber (Word, Google Docs, dll)
        return html
            // 1. Tag yang sudah berupa heading, pertahankan
            .replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, (match) => match)
            
            // 2. Word/Google Docs heading classes
            .replace(/<p[^>]*class="[^"]*MsoHeading1[^"]*"[^>]*>(.*?)<\/p>/gi, '<h1>$1</h1>')
            .replace(/<p[^>]*class="[^"]*MsoHeading2[^"]*"[^>]*>(.*?)<\/p>/gi, '<h2>$1</h2>')
            .replace(/<p[^>]*class="[^"]*MsoHeading3[^"]*"[^>]*>(.*?)<\/p>/gi, '<h3>$1</h3>')
            .replace(/<p[^>]*class="[^"]*MsoHeading4[^"]*"[^>]*>(.*?)<\/p>/gi, '<h4>$1</h4>')
            
            // 3. Google Docs heading classes
            .replace(/<p[^>]*class="[^"]*title[^"]*"[^>]*>(.*?)<\/p>/gi, '<h1>$1</h1>')
            .replace(/<p[^>]*class="[^"]*subtitle[^"]*"[^>]*>(.*?)<\/p>/gi, '<h2>$1</h2>')
            
            // 4. Paragraf dengan font-size besar (berdasarkan ukuran)
            .replace(/<p[^>]*style="[^"]*font-size:\s*(3[0-9]|[4-9][0-9])p[xt][^"]*"[^>]*>(.*?)<\/p>/gi, '<h1>$2</h1>')
            .replace(/<p[^>]*style="[^"]*font-size:\s*(2[4-9])p[xt][^"]*"[^>]*>(.*?)<\/p>/gi, '<h2>$2</h2>')
            .replace(/<p[^>]*style="[^"]*font-size:\s*(1[8-9]|2[0-3])p[xt][^"]*"[^>]*>(.*?)<\/p>/gi, '<h3>$2</h3>')
            .replace(/<p[^>]*style="[^"]*font-size:\s*(1[6-7])p[xt][^"]*"[^>]*>(.*?)<\/p>/gi, '<h4>$2</h4>')
            
            // 5. Paragraf dengan font-weight bold
            .replace(/<p[^>]*style="[^"]*font-weight:\s*(bold|[7-9]00)[^"]*font-size:\s*([2-9][0-9])p[xt][^"]*"[^>]*>(.*?)<\/p>/gi, 
                (match, weight, size, content) => {
                    const fontSize = parseInt(size);
                    if (fontSize >= 28) return `<h1>${content}</h1>`;
                    if (fontSize >= 22) return `<h2>${content}</h2>`;
                    if (fontSize >= 18) return `<h3>${content}</h3>`;
                    return `<h4>${content}</h4>`;
                }
            )
            
            // 6. Paragraf dengan <strong> atau <b> untuk semua konten
            .replace(/<p[^>]*><strong>(.*?)<\/strong><\/p>/gi, '<h3>$1</h3>')
            .replace(/<p[^>]*><b>(.*?)<\/b><\/p>/gi, '<h3>$1</h3>')
            
            // 7. Konversi div dengan styling heading
            .replace(/<div[^>]*style="[^"]*font-size:\s*(3[0-9]|[4-9][0-9])p[xt][^"]*"[^>]*>(.*?)<\/div>/gi, '<h1>$2</h1>')
            .replace(/<div[^>]*style="[^"]*font-size:\s*(2[4-9])p[xt][^"]*"[^>]*>(.*?)<\/div>/gi, '<h2>$2</h2>')
            .replace(/<div[^>]*style="[^"]*font-size:\s*(1[8-9]|2[0-3])p[xt][^"]*"[^>]*>(.*?)<\/div>/gi, '<h3>$2</h3>');
    };

    const editor = useEditor({
        extensions: [
            // Tetap gunakan Heading extension 
            Heading.configure({
                levels: [1, 2, 3, 4, 5, 6]
            }),
            StarterKit.configure({
                heading: false, // Nonaktifkan heading di StarterKit
                // Konfigurasi lainnya tetap sama
                bulletList: { keepMarks: true, keepAttributes: true, HTMLAttributes: { class: 'list-disc ml-4' }},
                orderedList: { keepMarks: true, keepAttributes: true, HTMLAttributes: { class: 'list-decimal ml-4' }},
                listItem: { keepMarks: true, keepAttributes: true, HTMLAttributes: { class: 'my-1' }}
            }),
            // Konfigurasi lainnya tetap sama
            Image.configure({
                HTMLAttributes: { class: 'max-w-full h-auto rounded-lg shadow-sm my-4' },
                allowBase64: true,
                inline: false,
            }),
            TextAlign.configure({ types: ['heading', 'paragraph', 'bulletList', 'orderedList'] }),
            TextStyle,
            FontSize.configure({ types: ['textStyle'] })
        ],
        editorProps: {
            attributes: { 
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-6',
                // Tambahkan styling untuk heading agar terlihat jelas
                style: `
                    --tw-prose-headings: #111827;
                    --tw-prose-body: #374151;
                `
            },
            handleDrop: (view, event, slice, moved) => handleFileDrop(event, moved),
            // Ganti handlePaste untuk menangani konversi heading
            handlePaste: (view, event, slice) => {
                // Tangani paste gambar terlebih dahulu
                const imageItems = Array.from(event.clipboardData?.items || [])
                    .filter(item => item.type.indexOf('image') === 0);
                
                if (imageItems.length > 0) {
                    event.preventDefault();
                    imageItems.forEach(item => {
                        const file = item.getAsFile();
                        if (file) handleImageUpload(file);
                    });
                    return true;
                }
                
                // Cek apakah ada HTML content
                const html = event.clipboardData?.getData('text/html');
                if (html) {
                    event.preventDefault();
                    
                    // Konversi styling ke heading tags
                    const transformedHTML = convertStylesToHeadings(html);
                    
                    // Insert konten yang sudah diubah
                    editor.commands.insertContent(transformedHTML);
                    return true;
                }
                
                // Untuk konten lainnya, biarkan TipTap yang menangani
                return false;
            },
            // Transformasi HTML yang di-paste
            transformPastedHTML: (html) => convertStylesToHeadings(html),
        },
        content,
        onUpdate: ({ editor }) => onChange(editor.getHTML())
    });

    // Tambahkan menu heading
    const headingItems = {
        items: [
            { key: 'p', label: 'Normal Text', onClick: () => editor.chain().focus().setParagraph().run() },
            { key: 'h1', label: 'Heading 1', onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
            { key: 'h2', label: 'Heading 2', onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
            { key: 'h3', label: 'Heading 3', onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
            { key: 'h4', label: 'Heading 4', onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run() }
        ]
    };

    const handleFileDrop = (event, moved) => {
        if (moved || !event.dataTransfer?.files?.length) return false;
        
        const imageFiles = Array.from(event.dataTransfer.files).filter(file => file.type.includes('image'));
        if (imageFiles.length > 0) {
            event.preventDefault();
            imageFiles.forEach(handleImageUpload);
            return true;
        }
        return false;
    };

    const handleFilePaste = (event) => {
        const imageItems = Array.from(event.clipboardData?.items || [])
            .filter(item => item.type.indexOf('image') === 0);
        
        if (imageItems.length > 0) {
            event.preventDefault();
            imageItems.forEach(item => {
                const file = item.getAsFile();
                if (file) handleImageUpload(file);
            });
            return true;
        }
        return false;
    };

    const handleImageUpload = async (file) => {
        if (!file?.type.startsWith('image/')) {
            message.error('Please select a valid image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            message.error('Image size must be less than 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        const loadingMessage = message.loading('Uploading image...', 0);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) throw new Error('CSRF token not found');

            const response = await fetch('/upload-image', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                },
                body: formData,
                credentials: 'same-origin'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Upload failed: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            
            if (data.success && data.url) {
                editor.chain().focus().setImage({ 
                    src: data.url,
                    alt: file.name,
                    title: file.name
                }).run();
                
                loadingMessage();
                message.success('Image uploaded successfully');
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            loadingMessage();
            message.error(`Failed to upload image: ${error.message}`);
        }
    };

    // Toolbar items
    const formatItems = [
        { key: 'bold', icon: <BoldOutlined />, onClick: () => editor?.chain().focus().toggleBold().run(), isActive: () => editor?.isActive('bold'), tooltip: 'Bold' },
        { key: 'italic', icon: <ItalicOutlined />, onClick: () => editor?.chain().focus().toggleItalic().run(), isActive: () => editor?.isActive('italic'), tooltip: 'Italic' }
    ];

    const fontSizeItems = {
        items: [
            { key: '14px', label: '14px', onClick: () => editor.chain().focus().setFontSize('14px').run() },
            { key: '16px', label: '16px (Normal)', onClick: () => editor.chain().focus().setFontSize('16px').run() },
            { key: '18px', label: '18px', onClick: () => editor.chain().focus().setFontSize('18px').run() },
            { key: '24px', label: '24px', onClick: () => editor.chain().focus().setFontSize('24px').run() },
            { type: 'divider' },
            { key: 'unset', label: 'Reset Size', onClick: () => editor.chain().focus().unsetFontSize().run() }
        ]
    };

    const listItems = {
        items: [
            { key: 'bullet', label: 'Bullet List', icon: <UnorderedListOutlined />, onClick: () => editor.chain().focus().toggleBulletList().run() },
            { key: 'ordered', label: 'Numbered List', icon: <OrderedListOutlined />, onClick: () => editor.chain().focus().toggleOrderedList().run() }
        ]
    };

    const alignmentItems = {
        items: [
            { key: 'left', label: 'Left', icon: <AlignLeftOutlined />, onClick: () => editor.chain().focus().setTextAlign('left').run() },
            { key: 'center', label: 'Center', icon: <AlignCenterOutlined />, onClick: () => editor.chain().focus().setTextAlign('center').run() },
            { key: 'right', label: 'Right', icon: <AlignRightOutlined />, onClick: () => editor.chain().focus().setTextAlign('right').run() }
        ]
    };

    if (!editor) return null;
    
    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col">
            {/* Fixed Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {/* Dropdown heading */}
                    <Dropdown menu={headingItems} trigger={['click']} placement="bottomLeft">
                        <Button type="text" size="small">
                            {editor.isActive('heading', { level: 1 }) ? 'H1' :
                             editor.isActive('heading', { level: 2 }) ? 'H2' :
                             editor.isActive('heading', { level: 3 }) ? 'H3' :
                             editor.isActive('heading', { level: 4 }) ? 'H4' : 'P'}
                        </Button>
                    </Dropdown>
                    
                    <div className="w-px h-6 bg-gray-300 mx-2" />
                    
                    {/* Format buttons */}
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
                    
                    {/* Font size dropdown */}
                    <Dropdown menu={fontSizeItems} trigger={['click']} placement="bottomLeft">
                        <Button type="text" icon={<FontSizeOutlined />} size="small" />
                    </Dropdown>
                    
                    {/* List dropdown */}
                    <Dropdown menu={listItems} trigger={['click']} placement="bottomLeft">
                        <Button 
                            type={editor.isActive('bulletList') || editor.isActive('orderedList') ? 'primary' : 'text'}
                            icon={<UnorderedListOutlined />} 
                            size="small"
                        />
                    </Dropdown>
                    
                    {/* Alignment dropdown */}
                    <Dropdown menu={alignmentItems} trigger={['click']} placement="bottomLeft">
                        <Button type="text" icon={<AlignLeftOutlined />} size="small" />
                    </Dropdown>
                    
                    {/* Image upload */}
                    <Upload
                        customRequest={({ file }) => handleImageUpload(file)}
                        showUploadList={false}
                        accept="image/*"
                        multiple={false}
                    >
                        <Tooltip title="Upload Image">
                            <Button type="text" icon={<PictureOutlined />} size="small" />
                        </Tooltip>
                    </Upload>
                </div>
                
                <div className="text-xs text-gray-400">Auto-saved</div>
            </div>

            {/* Scrollable Editor Content */}
            <div className="overflow-auto flex-grow" style={{ maxHeight: '500px' }}>
                <EditorContent 
                    editor={editor} 
                    className="focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20 transition-all"
                />
            </div>

            <style jsx>{`
                /* Ensure the ProseMirror editor has proper padding */
                .ProseMirror {
                    padding: 1.5rem;
                    min-height: 300px;
                    outline: none;
                }
                
                /* Fix editor sizing */
                .tiptap {
                    width: 100%;
                }
            `}</style>
        </div>
    );
}