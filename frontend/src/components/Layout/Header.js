import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faInstagram, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faInstagram as faInstagramBrand } from '@fortawesome/free-brands-svg-icons';
import { Container } from '../../styles/theme';
import { useSession } from '../../contexts/SessionContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslations } from '../../locales';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

const HeaderWrapper = styled.header`
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  z-index: 9999 !important;
  transition: ${({ theme }) => theme.transitions.default};
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
  will-change: transform;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 0 !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
    transform: translate3d(0, 0, 0) !important;
    -webkit-transform: translate3d(0, 0, 0) !important;
    -webkit-backface-visibility: hidden !important;
    backface-visibility: hidden !important;
    will-change: transform !important;
  }
`;

const HeaderContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-left: ${({ theme }) => theme.spacing.sm};
    padding-right: ${({ theme }) => theme.spacing.sm};
    width: 100%;
    max-width: 100%;
    margin: 0;
    box-sizing: border-box;
  }
`;

const Logo = styled(Link)`
  font-size: ${({ theme }) => theme.typography['2xl']};
  font-weight: ${({ theme }) => theme.typography.bold};
  background: ${({ theme }) => theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const NavItem = styled(Link)`
  font-weight: ${({ theme }) => theme.typography.medium};
  color: ${({ theme }) => theme.colors.gray700};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transitions.default};
  position: relative;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.gray50};
  }
  
  ${({ $isActive, theme }) => $isActive && `
    color: ${theme.colors.primary};
    background: ${theme.colors.gray50};
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background: ${theme.colors.primary};
      border-radius: 50%;
    }
  `}
`;

const InstagramLink = styled.a`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${({ theme }) => theme.typography.xl};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondaryDark};
    transform: scale(1.1);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.typography.xl};
  padding: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  z-index: 9998;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ $isOpen }) => $isOpen ? 'block' : 'none'};
  }
`;

const MobileNavItem = styled(Link)`
  display: block;
  font-weight: ${({ theme }) => theme.typography.medium};
  color: ${({ theme }) => theme.colors.gray700};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transitions.default};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.gray50};
  }
  
  ${({ $isActive, theme }) => $isActive && `
    color: ${theme.colors.primary};
    background: ${theme.colors.gray50};
  `}
`;

const MobileInstagramLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.secondary};
  font-weight: ${({ theme }) => theme.typography.medium};
  text-decoration: none;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }
`;

const ProgressIndicator = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: ${({ theme }) => theme.colors.gradientPrimary};
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease-in-out;
`;

const getNavigation = (t) => [
  { name: t.nav.home, path: '/' },
  { name: t.nav.takeTest, path: '/test' },
  { name: t.nav.types, path: '/mbti-types' },
  { name: t.nav.articles, path: '/articles' },
  { name: t.nav.contact, path: '/contact' },
  { name: t.nav.about, path: '/about' },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { progress, status } = useSession();
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const navigation = getNavigation(t);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const showProgress = status === 'in_progress' && progress > 0;

  return (
    <HeaderWrapper>
      <HeaderContainer>
        <Logo to="/" onClick={closeMobileMenu}>
          HK MBTI
        </Logo>
        
        <Nav>
          {navigation.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              $isActive={isActiveRoute(item.path)}
            >
              {item.name}
            </NavItem>
          ))}
          <LanguageSwitcher />
          <InstagramLink
            href="https://instagram.com/mbti_station"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav.instagram}
          >
            <FontAwesomeIcon icon={faInstagramBrand} />
          </InstagramLink>
        </Nav>

        <MobileMenuButton
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </MobileMenuButton>
      </HeaderContainer>

      <MobileMenu $isOpen={isMobileMenuOpen}>
        {navigation.map((item) => (
          <MobileNavItem
            key={item.path}
            to={item.path}
            $isActive={isActiveRoute(item.path)}
            onClick={closeMobileMenu}
          >
            {item.name}
          </MobileNavItem>
        ))}
        <LanguageSwitcher />
        <MobileInstagramLink
          href="https://instagram.com/mbti_station"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMobileMenu}
        >
          <FontAwesomeIcon icon={faInstagramBrand} />
          {t.nav.instagram}
        </MobileInstagramLink>
      </MobileMenu>

      {showProgress && (
        <ProgressIndicator progress={progress} />
      )}
    </HeaderWrapper>
  );
};

export default Header; 
 