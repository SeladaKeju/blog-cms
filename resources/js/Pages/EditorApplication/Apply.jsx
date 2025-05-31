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
            // User is now an editor, redirect to dashboard
            router.get('/dashboard');
        }
    }, [auth?.userRole]);

    // If user has existing application, show status
    if (existingApplication) {
        return (
            <BlogLayout>
                <Head title="Editor Application Status" />
                
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <Link href="/blog" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
                            <ArrowLeftOutlined className="mr-2" />
                            Back to Blog
                        </Link>
                        
                        <Title level={2}>Editor Application Status</Title>
                    </div>

                    <Card>
                        <div className="text-center py-8">
                            <div className="mb-4">
                                {existingApplication.status === 'pending' && (
                                    <Alert
                                        message="Application Pending"
                                        description="Your editor application is currently being reviewed by our administrators. We'll notify you once a decision has been made."
                                        type="info"
                                        showIcon
                                        className="mb-4"
                                    />
                                )}
                                
                                {existingApplication.status === 'approved' && (
                                    <Alert
                                        message="Application Approved!"
                                        description="Congratulations! Your editor application has been approved. You now have editor privileges. Redirecting to dashboard..."
                                        type="success"
                                        showIcon
                                        className="mb-4"
                                    />
                                )}
                                
                                {existingApplication.status === 'rejected' && (
                                    <Alert
                                        message="Application Rejected"
                                        description="Unfortunately, your editor application was not approved this time. You can submit a new application after reviewing our guidelines."
                                        type="error"
                                        showIcon
                                        className="mb-4"
                                    />
                                )}
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg text-left">
                                <Title level={5}>Application Details</Title>
                                <div className="space-y-2 text-sm">
                                    <div><strong>Submitted:</strong> {new Date(existingApplication.created_at).toLocaleDateString()}</div>
                                    <div><strong>Status:</strong> <span className="capitalize">{existingApplication.status}</span></div>
                                    {existingApplication.reviewed_at && (
                                        <div><strong>Reviewed:</strong> {new Date(existingApplication.reviewed_at).toLocaleDateString()}</div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                {existingApplication.status === 'approved' ? (
                                    <Link href="/dashboard">
                                        <Button type="primary">Go to Dashboard</Button>
                                    </Link>
                                ) : (
                                    <Link href="/blog">
                                        <Button type="primary">Return to Blog</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </BlogLayout>
        );
    }

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!data.motivation.trim()) {
            message.error('Please provide your motivation');
            return;
        }

        if (data.motivation.length < 100) {
            message.error('Motivation must be at least 100 characters');
            return;
        }

        console.log('Submitting application with data:', data); // Debug log

        post(route('editor-application.store'), {
            onStart: () => {
                console.log('Form submission started'); // Debug log
            },
            onSuccess: (response) => {
                console.log('Form submission successful:', response); // Debug log
                message.success('Application submitted successfully!');
            },
            onError: (errors) => {
                console.log('Form submission errors:', errors); // Debug log
                message.error('Failed to submit application. Please check the form.');
            },
            onFinish: () => {
                console.log('Form submission finished'); // Debug log
            }
        });
    };

    const steps = [
        {
            title: 'Personal Info',
            status: 'finish',
            icon: <UserOutlined />,
        },
        {
            title: 'Application',
            status: 'process',
            icon: <EditOutlined />,
        },
        {
            title: 'Review',
            status: 'wait',
            icon: <FileTextOutlined />,
        },
    ];

    return (
        <BlogLayout>
            <Head title="Apply to Become an Editor" />
            
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link href="/blog" className="flex items-center text-blue-600 hover:text-blue-700 mb-4">
                        <ArrowLeftOutlined className="mr-2" />
                        Back to Blog
                    </Link>
                    
                    <Title level={2}>Apply to Become an Editor</Title>
                    <Paragraph type="secondary">
                        Join our team of content creators and help shape the future of our blog community.
                    </Paragraph>
                </div>

                {/* Progress Steps */}
                <Card className="mb-6">
                    <Steps current={1} items={steps} />
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Application Form */}
                    <div className="lg:col-span-2">
                        <Card title="Application Form">
                            <form onSubmit={handleSubmit}>
                                {/* User Info Display */}
                                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                    <Title level={5}>Applicant Information</Title>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <Text strong>Name:</Text> {auth.user.name}
                                        </div>
                                        <div>
                                            <Text strong>Email:</Text> {auth.user.email}
                                        </div>
                                        <div>
                                            <Text strong>Member Since:</Text> {new Date(auth.user.created_at).toLocaleDateString()}
                                        </div>
                                        <div>
                                            <Text strong>Current Role:</Text> <span className="capitalize">{auth.userRole}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Motivation */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Why do you want to become an editor? *
                                    </label>
                                    <TextArea
                                        rows={5}
                                        placeholder="I want to become an editor because..."
                                        showCount
                                        maxLength={1000}
                                        value={data.motivation}
                                        onChange={(e) => setData('motivation', e.target.value)}
                                        className={errors.motivation ? 'border-red-500' : ''}
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                        Tell us about your passion for writing and editing. What unique perspective would you bring to our blog? (minimum 100 characters)
                                    </div>
                                    {errors.motivation && (
                                        <div className="text-red-500 text-sm mt-1">{errors.motivation}</div>
                                    )}
                                </div>

                                {/* Experience */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Writing/Editing Experience (Optional)
                                    </label>
                                    <TextArea
                                        rows={4}
                                        placeholder="Describe your writing or editing experience, publications, blogs, etc..."
                                        showCount
                                        maxLength={1000}
                                        value={data.experience}
                                        onChange={(e) => setData('experience', e.target.value)}
                                        className={errors.experience ? 'border-red-500' : ''}
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                        Share your relevant writing, blogging, or editing experience. Include any publications, blogs, or projects you've worked on.
                                    </div>
                                    {errors.experience && (
                                        <div className="text-red-500 text-sm mt-1">{errors.experience}</div>
                                    )}
                                </div>

                                {/* Portfolio URL */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Portfolio URL (Optional)
                                    </label>
                                    <Input
                                        placeholder="https://your-portfolio.com"
                                        value={data.portfolio_url}
                                        onChange={(e) => setData('portfolio_url', e.target.value)}
                                        className={errors.portfolio_url ? 'border-red-500' : ''}
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                        Link to your portfolio, personal blog, LinkedIn, or any relevant online presence.
                                    </div>
                                    {errors.portfolio_url && (
                                        <div className="text-red-500 text-sm mt-1">{errors.portfolio_url}</div>
                                    )}
                                </div>

                                {/* Error Display */}
                                {Object.keys(errors).length > 0 && (
                                    <Alert
                                        message="Please correct the following errors:"
                                        description={
                                            <ul className="mt-2">
                                                {Object.entries(errors).map(([field, error]) => (
                                                    <li key={field} className="text-red-600">• {error}</li>
                                                ))}
                                            </ul>
                                        }
                                        type="error"
                                        showIcon
                                        className="mb-4"
                                    />
                                )}

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-3 pt-4 border-t">
                                    <Link href="/blog">
                                        <Button size="large">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit"
                                        loading={processing}
                                        icon={<EditOutlined />}
                                        size="large"
                                    >
                                        Submit Application
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>

                    {/* Sidebar Info - Same as before */}
                    <div className="lg:col-span-1">
                        <Card title="Editor Benefits">
                            <div className="space-y-4">
                                <div>
                                    <Title level={5} className="text-green-600">✓ Content Creation</Title>
                                    <Text type="secondary">Write and publish your own articles on topics you're passionate about.</Text>
                                </div>
                                
                                <div>
                                    <Title level={5} className="text-green-600">✓ Editorial Access</Title>
                                    <Text type="secondary">Access to advanced editing tools and content management features.</Text>
                                </div>
                                
                                <div>
                                    <Title level={5} className="text-green-600">✓ Community Impact</Title>
                                    <Text type="secondary">Help shape the direction and quality of our blog content.</Text>
                                </div>
                                
                                <div>
                                    <Title level={5} className="text-green-600">✓ Recognition</Title>
                                    <Text type="secondary">Get recognition as a valued contributor to our community.</Text>
                                </div>
                            </div>
                        </Card>

                        <Card title="Requirements" className="mt-4">
                            <div className="space-y-2 text-sm">
                                <div>• Active community member</div>
                                <div>• Passion for quality content</div>
                                <div>• Good writing skills</div>
                                <div>• Commitment to our guidelines</div>
                                <div>• Respectful communication</div>
                            </div>
                        </Card>

                        <Card title="Application Process" className="mt-4">
                            <div className="space-y-2 text-sm">
                                <div><strong>1.</strong> Submit application</div>
                                <div><strong>2.</strong> Admin review (3-5 days)</div>
                                <div><strong>3.</strong> Decision notification</div>
                                <div><strong>4.</strong> Welcome & onboarding</div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </BlogLayout>
    );
}