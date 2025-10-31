import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCreditCard, faLock, faCheck, faBrain } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from '../../contexts/LanguageContext';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 100%;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ModalTitle = styled.h2`
  text-align: center;
  margin-bottom: 24px;
  color: #2c3e50;
  font-size: 24px;
`;

const PriceDisplay = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const Price = styled.div`
  font-size: 48px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8px;
`;

const PriceDescription = styled.div`
  color: #666;
  font-size: 16px;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 32px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const FeatureIcon = styled.div`
  color: #27ae60;
  font-size: 18px;
`;

const FeatureText = styled.span`
  color: #2c3e50;
  font-size: 16px;
`;

const PaymentButton = styled.button`
  width: 100%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess, mbtiType }) => {
  const { language } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
      onClose();
    }, 2000);
  };

  const features = [
    {
      icon: faBrain,
      text: language === 'zh' ? 'AI深度人格分析' : 'AI Deep Personality Analysis'
    },
    {
      icon: faCheck,
      text: language === 'zh' ? '專業心理學見解' : 'Professional Psychological Insights'
    },
    {
      icon: faCheck,
      text: language === 'zh' ? '職業發展建議' : 'Career Development Advice'
    },
    {
      icon: faCheck,
      text: language === 'zh' ? '個人成長指導' : 'Personal Growth Guidance'
    },
    {
      icon: faCheck,
      text: language === 'zh' ? '完整PDF報告下載' : 'Complete PDF Report Download'
    }
  ];

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </CloseButton>
        
        <ModalTitle>
          {language === 'zh' ? '解鎖高級分析' : 'Unlock Premium Analysis'}
        </ModalTitle>
        
        <PriceDisplay>
          <Price>HK$ 99</Price>
          <PriceDescription>
            {language === 'zh' ? '一次性付款，永久解鎖' : 'One-time payment, unlock forever'}
          </PriceDescription>
        </PriceDisplay>
        
        <FeaturesList>
          {features.map((feature, index) => (
            <FeatureItem key={index}>
              <FeatureIcon>
                <FontAwesomeIcon icon={feature.icon} />
              </FeatureIcon>
              <FeatureText>{feature.text}</FeatureText>
            </FeatureItem>
          ))}
        </FeaturesList>
        
        <PaymentButton onClick={handlePayment} disabled={isProcessing}>
          {isProcessing ? (
            language === 'zh' ? '處理中...' : 'Processing...'
          ) : (
            <>
              <FontAwesomeIcon icon={faCreditCard} style={{ marginRight: '8px' }} />
              {language === 'zh' ? '立即購買' : 'Buy Now'}
            </>
          )}
        </PaymentButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default PaymentModal;
