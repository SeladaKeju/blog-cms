import { Layout, Menu, Input, Button, Typography } from 'antd';
import { SearchOutlined, HomeOutlined } from '@ant-design/icons';
import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const { Search } = Input;

export default function BlogLayout({ children, title = "Blog" }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            
            // Menentukan arah scroll
            // Jika prevScrollPos > currentScrollPos, berarti scroll ke atas
            // Jika currentScrollPos < 10, berarti di bagian atas halaman
            setVisible((prevScrollPos > currentScrollPos) || currentScrollPos < 10);
            
            // Update posisi scroll sebelumnya
            setPrevScrollPos(currentScrollPos);
        };

        // Menambahkan event listener
        window.addEventListener('scroll', handleScroll);
        
        // Cleanup event listener saat komponen unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos]);

    const handleSearch = (value) => {
        if (value.trim()) {
            window.location.href = `/blog?search=${encodeURIComponent(value)}`;
        } else {
            window.location.href = '/blog';
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Header dengan animasi */}
            <Header style={{ 
                background: '#fff', 
                boxShadow: '0 2px 8px 0 rgba(29,35,41,.05)',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'fixed',         // Fixed position
                top: 0,                    // At the top
                left: 0,                   // Full width from left
                right: 0,                  // Full width to right
                zIndex: 1000,              // Above all content
                transition: 'transform 0.3s ease', // Smooth transition
                transform: visible ? 'translateY(0)' : 'translateY(-100%)', // Hide/show with transform
            }}>
                <div className="flex items-center gap-8">
                    <Link href="/blog" className="flex items-center">
                        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                            My Blog
                        </Title>
                    </Link>
                    
                    <Menu
                        mode="horizontal"
                        style={{ border: 'none', backgroundColor: 'transparent' }}
                        items={[
                            {
                                key: 'home',
                                icon: <HomeOutlined />,
                                label: <Link href="/blog">Home</Link>,
                            }
                        ]}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <Search
                        placeholder="Search articles..."
                        allowClear
                        style={{ width: 300 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onSearch={handleSearch}
                        enterButton={<SearchOutlined />}
                    />
                </div>
            </Header>

            {/* Content - add padding-top to account for fixed header */}
            <Content style={{ 
                padding: '24px', 
                backgroundColor: '#f5f5f5',
                marginTop: '64px' // Add margin equal to header height
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {children}
                </div>
            </Content>

            {/* Footer */}
            <Footer style={{ textAlign: 'center', backgroundColor: '#fff' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <p>© 2024 My Blog. Built with Laravel & React.</p>
                </div>
            </Footer>
        </Layout>
    );
}