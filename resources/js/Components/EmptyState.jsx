import { Typography, Button } from 'antd';

const { Title, Paragraph } = Typography;

export default function EmptyState({
    icon,
    title,
    description,
    buttonText,
    buttonIcon,
    onButtonClick,
    showButton = false
}) {
    return (
        <div className="text-center py-20">
            <div className="mb-6">
                {icon}
            </div>
            <Title level={3} type="secondary" className="mb-3">
                {title}
            </Title>
            <Paragraph type="secondary" className="mb-8 text-lg">
                {description}
            </Paragraph>
            {showButton && (
                <Button 
                    type="primary" 
                    icon={buttonIcon}
                    onClick={onButtonClick}
                    size="large"
                    style={{
                        background: '#000',
                        borderColor: '#000',
                        borderRadius: '6px',
                        height: '48px',
                        fontWeight: '500',
                        fontSize: '16px'
                    }}
                >
                    {buttonText}
                </Button>
            )}
        </div>
    );
}