// useQuranTracker.js - Updated with real-time Firebase sync
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

  // Prevent infinite update loops when receiving cloud updates
  const isUpdatingFromCloud = useRef(false);
  const saveTimeout = useRef(null);

  // Register cloud update callbacks for real-time sync
  useEffect(() => {
    if (isCloudSync) {
      // Register callback for memorizedPages updates
      registerCloudUpdateCallback('memorizedPages', (data) => {
        if (!isUpdatingFromCloud.current) {
          console.log('Updating memorizedPages from cloud');
          isUpdatingFromCloud.current = true;
          setMemorizedPages(data);
          setTimeout(() => { isUpdatingFromCloud.current = false; }, 100);
        }
      });

      // Register callback for currentPosition updates
      registerCloudUpdateCallback('currentPosition', (data) => {
        if (!isUpdatingFromCloud.current) {
          console.log('Updating currentPosition from cloud');
          isUpdatingFromCloud.current = true;
          setCurrentPosition(data);
          setTimeout(() => { isUpdatingFromCloud.current = false; }, 100);
        }
      });

      // Register callback for lastReviewDate updates
      registerCloudUpdateCallback('lastReviewDate', (data) => {
        if (!isUpdatingFromCloud.current) {
          console.log('Updating lastReviewDate from cloud');
          isUpdatingFromCloud.current = true;
          setLastReviewDate(data);
          setTimeout(() => { isUpdatingFromCloud.current = false; }, 100);
        }
      });

      // Register callback for reviewHistory updates
      registerCloudUpdateCallback('reviewHistory', (data) => {
        if (!isUpdatingFromCloud.current) {
          console.log('Updating reviewHistory from cloud');
          isUpdatingFromCloud.current = true;
          setReviewHistory(data);
          setTimeout(() => { isUpdatingFromCloud.current = false; }, 100);
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
        
        const [pages, position, reviewDate, history] = await Promise.all([
          loadData('memorizedPages', defaultMemorizedPages),
          loadData('currentPosition', 0),
          loadData('lastReviewDate', null),
          loadData('reviewHistory', [])
        ]);

        setMemorizedPages(pages);
        setCurrentPosition(position);
        setLastReviewDate(reviewDate);
        setReviewHistory(history);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [authLoading, loadData]);

  // Debounced auto-save function
  const debouncedSave = useCallback(() => {
    // Don't save if we're updating from cloud to prevent loops
    if (isUpdatingFromCloud.current) return;
    
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }
    
    saveTimeout.current = setTimeout(() => {
      if (!loading && !authLoading) {
        saveAllData({
          memorizedPages,
          currentPosition,
          lastReviewDate,
          reviewHistory,
        });
      }
    }, 500); // 500ms debounce
  }, [memorizedPages, currentPosition, lastReviewDate, reviewHistory, loading, authLoading, saveAllData]);

  // Auto-save when data changes (with debouncing)
  useEffect(() => {
    debouncedSave();
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [debouncedSave]);

  // Handle sign in and data migration
  const handleSignInAndMigrate = async () => {
    try {
      const signedInUser = await handleSignIn();
      
      // Get current local data
      const localData = {
        memorizedPages,
        currentPosition,
        lastReviewDate,
        reviewHistory
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
      } else {
        // Use local data and overwrite cloud
        await migrateToCloud({
          memorizedPages,
          currentPosition,
          lastReviewDate,
          reviewHistory
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

  // Page management functions
  const togglePage = (pageNum) => {
    const newMemorized = { ...memorizedPages };
    if (newMemorized[pageNum]) {
      delete newMemorized[pageNum];
    } else {
      newMemorized[pageNum] = 'red';
    }
    setMemorizedPages(newMemorized);
  };

  const changePageColor = (pageNum, color) => {
    setMemorizedPages((prev) => ({
      ...prev,
      [pageNum]: color,
    }));
  };

  // Review management
  const completeReview = () => {
    const newPosition = currentPosition + todaysPages.length;
    const reviewDate = new Date().toLocaleDateString();

    const newHistoryEntry = {
      date: reviewDate,
      pagesReviewed: todaysPages.map((p) => ({
        page: p.page,
        color: p.color,
        rank: getRank(p.color),
      })),
      totalRank: todaysPages.reduce((sum, page) => sum + getRank(page.color), 0),
      position: currentPosition + 1,
      cycleCompleted: newPosition >= memorizedPagesList.length,
    };

    setReviewHistory((prev) => [newHistoryEntry, ...prev].slice(0, 30));

    if (newPosition >= memorizedPagesList.length) {
      setCurrentPosition(0);
    } else {
      setCurrentPosition(newPosition);
    }
    setLastReviewDate(reviewDate);
  };

  const resetPosition = () => {
    if (window.confirm('Reset your review position to the beginning?')) {
      setCurrentPosition(0);
      setLastReviewDate(null);
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

  // Data management functions (updated for cloud sync)
  const exportData = () => {
    const exportData = {
      memorizedPages,
      currentPosition,
      lastReviewDate,
      reviewHistory,
      exportDate: new Date().toISOString(),
      version: '1.0',
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
    const exportData = {
      memorizedPages,
      currentPosition,
      lastReviewDate,
      reviewHistory,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const subject = encodeURIComponent('Quran Memorization Tracker - Backup Data');
    const body = encodeURIComponent(
      `Hi,\n\nHere's your Quran memorization tracker backup data.\n\nTo import this data:\n1. Copy the JSON data below\n2. Save it as a .json file\n3. Use the Import button in your tracker\n\nBackup Date: ${new Date().toLocaleString()}\nTotal Memorized Pages: ${Object.keys(memorizedPages).length}\n\n--- JSON DATA (copy everything between the lines) ---\n${dataStr}\n--- END JSON DATA ---\n\nBest regards!`
    );

    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    try {
      window.open(mailtoUrl);
    } catch (error) {
      copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    const exportData = {
      memorizedPages,
      currentPosition,
      lastReviewDate,
      reviewHistory,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const emailContent = `Quran Memorization Tracker - Backup Data

Backup Date: ${new Date().toLocaleString()}
Total Memorized Pages: ${Object.keys(memorizedPages).length}

To import this data:
1. Copy the JSON data below
2. Save it as a .json file  
3. Use the Import button in your tracker

--- JSON DATA (copy everything between the lines) ---
${dataStr}
--- END JSON DATA ---`;

    try {
      await navigator.clipboard.writeText(emailContent);
      alert('✅ Backup data copied to clipboard!\n\nYou can now paste it into any email, message, or document.');
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = emailContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('✅ Backup data copied to clipboard!\n\nYou can now paste it into any email, message, or document.');
    }
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        if (!importedData.memorizedPages || typeof importedData.memorizedPages !== 'object') {
          throw new Error('Invalid backup file format');
        }

        if (importedData.memorizedPages) setMemorizedPages(importedData.memorizedPages);
        if (typeof importedData.currentPosition === 'number') setCurrentPosition(importedData.currentPosition);
        if (importedData.lastReviewDate) setLastReviewDate(importedData.lastReviewDate);
        if (importedData.reviewHistory && Array.isArray(importedData.reviewHistory)) {
          setReviewHistory(importedData.reviewHistory);
        }

        setImportError('');
        alert(
          `✅ Data imported successfully!\nPages: ${Object.keys(importedData.memorizedPages).length}\nLast backup: ${
            importedData.exportDate ? new Date(importedData.exportDate).toLocaleString() : 'Unknown'
          }`
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
    
    // Data management
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