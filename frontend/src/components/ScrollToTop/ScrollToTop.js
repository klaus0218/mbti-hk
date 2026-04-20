import { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { forceWindowScrollTop } from '../../utils/forceScrollTop';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Prevent the browser from restoring the previous route’s scroll after we reset.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Run before paint so the new page is not briefly shown at the old offset.
  useLayoutEffect(() => {
    // Defensive reset: if any page left body/html overflow locked, re-enable
    // document scrolling after route changes.
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowY = '';

    forceWindowScrollTop();
    const raf = window.requestAnimationFrame(() => {
      forceWindowScrollTop();
    });
    const t0 = window.setTimeout(forceWindowScrollTop, 0);
    const t1 = window.setTimeout(forceWindowScrollTop, 100);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t0);
      window.clearTimeout(t1);
    };
  }, [location.pathname, location.key]);

  useEffect(() => {
    // Remove any existing test buttons
    const existingTestButton = document.getElementById('test-fixed-button');
    if (existingTestButton) {
      existingTestButton.remove();
    }

    // Create the scroll to top button
    const button = document.createElement('button');
    button.id = 'scroll-to-top-btn';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Scroll to top');
    button.setAttribute('title', 'Scroll to top');
    
    // Apply styles
    Object.assign(button.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
      color: 'white',
      border: 'none',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      cursor: 'pointer',
      zIndex: '999999',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      fontWeight: 'bold',
      transition: 'all 0.3s ease-in-out',
      opacity: '0',
      visibility: 'hidden',
      transform: 'translateY(20px) scale(0.8)',
      fontFamily: 'Inter, Arial, sans-serif'
    });

    // Add to body
    document.body.appendChild(button);

    const toggleVisibility = () => {
      const scrolled = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrolled > 300) {
        setIsVisible(true);
        button.style.opacity = '1';
        button.style.visibility = 'visible';
        button.style.transform = 'translateY(0) scale(1)';
      } else {
        setIsVisible(false);
        button.style.opacity = '0';
        button.style.visibility = 'hidden';
        button.style.transform = 'translateY(20px) scale(0.8)';
      }
    };

    const scrollToTop = () => {
      forceWindowScrollTop();
    };

    // Hover effects
    button.addEventListener('mouseenter', () => {
      if (isVisible) {
        button.style.background = 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)';
        button.style.transform = 'translateY(-4px) scale(1.1)';
        button.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
      }
    });

    button.addEventListener('mouseleave', () => {
      if (isVisible) {
        button.style.background = 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)';
        button.style.transform = 'translateY(0) scale(1)';
        button.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
      }
    });

    // Click handler
    button.addEventListener('click', scrollToTop);

    // Scroll listener
    window.addEventListener('scroll', toggleVisibility);
    
    // Initial check
    toggleVisibility();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      if (button && document.body.contains(button)) {
        document.body.removeChild(button);
      }
    };
  }, []);

  return null;
};

export default ScrollToTop; 
