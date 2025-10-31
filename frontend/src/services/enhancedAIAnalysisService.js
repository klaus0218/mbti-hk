import apiService from './api';
import html2pdf from 'html2pdf.js';

// Create complete analysis package (full report only, no preview)
export const createAnalysisPackage = async (mbtiResult, sessionId = null, userId = null) => {
  try {
    // Ensure we don't send undefined values
    const payload = {
      mbtiResult,
      sessionId: sessionId || null,
      userId: userId || null
    };
    
    console.log('🚀 Sending payload to create-package:', JSON.stringify(payload, null, 2));
    
    const response = await apiService.post('/api/ai-analysis/create-package', payload);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to create analysis package');
    }
  } catch (error) {
    console.error('Error creating analysis package:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to create analysis package'
    );
  }
};

// Get existing analysis from database (full report only)
export const getAnalysisFromDatabase = async (sessionId, mbtiType) => {
  try {
    const response = await apiService.get(`/api/ai-analysis/get-analysis/${sessionId}/${mbtiType}`);

    if (response.data.success) {
      return response.data.data;
    } else {
      return null; // No analysis found
    }
  } catch (error) {
    console.error('Error getting analysis from database:', error);
    return null;
  }
};

// Unlock premium content (now handled in MBTI results)
export const unlockPremiumContent = async (sessionId, mbtiType) => {
  try {
    const response = await apiService.post('/api/ai-analysis/unlock-premium', {
      sessionId,
      mbtiType
    });

    if (response.data.success) {
      return true;
    } else {
      throw new Error(response.data.message || 'Failed to unlock premium content');
    }
  } catch (error) {
    console.error('Error unlocking premium content:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to unlock premium content'
    );
  }
};

// Get full report (only when premium is unlocked)
export const getFullReport = async (sessionId, mbtiType) => {
  try {
    const response = await apiService.get(`/api/ai-analysis/get-full-report/${sessionId}/${mbtiType}`);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to get full report');
    }
  } catch (error) {
    console.error('Error getting full report:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to get full report'
    );
  }
};

// Update result with user email
export const updateResultEmail = async (sessionId, email) => {
  try {
    const response = await apiService.put(`/api/results/${sessionId}/email`, {
      email
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to update email');
    }
  } catch (error) {
    console.error('Error updating result email:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to update email'
    );
  }
};

// Generate AI analysis based on MBTI results
export const generateAnalysis = async (mbtiResult) => {
  try {
    const response = await apiService.post('/api/ai-analysis/analyze', {
      mbtiResult
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to generate AI analysis');
    }
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to generate AI analysis'
    );
  }
};

// Generate comprehensive PDF report
export const generateReport = async (mbtiResult, includeAnalysis = true) => {
  try {
    const response = await apiService.post('/api/ai-analysis/generate-report', {
      mbtiResult,
      includeAnalysis
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to generate report');
    }
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to generate report'
    );
  }
};

// Download generated PDF report
export const downloadReport = async (downloadUrl, filename) => {
  try {
    const response = await apiService.get(downloadUrl, {
      responseType: 'blob'
    });

    // Create blob and download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error downloading report:', error);
    throw new Error('Failed to download report');
  }
};

// Get AI analysis service status
export const getAnalysisStatus = async () => {
  try {
    const response = await apiService.get('/api/ai-analysis/status');
    return response.data;
  } catch (error) {
    console.error('Error getting analysis status:', error);
    throw new Error('Failed to get analysis status');
  }
};

// Generate HTML from existing analysis
export const generateHTMLFromAnalysis = async (sessionId, mbtiType, language = 'en') => {
  try {
    const response = await apiService.post('/api/ai-analysis/generate-html-from-analysis', {
      sessionId,
      mbtiType,
      language
    });

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to generate HTML from analysis');
    }
  } catch (error) {
    console.error('Error generating HTML from analysis:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to generate HTML from analysis'
    );
  }
};

// Generate PDF directly and download without user interaction
export const generatePDFFromHTML = async (htmlContent, filename = 'MBTI_Report.pdf') => {
  let iframe = null;
  
  try {
    console.log('🔄 Starting direct PDF generation and download...');
    
    // Create a hidden iframe for PDF generation
    iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '210mm';
    iframe.style.height = '297mm';
    
    document.body.appendChild(iframe);
    
    // Write content to iframe
    iframe.contentDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>MBTI Report</title>
          <style>
            @page {
              margin: 15mm;
              size: A4;
            }
            
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 12pt;
              line-height: 1.4;
              color: #333;
              background: white;
              margin: 0;
              padding: 0;
            }
            
            h1, h2, h3, h4, h5, h6 {
              page-break-after: avoid;
              page-break-inside: avoid;
            }
            
            p, div, section {
              page-break-inside: avoid;
            }
            
            .page-break {
              page-break-before: always;
            }
            
            img {
              max-width: 100%;
              height: auto;
            }
            
            * {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `);
    
    iframe.contentDocument.close();
    
    // Wait for content to load and then generate PDF
    return new Promise((resolve, reject) => {
      let isResolved = false;
      
      const cleanup = () => {
        if (iframe && iframe.parentNode) {
          try {
            iframe.parentNode.removeChild(iframe);
          } catch (error) {
            console.warn('Iframe cleanup warning:', error);
          }
          iframe = null;
        }
      };
      
      const resolveOnce = (value) => {
        if (!isResolved) {
          isResolved = true;
          cleanup();
          resolve(value);
        }
      };
      
      const rejectOnce = (error) => {
        if (!isResolved) {
          isResolved = true;
          cleanup();
          reject(error);
        }
      };
      
      iframe.onload = async () => {
        try {
          // Use the browser's print-to-PDF API if available
          if (iframe.contentWindow.printToPDF) {
            const pdfBlob = await iframe.contentWindow.printToPDF();
            downloadPDFBlob(pdfBlob, filename);
            resolveOnce(true);
          } else {
            // Fallback: Trigger print and capture
            await generatePDFWithPrintCapture(iframe, filename);
            resolveOnce(true);
          }
        } catch (error) {
          rejectOnce(error);
        }
      };
      
      // Fallback timeout
      setTimeout(() => {
        try {
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.print();
            // Give user time to interact with print dialog
            setTimeout(() => {
              resolveOnce(true);
            }, 3000);
          } else {
            rejectOnce(new Error('Iframe not available for print'));
          }
        } catch (error) {
          rejectOnce(error);
        }
      }, 1000);
    });
    
  } catch (error) {
    console.error('Error generating PDF from HTML:', error);
    // Clean up iframe if it exists
    if (iframe && iframe.parentNode) {
      try {
        iframe.parentNode.removeChild(iframe);
      } catch (cleanupError) {
        console.warn('Iframe cleanup error:', cleanupError);
      }
    }
    throw new Error('Failed to generate PDF from HTML');
  }
};

// Helper function to download PDF blob
const downloadPDFBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Fallback method using print capture
const generatePDFWithPrintCapture = async (iframe, filename) => {
  // This is a fallback that would require additional setup
  // For now, we'll just trigger the print dialog as a last resort
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.print();
  }
};

// Alternative method using iframe for better compatibility
export const generatePDFFromHTMLWithIframe = async (htmlContent, filename = 'MBTI_Report.pdf') => {
  try {
    console.log('🔄 Starting iframe-based PDF generation...');
    
    return new Promise((resolve, reject) => {
      // Create a hidden iframe
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '-9999px';
      iframe.style.width = '210mm'; // A4 width
      iframe.style.height = '297mm'; // A4 height
      
      document.body.appendChild(iframe);
      
      // Write content to iframe
      iframe.contentDocument.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>MBTI Report</title>
            <style>
              @page {
                margin: 15mm;
                size: A4;
              }
              
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 12pt;
                line-height: 1.4;
                color: #333;
                background: white;
                margin: 0;
                padding: 0;
              }
              
              h1, h2, h3, h4, h5, h6 {
                page-break-after: avoid;
                page-break-inside: avoid;
              }
              
              p, div, section {
                page-break-inside: avoid;
              }
              
              .page-break {
                page-break-before: always;
              }
              
              img {
                max-width: 100%;
                height: auto;
              }
              
              * {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
      
      iframe.contentDocument.close();
      
      // Wait for content to load
      iframe.onload = () => {
        try {
          // Trigger print dialog
          iframe.contentWindow.print();
          
          // Clean up after print dialog appears
          setTimeout(() => {
            document.body.removeChild(iframe);
            resolve(true);
          }, 2000);
          
        } catch (error) {
          document.body.removeChild(iframe);
          reject(error);
        }
      };
      
      // Fallback if onload doesn't fire
      setTimeout(() => {
        try {
          iframe.contentWindow.print();
          setTimeout(() => {
            document.body.removeChild(iframe);
            resolve(true);
          }, 2000);
        } catch (error) {
          document.body.removeChild(iframe);
          reject(error);
        }
      }, 1000);
    });
    
  } catch (error) {
    console.error('Error generating PDF from HTML with iframe:', error);
    throw new Error('Failed to generate PDF from HTML');
  }
};
