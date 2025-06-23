// App.jsx - Enhanced with onboarding flow and medal system
import { useEffect, useState } from 'react';
import { useQuranTracker } from './useQuranTracker.js';
import { surahInfo, getRank } from './quranData.js';
import { useStorage } from './useStorage.js';
import { setupTheme, styles, getColorStyle } from './styles.js';
import { useOnboarding } from './useOnboarding.js';
import { OnboardingFlow } from './OnboardingFlow.jsx';
import { 
  TodaysReviewEnhanced, 
  QualityUpgradeModal, 
  BatchQualityUpgradeModal,
  ProgressDashboard, 
  AddPagesFlow, 
  CycleComplete, 
  InstallPrompt,
  MedalBadge 
} from './EnhancedComponents.jsx';

export default function App() {
  // Get everything from the custom hook (now includes Firebase and onboarding)
  const {
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
    
    // Loading states
    loading,
    
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
    
    // Helper functions
    getSurahMemorizedCount,
    getOverviewData,
    
    // Actions
    togglePage,
    changePageColor,
    completeReview,
    resetPosition,
    toggleSurah,
    expandAllSurahs,
    collapseAllSurahs,
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
    
    // New onboarding functions
    completeOnboardingSetup,
    shouldShowOnboarding,
    onboardingComplete,
    checkExistingUser,
  } = useQuranTracker();

  const { migrateToCloud } = useStorage(user);

  // Onboarding state
  const {
    isFirstTime,
    showQualityUpgrade,
    currentUpgradePage,
    currentUpgradeQuality,
    showCycleComplete,
    cycleStats,
    triggerQualityUpgrade,
    handleQualityUpgrade,
    closeQualityUpgrade,
    triggerCycleComplete,
    closeCycleComplete,
  } = useOnboarding(user, isCloudSync);

  // Enhanced UI state
  const [showAddPages, setShowAddPages] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [onboardingKey, setOnboardingKey] = useState(0); // Force re-render after onboarding
  const [showBatchQualityUpgrade, setShowBatchQualityUpgrade] = useState(false);
  const [batchUpgradePages, setBatchUpgradePages] = useState([]);

  // Setup theme on mount
  useEffect(() => {
    const cleanup = setupTheme();
    return cleanup;
  }, []);

  // Handle PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Handle app installed
  useEffect(() => {
    const handleAppInstalled = () => {
      console.log('App was installed successfully');
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Enhanced complete review with batch quality upgrade prompt
  const handleCompleteReview = () => {
    if (todaysPages.length > 0) {
      // Show batch quality upgrade modal for all today's pages
      triggerBatchQualityUpgrade(todaysPages);
    }
    // Don't complete review yet - wait for quality updates
  };

  // Trigger batch quality upgrade modal
  const triggerBatchQualityUpgrade = (pages) => {
    setBatchUpgradePages(pages);
    setShowBatchQualityUpgrade(true);
  };

  // Handle batch quality upgrades
  const handleBatchQualityUpgrade = (pageNum, quality) => {
    changePageColor(pageNum, quality);
  };

  // Close batch upgrade and complete review
  const closeBatchUpgrade = () => {
    setShowBatchQualityUpgrade(false);
    setBatchUpgradePages([]);
    // Now complete the review
    completeReview();
  };

  // Handle adding new pages
  const handleAddPages = (newPages) => {
    Object.entries(newPages).forEach(([pageNum, quality]) => {
      if (!memorizedPages[pageNum]) {
        togglePage(parseInt(pageNum));
        if (quality !== 'red') {
          setTimeout(() => changePageColor(parseInt(pageNum), quality), 100);
        }
      }
    });
  };

  // Handle PWA install
  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  // Handle install prompt dismiss
  const handleInstallDismiss = () => {
    setShowInstallPrompt(false);
    // Auto-hide for 7 days
    localStorage.setItem('hideInstallPrompt', Date.now() + (7 * 24 * 60 * 60 * 1000));
  };

  // Check if should show install prompt
  useEffect(() => {
    const hideUntil = localStorage.getItem('hideInstallPrompt');
    if (hideUntil && Date.now() < parseInt(hideUntil)) {
      setShowInstallPrompt(false);
    }
  }, []);

  // Enhanced onboarding completion handler
  const handleOnboardingComplete = (selectedPages) => {
    console.log('Onboarding completed with pages:', selectedPages);
    const success = completeOnboardingSetup(selectedPages);
    if (success) {
      // Force re-render by changing key
      setOnboardingKey(prev => prev + 1);
    }
  };

  // Enhanced sign-in handler for onboarding
  const handleOnboardingSignIn = async () => {
    try {
      const result = await handleSignInAndMigrate();
      
      if (result && result.hasExistingData && result.hasExistingData.hasData) {
        // User has existing data, skip onboarding
        console.log('Existing user detected, loading cloud data');
        // Force re-render to exit onboarding
        setOnboardingKey(prev => prev + 1);
        return { hasExistingData: true };
      }
      
      // New user or user without data
      return { hasExistingData: false };
    } catch (error) {
      console.error('Error during onboarding sign-in:', error);
      throw error;
    }
  };

  // Show loading spinner
  if (loading) {
    return (
      <div style={{
        ...styles.container,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📖</div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading your data...</p>
        </div>
      </div>
    );
  }

  // Show onboarding for new users
  if (shouldShowOnboarding(memorizedPages) || (isFirstTime && !onboardingComplete)) {
    return (
      <OnboardingFlow 
        key={onboardingKey} // Force re-render when key changes
        onComplete={handleOnboardingComplete}
        onSignIn={handleOnboardingSignIn}
      />
    );
  }

  return (
    <div style={styles.container} key={`app-${onboardingKey}`}>
      {/* Sign-in Banner */}
      {showSignInBanner && (
        <div style={{
          ...styles.card,
          backgroundColor: 'var(--info-color)',
          color: 'white',
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: '1.1rem' }}>✨ Want to sync across devices?</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
              Sign in with Google to backup your progress and access it from any device
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              style={{
                ...styles.button,
                backgroundColor: 'white',
                color: 'var(--info-color)',
                minWidth: 'auto',
                padding: '8px 16px',
                fontSize: '14px'
              }}
              onClick={handleSignInAndMigrate}
            >
              🔗 Sign In
            </button>
            <button
              style={{
                ...styles.button,
                backgroundColor: 'transparent',
                color: 'white',
                border: '1px solid white',
                minWidth: 'auto',
                padding: '8px 16px',
                fontSize: '14px'
              }}
              onClick={dismissSignInBanner}
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* User Info Bar */}
      {user && (
        <div style={{
          ...styles.card,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {user.photoURL && (
              <img 
                src={user.photoURL} 
                alt="Profile"
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%' 
                }}
              />
            )}
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                {user.displayName || user.email}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {isCloudSync ? '☁️ Synced' : '💾 Local storage'} 
                {syncStatus === 'syncing' && ' • Saving...'}
                {syncStatus === 'error' && ' • Sync error'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {!isCloudSync && (
            <button
              style={{
                ...styles.button,
                ...styles.secondaryButton,
                minWidth: 'auto',
                padding: '8px 16px',
                fontSize: '14px'
              }}
              onClick={async () => {
                await migrateToCloud({
                  memorizedPages,
                  currentPosition,
                  lastReviewDate,
                  reviewHistory,
                  onboardingComplete: true
                });
              }}
            >
              ☁️ Enable Sync
            </button>
          )}
            <button
              style={{
                ...styles.button,
                backgroundColor: '#6c757d',
                color: 'white',
                minWidth: 'auto',
                padding: '8px 16px',
                fontSize: '14px',
                border: '1px solid #6c757d',
                WebkitAppearance: 'none',
                appearance: 'none'
              }}
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Data Conflict Resolution Modal */}
      {showDataConflictModal && conflictData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            ...styles.card,
            maxWidth: '500px',
            width: '100%',
            backgroundColor: 'var(--bg-primary)',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              🔄 Data Conflict Detected
            </h3>
            
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
              You have data both locally and in the cloud. Which would you like to keep?
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ 
                padding: '1rem', 
                border: '2px solid var(--border-color)', 
                borderRadius: '8px',
                backgroundColor: 'var(--bg-secondary)'
              }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  💾 Local Data
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0' }}>
                  {conflictData.localPageCount || Object.keys(memorizedPages).length} pages memorized
                  <br />
                  Last review: {lastReviewDate || 'Never'}
                </p>
              </div>
              
              <div style={{ 
                padding: '1rem', 
                border: '2px solid var(--border-color)', 
                borderRadius: '8px',
                backgroundColor: 'var(--bg-secondary)'
              }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  ☁️ Cloud Data
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0' }}>
                  {conflictData.cloudPageCount || Object.keys(conflictData.cloudData.memorizedPages || {}).length} pages memorized
                  <br />
                  Last review: {conflictData.cloudData.lastReviewDate || 'Never'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                style={{ ...styles.button, ...styles.secondaryButton }}
                onClick={() => resolveDataConflict(false)}
              >
                💾 Keep Local
              </button>
              <button
                style={{ ...styles.button, ...styles.primaryButton }}
                onClick={() => resolveDataConflict(true)}
              >
                ☁️ Keep Cloud
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>
        📖 Quran Memorization Tracker
      </h1>

      {/* Enhanced Today's Review Section */}
      <TodaysReviewEnhanced
        todaysPages={todaysPages}
        currentPosition={currentPosition}
        memorizedPagesList={memorizedPagesList}
        remainingDays={remainingDays}
        estimatedCycleDuration={estimatedCycleDuration}
        lastReviewDate={lastReviewDate}
        onCompleteReview={handleCompleteReview}
      />

      {/* Enhanced Action Buttons */}
      <div style={styles.flexWrap}>
        <button
          style={{ ...styles.button, ...styles.secondaryButton }}
          onClick={() => setShowPageSelector(!showPageSelector)}
        >
          {showPageSelector ? '🙈 Hide' : '👁️ Show'} Pages
        </button>

        <button
          style={{ ...styles.button, ...styles.warningButton }}
          onClick={() => setShowOverview(!showOverview)}
        >
          {showOverview ? '📊 Hide' : '📈 Show'} Overview
        </button>

        <button
          style={{ ...styles.button, ...styles.primaryButton }}
          onClick={() => setShowAddPages(true)}
        >
          📝 Add Pages
        </button>
      </div>

      {/* Enhanced Progress Overview */}
      {showOverview && (
        <ProgressDashboard
          memorizedPages={memorizedPages}
          reviewHistory={reviewHistory}
          currentPosition={currentPosition}
          memorizedPagesList={memorizedPagesList}
          todaysPages={todaysPages}
          remainingDays={remainingDays}
          estimatedCycleDuration={estimatedCycleDuration}
        />
      )}

      {/* Enhanced Page Selector */}
      {showPageSelector && (
        <div style={styles.card}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            📝 Manage Your Pages
          </h3>

          <input
            type="text"
            placeholder="🔍 Search surahs (name or number)..."
            value={surahSearch}
            onChange={(e) => setSurahSearch(e.target.value)}
            style={styles.input}
          />

          <div style={styles.flexWrap}>
            <button
              onClick={() => expandAllSurahs(filteredSurahs)}
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              📖 Expand All
            </button>
            <button
              onClick={collapseAllSurahs}
              style={{ ...styles.button, ...styles.dangerButton }}
            >
              📕 Collapse All
            </button>
          </div>

          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {filteredSurahs.map((surah) => {
              const memorizedCount = getSurahMemorizedCount(surah);
              const totalPages = surah.endPage - surah.startPage + 1;
              const isExpanded = expandedSurahs.has(surah.number);
              const percentage = Math.round((memorizedCount / totalPages) * 100);

              return (
                <div key={surah.number} style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  overflow: 'hidden'
                }}>
                  <div
                    style={{
                      padding: '1rem',
                      backgroundColor: memorizedCount > 0 ? 'var(--bg-accent)' : 'var(--bg-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}
                    onClick={() => toggleSurah(surah.number)}
                  >
                    <div style={{ flex: '1', minWidth: '200px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {isExpanded ? '▼' : '▶'} {surah.number}. {surah.name}
                      </strong>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Pages {surah.startPage}-{surah.endPage}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {memorizedCount}/{totalPages}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {percentage}%
                      </div>
                    </div>
                  </div>

                  {percentage > 0 && (
                    <div style={styles.progressBar}>
                      <div style={{
                        ...styles.progressFill,
                        width: `${percentage}%`,
                        backgroundColor: percentage === 100 ? 'var(--success-color)' : 'var(--info-color)'
                      }} />
                    </div>
                  )}

                  {isExpanded && (
                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
                      <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                        gap: '0.5rem'
                      }}>
                        {Array.from(
                          { length: surah.endPage - surah.startPage + 1 },
                          (_, i) => surah.startPage + i
                        ).map((pageNum) => (
                          <div key={pageNum} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '0.75rem',
                            border: '2px solid var(--border-color)',
                            borderRadius: '8px',
                            backgroundColor: memorizedPages[pageNum] ? 'var(--bg-accent)' : 'var(--bg-secondary)',
                            minHeight: '100px',
                            justifyContent: 'center',
                            gap: '0.5rem'
                          }}>
                            <label style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              fontWeight: '500',
                              color: 'var(--text-primary)'
                            }}>
                              <input
                                type="checkbox"
                                checked={!!memorizedPages[pageNum]}
                                onChange={() => togglePage(pageNum)}
                                style={{ transform: 'scale(1.2)' }}
                              />
                              P{pageNum}
                            </label>
                            {memorizedPages[pageNum] && (
                              <div style={{ width: '100%', textAlign: 'center' }}>
                                <MedalBadge quality={memorizedPages[pageNum]} size="small" />
                                <select
                                  value={memorizedPages[pageNum]}
                                  onChange={(e) => changePageColor(pageNum, e.target.value)}
                                  style={{
                                    ...styles.select,
                                    width: '100%',
                                    textAlign: 'center',
                                    marginTop: '0.5rem',
                                    fontSize: '0.8rem'
                                  }}
                                >
                                  <option value="red">🥉 Bronze</option>
                                  <option value="green">🥈 Silver</option>
                                  <option value="super-green">🥇 Gold</option>
                                </select>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Enhanced Statistics */}
      <div style={styles.card}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          📊 Medal Distribution
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
          <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {memorizedPagesList.length}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>📖 Total Pages</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#CD7F32', color: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {memorizedPagesList.filter((p) => p.color === 'red').length}
            </div>
            <div style={{ fontSize: '0.875rem' }}>🥉 Bronze</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#C0C0C0', color: 'white', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {memorizedPagesList.filter((p) => p.color === 'green').length}
            </div>
            <div style={{ fontSize: '0.875rem' }}>🥈 Silver</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#FFD700', color: '#333', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              {memorizedPagesList.filter((p) => p.color === 'super-green').length}
            </div>
            <div style={{ fontSize: '0.875rem' }}>🥇 Gold</div>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div style={styles.card}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
          💾 Data Management
        </h3>

        <div style={styles.flexWrap}>
          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={exportData}
          >
            📥 Export
          </button>

          <button
            style={{ ...styles.button, ...styles.secondaryButton }}
            onClick={emailData}
          >
            📧 Email
          </button>

          <button
            style={{ ...styles.button, backgroundColor: '#9C27B0', color: 'white' }}
            onClick={copyToClipboard}
          >
            📋 Copy
          </button>

          <label style={{ ...styles.button, ...styles.warningButton, textAlign: 'center' }}>
            📤 Import
            <input
              type="file"
              accept=".json"
              onChange={importData}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {importError && (
          <div style={{
            padding: '1rem',
            backgroundColor: 'var(--danger-color)',
            color: 'white',
            borderRadius: '8px',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            ❌ {importError}
          </div>
        )}

        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          <strong>Export:</strong> Download backup • <strong>Email:</strong> Open in email app •{' '}
          <strong>Copy:</strong> Copy to clipboard • <strong>Import:</strong> Restore from backup
        </div>
      </div>

      {/* Reset Button */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem', 
        paddingTop: '2rem', 
        borderTop: '1px solid var(--border-color)' 
      }}>
        <button
          style={{ ...styles.button, ...styles.dangerButton }}
          onClick={resetPosition}
        >
          🔄 Reset Position
        </button>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Your data is {isCloudSync ? 'synced to the cloud' : 'saved locally'}
        </p>
      </div>

      {/* Batch Quality Upgrade Modal */}
      {showBatchQualityUpgrade && batchUpgradePages.length > 0 && (
        <BatchQualityUpgradeModal
          pages={batchUpgradePages}
          onUpgrade={handleBatchQualityUpgrade}
          onClose={closeBatchUpgrade}
        />
      )}

      {showAddPages && (
        <AddPagesFlow
          memorizedPages={memorizedPages}
          onAddPages={handleAddPages}
          onClose={() => setShowAddPages(false)}
        />
      )}

      {showCycleComplete && (
        <CycleComplete
          stats={cycleStats}
          onContinue={closeCycleComplete}
        />
      )}

      {/* PWA Install Prompt */}
      {showInstallPrompt && deferredPrompt && (
        <InstallPrompt
          onInstall={handleInstall}
          onDismiss={handleInstallDismiss}
        />
      )}
    </div>
  );
}