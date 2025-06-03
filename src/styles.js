// styles.js - All styling and theming

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
          --success-color: #28a745;
          --info-color: #17a2b8;
          --warning-color: #ffc107;
          --danger-color: #dc3545;
          --accent-color: #007bff;
        }
      }
      
      * {
        box-sizing: border-box;
      }
      
      button:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      
      button:active {
        transform: translateY(0);
      }
      
      input:focus, select:focus {
        outline: 2px solid var(--accent-color);
        outline-offset: 2px;
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
      backgroundColor: 'var(--bg-primary, #ffffff)',
      color: 'var(--text-primary, #000000)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: '16px',
      lineHeight: '1.5',
      padding: '1rem',
      maxWidth: '100%',
      margin: '0 auto',
    },
    
    card: {
      backgroundColor: 'var(--bg-secondary, #f8f9fa)',
      border: '1px solid var(--border-color, #e9ecef)',
      borderRadius: '12px',
      padding: '1.25rem',
      marginBottom: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    
    primaryCard: {
      backgroundColor: 'var(--bg-accent, #e3f2fd)',
      border: '2px solid var(--accent-color, #2196f3)',
      borderRadius: '12px',
      padding: '1.25rem',
      marginBottom: '1rem',
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
    },
    
    primaryButton: {
      backgroundColor: 'var(--success-color, #4caf50)',
      color: 'white',
    },
    
    secondaryButton: {
      backgroundColor: 'var(--info-color, #2196f3)',
      color: 'white',
    },
    
    warningButton: {
      backgroundColor: 'var(--warning-color, #ff9800)',
      color: 'white',
    },
    
    dangerButton: {
      backgroundColor: 'var(--danger-color, #f44336)',
      color: 'white',
    },
    
    input: {
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid var(--border-color, #e9ecef)',
      borderRadius: '8px',
      backgroundColor: 'var(--bg-primary, #ffffff)',
      color: 'var(--text-primary, #000000)',
      width: '100%',
      marginBottom: '1rem',
      minHeight: '48px',
    },
    
    pageTag: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 12px',
      margin: '4px',
      border: '2px solid var(--border-color, #e9ecef)',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      minHeight: '40px',
      minWidth: '80px',
      justifyContent: 'center',
    },
    
    select: {
      padding: '6px 8px',
      borderRadius: '6px',
      border: '1px solid var(--border-color, #ccc)',
      fontSize: '14px',
      backgroundColor: 'var(--bg-primary, #ffffff)',
      color: 'var(--text-primary, #000000)',
      minHeight: '32px',
    },
    
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: 'var(--bg-tertiary, #e0e0e0)',
      borderRadius: '4px',
      overflow: 'hidden',
      marginBottom: '1rem',
    },
    
    progressFill: {
      height: '100%',
      backgroundColor: 'var(--success-color, #4caf50)',
      transition: 'width 0.3s ease',
    },
    
    statCard: {
      textAlign: 'center',
      padding: '1rem',
      borderRadius: '12px',
      marginBottom: '1rem',
      minHeight: '100px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
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
  };
  
  export const getColorStyle = (color) => {
    const baseStyle = { ...styles.pageTag };
    switch (color) {
      case 'red':
        return { ...baseStyle, backgroundColor: 'var(--danger-color, #ffcdd2)', color: 'white', borderColor: 'var(--danger-color, #c62828)' };
      case 'green':
        return { ...baseStyle, backgroundColor: 'var(--success-color, #c8e6c9)', color: 'white', borderColor: 'var(--success-color, #2e7d32)' };
      case 'super-green':
        return { ...baseStyle, backgroundColor: '#1b5e20', color: 'white', borderColor: '#1b5e20' };
      default:
        return baseStyle;
    }
  };