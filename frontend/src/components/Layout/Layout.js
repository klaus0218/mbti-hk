import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';

const LayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100vw;
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 70px; /* Account for fixed header */
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-top: 60px; /* Mobile header height */
  }
`;

const Layout = () => {
  return (
    <LayoutWrapper>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </LayoutWrapper>
  );
};

export default Layout; 
