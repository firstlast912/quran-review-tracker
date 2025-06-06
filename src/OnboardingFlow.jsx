// OnboardingFlow.jsx - Complete onboarding experience with sign-in option
import { useState } from 'react';
import { surahInfo } from './quranData.js';

export const OnboardingFlow = ({ onComplete, onSignIn }) => {
  const [step, setStep] = useState('welcome'); // welcome, education, selection, complete
  const [selectedPages, setSelectedPages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSurahs, setExpandedSurahs] = useState(new Set());
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Handle sign in for existing users
  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await onSignIn();
      // If user has existing data, onSignIn will handle navigation
      // If not, continue with onboarding
      if (!result || !result.hasExistingData) {
        setIsSigningIn(false);
        // User signed in but has no data, continue onboarding
        setStep('education');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setIsSigningIn(false);
      alert('Sign in failed. Please try again.');
    }
  };

  // Get medal counts and stats
  const getStats = () => {
    const entries = Object.entries(selectedPages);
    const bronze = entries.filter(([_, quality]) => quality === 'red').length;
    const silver = entries.filter(([_, quality]) => quality === 'green').length;
    const gold = entries.filter(([_, quality]) => quality === 'super-green').length;
    const totalPoints = bronze * 3 + silver * 2 + gold * 1;
    const estimatedDailyPages = totalPoints <= 4 ? entries.length : Math.ceil(totalPoints / 4);
    
    return { bronze, silver, gold, total: entries.length, totalPoints, estimatedDailyPages };
  };

  // Filter surahs based on search
  const filteredSurahs = surahInfo.filter(surah =>
    surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.number.toString().includes(searchTerm)
  );

  // Toggle page selection
  const togglePage = (pageNum, defaultQuality = 'red') => {
    setSelectedPages(prev => {
      const newPages = { ...prev };
      if (newPages[pageNum]) {
        delete newPages[pageNum];
      } else {
        newPages[pageNum] = defaultQuality;
      }
      return newPages;
    });
  };

  // Change page quality
  const changePageQuality = (pageNum, quality) => {
    setSelectedPages(prev => ({
      ...prev,
      [pageNum]: quality
    }));
  };

  // Toggle entire surah
  const toggleSurah = (surah, quality = 'red') => {
    const surahPages = [];
    for (let page = surah.startPage; page <= surah.endPage; page++) {
      surahPages.push(page);
    }
    
    const allSelected = surahPages.every(page => selectedPages[page]);
    
    setSelectedPages(prev => {
      const newPages = { ...prev };
      if (allSelected) {
        // Remove all pages from this surah
        surahPages.forEach(page => delete newPages[page]);
      } else {
        // Add all pages from this surah
        surahPages.forEach(page => {
          if (!newPages[page]) {
            newPages[page] = quality;
          }
        });
      }
      return newPages;
    });
  };

  // Quick add options - TOGGLE functionality
  const toggleQuickSelection = (type) => {
    setSelectedPages(prev => {
      const newPages = { ...prev };
      let pagesToToggle = [];
      
      if (type === 'last10') {
        // Last 10 surahs (105-114)
        for (let surahNum = 105; surahNum <= 114; surahNum++) {
          const surah = surahInfo.find(s => s.number === surahNum);
          if (surah) {
            for (let page = surah.startPage; page <= surah.endPage; page++) {
              pagesToToggle.push(page);
            }
          }
        }
      } else if (type === 'fatihah') {
        pagesToToggle = [1]; // Al-Fatihah
      } else if (type === 'short') {
        // Common short surahs (110-114)
        for (let surahNum = 110; surahNum <= 114; surahNum++) {
          const surah = surahInfo.find(s => s.number === surahNum);
          if (surah) {
            for (let page = surah.startPage; page <= surah.endPage; page++) {
              pagesToToggle.push(page);
            }
          }
        }
      }
      
      // Check if all pages are already selected
      const allSelected = pagesToToggle.every(page => newPages[page]);
      
      if (allSelected) {
        // Remove all pages
        pagesToToggle.forEach(page => delete newPages[page]);
      } else {
        // Add all pages with super-green quality
        pagesToToggle.forEach(page => {
          newPages[page] = 'super-green';
        });
      }
      
      return newPages;
    });
  };
  
  // Helper to check if quick selection is active
  const isQuickSelectionActive = (type) => {
    let pagesToCheck = [];
    
    if (type === 'last10') {
      for (let surahNum = 105; surahNum <= 114; surahNum++) {
        const surah = surahInfo.find(s => s.number === surahNum);
        if (surah) {
          for (let page = surah.startPage; page <= surah.endPage; page++) {
            pagesToCheck.push(page);
          }
        }
      }
    } else if (type === 'fatihah') {
      pagesToCheck = [1];
    } else if (type === 'short') {
      for (let surahNum = 110; surahNum <= 114; surahNum++) {
        const surah = surahInfo.find(s => s.number === surahNum);
        if (surah) {
          for (let page = surah.startPage; page <= surah.endPage; page++) {
            pagesToCheck.push(page);
          }
        }
      }
    }
    
    return pagesToCheck.length > 0 && pagesToCheck.every(page => selectedPages[page]);
  };

  const stats = getStats();

  // Welcome Screen with Sign In option
  if (step === 'welcome') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '500px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>📖</div>
          
          <h1 style={{ 
            fontSize: '2rem', 
            marginBottom: '1rem', 
            color: 'var(--text-primary)',
            fontWeight: 'bold'
          }}>
            Quran Memorization Tracker
          </h1>
          
          <p style={{ 
            fontSize: '1.1rem', 
            marginBottom: '2rem', 
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            Welcome to your journey of memorizing the entire Quran! This app helps you maintain and strengthen what you've already memorized through smart daily reviews.
          </p>

          <div style={{
            backgroundColor: 'var(--bg-accent)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '2px solid var(--accent-color)'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              🎯 Your Goal
            </h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Track your memorized pages and review them in optimized cycles to bring everything to mastery level (Gold 🥇)
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Perfect for those who have memorized:
            </h3>
            <ul style={{ 
              textAlign: 'left', 
              color: 'var(--text-secondary)',
              lineHeight: '1.8',
              paddingLeft: '1.5rem'
            }}>
              <li>At least 1 complete surah or page</li>
              <li>Multiple surahs (complete or partial)</li>
              <li>Pages from long surahs like Al-Baqarah</li>
              <li>Mixed memorization across the Quran</li>
            </ul>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={() => setStep('education')}
              style={{
                backgroundColor: 'var(--success-color)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '12px',
                cursor: 'pointer',
                minWidth: '200px'
              }}
            >
              Get Started 🚀
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{
                flex: 1,
                height: '1px',
                backgroundColor: 'var(--border-color)'
              }} />
              <span style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontStyle: 'italic'
              }}>
                Already have an account?
              </span>
              <div style={{
                flex: 1,
                height: '1px',
                backgroundColor: 'var(--border-color)'
              }} />
            </div>

            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              style={{
                backgroundColor: 'var(--info-color)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '12px',
                cursor: isSigningIn ? 'not-allowed' : 'pointer',
                minWidth: '200px',
                opacity: isSigningIn ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isSigningIn ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderRadius: '50%',
                    borderTopColor: 'transparent',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Signing in...
                </>
              ) : (
                <>
                  🔗 Sign In with Google
                </>
              )}
            </button>

            <p style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginTop: '0.5rem'
            }}>
              Sign in to sync your progress across devices
            </p>
          </div>
        </div>

        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Education Screen
  if (step === 'education') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              🏅 Understanding Quality Levels
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              Each page you've memorized has a quality level that determines how often you'll review it
            </p>
          </div>

          <div style={{ display: 'grid', gap: '2rem', marginBottom: '3rem' }}>
            {/* Bronze */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '2rem',
              borderRadius: '12px',
              border: '3px solid #CD7F32'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem', marginRight: '1rem' }}>🥉</span>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
                  Bronze - Recently memorized or need refresh
                </h3>
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                "I need to think hard to recall this" or "I haven't reviewed this in months"
              </p>
              <div style={{ 
                backgroundColor: '#CD7F32', 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '6px',
                display: 'inline-block',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                3 difficulty points - Review frequently
              </div>
            </div>

            {/* Silver */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '2rem',
              borderRadius: '12px',
              border: '3px solid #C0C0C0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem', marginRight: '1rem' }}>🥈</span>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
                  Silver - Can recall with some effort
                </h3>
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                "I can recite it but need to concentrate" or "Might make small mistakes"
              </p>
              <div style={{ 
                backgroundColor: '#C0C0C0', 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '6px',
                display: 'inline-block',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                2 difficulty points - Moderate review
              </div>
            </div>

            {/* Gold */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '2rem',
              borderRadius: '12px',
              border: '3px solid #FFD700'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem', marginRight: '1rem' }}>🥇</span>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: 0 }}>
                  Gold - Confident recall + used in prayer
                </h3>
              </div>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                "Flows naturally from memory AND I've successfully used it during Salah"
              </p>
              <div style={{ 
                backgroundColor: '#FFD700', 
                color: '#333', 
                padding: '8px 16px', 
                borderRadius: '6px',
                display: 'inline-block',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}>
                1 difficulty point - Maintenance review
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--bg-accent)',
            padding: '2rem',
            borderRadius: '12px',
            marginBottom: '3rem',
            border: '2px solid var(--accent-color)'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              📊 Daily Review Examples (4 difficulty points total)
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ 
                backgroundColor: 'var(--bg-primary)', 
                padding: '1rem', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>1 Bronze + 1 Gold page</span>
                <span style={{ color: 'var(--text-secondary)' }}>3 + 1 = 4 points ✅</span>
              </div>
              <div style={{ 
                backgroundColor: 'var(--bg-primary)', 
                padding: '1rem', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>2 Silver pages</span>
                <span style={{ color: 'var(--text-secondary)' }}>2 + 2 = 4 points ✅</span>
              </div>
              <div style={{ 
                backgroundColor: 'var(--bg-primary)', 
                padding: '1rem', 
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--text-primary)' }}>4 Gold pages</span>
                <span style={{ color: 'var(--text-secondary)' }}>1 + 1 + 1 + 1 = 4 points ✅</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => setStep('welcome')}
              style={{
                backgroundColor: 'var(--text-secondary)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                fontSize: '1rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
            <button
              onClick={() => setStep('selection')}
              style={{
                backgroundColor: 'var(--success-color)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Let's Add Your Pages →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Page Selection Screen
  if (step === 'selection') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        padding: '2rem'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              📚 Select Your Memorized Pages
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              Add the pages you've already memorized and set their quality levels
            </p>
          </div>

          {/* Quick Selection Options */}
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem'
          }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              🚀 Quick Selection Options
            </h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => toggleQuickSelection('fatihah')}
                style={{
                  backgroundColor: isQuickSelectionActive('fatihah') ? 'var(--success-color)' : 'var(--info-color)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: isQuickSelectionActive('fatihah') ? 'bold' : 'normal'
                }}
              >
                {isQuickSelectionActive('fatihah') ? '✓' : '+'} Al-Fatihah
              </button>
              <button
                onClick={() => toggleQuickSelection('short')}
                style={{
                  backgroundColor: isQuickSelectionActive('short') ? 'var(--success-color)' : 'var(--info-color)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: isQuickSelectionActive('short') ? 'bold' : 'normal'
                }}
              >
                {isQuickSelectionActive('short') ? '✓' : '+'} Short Surahs (110-114)
              </button>
              <button
                onClick={() => toggleQuickSelection('last10')}
                style={{
                  backgroundColor: isQuickSelectionActive('last10') ? 'var(--success-color)' : 'var(--info-color)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: isQuickSelectionActive('last10') ? 'bold' : 'normal'
                }}
              >
                {isQuickSelectionActive('last10') ? '✓' : '+'} Last 10 Surahs (105-114)
              </button>
            </div>
          </div>

          {/* Progress Summary */}
          <div style={{
            backgroundColor: 'var(--bg-accent)',
            padding: '1.5rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '2px solid var(--accent-color)'
          }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              📊 Current Selection
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {stats.total}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Pages</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#CD7F32' }}>
                  🥉 {stats.bronze}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Bronze</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#C0C0C0' }}>
                  🥈 {stats.silver}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Silver</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FFD700' }}>
                  🥇 {stats.gold}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Gold</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {stats.estimatedDailyPages}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Daily Pages</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Search surahs (name or number)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '1rem',
              border: '2px solid var(--border-color)',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              marginBottom: '2rem'
            }}
          />

          {/* Surah List */}
          <div style={{ maxHeight: '500px', overflowY: 'auto', marginBottom: '2rem' }}>
            {filteredSurahs.map((surah) => {
              const surahPages = [];
              for (let page = surah.startPage; page <= surah.endPage; page++) {
                surahPages.push(page);
              }
              const selectedInSurah = surahPages.filter(page => selectedPages[page]).length;
              const totalInSurah = surahPages.length;
              const isExpanded = expandedSurahs.has(surah.number);

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
                      backgroundColor: selectedInSurah > 0 ? 'var(--bg-accent)' : 'var(--bg-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onClick={() => setExpandedSurahs(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has(surah.number)) {
                        newSet.delete(surah.number);
                      } else {
                        newSet.add(surah.number);
                      }
                      return newSet;
                    })}
                  >
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {isExpanded ? '▼' : '▶'} {surah.number}. {surah.name}
                      </strong>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Pages {surah.startPage}{surah.endPage !== surah.startPage ? `-${surah.endPage}` : ''} 
                        {totalInSurah > 1 && ` (${totalInSurah} pages)`}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {selectedInSurah}/{totalInSurah}
                      </div>
                      {totalInSurah > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSurah(surah, 'red');
                          }}
                          style={{
                            backgroundColor: selectedInSurah === totalInSurah ? 'var(--danger-color)' : 'var(--success-color)',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            marginTop: '4px'
                          }}
                        >
                          {selectedInSurah === totalInSurah ? 'Remove All' : 'Add All'}
                        </button>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '0.5rem'
                      }}>
                        {surahPages.map((pageNum) => (
                          <div key={pageNum} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '0.75rem',
                            border: '2px solid var(--border-color)',
                            borderRadius: '8px',
                            backgroundColor: selectedPages[pageNum] ? 'var(--bg-accent)' : 'var(--bg-secondary)'
                          }}>
                            <label style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              cursor: 'pointer',
                              marginBottom: '0.5rem'
                            }}>
                              <input
                                type="checkbox"
                                checked={!!selectedPages[pageNum]}
                                onChange={() => togglePage(pageNum)}
                                style={{ transform: 'scale(1.2)' }}
                              />
                              <strong style={{ color: 'var(--text-primary)' }}>Page {pageNum}</strong>
                            </label>
                            
                            {selectedPages[pageNum] && (
                              <div style={{ marginTop: '0.5rem' }}>
                                <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                  Quality level:
                                </div>
                                <select
                                  value={selectedPages[pageNum]}
                                  onChange={(e) => changePageQuality(pageNum, e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '4px',
                                    borderRadius: '4px',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-primary)',
                                    color: 'var(--text-primary)'
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

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button
              onClick={() => setStep('education')}
              style={{
                backgroundColor: 'var(--text-secondary)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                fontSize: '1rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
            <button
              onClick={() => stats.total > 0 ? setStep('complete') : alert('Please select at least one page')}
              disabled={stats.total === 0}
              style={{
                backgroundColor: stats.total > 0 ? 'var(--success-color)' : 'var(--text-secondary)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: stats.total > 0 ? 'pointer' : 'not-allowed',
                opacity: stats.total > 0 ? 1 : 0.6
              }}
            >
              Continue ({stats.total} pages) →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Complete Screen
  if (step === 'complete') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🎉</div>
          
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            fontWeight: 'bold'
          }}>
            Setup Complete!
          </h1>
          
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '2rem',
            color: 'var(--text-secondary)'
          }}>
            Your memorization journey is ready to begin
          </p>

          <div style={{
            backgroundColor: 'var(--bg-accent)',
            padding: '2rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            border: '2px solid var(--accent-color)'
          }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              📊 Your Memorization Portfolio
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {stats.total}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Pages</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#CD7F32' }}>
                  🥉 {stats.bronze}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Bronze</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#C0C0C0' }}>
                  🥈 {stats.silver}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Silver</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#FFD700' }}>
                  🥇 {stats.gold}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Gold</div>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--bg-primary)',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                📅 Review Schedule
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                Daily review: ~{stats.estimatedDailyPages} pages ({stats.totalPoints} difficulty points)
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                Full cycle: {stats.total} days
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                Estimated time: {Math.ceil(stats.estimatedDailyPages * 3)}-{Math.ceil(stats.estimatedDailyPages * 5)} minutes daily
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--success-color)',
              color: 'white',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '1rem'
            }}>
              🎯 <strong>Goal:</strong> Bring all {stats.total} pages to Gold level through consistent daily reviews!
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              🚀 What happens next?
            </h3>
            <ul style={{
              textAlign: 'left',
              color: 'var(--text-secondary)',
              lineHeight: '1.8',
              paddingLeft: '1.5rem'
            }}>
              <li>Start your first review cycle today</li>
              <li>Review pages in order with smart difficulty balancing</li>
              <li>Upgrade page quality levels as you improve</li>
              <li>Add new pages as you memorize them</li>
              <li>Track your progress toward Gold mastery</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => setStep('selection')}
              style={{
                backgroundColor: 'var(--text-secondary)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                fontSize: '1rem',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              ← Adjust Pages
            </button>
            <button
              onClick={() => {
                console.log('Completing onboarding with pages:', selectedPages);
                onComplete(selectedPages);
              }}
              style={{
                backgroundColor: 'var(--success-color)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              Start My First Review! 📚
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};