// useQuranTracker.js - Enhanced with onboarding integration and medal system
import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  defaultMemorizedPages,
  surahInfo,
  getMemorizedPagesList, 
  getPagesToReview, 
  getEstimatedCycleDuration, 
  getRemainingDays,
  getSurahMemorizedCount,
  getOverviewData,
  getRank
} from './quranData.js';
import { useAuth } from './useAuth.js';
import { useStorage } from './useStorage.js';
import { medalHelpers } from './useOnboarding';

export const useQuranTracker = () => {
  // Authentication
  const { user, loading: authLoading, showSignInBanner, handleSignIn, handleSignOut, dismissSignInBanner, syncLocalDataToCloud } = useAuth();
  
  // Storage management (now with real-time sync)
  const { 
    loadData, 
    saveAllData, 
    migrateToCloud, 
    switchToLocal, 
    isCloudSync, 
    syncStatus,
    registerCloudUpdateCallback 
  } = useStorage(user);

  // Core state
  const [memorizedPages, setMemorizedPages] = useState(defaultMemorizedPages);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [lastReviewDate, setLastReviewDate] = useState(null);
  const [reviewHistory, setReviewHistory] = useState([]);

  // UI state
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [expandedSurahs, setExpandedSurahs] = useState(new Set());
  const [surahSearch, setSurahSearch] = useState('');
  const [showOverview, setShowOverview] = useState(false);
  const [importError, setImportError] = useState('');

  // Cloud sync state
  const [showDataConflictModal, setShowDataConflictModal] = useState(false);
  const [conflictData, setConflictData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Onboarding state
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  // Prevent infinite update loops when receiving cloud updates
  const isUpdatingFromCloud = useRef(false);
  const saveTimeout = useRef(null);
  const lastLocalUpdate = useRef(Date.now());

  // Check onboarding status
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (authLoading) return;
      
      try {
        const [pages, onboardingStatus] = await Promise.all([
          loadData('memorizedPages', {}),
          loadData('onboardingComplete', false)
        ]);

        // If user has pages or onboarding is complete, they're not first time
        if (Object.keys(pages).length > 0 || onboardingStatus) {
          setOnboardingComplete(true);
          setIsFirstTime(false);
        } else {
          setOnboardingComplete(false);
          setIsFirstTime(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };

    checkOnboardingStatus();
  }, [authLoading, loadData]);

  // Register cloud update callbacks for real-time sync
  useEffect(() => {
    if (isCloudSync) {
      // Register callback for memorizedPages updates
      registerCloudUpdateCallback('memorizedPages', (data) => {
        if (!isUpdatingFromCloud.current) {
          console.log('Updating memorizedPages from cloud');
          isUpdatingFromCloud.current = true;
          setMemorizedPages(data);
          setTimeout(() => { isUpdatingFromCloud.current = false; }, 1000);
        }
      });

      // Register callback for currentPosition updates
      registerCloudUpdateCallback('currentPosition', (data) => {
        if (!isUpdatingFromCloud.current) {
          console.log('Updating currentPosition from cloud');
          isUpdatingFromCloud.current = true;
          setCurrentPosition(data);
          setTimeout(() => { isUpdatingFromCloud.current = false; }, 1000);
        }
      });

      // Register callback for lastReviewDate updates
      registerCloudUpdateCallback('lastReviewDate', (data) => {
        if (!isUpdatingFromCloud.current) {
          console.log('Updating lastReviewDate from cloud');
          isUpdatingFromCloud.current = true;
          setLastReviewDate(data);
          setTimeout(() => { isUpdatingFromCloud.current = false; }, 1000);
        }
      });

      // Register callback for reviewHistory updates
      registerCloudUpdateCallback('reviewHistory', (data) => {
        if (!isUpdatingFromCloud.current) {
          console.log('Updating reviewHistory from cloud');
          isUpdatingFromCloud.current = true;
          setReviewHistory(data);
          setTimeout(() => { isUpdatingFromCloud.current = false; }, 1000);
        }
      });

      // Register callback for onboarding status
      registerCloudUpdateCallback('onboardingComplete', (data) => {
        if (!isUpdatingFromCloud.current) {
          console.log('Updating onboardingComplete from cloud');
          setOnboardingComplete(data);
          if (data) {
            setIsFirstTime(false);
          }
        }
      });
    }
  }, [isCloudSync, registerCloudUpdateCallback]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      if (authLoading) return;
      
      try {
        setLoading(true);
        
        const [pages, position, reviewDate, history, onboardingStatus] = await Promise.all([
          loadData('memorizedPages', defaultMemorizedPages),
          loadData('currentPosition', 0),
          loadData('lastReviewDate', null),
          loadData('reviewHistory', []),
          loadData('onboardingComplete', false)
        ]);

        setMemorizedPages(pages);
        setCurrentPosition(position);
        setLastReviewDate(reviewDate);
        setReviewHistory(history);
        setOnboardingComplete(onboardingStatus);

        // If user has data but no onboarding flag, auto-complete onboarding
        if (Object.keys(pages).length > 0 && !onboardingStatus) {
          setOnboardingComplete(true);
          setIsFirstTime(false);
          // Save the onboarding completion status
          setTimeout(() => {
            saveAllData({
              memorizedPages: pages,
              currentPosition: position,
              lastReviewDate: reviewDate,
              reviewHistory: history,
              onboardingComplete: true
            });
          }, 500);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [authLoading, loadData, saveAllData]);

  // Debounced auto-save function with better conflict prevention
  const debouncedSave = useCallback(() => {
    // Don't save if we're updating from cloud
    if (isUpdatingFromCloud.current) {
      console.log('Skipping save - updating from cloud');
      return;
    }
    
    // Don't save if we recently received a cloud update
    const timeSinceLastUpdate = Date.now() - lastLocalUpdate.current;
    if (timeSinceLastUpdate < 2000) {
      console.log('Skipping save - recent cloud update');
      return;
    }
    
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    
    saveTimeout.current = setTimeout(() => {
      if (!loading && !authLoading && !isUpdatingFromCloud.current) {
        console.log('Saving data to cloud');
        saveAllData({
          memorizedPages,
          currentPosition,
          lastReviewDate,
          reviewHistory,
          onboardingComplete
        });
      }
    }, 1000);
  }, [memorizedPages, currentPosition, lastReviewDate, reviewHistory, onboardingComplete, loading, authLoading, saveAllData]);

  // Track when we make local changes (not from cloud)
  const makeLocalChange = useCallback((updateFunction) => {
    if (!isUpdatingFromCloud.current) {
      lastLocalUpdate.current = Date.now();
      updateFunction();
    }
  }, []);

  // Auto-save when data changes (with better conflict prevention)
  useEffect(() => {
    if (!isUpdatingFromCloud.current) {
      debouncedSave();
    }
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [memorizedPages, currentPosition, lastReviewDate, reviewHistory, onboardingComplete, debouncedSave]);

  // Complete onboarding setup
  const completeOnboardingSetup = useCallback((selectedPages) => {
    try {
      makeLocalChange(() => {
        setMemorizedPages(selectedPages);
        setCurrentPosition(0);
        setLastReviewDate(null);
        setReviewHistory([]);
        setOnboardingComplete(true);
        setIsFirstTime(false);
      });

      // Track onboarding completion for analytics
      console.log('Onboarding completed with', Object.keys(selectedPages).length, 'pages');
      
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  }, [makeLocalChange]);

  // Check if should show onboarding
  const shouldShowOnboarding = useCallback((pages) => {
    // Always show onboarding if explicitly first time and not complete
    if (isFirstTime && !onboardingComplete) {
      return true;
    }
    
    // Show if no pages and no onboarding completion
    if ((!pages || Object.keys(pages).length === 0) && !onboardingComplete) {
      return true;
    }
    
    return false;
  }, [isFirstTime, onboardingComplete]);

  // Handle sign in and data migration
  const handleSignInAndMigrate = async () => {
    try {
      const signedInUser = await handleSignIn();
      
      // Get current local data
      const localData = {
        memorizedPages,
        currentPosition,
        lastReviewDate,
        reviewHistory,
        onboardingComplete
      };

      // Check if cloud data exists and handle conflicts
      const syncResult = await syncLocalDataToCloud(localData);
      
      if (syncResult?.needsResolution) {
        // Show conflict resolution modal
        setConflictData(syncResult);
        setShowDataConflictModal(true);
      } else {
        // No conflict, migrate to cloud
        await migrateToCloud(localData);
      }
    } catch (error) {
      console.error('Error signing in and migrating:', error);
    }
  };

  // Resolve data conflict
  const resolveDataConflict = async (useCloudData) => {
    try {
      if (useCloudData) {
        // Use cloud data
        const cloudData = conflictData.cloudData;
        setMemorizedPages(cloudData.memorizedPages || defaultMemorizedPages);
        setCurrentPosition(cloudData.currentPosition || 0);
        setLastReviewDate(cloudData.lastReviewDate || null);
        setReviewHistory(cloudData.reviewHistory || []);
        setOnboardingComplete(cloudData.onboardingComplete || false);
      } else {
        // Use local data and overwrite cloud
        await migrateToCloud({
          memorizedPages,
          currentPosition,
          lastReviewDate,
          reviewHistory,
          onboardingComplete
        });
      }
      
      setShowDataConflictModal(false);
      setConflictData(null);
    } catch (error) {
      console.error('Error resolving data conflict:', error);
    }
  };

  // Computed values
  const memorizedPagesList = getMemorizedPagesList(memorizedPages);
  const todaysPages = getPagesToReview(memorizedPages, currentPosition);
  const estimatedCycleDuration = getEstimatedCycleDuration(memorizedPages);
  const remainingDays = getRemainingDays(memorizedPages, currentPosition);

  // Page management functions (updated to track local changes)
  const togglePage = (pageNum) => {
    makeLocalChange(() => {
      const newMemorized = { ...memorizedPages };
      if (newMemorized[pageNum]) {
        delete newMemorized[pageNum];
        // Track quality change
        medalHelpers.trackQualityChange(pageNum, newMemorized[pageNum], null, 'removed');
      } else {
        newMemorized[pageNum] = 'red';
        // Track quality change
        medalHelpers.trackQualityChange(pageNum, null, 'red', 'added');
      }
      setMemorizedPages(newMemorized);
    });
  };

  const changePageColor = (pageNum, color) => {
    makeLocalChange(() => {
      const oldColor = memorizedPages[pageNum];
      setMemorizedPages((prev) => ({
        ...prev,
        [pageNum]: color,
      }));
      
      // Track quality change
      if (oldColor !== color) {
        const direction = oldColor === 'red' && color !== 'red' ? 'upgrade' :
                         oldColor !== 'red' && color === 'red' ? 'downgrade' : 'change';
        medalHelpers.trackQualityChange(pageNum, oldColor, color, direction);
      }
    });
  };

  // Enhanced review management with cycle completion detection
  const completeReview = () => {
    makeLocalChange(() => {
      const newPosition = currentPosition + todaysPages.length;
      const reviewDate = new Date().toLocaleDateString();
      const cycleCompleted = newPosition >= memorizedPagesList.length;

      const newHistoryEntry = {
        date: reviewDate,
        pagesReviewed: todaysPages.map((p) => ({
          page: p.page,
          color: p.color,
          rank: getRank(p.color),
        })),
        totalRank: todaysPages.reduce((sum, page) => sum + getRank(page.color), 0),
        position: currentPosition + 1,
        cycleCompleted,
      };

      setReviewHistory((prev) => [newHistoryEntry, ...prev].slice(0, 30));

      if (cycleCompleted) {
        setCurrentPosition(0);
        
        // Could trigger cycle completion celebration here
        console.log('🎉 Cycle completed!');
      } else {
        setCurrentPosition(newPosition);
      }
      setLastReviewDate(reviewDate);
    });
  };

  const resetPosition = () => {
    if (window.confirm('Reset your review position to the beginning?')) {
      makeLocalChange(() => {
        setCurrentPosition(0);
        setLastReviewDate(null);
      });
    }
  };

  // Surah management
  const toggleSurah = (surahNumber) => {
    const newExpanded = new Set(expandedSurahs);
    if (newExpanded.has(surahNumber)) {
      newExpanded.delete(surahNumber);
    } else {
      newExpanded.add(surahNumber);
    }
    setExpandedSurahs(newExpanded);
  };

  const expandAllSurahs = (filteredSurahs) => {
    setExpandedSurahs(new Set(filteredSurahs.map((s) => s.number)));
  };

  const collapseAllSurahs = () => {
    setExpandedSurahs(new Set());
  };

  // Filtered surahs for search
  const filteredSurahs = surahInfo.filter(
    (surah) =>
      surah.name.toLowerCase().includes(surahSearch.toLowerCase()) ||
      surah.number.toString().includes(surahSearch)
  );

  // Enhanced data management functions
  const exportData = () => {
    const stats = medalHelpers.getQualityStats(memorizedPages);
    const exportData = {
      memorizedPages,
      currentPosition,
      lastReviewDate,
      reviewHistory,
      onboardingComplete,
      stats,
      qualityChanges: medalHelpers.getRecentQualityChanges(),
      exportDate: new Date().toISOString(),
      version: '2.0',
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quran-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const emailData = () => {
    const stats = medalHelpers.getQualityStats(memorizedPages);
    const exportData = {
      memorizedPages,
      currentPosition,
      lastReviewDate,
      reviewHistory,
      onboardingComplete,
      stats,
      exportDate: new Date().toISOString(),
      version: '2.0',
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const subject = encodeURIComponent('Quran Memorization Tracker - Enhanced Backup Data');
    const body = encodeURIComponent(
      `Assalamu Alaikum,\n\nHere's your enhanced Quran memorization tracker backup data.\n\n📊 Current Progress:\n• Total Pages: ${stats.total}\n• 🥉 Bronze: ${stats.bronze}\n• 🥈 Silver: ${stats.silver}\n• 🥇 Gold: ${stats.gold}\n• Quran Completion: ${stats.quranCompletionPercentage}%\n\nTo import this data:\n1. Copy the JSON data below\n2. Save it as a .json file\n3. Use the Import button in your tracker\n\nBackup Date: ${new Date().toLocaleString()}\n\n--- JSON DATA (copy everything between the lines) ---\n${dataStr}\n--- END JSON DATA ---\n\nBarakAllahu feek!`
    );

    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    try {
      window.open(mailtoUrl);
    } catch (error) {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    const stats = medalHelpers.getQualityStats(memorizedPages);
    const exportData = {
      memorizedPages,
      currentPosition,
      lastReviewDate,
      reviewHistory,
      onboardingComplete,
      stats,
      exportDate: new Date().toISOString(),
      version: '2.0',
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const emailContent = `📖 Quran Memorization Tracker - Enhanced Backup

📊 Current Progress:
• Total Pages: ${stats.total}
• 🥉 Bronze: ${stats.bronze}
• 🥈 Silver: ${stats.silver}  
• 🥇 Gold: ${stats.gold}
• Quran Completion: ${stats.quranCompletionPercentage}%

Backup Date: ${new Date().toLocaleString()}

To import this data:
1. Copy the JSON data below
2. Save it as a .json file  
3. Use the Import button in your tracker

--- JSON DATA (copy everything between the lines) ---
${dataStr}
--- END JSON DATA ---`;

    try {
      await navigator.clipboard.writeText(emailContent);
      alert('✅ Enhanced backup data copied to clipboard!\n\nIncludes medal statistics and progress tracking.');
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = emailContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('✅ Enhanced backup data copied to clipboard!\n\nIncludes medal statistics and progress tracking.');
    }
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        // Validate the imported data
        const validation = medalHelpers.validatePageSelection(importedData.memorizedPages);
        if (!validation.isValid) {
          throw new Error('Invalid backup file: ' + validation.errors.join(', '));
        }

        makeLocalChange(() => {
          if (importedData.memorizedPages) setMemorizedPages(importedData.memorizedPages);
          if (typeof importedData.currentPosition === 'number') setCurrentPosition(importedData.currentPosition);
          if (importedData.lastReviewDate) setLastReviewDate(importedData.lastReviewDate);
          if (importedData.reviewHistory && Array.isArray(importedData.reviewHistory)) {
            setReviewHistory(importedData.reviewHistory);
          }
          if (typeof importedData.onboardingComplete === 'boolean') {
            setOnboardingComplete(importedData.onboardingComplete);
            if (importedData.onboardingComplete) {
              setIsFirstTime(false);
            }
          }
        });

        setImportError('');
        
        const stats = medalHelpers.getQualityStats(importedData.memorizedPages);
        alert(
          `✅ Enhanced data imported successfully!\n\n📊 Statistics:\n• Total Pages: ${stats.total}\n• 🥉 Bronze: ${stats.bronze}\n• 🥈 Silver: ${stats.silver}\n• 🥇 Gold: ${stats.gold}\n\nLast backup: ${
            importedData.exportDate ? new Date(importedData.exportDate).toLocaleString() : 'Unknown'
          }\nVersion: ${importedData.version || '1.0'}`
        );
      } catch (error) {
        setImportError("Error importing file. Please check that it's a valid backup file.");
        console.error('Import error:', error);
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  return {
    // Core state
    memorizedPages,
    currentPosition,
    lastReviewDate,
    reviewHistory,
    
    // UI state
    showPageSelector,
    setShowPageSelector,
    expandedSurahs,
    surahSearch,
    setSurahSearch,
    showOverview,
    setShowOverview,
    importError,
    setImportError,
    
    // Loading states
    loading: loading || authLoading,
    
    // Cloud sync state
    user,
    isCloudSync,
    syncStatus,
    showSignInBanner,
    showDataConflictModal,
    conflictData,
    
    // Onboarding state
    onboardingComplete,
    isFirstTime,
    shouldShowOnboarding,
    completeOnboardingSetup,
    
    // Computed values
    memorizedPagesList,
    todaysPages,
    estimatedCycleDuration,
    remainingDays,
    filteredSurahs,
    
    // Helper functions with data
    getSurahMemorizedCount: (surah) => getSurahMemorizedCount(surah, memorizedPages),
    getOverviewData: () => getOverviewData(memorizedPages),
    
    // Page management
    togglePage,
    changePageColor,
    
    // Review management
    completeReview,
    resetPosition,
    
    // Surah management
    toggleSurah,
    expandAllSurahs,
    collapseAllSurahs,
    
    // Enhanced data management
    exportData,
    emailData,
    copyToClipboard,
    importData,
    
    // Auth and sync functions
    handleSignInAndMigrate,
    handleSignOut,
    dismissSignInBanner,
    switchToLocal,
    resolveDataConflict,
  };
};