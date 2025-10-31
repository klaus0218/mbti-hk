import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { Container, Button } from '../../styles/theme';

const ErrorWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.gradientLight};
`;

const ErrorContent = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['4xl']};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  max-width: 500px;
  width: 100%;
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.error};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const ErrorTitle = styled.h1`
  color: ${({ theme }) => theme.colors.gray900};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  text-align: left;
  margin: ${({ theme }) => theme.spacing.lg} 0;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.gray50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const ErrorSummary = styled.summary`
  cursor: pointer;
  font-weight: ${({ theme }) => theme.typography.medium};
  color: ${({ theme }) => theme.colors.gray700};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ErrorStack = styled.pre`
  font-size: ${({ theme }) => theme.typography.xs};
  color: ${({ theme }) => theme.colors.gray600};
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: center;
  flex-wrap: wrap;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and external service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    // Example: Sentry.captureException(error);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportError = () => {
    const errorReport = {
      error: this.state.error?.toString(),
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    // You can implement error reporting here
    console.log('Error Report:', errorReport);
    
    // For now, just copy to clipboard
    navigator.clipboard?.writeText(JSON.stringify(errorReport, null, 2))
      .then(() => alert('Error details copied to clipboard'))
      .catch(() => alert('Could not copy error details'));
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorWrapper>
          <Container>
            <ErrorContent>
              <ErrorIcon>
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </ErrorIcon>
              
              <ErrorTitle>Oops! Something went wrong</ErrorTitle>
              
              <ErrorMessage>
                We're sorry, but something unexpected happened. The error has been logged 
                and we'll work to fix it as soon as possible.
              </ErrorMessage>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <ErrorDetails>
                  <ErrorSummary>Error Details (Development)</ErrorSummary>
                  <ErrorStack>
                    <strong>Error:</strong> {this.state.error.toString()}
                    {this.state.error.stack && (
                      <>
                        <br /><br />
                        <strong>Stack Trace:</strong>
                        <br />
                        {this.state.error.stack}
                      </>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <>
                        <br /><br />
                        <strong>Component Stack:</strong>
                        <br />
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </ErrorStack>
                </ErrorDetails>
              )}

              <ActionButtons>
                <Button onClick={this.handleReload} variant="primary">
                  <FontAwesomeIcon icon={faRefresh} />
                  Reload Page
                </Button>
                
                <Button onClick={this.handleGoHome} variant="secondary">
                  Go to Home
                </Button>
                
                {process.env.NODE_ENV === 'development' && (
                  <Button onClick={this.handleReportError} variant="outline">
                    Copy Error Details
                  </Button>
                )}
              </ActionButtons>
            </ErrorContent>
          </Container>
        </ErrorWrapper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 
