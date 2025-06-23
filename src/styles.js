// styles.js - Enhanced styling with medal colors and onboarding themes

export const setupTheme = () => {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f8f9fa;
      --bg-tertiary: #e9ecef;
      --bg-accent: #e3f2fd;
      --text-primary: #212529;
      --text-secondary: #6c757d;
      --border-color: #dee2e6;
      --success-color: #28a745;
      --info-color: #17a2b8;
      --warning-color: #ffc107;
      --danger-color: #dc3545;
      --accent-color: #007bff;
      
      /* Medal Colors */
      --bronze-color: #CD7F32;
      --silver-color: #C0C0C0;
      --gold-color: #FFD700;
      --bronze-bg: #f4e4c1;
      --silver-bg: #f0f0f0;
      --gold-bg: #fff9c4;
      
      /* Enhanced Colors */
      --onboarding-primary: #2196f3;
      --onboarding-secondary: #4caf50;
      --celebration-color: #ff9800;
      --progress-color: #9c27b0;
    }
    
    @media (prefers-color-scheme: dark) {
      :root {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --bg-tertiary: #404040;
        --bg-accent: #1e3a5f;
        --text-primary: #ffffff;
        --text-secondary: #b0b0b0;
        --border-color: #404040;
        --success-color: #4caf50;
        --info-color: #2196f3;
        --warning-color: #ff9800;
        --danger-color: #f44336;
        --accent-color: #2196f3;
        
        /* Dark mode medal adjustments */
        --bronze-bg: #3d2f1f;
        --silver-bg: #3d3d3d;
        --gold-bg: #3d3a1f;
      }
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
    }
    
    /* Enhanced button interactions */
    button {
      transition: all 0.2s ease;
      cursor: pointer;
      user-select: none;
    }
    
    button:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    button:active:not(:disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    /* Enhanced form elements */
    input:focus, select:focus, textarea:focus {
      outline: 2px solid var(--accent-color);
      outline-offset: 2px;
      border-color: var(--accent-color);
    }
    
    /* Medal specific animations */
    .medal-upgrade {
      animation: medalShine 0.6s ease-in-out;
    }
    
    @keyframes medalShine {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
      100% { transform: scale(1); }
    }
    
    /* Onboarding specific styles */
    .onboarding-container {
      background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-accent) 100%);
      min-height: 100vh;
    }
    
    .progress-indicator {
      background: linear-gradient(90deg, var(--success-color) 0%, var(--info-color) 100%);
      border-radius: 10px;
      overflow: hidden;
    }
    
    /* Celebration animations */
    .celebration-bounce {
      animation: celebrationBounce 0.8s ease-in-out;
    }
    
    @keyframes celebrationBounce {
      0%, 20%, 60%, 100% { transform: translateY(0); }
      40% { transform: translateY(-20px); }
      80% { transform: translateY(-10px); }
    }
    
    /* PWA specific styles */
    .install-prompt {
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    
    /* Responsive improvements */
    @media (max-width: 768px) {
      .desktop-only {
        display: none;
      }
      
      .mobile-stack {
        flex-direction: column;
      }
      
      .mobile-full-width {
        width: 100%;
      }
    }
    
    @media (min-width: 769px) {
      .mobile-only {
        display: none;
      }
    }
    
    /* Accessibility improvements */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
    
    /* Focus visible for keyboard navigation */
    button:focus-visible,
    input:focus-visible,
    select:focus-visible {
      outline: 3px solid var(--accent-color);
      outline-offset: 2px;
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
      :root {
        --border-color: #000000;
        --text-secondary: #000000;
      }
    }
  `;
  document.head.appendChild(style);
  
  return () => {
    document.head.removeChild(style);
  };
};

export const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '16px',
    lineHeight: '1.5',
    padding: '1rem',
    maxWidth: '100%',
    margin: '0 auto',
  },
  
  card: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.25rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'box-shadow 0.2s ease',
  },
  
  primaryCard: {
    backgroundColor: 'var(--bg-accent)',
    border: '2px solid var(--accent-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1rem',
    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.1)',
  },
  
  // Enhanced medal-themed cards
  bronzeCard: {
    backgroundColor: 'var(--bronze-bg)',
    border: '2px solid var(--bronze-color)',
    borderRadius: '12px',
    padding: '1.25rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 8px rgba(205, 127, 50, 0.1)',
  },
  
  silverCard: {
    backgroundColor: 'var(--silver-bg)',
    border: '2px solid var(--silver-color)',
    borderRadius: '12px',
    padding: '1.25rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 8px rgba(192, 192, 192, 0.1)',
  },
  
  goldCard: {
    backgroundColor: 'var(--gold-bg)',
    border: '2px solid var(--gold-color)',
    borderRadius: '12px',
    padding: '1.25rem',
    marginBottom: '1rem',
    boxShadow: '0 2px 8px rgba(255, 215, 0, 0.1)',
  },
  
  button: {
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minHeight: '48px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '0.5rem',
    marginRight: '0.5rem',
    width: 'auto',
    minWidth: '120px',
    textDecoration: 'none',
    userSelect: 'none',
  },
  
  primaryButton: {
    backgroundColor: 'var(--success-color)',
    color: 'white',
    boxShadow: '0 2px 4px rgba(40, 167, 69, 0.2)',
  },
  
  secondaryButton: {
    backgroundColor: 'var(--info-color)',
    color: 'white',
    boxShadow: '0 2px 4px rgba(23, 162, 184, 0.2)',
  },
  
  warningButton: {
    backgroundColor: 'var(--warning-color)',
    color: 'white',
    boxShadow: '0 2px 4px rgba(255, 193, 7, 0.2)',
  },
  
  dangerButton: {
    backgroundColor: 'var(--danger-color)',
    color: 'white',
    boxShadow: '0 2px 4px rgba(220, 53, 69, 0.2)',
  },
  
  // Medal-themed buttons
  bronzeButton: {
    backgroundColor: 'var(--bronze-color)',
    color: 'white',
    boxShadow: '0 2px 4px rgba(205, 127, 50, 0.2)',
  },
  
  silverButton: {
    backgroundColor: 'var(--silver-color)',
    color: 'white',
    boxShadow: '0 2px 4px rgba(192, 192, 192, 0.2)',
  },
  
  goldButton: {
    backgroundColor: 'var(--gold-color)',
    color: '#333',
    boxShadow: '0 2px 4px rgba(255, 215, 0, 0.2)',
  },
  
  // Onboarding-specific buttons
  onboardingButton: {
    backgroundColor: 'var(--onboarding-primary)',
    color: 'white',
    padding: '16px 32px',
    fontSize: '18px',
    fontWeight: 'bold',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
    minWidth: '200px',
  },
  
  // Toggle switch styles
  toggleContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem',
  },
  
  toggleSwitch: {
    position: 'relative',
    width: '48px',
    height: '24px',
    backgroundColor: 'var(--border-color)',
    borderRadius: '24px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  
  toggleSwitchActive: {
    backgroundColor: 'var(--success-color)',
  },
  
  toggleSlider: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: 'transform 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  
  toggleSliderActive: {
    transform: 'translateX(24px)',
  },
  
  toggleLabel: {
    fontSize: '0.9rem',
    fontWeight: '500',
    color: 'var(--text-primary)',
    userSelect: 'none',
  },
  
  input: {
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid var(--border-color)',
    borderRadius: '8px',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    width: '100%',
    marginBottom: '1rem',
    minHeight: '48px',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '2px solid var(--border-color)',
    fontSize: '14px',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    minHeight: '36px',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease',
  },
  
  // Enhanced page tag with medal styling
  pageTag: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '8px 12px',
    margin: '4px',
    border: '2px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    minHeight: '40px',
    minWidth: '80px',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  
  // Medal-specific page tags
  bronzePageTag: {
    backgroundColor: 'var(--bronze-bg)',
    borderColor: 'var(--bronze-color)',
    color: 'var(--bronze-color)',
  },
  
  silverPageTag: {
    backgroundColor: 'var(--silver-bg)',
    borderColor: 'var(--silver-color)',
    color: 'var(--silver-color)',
  },
  
  goldPageTag: {
    backgroundColor: 'var(--gold-bg)',
    borderColor: 'var(--gold-color)',
    color: 'var(--gold-color)',
  },
  
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '1rem',
  },
  
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--success-color)',
    transition: 'width 0.3s ease',
    borderRadius: '4px',
  },
  
  // Enhanced progress bar with gradient
  enhancedProgressBar: {
    width: '100%',
    height: '12px',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '1rem',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
  },
  
  enhancedProgressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, var(--success-color) 0%, var(--info-color) 100%)',
    transition: 'width 0.3s ease',
    borderRadius: '6px',
  },
  
  statCard: {
    textAlign: 'center',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '1rem',
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
  },
  
  // Medal-themed stat cards
  bronzeStatCard: {
    backgroundColor: 'var(--bronze-color)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(205, 127, 50, 0.2)',
  },
  
  silverStatCard: {
    backgroundColor: 'var(--silver-color)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(192, 192, 192, 0.2)',
  },
  
  goldStatCard: {
    backgroundColor: 'var(--gold-color)',
    color: '#333',
    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.2)',
  },
  
  flexWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  
  mobileGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem',
  },
  
  // Enhanced grid for larger displays
  desktopGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  
  // Onboarding-specific layouts
  onboardingContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-accent) 100%)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  
  onboardingCard: {
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '16px',
    padding: '2rem',
    maxWidth: '800px',
    width: '100%',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid var(--border-color)',
  },
  
  onboardingStep: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  
  onboardingTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '1rem',
  },
  
  onboardingSubtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  
  // Modal and overlay styles
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '1rem',
    backdropFilter: 'blur(4px)',
  },
  
  modalContent: {
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '2px solid var(--border-color)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  
  // Celebration styles
  celebrationModal: {
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '16px',
    padding: '3rem',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
    border: '3px solid var(--celebration-color)',
    boxShadow: '0 12px 48px rgba(255, 152, 0, 0.2)',
  },
  
  // PWA-specific styles
  installPrompt: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'var(--info-color)',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
    zIndex: 1000,
    maxWidth: '90vw',
    minWidth: '300px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
  },
  
  // Responsive utilities
  hideOnMobile: {
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  
  hideOnDesktop: {
    '@media (min-width: 769px)': {
      display: 'none',
    },
  },
  
  fullWidthOnMobile: {
    '@media (max-width: 768px)': {
      width: '100%',
      marginRight: 0,
      marginBottom: '0.5rem',
    },
  },
};

// Enhanced color style function with medal support
export const getColorStyle = (color) => {
  const baseStyle = { ...styles.pageTag };
  switch (color) {
    case 'red':
      return { 
        ...baseStyle, 
        ...styles.bronzePageTag,
        backgroundColor: 'var(--bronze-bg)',
        borderColor: 'var(--bronze-color)',
        color: 'var(--bronze-color)'
      };
    case 'green':
      return { 
        ...baseStyle, 
        ...styles.silverPageTag,
        backgroundColor: 'var(--silver-bg)',
        borderColor: 'var(--silver-color)',
        color: 'var(--silver-color)'
      };
    case 'super-green':
      return { 
        ...baseStyle, 
        ...styles.goldPageTag,
        backgroundColor: 'var(--gold-bg)',
        borderColor: 'var(--gold-color)',
        color: 'var(--gold-color)'
      };
    default:
      return baseStyle;
  }
};

// Medal-themed utility functions
export const getMedalStyle = (medalType, variant = 'default') => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    fontWeight: 'bold',
    transition: 'all 0.2s ease',
  };
  
  switch (medalType) {
    case 'bronze':
      return {
        ...baseStyles,
        backgroundColor: variant === 'solid' ? 'var(--bronze-color)' : 'var(--bronze-bg)',
        color: variant === 'solid' ? 'white' : 'var(--bronze-color)',
        border: `2px solid var(--bronze-color)`,
      };
    case 'silver':
      return {
        ...baseStyles,
        backgroundColor: variant === 'solid' ? 'var(--silver-color)' : 'var(--silver-bg)',
        color: variant === 'solid' ? 'white' : 'var(--silver-color)',
        border: `2px solid var(--silver-color)`,
      };
    case 'gold':
      return {
        ...baseStyles,
        backgroundColor: variant === 'solid' ? 'var(--gold-color)' : 'var(--gold-bg)',
        color: variant === 'solid' ? '#333' : 'var(--gold-color)',
        border: `2px solid var(--gold-color)`,
      };
    default:
      return baseStyles;
  }
};

// Onboarding step indicator styles
export const getStepIndicatorStyle = (isActive, isCompleted) => {
  const baseStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'all 0.3s ease',
  };
  
  if (isCompleted) {
    return {
      ...baseStyle,
      backgroundColor: 'var(--success-color)',
      color: 'white',
      border: '2px solid var(--success-color)',
    };
  }
  
  if (isActive) {
    return {
      ...baseStyle,
      backgroundColor: 'var(--accent-color)',
      color: 'white',
      border: '2px solid var(--accent-color)',
      transform: 'scale(1.1)',
    };
  }
  
  return {
    ...baseStyle,
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-secondary)',
    border: '2px solid var(--border-color)',
  };
};

// Animation utilities
export const animations = {
  fadeIn: {
    animation: 'fadeIn 0.3s ease-in-out',
  },
  slideUp: {
    animation: 'slideUp 0.4s ease-out',
  },
  bounce: {
    animation: 'celebrationBounce 0.8s ease-in-out',
  },
  shine: {
    animation: 'medalShine 0.6s ease-in-out',
  },
};

// Responsive breakpoints
export const breakpoints = {
  mobile: '(max-width: 768px)',
  tablet: '(min-width: 769px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
};