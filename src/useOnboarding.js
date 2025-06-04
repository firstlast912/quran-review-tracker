// useOnboarding.js - Onboarding state management and medal helpers
import { useState, useEffect, useCallback } from 'react';

export const useOnboarding = (user, isCloudSync) => {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [showQualityUpgrade, setShowQualityUpgrade] = useState(false);
  const [currentUpgradePage, setCurrentUpgradePage] = useState(null);
  const [currentUpgradeQuality, setCurrentUpgradeQuality] = useState(null);
  const [showCycleComplete, setShowCycleComplete] = useState(false);
  const [cycleStats, setCycleStats] = useState({});

  // Check if user has completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = () => {
      try {
        // For cloud users, check cloud storage
        if (user && isCloudSync) {
          // This will be handled by the main app's data loading
          return;
        }
        
        // For local users, check localStorage
        const completed = localStorage.getItem('onboardingComplete');
        const hasMemorizedPages = localStorage.getItem('memorizedPages');
        
        if (completed === 'true' || hasMemorizedPages) {
          setOnboardingComplete(true);
          setIsFirstTime(false);
        } else {
          setOnboardingComplete(false);
          setIsFirstTime(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // Default to showing onboarding if there's an error
        setOnboardingComplete(false);
        setIsFirstTime(true);
      }
    };

    checkOnboardingStatus();
  }, [user, isCloudSync]);

  // Complete onboarding
  const completeOnboarding = useCallback((memorizedPages) => {
    try {
      setOnboardingComplete(true);
      setIsFirstTime(false);
      
      // Save onboarding completion status
      if (user && isCloudSync) {
        // Will be saved to cloud by the main app
      } else {
        localStorage.setItem('onboardingComplete', 'true');
      }
      
      return memorizedPages;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }, [user, isCloudSync]);

  // Reset onboarding (for testing or user request)
  const resetOnboarding = useCallback(() => {
    try {
      setOnboardingComplete(false);
      setIsFirstTime(true);
      
      if (user && isCloudSync) {
        // Would need to clear cloud data
      } else {
        localStorage.removeItem('onboardingComplete');
      }
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  }, [user, isCloudSync]);

  // Show quality upgrade modal
  const triggerQualityUpgrade = useCallback((page, currentQuality) => {
    setCurrentUpgradePage(page);
    setCurrentUpgradeQuality(currentQuality);
    setShowQualityUpgrade(true);
  }, []);

  // Handle quality upgrade
  const handleQualityUpgrade = useCallback((page, newQuality, updateFunction) => {
    try {
      updateFunction(page, newQuality);
      setShowQualityUpgrade(false);
      setCurrentUpgradePage(null);
      setCurrentUpgradeQuality(null);
      
      // Could track upgrade stats here for analytics
      console.log(`Page ${page} upgraded to ${newQuality}`);
    } catch (error) {
      console.error('Error upgrading quality:', error);
    }
  }, []);

  // Close quality upgrade modal
  const closeQualityUpgrade = useCallback(() => {
    setShowQualityUpgrade(false);
    setCurrentUpgradePage(null);
    setCurrentUpgradeQuality(null);
  }, []);

  // Show cycle completion celebration
  const triggerCycleComplete = useCallback((stats) => {
    setCycleStats(stats);
    setShowCycleComplete(true);
  }, []);

  // Close cycle completion modal
  const closeCycleComplete = useCallback(() => {
    setShowCycleComplete(false);
    setCycleStats({});
  }, []);

  // For existing users who haven't been through new onboarding
  const shouldShowOnboarding = useCallback((memorizedPages) => {
    // If user has no memorized pages, definitely show onboarding
    if (!memorizedPages || Object.keys(memorizedPages).length === 0) {
      return true;
    }
    
    // If onboarding was explicitly completed, don't show
    if (onboardingComplete) {
      return false;
    }
    
    // For existing users with data but no onboarding completion flag
    // Auto-complete onboarding for them
    setOnboardingComplete(true);
    setIsFirstTime(false);
    
    if (!user || !isCloudSync) {
      localStorage.setItem('onboardingComplete', 'true');
    }
    
    return false;
  }, [onboardingComplete, user, isCloudSync]);

  return {
    // Onboarding state
    isFirstTime,
    onboardingComplete,
    shouldShowOnboarding,
    completeOnboarding,
    resetOnboarding,
    
    // Quality upgrade modal
    showQualityUpgrade,
    currentUpgradePage,
    currentUpgradeQuality,
    triggerQualityUpgrade,
    handleQualityUpgrade,
    closeQualityUpgrade,
    
    // Cycle completion modal
    showCycleComplete,
    cycleStats,
    triggerCycleComplete,
    closeCycleComplete,
  };
};

// Medal conversion helpers
export const medalHelpers = {
  // Convert internal color to medal info
  getMedalInfo: (quality) => {
    switch (quality) {
      case 'red':
        return {
          type: 'bronze',
          emoji: '🥉',
          label: 'Bronze',
          color: '#CD7F32',
          points: 3,
          description: 'Recently memorized or need refresh'
        };
      case 'green':
        return {
          type: 'silver',
          emoji: '🥈',
          label: 'Silver',
          color: '#C0C0C0',
          points: 2,
          description: 'Can recall with some effort'
        };
      case 'super-green':
        return {
          type: 'gold',
          emoji: '🥇',
          label: 'Gold',
          color: '#FFD700',
          points: 1,
          description: 'Confident recall + used in prayer'
        };
      default:
        return {
          type: 'bronze',
          emoji: '🥉',
          label: 'Bronze',
          color: '#CD7F32',
          points: 3,
          description: 'Recently memorized or need refresh'
        };
    }
  },

  // Get quality statistics
  getQualityStats: (memorizedPages) => {
    const entries = Object.entries(memorizedPages || {});
    const bronze = entries.filter(([_, quality]) => quality === 'red').length;
    const silver = entries.filter(([_, quality]) => quality === 'green').length;
    const gold = entries.filter(([_, quality]) => quality === 'super-green').length;
    const total = entries.length;
    const totalPoints = bronze * 3 + silver * 2 + gold * 1;
    
    return {
      bronze,
      silver,
      gold,
      total,
      totalPoints,
      bronzePercentage: total > 0 ? Math.round((bronze / total) * 100) : 0,
      silverPercentage: total > 0 ? Math.round((silver / total) * 100) : 0,
      goldPercentage: total > 0 ? Math.round((gold / total) * 100) : 0,
      averageQuality: total > 0 ? (gold * 3 + silver * 2 + bronze * 1) / total : 0,
      estimatedDailyPages: totalPoints <= 4 ? total : Math.ceil(totalPoints / 4),
      quranCompletionPercentage: Math.round((total / 604) * 100)
    };
  },

  // Check if page can be upgraded based on review performance
  canUpgradeQuality: (currentQuality, reviewStreak = 1) => {
    if (currentQuality === 'super-green') return false; // Already at max
    
    // Simple logic: suggest upgrade after multiple successful reviews
    if (currentQuality === 'red' && reviewStreak >= 3) return 'green';
    if (currentQuality === 'green' && reviewStreak >= 5) return 'super-green';
    
    return false;
  },

  // Get suggested upgrade text
  getUpgradeText: (fromQuality, toQuality) => {
    const from = medalHelpers.getMedalInfo(fromQuality);
    const to = medalHelpers.getMedalInfo(toQuality);
    
    return `Upgrade from ${from.emoji} ${from.label} to ${to.emoji} ${to.label}?`;
  },

  // Track quality changes for analytics
  trackQualityChange: (page, fromQuality, toQuality, direction = 'upgrade') => {
    try {
      const timestamp = new Date().toISOString();
      const change = {
        page,
        fromQuality,
        toQuality,
        direction, // 'upgrade', 'downgrade', 'maintain'
        timestamp
      };
      
      // Store in localStorage for local analytics
      const existingChanges = JSON.parse(localStorage.getItem('qualityChanges') || '[]');
      existingChanges.push(change);
      
      // Keep only last 100 changes to avoid storage bloat
      const recentChanges = existingChanges.slice(-100);
      localStorage.setItem('qualityChanges', JSON.stringify(recentChanges));
      
      console.log('Quality change tracked:', change);
      return change;
    } catch (error) {
      console.error('Error tracking quality change:', error);
      return null;
    }
  },

  // Get recent quality changes for progress analysis
  getRecentQualityChanges: (days = 30) => {
    try {
      const changes = JSON.parse(localStorage.getItem('qualityChanges') || '[]');
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      return changes.filter(change => new Date(change.timestamp) > cutoffDate);
    } catch (error) {
      console.error('Error getting recent quality changes:', error);
      return [];
    }
  },

  // Calculate cycle progress and suggest cycle completion
  calculateCycleProgress: (currentPosition, memorizedPagesList, reviewHistory) => {
    const totalPages = memorizedPagesList.length;
    const progressPercentage = totalPages > 0 ? Math.round(((currentPosition + 1) / totalPages) * 100) : 0;
    const isNearCompletion = progressPercentage >= 90;
    const cycleCompleted = currentPosition >= totalPages - 1;
    
    // Calculate recent performance
    const recentReviews = reviewHistory.slice(0, 10);
    const recentUpgrades = recentReviews.filter(review => 
      review.pagesReviewed?.some(page => page.upgraded)
    ).length;
    
    return {
      currentPosition: currentPosition + 1,
      totalPages,
      progressPercentage,
      isNearCompletion,
      cycleCompleted,
      recentUpgrades,
      estimatedCompletion: totalPages - currentPosition - 1
    };
  },

  // Validation helpers for onboarding
  validatePageSelection: (selectedPages) => {
    const errors = [];
    
    if (!selectedPages || typeof selectedPages !== 'object') {
      errors.push('Invalid page selection format');
      return { isValid: false, errors };
    }
    
    const pageNumbers = Object.keys(selectedPages).map(Number);
    const totalPages = pageNumbers.length;
    
    if (totalPages === 0) {
      errors.push('Please select at least one page');
    }
    
    if (totalPages > 100) {
      errors.push('Maximum 100 pages can be selected at once');
    }
    
    // Validate page numbers are within Quran range
    const invalidPages = pageNumbers.filter(page => page < 1 || page > 604);
    if (invalidPages.length > 0) {
      errors.push(`Invalid page numbers: ${invalidPages.join(', ')}`);
    }
    
    // Validate quality values
    const validQualities = ['red', 'green', 'super-green'];
    const invalidQualities = Object.values(selectedPages).filter(quality => 
      !validQualities.includes(quality)
    );
    if (invalidQualities.length > 0) {
      errors.push(`Invalid quality levels detected`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
      stats: {
        totalPages,
        pageRange: pageNumbers.length > 0 ? {
          min: Math.min(...pageNumbers),
          max: Math.max(...pageNumbers)
        } : null
      }
    };
  },

  // Generate onboarding completion data
  generateOnboardingData: (selectedPages) => {
    const validation = medalHelpers.validatePageSelection(selectedPages);
    
    if (!validation.isValid) {
      throw new Error(`Invalid page selection: ${validation.errors.join(', ')}`);
    }
    
    const stats = medalHelpers.getQualityStats(selectedPages);
    const timestamp = new Date().toISOString();
    
    return {
      memorizedPages: selectedPages,
      onboardingComplete: true,
      onboardingCompletedAt: timestamp,
      initialStats: stats,
      currentPosition: 0,
      lastReviewDate: null,
      reviewHistory: [],
      version: '2.0' // Track onboarding version for future migrations
    };
  }
};

// PWA helpers
export const pwaHelpers = {
  // Check if PWA is supported
  isPWASupported: () => {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  },

  // Check if app is already installed
  isInstalled: () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone ||
           document.referrer.includes('android-app://');
  },

  // Check if install prompt is available
  isInstallPromptAvailable: () => {
    return !pwaHelpers.isInstalled() && pwaHelpers.isPWASupported();
  },

  // Handle PWA install prompt
  handleInstallPrompt: (deferredPrompt) => {
    if (!deferredPrompt) {
      console.log('No install prompt available');
      return Promise.resolve({ outcome: 'dismissed' });
    }

    return deferredPrompt.prompt().then(() => {
      return deferredPrompt.userChoice;
    }).then((choiceResult) => {
      console.log('User choice:', choiceResult.outcome);
      return choiceResult;
    }).catch((error) => {
      console.error('Install prompt error:', error);
      return { outcome: 'error', error };
    });
  },

  // Register service worker
  registerServiceWorker: () => {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return Promise.resolve(false);
    }

    return navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration.scope);
        
        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content available, show update notification
              console.log('New content available, please refresh');
              // Could trigger update notification here
            }
          });
        });
        
        return true;
      })
      .catch((error) => {
        console.error('SW registration failed:', error);
        return false;
      });
  },

  // Check for app updates
  checkForUpdates: () => {
    if ('serviceWorker' in navigator) {
      return navigator.serviceWorker.ready.then((registration) => {
        return registration.update();
      });
    }
    return Promise.resolve();
  },

  // Get installation instructions for different platforms
  getInstallInstructions: () => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      return {
        platform: 'ios',
        steps: [
          'Tap the Share button in Safari',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to install the app'
        ]
      };
    } else if (userAgent.includes('android')) {
      return {
        platform: 'android',
        steps: [
          'Tap the menu (⋮) in Chrome',
          'Tap "Add to Home screen"',
          'Tap "Add" to install the app'
        ]
      };
    } else {
      return {
        platform: 'desktop',
        steps: [
          'Look for the install icon in your browser\'s address bar',
          'Click "Install" when prompted',
          'The app will be added to your applications'
        ]
      };
    }
  },

  // Storage quota helpers for offline functionality
  checkStorageQuota: async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        const quota = estimate.quota || 0;
        const usedMB = Math.round(used / 1024 / 1024);
        const quotaMB = Math.round(quota / 1024 / 1024);
        const usedPercentage = quota > 0 ? Math.round((used / quota) * 100) : 0;
        
        return {
          used: usedMB,
          quota: quotaMB,
          usedPercentage,
          available: quotaMB - usedMB,
          isNearLimit: usedPercentage > 80
        };
      } catch (error) {
        console.error('Error checking storage quota:', error);
        return null;
      }
    }
    return null;
  },

  // Network status helpers
  getNetworkStatus: () => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    return {
      online: navigator.onLine,
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || 0,
      rtt: connection?.rtt || 0,
      saveData: connection?.saveData || false
    };
  },

  // Offline capability detection
  hasOfflineCapability: () => {
    return 'serviceWorker' in navigator && 'caches' in window;
  }
};

// Export everything for easy importing
export default {
  useOnboarding,
  medalHelpers,
  pwaHelpers
};