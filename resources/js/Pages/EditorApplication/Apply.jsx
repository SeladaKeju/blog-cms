import React, { useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Card, Form, Input, Button, Space, Typography, Alert, Steps, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined, UserOutlined, FileTextOutlined } from '@ant-design/icons';
import BlogLayout from '@/Layouts/BlogLayout';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

export default function Apply({ auth, existingApplication }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        motivation: '',
        experience: '',
        portfolio_url: '',
    });

    // Check if user role changed after approval
    useEffect(() => {
        if (auth?.userRole === 'editor' || auth?.userRole === 'admin') {
            router.get('/dashboard');
        }
    }, [auth?.userRole]);

    // If user has existing application, show status
    if (existingApplication) {
        return (
            <BlogLayout>
                <Head title="Editor Application Status" />
                
                <div className="max-w-3xl mx-auto px-6 py-12">
                    <div className="mb-8">
                        <Link href="/blog" className="text-green-600 hover:text-green-700 transition-colors">
                            <ArrowLeftOutlined className="mr-2" />
                            Back to stories
                        </Link>
                    </div>

                    <div className="mb-12">
                        <Title 
                            level={1}
                            style={{ 
                                fontSize: '42px',
                                lineHeight: '52px',
                                fontWeight: '700',
                                letterSpacing: '-0.02em',
                                color: '#1a1a1a',
                                margin: 0,
                                marginBottom: '16px'
                            }}
                        >
                            Application Status
                        </Title>
                        <Text className="text-xl text-gray-600">
                            Track your editor application progress
                        </Text>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-8">
                        <div className="text-center">
                            <div className="mb-8">
                                {existingApplication.status === 'pending' && (
                                    <div>
                                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <div className="w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
                                        </div>
                                        <Title level={3} className="mb-4">Under Review</Title>
                                        <Text className="text-gray-600 text-lg">
                                            Your editor application is currently being reviewed by our team. 
                                            We'll notify you once a decision has been made.
                                        </Text>
                                    </div>
                                )}
                                
                                {existingApplication.status === 'approved' && (
                                    <div>
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <div className="text-green-600 text-2xl">✓</div>
                                        </div>
                                        <Title level={3} className="mb-4 text-green-600">Congratulations!</Title>
                                        <Text className="text-gray-600 text-lg">
                                            Your editor application has been approved. You now have editor privileges 
                                            and can start creating content.
                                        </Text>
                                    </div>
                                )}
                                
                                {existingApplication.status === 'rejected' && (
                                    <div>
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <div className="text-red-600 text-2xl">✕</div>
                                        </div>
                                        <Title level={3} className="mb-4 text-red-600">Not Approved</Title>
                                        <Text className="text-gray-600 text-lg">
                                            Unfortunately, your editor application was not approved this time. 
                                            You can submit a new application after reviewing our guidelines.
                                        </Text>
                                    </div>
                                )}
                            </div>
                            
                            <div className="bg-gray-50 p-6 rounded-lg text-left mb-8">
                                <Title level={5} className="mb-4">Application Details</Title>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <Text className="text-gray-600">Submitted:</Text>
                                        <Text className="font-medium">
                                            {new Date(existingApplication.created_at).toLocaleDateString()}
                                        </Text>
                                    </div>
                                    <div className="flex justify-between">
                                        <Text className="text-gray-600">Status:</Text>
                                        <Text className={`font-medium capitalize ${
                                            existingApplication.status === 'approved' ? 'text-green-600' :
                                            existingApplication.status === 'rejected' ? 'text-red-600' :
                                            'text-yellow-600'
                                        }`}>
                                            {existingApplication.status}
                                        </Text>
                                    </div>
                                    {existingApplication.reviewed_at && (
                                        <div className="flex justify-between">
                                            <Text className="text-gray-600">Reviewed:</Text>
                                            <Text className="font-medium">
                                                {new Date(existingApplication.reviewed_at).toLocaleDateString()}
                                            </Text>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex justify-center gap-4">
                                {existingApplication.status === 'approved' ? (
                                    <Link href="/dashboard">
                                        <Button 
                                            type="primary" 
                                            size="large"
                                            className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 rounded-full px-8"
                                        >
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                ) : existingApplication.status === 'rejected' ? (
                                    <Link href="/apply">
                                        <Button 
                                            type="primary" 
                                            size="large"
                                            className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 rounded-full px-8"
                                        >
                                            Apply Again
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href="/blog">
                                        <Button 
                                            size="large"
                                            className="rounded-full px-8"
                                        >
                                            Return to Stories
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </BlogLayout>
        );
    }

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!data.motivation.trim()) {
            message.error('Please provide your motivation');
            return;
        }

        if (data.motivation.length < 100) {
            message.error('Motivation must be at least 100 characters');
            return;
        }

        post(route('editor-application.store'), {
            onSuccess: () => {
                message.success('Application submitted successfully!');
            },
            onError: () => {
                message.error('Failed to submit application. Please check the form.');
            }
        });
    };

    return (
        <BlogLayout>
            <Head title="Apply to Write" />
            
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <Link href="/blog" className="text-green-600 hover:text-green-700 transition-colors">
                        <ArrowLeftOutlined className="mr-2" />
                        Back to stories
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-16">
                    <Title 
                        level={1}
                        style={{ 
                            fontSize: '42px',
                            lineHeight: '52px',
                            fontWeight: '700',
                            letterSpacing: '-0.02em',
                            color: '#1a1a1a',
                            margin: 0,
                            marginBottom: '16px'
                        }}
                    >
                        Start Writing
                    </Title>
                    <Text 
                        className="text-xl text-gray-600 block mb-8"
                        style={{ fontSize: '20px', lineHeight: '28px' }}
                    >
                        Join our community of writers and share your unique perspective with the world
                    </Text>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Application Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-lg p-8">
                            <form onSubmit={handleSubmit}>
                                {/* Motivation */}
                                <div className="mb-8">
                                    <Title level={4} className="mb-4">
                                        Why do you want to write for us?
                                    </Title>
                                    <TextArea
                                        rows={6}
                                        placeholder="Tell us about your passion for writing and what unique perspective you'd bring to our community..."
                                        showCount
                                        maxLength={1000}
                                        value={data.motivation}
                                        onChange={(e) => setData('motivation', e.target.value)}
                                        className={`text-lg ${errors.motivation ? 'border-red-500' : ''}`}
                                        style={{ fontSize: '16px', lineHeight: '24px' }}
                                    />
                                    <Text className="text-sm text-gray-500 mt-2 block">
                                        Minimum 100 characters. Share your writing goals and what drives your passion for storytelling.
                                    </Text>
                                    {errors.motivation && (
                                        <Text className="text-red-500 text-sm mt-1 block">{errors.motivation}</Text>
                                    )}
                                </div>

                                {/* Experience */}
                                <div className="mb-8">
                                    <Title level={4} className="mb-4">
                                        Writing Experience
                                        <Text className="text-sm text-gray-500 font-normal ml-2">(Optional)</Text>
                                    </Title>
                                    <TextArea
                                        rows={5}
                                        placeholder="Share your writing background, published works, blogs, or any relevant experience..."
                                        showCount
                                        maxLength={1000}
                                        value={data.experience}
                                        onChange={(e) => setData('experience', e.target.value)}
                                        className={`text-lg ${errors.experience ? 'border-red-500' : ''}`}
                                        style={{ fontSize: '16px', lineHeight: '24px' }}
                                    />
                                    {errors.experience && (
                                        <Text className="text-red-500 text-sm mt-1 block">{errors.experience}</Text>
                                    )}
                                </div>

                                {/* Portfolio URL */}
                                <div className="mb-8">
                                    <Title level={4} className="mb-4">
                                        Portfolio or Writing Samples
                                        <Text className="text-sm text-gray-500 font-normal ml-2">(Optional)</Text>
                                    </Title>
                                    <Input
                                        placeholder="https://your-portfolio.com or https://your-blog.com"
                                        value={data.portfolio_url}
                                        onChange={(e) => setData('portfolio_url', e.target.value)}
                                        className={`text-lg ${errors.portfolio_url ? 'border-red-500' : ''}`}
                                        style={{ fontSize: '16px', padding: '12px 16px' }}
                                    />
                                    <Text className="text-sm text-gray-500 mt-2 block">
                                        Link to your portfolio, personal blog, LinkedIn, or any published work.
                                    </Text>
                                    {errors.portfolio_url && (
                                        <Text className="text-red-500 text-sm mt-1 block">{errors.portfolio_url}</Text>
                                    )}
                                </div>

                                {/* Error Display */}
                                {Object.keys(errors).length > 0 && (
                                    <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <Text className="text-red-600 font-medium">
                                            Please correct the following errors:
                                        </Text>
                                        <ul className="mt-2 space-y-1">
                                            {Object.entries(errors).map(([field, error]) => (
                                                <li key={field} className="text-red-600 text-sm">• {error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Submit Buttons */}
                                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                                    <Link href="/blog">
                                        <Button size="large" className="rounded-full px-8">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit"
                                        loading={processing}
                                        size="large"
                                        className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 rounded-full px-8"
                                    >
                                        Submit Application
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            {/* What You'll Get */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                <Title level={5} className="mb-4">What you'll get</Title>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <Text>Publish your stories to our community</Text>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <Text>Access to our editorial tools</Text>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <Text>Build your audience and readership</Text>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <Text>Connect with other writers</Text>
                                    </div>
                                </div>
                            </div>

                            {/* Application Process */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <Title level={5} className="mb-4">Application process</Title>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                            1
                                        </div>
                                        <div>
                                            <Text className="font-medium block">Submit application</Text>
                                            <Text className="text-sm text-gray-500">Tell us about your writing goals</Text>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                            2
                                        </div>
                                        <div>
                                            <Text className="font-medium block">Review process</Text>
                                            <Text className="text-sm text-gray-500">Our team reviews your application (3-5 days)</Text>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                            3
                                        </div>
                                        <div>
                                            <Text className="font-medium block">Welcome!</Text>
                                            <Text className="text-sm text-gray-500">Start writing and publishing</Text>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Guidelines */}
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <Title level={5} className="mb-4">Writing guidelines</Title>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div>• Original, high-quality content</div>
                                    <div>• Respectful and constructive tone</div>
                                    <div>• Proper grammar and formatting</div>
                                    <div>• Adherence to community standards</div>
                                    <div>• Regular publishing commitment</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BlogLayout>
    );
}