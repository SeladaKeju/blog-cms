import { useState } from 'react';
import { router } from '@inertiajs/react';
import { message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

export function useArticleForm(initialPost = null) {
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [content, setContent] = useState(initialPost?.content || '');

    const submitForm = (formData, url, method = 'POST', successMessage = 'Operation completed successfully') => {
        setLoading(true);
        
        const options = {
            forceFormData: true,
            onSuccess: () => {
                message.success(successMessage);
                if (!initialPost) {
                    router.get('/article');
                }
            },
            onError: (errors) => {
                console.error('Submit errors:', errors);
                const errorMessage = Object.values(errors).join(', ');
                message.error(`Operation failed: ${errorMessage}`);
            },
            onFinish: () => {
                setLoading(false);
            }
        };

        router.post(url, formData, options);
    };

    const prepareFormData = (values, status = null, publishedAt = null) => {
        const formData = new FormData();
        
        Object.keys(values).forEach(key => {
            if (key === 'thumbnail' && values[key]?.file) {
                formData.append('thumbnail', values[key].file);
            } else if (values[key] !== undefined && values[key] !== null) {
                formData.append(key, values[key]);
            }
        });
        
        formData.append('content', content);
        
        if (status) {
            formData.append('status', status);
        }
        
        if (publishedAt) {
            formData.append('published_at', publishedAt);
        }
        
        if (initialPost) {
            formData.append('_method', 'PUT');
        }

        return formData;
    };

    const handleSubmit = (values) => {
        const formData = prepareFormData(values);
        const url = initialPost ? `/posts/${initialPost.id}` : '/posts';
        const successMessage = initialPost ? 'Post updated successfully' : 'Post created successfully';
        
        submitForm(formData, url, 'POST', successMessage);
    };

    const handleSaveDraft = (form) => {
        const values = form.getFieldsValue();
        const formData = prepareFormData(values, 'draft');
        const url = initialPost ? `/posts/${initialPost.id}` : '/posts';
        const successMessage = initialPost ? 'Post saved as draft successfully' : 'Draft created successfully';
        
        submitForm(formData, url, 'POST', successMessage);
    };

    const handlePublish = (form) => {
        const values = form.getFieldsValue();
        const publishedAt = new Date().toISOString().slice(0, 16);
        const formData = prepareFormData(values, 'published', publishedAt);
        const url = initialPost ? `/posts/${initialPost.id}` : '/posts';
        const successMessage = initialPost ? 'Post published successfully' : 'Post created and published successfully';
        
        submitForm(formData, url, 'POST', successMessage);
    };

    const handleDelete = () => {
        if (!initialPost) return;
        
        confirm({
            title: 'Delete Article',
            icon: ExclamationCircleOutlined,
            content: `Are you sure you want to delete this article "${initialPost.title}"? This action cannot be undone.`,
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                setDeleteLoading(true);
                router.delete(`/posts/${initialPost.id}`, {
                    onSuccess: () => {
                        message.success('Post deleted successfully');
                        router.get('/article');
                    },
                    onError: () => {
                        message.error('Failed to delete post');
                        setDeleteLoading(false);
                    }
                });
            },
        });
    };

    const handleThumbnailChange = ({ fileList }, form) => {
        form.setFieldsValue({ thumbnail: fileList[0] });
    };

    return {
        loading,
        deleteLoading,
        content,
        setContent,
        handleSubmit,
        handleSaveDraft,
        handlePublish,
        handleDelete,
        handleThumbnailChange
    };
}