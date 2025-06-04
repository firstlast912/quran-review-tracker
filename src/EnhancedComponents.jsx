// EnhancedComponents.jsx - All enhanced UI components with medal system
import { useState } from 'react';
import { getRank, surahInfo } from './quranData';

// Medal Badge Component
export const MedalBadge = ({ quality, size = 'normal', showLabel = true }) => {
  const getMedalInfo = (quality) => {
    switch (quality) {
      case 'red':
        return { emoji: '🥉', label: 'Bronze', color: '#CD7F32', points: 3 };
      case 'green':
        return { emoji: '🥈', label: 'Silver', color: '#C0C0C0', points: 2 };
      case 'super-green':
        return { emoji: '🥇', label: 'Gold', color: '#FFD700', points: 1 };
      default:
        return { emoji: '🥉', label: 'Bronze', color: '#CD7F32', points: 3 };
    }
  };

  const medal = getMedalInfo(quality);
  const fontSize = size === 'large' ? '2rem' : size === 'small' ? '1rem' : '1.5rem';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <span style={{ fontSize }}>{medal.emoji}</span>
      {showLabel && (
        <span style={{
          color: medal.color,
          fontWeight: 'bold',
          fontSize: size === 'small' ? '0.8rem' : '1rem'
        }}>
          {medal.label}
        </span>
      )}
    </div>
  );
};

// Quality Selector Component
export const QualitySelector = ({ value, onChange, style = {} }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '8px',
        borderRadius: '6px',
        border: '2px solid var(--border-color)',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        cursor: 'pointer',
        ...style
      }}
    >
      <option value="red">🥉 Bronze</option>
      <option value="green">🥈 Silver</option>
      <option value="super-green">🥇 Gold</option>
    </select>
  );
};

// Enhanced Today's Review Component
export const TodaysReviewEnhanced = ({
  todaysPages,
  currentPosition,
  memorizedPagesList,
  remainingDays,
  estimatedCycleDuration,
  lastReviewDate,
  onCompleteReview
}) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-accent)',
      border: '2px solid var(--accent-color)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1rem'
    }}>
      <h2 style={{
        fontSize: '1.4rem',
        marginBottom: '1rem',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        🌅 Today's Review
      </h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {currentPosition + 1}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              of {memorizedPagesList.length} pages
            </div>
          </div>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {remainingDays}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              days remaining
            </div>
          </div>
          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
              {estimatedCycleDuration}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              day cycle
            </div>
          </div>
        </div>
      </div>

      {todaysPages.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.2rem',
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            📚 Review these pages today:
          </h3>

          <div style={{
            backgroundColor: 'var(--bg-primary)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Total Difficulty: {todaysPages.reduce((sum, page) => sum + getRank(page.color), 0)}/4 points
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              🥉 Bronze = 3pts • 🥈 Silver = 2pts • 🥇 Gold = 1pt
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {todaysPages.map((page, idx) => (
              <div key={idx} style={{
                backgroundColor: 'var(--bg-primary)',
                border: '2px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  Page {page.page}
                </div>
                
                <MedalBadge quality={page.color} size="large" />
                
                <div style={{
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)'
                }}>
                  {getRank(page.color)} difficulty points
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onCompleteReview}
        disabled={todaysPages.length === 0}
        style={{
          backgroundColor: todaysPages.length > 0 ? 'var(--success-color)' : 'var(--text-secondary)',
          color: 'white',
          border: 'none',
          padding: '16px 32px',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          borderRadius: '12px',
          cursor: todaysPages.length > 0 ? 'pointer' : 'not-allowed',
          width: '100%',
          opacity: todaysPages.length > 0 ? 1 : 0.6
        }}
      >
        {todaysPages.length > 0 ? '✅ Complete Review & Continue' : 'No pages to review today'}
      </button>

      {lastReviewDate && (
        <p style={{
          marginTop: '1rem',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          textAlign: 'center'
        }}>
          Last review: {lastReviewDate}
        </p>
      )}
    </div>
  );
};

// Quality Upgrade Modal Component
export const QualityUpgradeModal = ({ page, currentQuality, onUpgrade, onClose }) => {
  const [selectedQuality, setSelectedQuality] = useState(currentQuality);

  const handleSubmit = () => {
    onUpgrade(page, selectedQuality);
    onClose();
  };

  return (
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
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        border: '2px solid var(--border-color)'
      }}>
        <h3 style={{
          fontSize: '1.3rem',
          marginBottom: '1rem',
          color: 'var(--text-primary)',
          textAlign: 'center'
        }}>
          📖 Page {page} Review Complete!
        </h3>

        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Currently: </span>
            <MedalBadge quality={currentQuality} />
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            How did that review go?
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem',
              backgroundColor: selectedQuality === 'red' ? 'var(--bg-accent)' : 'var(--bg-secondary)',
              borderRadius: '8px',
              cursor: 'pointer',
              border: selectedQuality === 'red' ? '2px solid var(--accent-color)' : '2px solid transparent'
            }}>
              <input
                type="radio"
                name="quality"
                value="red"
                checked={selectedQuality === 'red'}
                onChange={(e) => setSelectedQuality(e.target.value)}
                style={{ marginRight: '1rem', transform: 'scale(1.2)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <MedalBadge quality="red" size="small" />
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>Keep as Bronze</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Still struggling or need more practice
                </div>
              </div>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem',
              backgroundColor: selectedQuality === 'green' ? 'var(--bg-accent)' : 'var(--bg-secondary)',
              borderRadius: '8px',
              cursor: 'pointer',
              border: selectedQuality === 'green' ? '2px solid var(--accent-color)' : '2px solid transparent'
            }}>
              <input
                type="radio"
                name="quality"
                value="green"
                checked={selectedQuality === 'green'}
                onChange={(e) => setSelectedQuality(e.target.value)}
                style={{ marginRight: '1rem', transform: 'scale(1.2)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <MedalBadge quality="green" size="small" />
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>Upgrade to Silver</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Can recall with some effort and concentration
                </div>
              </div>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              padding: '1rem',
              backgroundColor: selectedQuality === 'super-green' ? 'var(--bg-accent)' : 'var(--bg-secondary)',
              borderRadius: '8px',
              cursor: 'pointer',
              border: selectedQuality === 'super-green' ? '2px solid var(--accent-color)' : '2px solid transparent'
            }}>
              <input
                type="radio"
                name="quality"
                value="super-green"
                checked={selectedQuality === 'super-green'}
                onChange={(e) => setSelectedQuality(e.target.value)}
                style={{ marginRight: '1rem', transform: 'scale(1.2)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <MedalBadge quality="super-green" size="small" />
                  <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>Upgrade to Gold</span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Confident recall AND have used it in prayer
                </div>
              </div>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--text-secondary)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Skip
          </button>
          <button
            onClick={handleSubmit}
            style={{
              backgroundColor: 'var(--success-color)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              flex: 2
            }}
          >
            {selectedQuality === currentQuality ? 'Keep Current' : 'Update Quality'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Progress Dashboard Component
export const ProgressDashboard = ({
  memorizedPages,
  reviewHistory,
  currentPosition,
  memorizedPagesList
}) => {
  const getQualityStats = () => {
    const entries = Object.entries(memorizedPages);
    const bronze = entries.filter(([_, quality]) => quality === 'red').length;
    const silver = entries.filter(([_, quality]) => quality === 'green').length;
    const gold = entries.filter(([_, quality]) => quality === 'super-green').length;
    return { bronze, silver, gold, total: entries.length };
  };

  const getRecentProgress = () => {
    const recent = reviewHistory.slice(0, 10);
    const upgrades = recent.reduce((acc, entry) => {
      // This would track upgrades if we stored that data
      return acc;
    }, []);
    return upgrades;
  };

  const stats = getQualityStats();
  const completionPercentage = Math.round((stats.total / 604) * 100);

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1rem'
    }}>
      <h3 style={{
        fontSize: '1.4rem',
        marginBottom: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      }}>
        📊 Progress Dashboard
      </h3>

      {/* Quality Distribution */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: '#CD7F32',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {stats.bronze}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>🥉 Bronze Pages</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
            Need focus
          </div>
        </div>

        <div style={{
          backgroundColor: '#C0C0C0',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {stats.silver}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>🥈 Silver Pages</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
            Progressing well
          </div>
        </div>

        <div style={{
          backgroundColor: '#FFD700',
          color: '#333',
          padding: '1.5rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {stats.gold}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>🥇 Gold Pages</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
            Mastered
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--info-color)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>📖 Total Pages</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
            {completionPercentage}% of Quran
          </div>
        </div>
      </div>

      {/* Current Cycle Progress */}
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          🔄 Current Cycle Progress
        </h4>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            Position {currentPosition + 1} of {memorizedPagesList.length}
          </span>
          <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>
            {Math.round(((currentPosition + 1) / memorizedPagesList.length) * 100)}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((currentPosition + 1) / memorizedPagesList.length) * 100}%`,
            height: '100%',
            backgroundColor: 'var(--success-color)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Review History Preview */}
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        padding: '1.5rem',
        borderRadius: '8px'
      }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          📈 Recent Review History
        </h4>
        {reviewHistory.length === 0 ? (
          <p style={{
            color: 'var(--text-secondary)',
            fontStyle: 'italic',
            textAlign: 'center',
            padding: '2rem'
          }}>
            Complete your first review to see progress history
          </p>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {reviewHistory.slice(0, 5).map((entry, index) => (
              <div key={index} style={{
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem'
                }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{entry.date}</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      Position {entry.position}
                    </span>
                    {entry.cycleCompleted && (
                      <span style={{
                        fontSize: '0.75rem',
                        backgroundColor: 'var(--success-color)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px'
                      }}>
                        🎉 Cycle Complete
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <strong>Pages:</strong> {entry.pagesReviewed.map(p => `P${p.page}`).join(', ')}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  <strong>Difficulty:</strong> {entry.totalRank}/4 points
                </div>
              </div>
            ))}
            {reviewHistory.length > 5 && (
              <div style={{
                textAlign: 'center',
                padding: '1rem',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem'
              }}>
                ... and {reviewHistory.length - 5} more reviews
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Add New Pages Flow Component
export const AddPagesFlow = ({ memorizedPages, onAddPages, onClose }) => {
  const [selectedPages, setSelectedPages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSurahs, setExpandedSurahs] = useState(new Set());

  // Filter surahs based on search
  const filteredSurahs = surahInfo.filter(surah =>
    surah.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.number.toString().includes(searchTerm)
  );

  // Toggle page selection
  const togglePage = (pageNum, defaultQuality = 'red') => {
    if (memorizedPages[pageNum]) return; // Already memorized
    
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

  // Get stats
  const getStats = () => {
    const entries = Object.entries(selectedPages);
    const bronze = entries.filter(([_, quality]) => quality === 'red').length;
    const silver = entries.filter(([_, quality]) => quality === 'green').length;
    const gold = entries.filter(([_, quality]) => quality === 'super-green').length;
    return { bronze, silver, gold, total: entries.length };
  };

  const stats = getStats();

  const handleSubmit = () => {
    if (stats.total > 0) {
      onAddPages(selectedPages);
      onClose();
    }
  };

  return (
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
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '2px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0 }}>
            📝 Add New Memorized Pages
          </h3>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            ✕
          </button>
        </div>

        {/* Progress Summary */}
        {stats.total > 0 && (
          <div style={{
            backgroundColor: 'var(--bg-accent)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '2px solid var(--accent-color)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>
                {stats.total} pages selected to add
              </div>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem' }}>
                <span style={{ color: '#CD7F32' }}>🥉 {stats.bronze}</span>
                <span style={{ color: '#C0C0C0' }}>🥈 {stats.silver}</span>
                <span style={{ color: '#FFD700' }}>🥇 {stats.gold}</span>
              </div>
            </div>
          </div>
        )}

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
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            marginBottom: '1.5rem'
          }}
        />

        {/* Surah List */}
        <div style={{ maxHeight: '400px', overflowY: 'auto', marginBottom: '1.5rem' }}>
          {filteredSurahs.map((surah) => {
            const surahPages = [];
            for (let page = surah.startPage; page <= surah.endPage; page++) {
              surahPages.push(page);
            }
            const alreadyMemorized = surahPages.filter(page => memorizedPages[page]).length;
            const selectedInSurah = surahPages.filter(page => selectedPages[page]).length;
            const availablePages = surahPages.filter(page => !memorizedPages[page]);
            const isExpanded = expandedSurahs.has(surah.number);

            if (availablePages.length === 0) return null; // Skip if all pages already memorized

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
                      Pages {surah.startPage}-{surah.endPage} 
                      {alreadyMemorized > 0 && ` (${alreadyMemorized} already memorized)`}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                      {selectedInSurah}/{availablePages.length} available
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)' }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                      gap: '0.5rem'
                    }}>
                      {availablePages.map((pageNum) => (
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
                              <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                                Quality:
                              </div>
                              <QualitySelector
                                value={selectedPages[pageNum]}
                                onChange={(quality) => changePageQuality(pageNum, quality)}
                                style={{ width: '100%', fontSize: '0.8rem', padding: '4px' }}
                              />
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

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--text-secondary)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={stats.total === 0}
            style={{
              backgroundColor: stats.total > 0 ? 'var(--success-color)' : 'var(--text-secondary)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: stats.total > 0 ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              opacity: stats.total > 0 ? 1 : 0.6
            }}
          >
            Add {stats.total} Pages
          </button>
        </div>
      </div>
    </div>
  );
};

// Cycle Complete Celebration Component
export const CycleComplete = ({ stats, onContinue }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '12px',
        padding: '3rem',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        border: '3px solid var(--success-color)'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
        
        <h2 style={{
          fontSize: '2rem',
          marginBottom: '1rem',
          color: 'var(--text-primary)',
          fontWeight: 'bold'
        }}>
          Cycle Complete!
        </h2>
        
        <p style={{
          fontSize: '1.1rem',
          marginBottom: '2rem',
          color: 'var(--text-secondary)'
        }}>
          Congratulations! You've reviewed all {stats.totalPages} pages in your collection.
        </p>

        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            📈 This Cycle's Progress
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#FFD700' }}>
                {stats.promoted || 0}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Pages Upgraded
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>
                {stats.maintained || 0}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Pages Maintained
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {stats.totalReviews || 0}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Total Reviews
              </div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-accent)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          border: '2px solid var(--accent-color)'
        }}>
          <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 'bold' }}>
            🔄 Ready to start a new cycle with your updated quality levels!
          </p>
        </div>

        <button
          onClick={onContinue}
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
          Start New Cycle 🚀
        </button>
      </div>
    </div>
  );
};

// PWA Install Prompt Component
export const InstallPrompt = ({ onInstall, onDismiss }) => {
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: 'var(--info-color)',
      color: 'white',
      padding: '1rem 1.5rem',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 1000,
      maxWidth: '90vw',
      minWidth: '300px',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          📱 Install Quran Tracker
        </div>
        <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
          Get quick access from your home screen and use offline
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button
          onClick={onInstall}
          style={{
            backgroundColor: 'white',
            color: 'var(--info-color)',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}
        >
          Install
        </button>
        <button
          onClick={onDismiss}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
};