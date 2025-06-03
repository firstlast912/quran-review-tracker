// App.jsx - Main component with Firebase integration
import { useEffect } from 'react';
import { useQuranTracker } from './useQuranTracker.js';
import { surahInfo, getRank } from './quranData.js';
import { useStorage } from './useStorage.js';
import { setupTheme, styles, getColorStyle } from './styles.js';

export default function App() {
  // Get everything from the custom hook (now includes Firebase)
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
  } = useQuranTracker();

  const { migrateToCloud } = useStorage(user);

  // Setup theme on mount
  useEffect(() => {
    const cleanup = setupTheme();
    return cleanup;
  }, []);

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

  return (
    <div style={styles.container}>
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
                  reviewHistory
                });
              }}
            >
              ☁️ Enable Sync
            </button>
          )}
            <button
              style={{
                ...styles.button,
                backgroundColor: 'var(--text-secondary)',
                color: 'white',
                minWidth: 'auto',
                padding: '8px 16px',
                fontSize: '14px'
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
                  {Object.keys(memorizedPages).length} pages memorized
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
                  {Object.keys(conflictData.cloudData.memorizedPages || {}).length} pages memorized
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

      {/* Today's Review Section */}
      <div style={styles.primaryCard}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          🌅 Today's Review
        </h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '1rem', margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
            Position: <strong>{currentPosition + 1}</strong> of <strong>{memorizedPagesList.length}</strong> pages
          </p>
          <p style={{ fontSize: '0.875rem', margin: '0.5rem 0', color: 'var(--text-secondary)' }}>
            🔄 {remainingDays} days remaining • Full cycle: {estimatedCycleDuration} days
          </p>
        </div>

        {todaysPages.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              📚 Review these pages today:
            </h3>
            
            <div style={{
              ...styles.card,
              backgroundColor: 'var(--bg-accent, #e3f2fd)',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                Total Difficulty: {todaysPages.reduce((sum, page) => sum + getRank(page.color), 0)}/4
              </strong>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                🟢🟢 = 1 • 🟢 = 2 • 🔴 = 3
              </div>
            </div>

            <div style={{ ...styles.flexWrap, justifyContent: 'center' }}>
              {todaysPages.map((page, idx) => (
                <div key={idx} style={{
                  ...getColorStyle(page.color),
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minWidth: '100px',
                  padding: '1rem'
                }}>
                  <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    Page {page.page}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem' }}>Rank {getRank(page.color)}</span>
                    <span style={{ fontSize: '1.2rem' }}>
                      {page.color === 'super-green' ? '🟢🟢' : page.color === 'green' ? '🟢' : '🔴'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          style={{ ...styles.button, ...styles.primaryButton, width: '100%' }}
          onClick={completeReview}
        >
          ✅ Complete Review & Next
        </button>

        {lastReviewDate && (
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            Last review: {lastReviewDate}
          </p>
        )}
      </div>

      {/* Action Buttons */}
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
      </div>

      {/* Progress Overview */}
      {showOverview && (
        <div style={styles.card}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
            📊 Progress Overview
          </h3>

          <div style={styles.mobileGrid}>
            <div style={{
              ...styles.statCard,
              backgroundColor: 'var(--danger-color, #ffcdd2)',
              color: 'white'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {memorizedPagesList.filter((p) => p.color === 'red').length}
              </div>
              <div style={{ fontSize: '0.875rem' }}>🔴 Red Pages</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Need more work</div>
            </div>

            <div style={{
              ...styles.statCard,
              backgroundColor: 'var(--success-color, #c8e6c9)',
              color: 'white'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {memorizedPagesList.filter((p) => p.color === 'green').length}
              </div>
              <div style={{ fontSize: '0.875rem' }}>🟢 Green Pages</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Well known</div>
            </div>

            <div style={{
              ...styles.statCard,
              backgroundColor: '#1b5e20',
              color: 'white'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {memorizedPagesList.filter((p) => p.color === 'super-green').length}
              </div>
              <div style={{ fontSize: '0.875rem' }}>🟢🟢 Super Green</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>Very solid</div>
            </div>

            <div style={{
              ...styles.statCard,
              backgroundColor: 'var(--info-color, #e1f5fe)',
              color: 'white'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {memorizedPagesList.length}
              </div>
              <div style={{ fontSize: '0.875rem' }}>📖 Total Pages</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                {Math.round((memorizedPagesList.length / 604) * 100)}% of Quran
              </div>
            </div>
          </div>

          {/* Review History */}
          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              📈 Review History
            </h4>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {reviewHistory.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
                  No review history yet. Complete a review to see your progress!
                </p>
              ) : (
                reviewHistory.map((entry, index) => (
                  <div key={index} style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: 'var(--bg-primary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{entry.date}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          Position {entry.position}
                        </span>
                        {entry.cycleCompleted && (
                          <span style={{
                            fontSize: '0.75rem',
                            backgroundColor: 'var(--success-color)',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '12px',
                          }}>
                            🎉 Cycle Complete
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                      <strong>Pages reviewed:</strong> {entry.pagesReviewed.map((p) => `P${p.page}`).join(', ')}
                    </div>

                    <div style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}>
                      <span>
                        Difficulty: {entry.pagesReviewed
                          .map((p) => p.color === 'super-green' ? '🟢🟢' : p.color === 'green' ? '🟢' : '🔴')
                          .join(' ')}
                      </span>
                      <span>Rank: {entry.totalRank}/4</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page Selector */}
      {showPageSelector && (
        <div style={styles.card}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            📝 Select Memorized Pages
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
                        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
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
                            minHeight: '80px',
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
                              <select
                                value={memorizedPages[pageNum]}
                                onChange={(e) => changePageColor(pageNum, e.target.value)}
                                style={{
                                  ...styles.select,
                                  ...getColorStyle(memorizedPages[pageNum]),
                                  width: '100%',
                                  textAlign: 'center'
                                }}
                              >
                                <option value="red">🔴 Red</option>
                                <option value="green">🟢 Green</option>
                                <option value="super-green">🟢🟢 Super</option>
                              </select>
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

      {/* Statistics */}
      <div style={styles.card}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          📊 Statistics
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', fontSize: '0.875rem' }}>
          <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {memorizedPagesList.length}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>Total Pages</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--danger-color)' }}>
              {memorizedPagesList.filter((p) => p.color === 'red').length}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>🔴 Red</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
              {memorizedPagesList.filter((p) => p.color === 'green').length}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>🟢 Green</div>
          </div>
          <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1b5e20' }}>
              {memorizedPagesList.filter((p) => p.color === 'super-green').length}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>🟢🟢 Super</div>
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
    </div>
  );
}