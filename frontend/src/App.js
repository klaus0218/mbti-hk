import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { LanguageProvider } from './contexts/LanguageContext';
import { SessionProvider } from './contexts/SessionContext';
import { AdminProvider } from './contexts/AdminContext';
import muiTheme from './styles/muiTheme';
import { theme, GlobalStyle } from './styles/theme';
import CssBaseline from '@mui/material/CssBaseline';

// Layout components
import Layout from './components/Layout/Layout';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

// Main pages
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import MBTITest from './pages/MBTITest/MBTITest';
import MBTITypes from './pages/MBTITypes/MBTITypes';
import Questions from './pages/Questions/Questions';
import Results from './pages/Results/Results';
import Articles from './pages/Articles/Articles';
import ArticleDetail from './pages/Articles/ArticleDetail';
import Demographics from './pages/Demographics/Demographics';
import TestStatement from './pages/TestStatement/TestStatement';
import NotFound from './pages/NotFound/NotFound';
import Main1 from './pages/Main1/Main1';

// Admin pages
import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './components/Layout/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminRecords from './pages/Admin/AdminRecords';
import AdminRecordDetail from './pages/Admin/AdminRecordDetail';
import AdminGraphs from './pages/Admin/AdminGraphs';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <StyledThemeProvider theme={theme}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        <GlobalStyle />
        <LanguageProvider>
          <SessionProvider>
            <Router>
              <ScrollToTop />
              <ErrorBoundary>
                <Routes>
                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminProvider />}>
                    <Route path="login" element={<AdminLogin />} />
                    <Route path="" element={
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    }>
                      <Route index element={<AdminDashboard />} />
                      <Route path="records" element={<AdminRecords />} />
                      <Route path="records/:sessionId" element={<AdminRecordDetail />} />
                      <Route path="graphs" element={<AdminGraphs />} />
                    </Route>
                  </Route>

                  {/* Main Routes */}
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="main1" element={<Main1 />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="test" element={<TestStatement />} />
                    <Route path="start-test" element={<MBTITest />} />
                    <Route path="mbti-types" element={<MBTITypes />} />
                    <Route path="mbti-types/:type" element={<MBTITypes />} />
                    <Route path="questions/:sessionId" element={<Questions />} />
                    <Route path="questions/:sessionId/:sectionId" element={<Questions />} />
                    <Route path="demographics/:sessionId" element={<Demographics />} />
                    <Route path="results/:sessionId" element={<Results />} />
                    <Route path="articles" element={<Articles />} />
                    <Route path="articles/:identifier" element={<ArticleDetail />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </ErrorBoundary>
            </Router>
          </SessionProvider>
        </LanguageProvider>
      </MuiThemeProvider>
    </StyledThemeProvider>
  );
}

export default App;
