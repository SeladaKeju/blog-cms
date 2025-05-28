import { Typography, Button } from 'antd';

const { Title, Text } = Typography;

export default function PageHeader({
    title,
    subtitle,
    buttonText,
    buttonIcon,
    onButtonClick,
    buttonStyle = {}
}) {
    return (
        <div className="flex justify-between items-start gap-6 mb-6">
            <div>
                <Title level={3} className="mb-1">{title}</Title>
                <Text type="secondary">{subtitle}</Text>
            </div>
            
            {buttonText && (
                <Button 
                    type="primary" 
                    icon={buttonIcon}
                    size="large"
                    onClick={onButtonClick}
                    style={{
                        background: '#000',
                        borderColor: '#000',
                        borderRadius: '6px',
                        height: '40px',
                        fontWeight: '500',
                        ...buttonStyle
                    }}
                >
                    {buttonText}
                </Button>
            )}
        </div>
    );
}