import { useState, useEffect } from 'react';

export default function App() {
  // Load data from memory (localStorage not supported in artifacts)
  const loadFromStorage = (key, defaultValue) => {
    return defaultValue; // Simplified for artifact environment
  };

  // Default memorized pages
  const defaultPages = {
    2: 'red',
    3: 'red',
    293: 'green',
    294: 'green',
    295: 'super-green',
    296: 'super-green',
    297: 'green',
    298: 'green',
    299: 'super-green',
    300: 'super-green',
    301: 'green',
    302: 'green',
    303: 'green',
    304: 'green',
    415: 'green',
    416: 'green',
    417: 'red',
    531: 'super-green',
    532: 'super-green',
    533: 'super-green',
    534: 'green',
    582: 'super-green',
    583: 'super-green',
    584: 'super-green',
    585: 'super-green',
    586: 'super-green',
    587: 'super-green',
    588: 'super-green',
    589: 'super-green',
    590: 'super-green',
    591: 'super-green',
    592: 'super-green',
    593: 'super-green',
    594: 'super-green',
    595: 'super-green',
    596: 'super-green',
    597: 'super-green',
    598: 'super-green',
    599: 'super-green',
    600: 'super-green',
    601: 'super-green',
    602: 'super-green',
    603: 'super-green',
    604: 'super-green',
  };

  // Initialize state
  const [memorizedPages, setMemorizedPages] = useState(defaultPages);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [lastReviewDate, setLastReviewDate] = useState(null);
  const [reviewHistory, setReviewHistory] = useState([]);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [expandedSurahs, setExpandedSurahs] = useState(new Set());
  const [surahSearch, setSurahSearch] = useState('');
  const [showOverview, setShowOverview] = useState(false);
  const [importError, setImportError] = useState('');

  // Complete Quran surah info
  const surahInfo = [
    { number: 1, name: 'Al-Fatihah', startPage: 1, endPage: 1 },
    { number: 2, name: 'Al-Baqarah', startPage: 2, endPage: 49 },
    { number: 3, name: 'Aal-E-Imran', startPage: 50, endPage: 76 },
    { number: 4, name: 'An-Nisa', startPage: 77, endPage: 106 },
    { number: 5, name: 'Al-Maidah', startPage: 106, endPage: 127 },
    { number: 6, name: "Al-An'am", startPage: 128, endPage: 150 },
    { number: 7, name: "Al-A'raf", startPage: 151, endPage: 176 },
    { number: 8, name: 'Al-Anfal', startPage: 177, endPage: 186 },
    { number: 9, name: 'At-Tawbah', startPage: 187, endPage: 207 },
    { number: 10, name: 'Yunus', startPage: 208, endPage: 220 },
    { number: 11, name: 'Hud', startPage: 221, endPage: 234 },
    { number: 12, name: 'Yusuf', startPage: 235, endPage: 248 },
    { number: 13, name: "Ar-Ra'd", startPage: 249, endPage: 255 },
    { number: 14, name: 'Ibrahim', startPage: 255, endPage: 261 },
    { number: 15, name: 'Al-Hijr', startPage: 262, endPage: 267 },
    { number: 16, name: 'An-Nahl', startPage: 267, endPage: 281 },
    { number: 17, name: 'Al-Isra', startPage: 282, endPage: 293 },
    { number: 18, name: 'Al-Kahf', startPage: 293, endPage: 304 },
    { number: 19, name: 'Maryam', startPage: 305, endPage: 311 },
    { number: 20, name: 'Taha', startPage: 312, endPage: 321 },
    { number: 21, name: 'Al-Anbiya', startPage: 322, endPage: 331 },
    { number: 22, name: 'Al-Hajj', startPage: 332, endPage: 341 },
    { number: 23, name: "Al-Mu'minun", startPage: 342, endPage: 349 },
    { number: 24, name: 'An-Nur', startPage: 350, endPage: 359 },
    { number: 25, name: 'Al-Furqan', startPage: 359, endPage: 366 },
    { number: 26, name: "Ash-Shu'ara", startPage: 367, endPage: 376 },
    { number: 27, name: 'An-Naml', startPage: 377, endPage: 385 },
    { number: 28, name: 'Al-Qasas', startPage: 385, endPage: 396 },
    { number: 29, name: 'Al-Ankabut', startPage: 396, endPage: 404 },
    { number: 30, name: 'Ar-Rum', startPage: 404, endPage: 410 },
    { number: 31, name: 'Luqman', startPage: 411, endPage: 414 },
    { number: 32, name: 'As-Sajdah', startPage: 415, endPage: 417 },
    { number: 33, name: 'Al-Ahzab', startPage: 418, endPage: 427 },
    { number: 34, name: 'Saba', startPage: 428, endPage: 434 },
    { number: 35, name: 'Fatir', startPage: 434, endPage: 440 },
    { number: 36, name: 'Ya-Sin', startPage: 440, endPage: 445 },
    { number: 37, name: 'As-Saffat', startPage: 446, endPage: 452 },
    { number: 38, name: 'Sad', startPage: 453, endPage: 458 },
    { number: 39, name: 'Az-Zumar', startPage: 458, endPage: 467 },
    { number: 40, name: 'Ghafir', startPage: 467, endPage: 476 },
    { number: 41, name: 'Fussilat', startPage: 477, endPage: 482 },
    { number: 42, name: 'Ash-Shuraa', startPage: 483, endPage: 489 },
    { number: 43, name: 'Az-Zukhruf', startPage: 489, endPage: 495 },
    { number: 44, name: 'Ad-Dukhan', startPage: 496, endPage: 498 },
    { number: 45, name: 'Al-Jathiyah', startPage: 499, endPage: 502 },
    { number: 46, name: 'Al-Ahqaf', startPage: 502, endPage: 506 },
    { number: 47, name: 'Muhammad', startPage: 507, endPage: 510 },
    { number: 48, name: 'Al-Fath', startPage: 511, endPage: 515 },
    { number: 49, name: 'Al-Hujurat', startPage: 515, endPage: 517 },
    { number: 50, name: 'Qaf', startPage: 518, endPage: 520 },
    { number: 51, name: 'Adh-Dhariyat', startPage: 520, endPage: 523 },
    { number: 52, name: 'At-Tur', startPage: 523, endPage: 525 },
    { number: 53, name: 'An-Najm', startPage: 526, endPage: 528 },
    { number: 54, name: 'Al-Qamar', startPage: 528, endPage: 531 },
    { number: 55, name: 'Ar-Rahman', startPage: 531, endPage: 534 },
    { number: 56, name: "Al-Waqi'ah", startPage: 534, endPage: 537 },
    { number: 57, name: 'Al-Hadid', startPage: 537, endPage: 541 },
    { number: 58, name: 'Al-Mujadila', startPage: 542, endPage: 545 },
    { number: 59, name: 'Al-Hashr', startPage: 545, endPage: 548 },
    { number: 60, name: 'Al-Mumtahanah', startPage: 549, endPage: 551 },
    { number: 61, name: 'As-Saff', startPage: 551, endPage: 552 },
    { number: 62, name: "Al-Jumu'ah", startPage: 553, endPage: 554 },
    { number: 63, name: 'Al-Munafiqun', startPage: 554, endPage: 555 },
    { number: 64, name: 'At-Taghabun', startPage: 556, endPage: 557 },
    { number: 65, name: 'At-Talaq', startPage: 558, endPage: 559 },
    { number: 66, name: 'At-Tahrim', startPage: 560, endPage: 561 },
    { number: 67, name: 'Al-Mulk', startPage: 562, endPage: 564 },
    { number: 68, name: 'Al-Qalam', startPage: 564, endPage: 566 },
    { number: 69, name: 'Al-Haqqah', startPage: 566, endPage: 568 },
    { number: 70, name: "Al-Ma'arij", startPage: 568, endPage: 570 },
    { number: 71, name: 'Nuh', startPage: 570, endPage: 571 },
    { number: 72, name: 'Al-Jinn', startPage: 572, endPage: 573 },
    { number: 73, name: 'Al-Muzzammil', startPage: 574, endPage: 575 },
    { number: 74, name: 'Al-Muddaththir', startPage: 575, endPage: 577 },
    { number: 75, name: 'Al-Qiyamah', startPage: 577, endPage: 578 },
    { number: 76, name: 'Al-Insan', startPage: 578, endPage: 580 },
    { number: 77, name: 'Al-Mursalat', startPage: 580, endPage: 581 },
    { number: 78, name: 'An-Naba', startPage: 582, endPage: 583 },
    { number: 79, name: "An-Nazi'at", startPage: 583, endPage: 584 },
    { number: 80, name: 'Abasa', startPage: 585, endPage: 585 },
    { number: 81, name: 'At-Takwir', startPage: 586, endPage: 586 },
    { number: 82, name: 'Al-Infitar', startPage: 587, endPage: 587 },
    { number: 83, name: 'Al-Mutaffifin', startPage: 587, endPage: 589 },
    { number: 84, name: 'Al-Inshiqaq', startPage: 589, endPage: 589 },
    { number: 85, name: 'Al-Buruj', startPage: 590, endPage: 590 },
    { number: 86, name: 'At-Tariq', startPage: 591, endPage: 591 },
    { number: 87, name: "Al-A'la", startPage: 591, endPage: 591 },
    { number: 88, name: 'Al-Ghashiyah', startPage: 592, endPage: 592 },
    { number: 89, name: 'Al-Fajr', startPage: 593, endPage: 594 },
    { number: 90, name: 'Al-Balad', startPage: 594, endPage: 594 },
    { number: 91, name: 'Ash-Shams', startPage: 595, endPage: 595 },
    { number: 92, name: 'Al-Layl', startPage: 595, endPage: 596 },
    { number: 93, name: 'Ad-Duhaa', startPage: 596, endPage: 596 },
    { number: 94, name: 'Ash-Sharh', startPage: 596, endPage: 596 },
    { number: 95, name: 'At-Tin', startPage: 597, endPage: 597 },
    { number: 96, name: 'Al-Alaq', startPage: 597, endPage: 597 },
    { number: 97, name: 'Al-Qadr', startPage: 598, endPage: 598 },
    { number: 98, name: 'Al-Bayyinah', startPage: 598, endPage: 598 },
    { number: 99, name: 'Az-Zalzalah', startPage: 599, endPage: 599 },
    { number: 100, name: 'Al-Adiyat', startPage: 599, endPage: 599 },
    { number: 101, name: "Al-Qari'ah", startPage: 600, endPage: 600 },
    { number: 102, name: 'At-Takathur', startPage: 600, endPage: 600 },
    { number: 103, name: 'Al-Asr', startPage: 601, endPage: 601 },
    { number: 104, name: 'Al-Humazah', startPage: 601, endPage: 601 },
    { number: 105, name: 'Al-Fil', startPage: 601, endPage: 601 },
    { number: 106, name: 'Quraysh', startPage: 602, endPage: 602 },
    { number: 107, name: "Al-Ma'un", startPage: 602, endPage: 602 },
    { number: 108, name: 'Al-Kawthar', startPage: 602, endPage: 602 },
    { number: 109, name: 'Al-Kafirun', startPage: 603, endPage: 603 },
    { number: 110, name: 'An-Nasr', startPage: 603, endPage: 603 },
    { number: 111, name: 'Al-Masad', startPage: 603, endPage: 603 },
    { number: 112, name: 'Al-Ikhlas', startPage: 604, endPage: 604 },
    { number: 113, name: 'Al-Falaq', startPage: 604, endPage: 604 },
    { number: 114, name: 'An-Nas', startPage: 604, endPage: 604 },
  ];

  // Utility functions
  const getMemorizedPagesList = () => {
    return Object.entries(memorizedPages)
      .map(([page, color]) => ({ page: parseInt(page), color }))
      .sort((a, b) => a.page - b.page);
  };

  const getRank = (color) => {
    switch (color) {
      case 'super-green': return 1;
      case 'green': return 2;
      case 'red': return 3;
      default: return 3;
    }
  };

  const getPagesToReview = () => {
    const pagesList = getMemorizedPagesList();
    if (pagesList.length === 0) return [];

    const maxRankSum = 4;
    let currentRankSum = 0;
    const pagesToReview = [];

    for (let i = currentPosition; i < pagesList.length; i++) {
      const page = pagesList[i];
      const pageRank = getRank(page.color);

      if (currentRankSum + pageRank > maxRankSum) {
        break;
      }

      pagesToReview.push(page);
      currentRankSum += pageRank;

      if (currentRankSum === maxRankSum) {
        break;
      }
    }

    if (pagesToReview.length === 0 && pagesList.length > currentPosition) {
      pagesToReview.push(pagesList[currentPosition]);
    }

    return pagesToReview;
  };

  const getEstimatedCycleDuration = () => {
    const pagesList = getMemorizedPagesList();
    if (pagesList.length === 0) return 0;

    let totalDays = 0;
    let position = 0;

    while (position < pagesList.length) {
      let currentRankSum = 0;
      let pagesInThisDay = 0;

      for (let i = position; i < pagesList.length; i++) {
        const page = pagesList[i];
        const pageRank = getRank(page.color);

        if (currentRankSum + pageRank > 4 && pagesInThisDay > 0) {
          break;
        }

        currentRankSum += pageRank;
        pagesInThisDay++;

        if (currentRankSum === 4) {
          break;
        }
      }

      if (pagesInThisDay === 0) {
        pagesInThisDay = 1;
      }

      position += pagesInThisDay;
      totalDays++;
    }

    return totalDays;
  };

  const getRemainingDays = () => {
    const pagesList = getMemorizedPagesList();
    if (pagesList.length === 0 || currentPosition >= pagesList.length) return 0;

    let totalDays = 0;
    let position = currentPosition;

    while (position < pagesList.length) {
      let currentRankSum = 0;
      let pagesInThisDay = 0;

      for (let i = position; i < pagesList.length; i++) {
        const page = pagesList[i];
        const pageRank = getRank(page.color);

        if (currentRankSum + pageRank > 4 && pagesInThisDay > 0) {
          break;
        }

        currentRankSum += pageRank;
        pagesInThisDay++;

        if (currentRankSum === 4) {
          break;
        }
      }

      if (pagesInThisDay === 0) {
        pagesInThisDay = 1;
      }

      position += pagesInThisDay;
      totalDays++;
    }

    return totalDays;
  };

  const getSurahMemorizedCount = (surah) => {
    let count = 0;
    for (let page = surah.startPage; page <= surah.endPage; page++) {
      if (memorizedPages[page]) count++;
    }
    return count;
  };

  const toggleSurah = (surahNumber) => {
    const newExpanded = new Set(expandedSurahs);
    if (newExpanded.has(surahNumber)) {
      newExpanded.delete(surahNumber);
    } else {
      newExpanded.add(surahNumber);
    }
    setExpandedSurahs(newExpanded);
  };

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

  const filteredSurahs = surahInfo.filter(
    (surah) =>
      surah.name.toLowerCase().includes(surahSearch.toLowerCase()) ||
      surah.number.toString().includes(surahSearch)
  );

  // Export data functionality
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

  // Email export functionality
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

  // Copy backup data to clipboard
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
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = emailContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('✅ Backup data copied to clipboard!\n\nYou can now paste it into any email, message, or document.');
    }
  };

  // Import data functionality
  const importData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);

        // Validate the imported data structure
        if (!importedData.memorizedPages || typeof importedData.memorizedPages !== 'object') {
          throw new Error('Invalid backup file format');
        }

        // Import the data
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
    event.target.value = ''; // Reset file input
  };

  const getOverviewData = () => {
    const memorizedSurahs = surahInfo.filter((surah) => getSurahMemorizedCount(surah) > 0);
    return memorizedSurahs
      .map((surah) => {
        const memorizedCount = getSurahMemorizedCount(surah);
        const totalPages = surah.endPage - surah.startPage + 1;
        const percentage = Math.round((memorizedCount / totalPages) * 100);

        // Get color distribution for this surah
        const colors = { red: 0, green: 0, 'super-green': 0 };
        for (let page = surah.startPage; page <= surah.endPage; page++) {
          if (memorizedPages[page]) {
            colors[memorizedPages[page]]++;
          }
        }

        return { ...surah, memorizedCount, totalPages, percentage, colors };
      })
      .sort((a, b) => a.number - b.number);
  };

  const memorizedPagesList = getMemorizedPagesList();
  const todaysPages = getPagesToReview();

  // Mobile-first responsive styles with dark mode support
  const styles = {
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

  // Add CSS custom properties for dark mode
  useEffect(() => {
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
  }, []);

  const getColorStyle = (color) => {
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

  return (
    <div style={styles.container}>
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
            🔄 {getRemainingDays()} days remaining • Full cycle: {getEstimatedCycleDuration()} days
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
          onClick={() => {
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
          }}
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
              onClick={() => setExpandedSurahs(new Set(filteredSurahs.map((s) => s.number)))}
              style={{ ...styles.button, ...styles.primaryButton }}
            >
              📖 Expand All
            </button>
            <button
              onClick={() => setExpandedSurahs(new Set())}
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

        {/* Detailed Surah Progress */}
        {showOverview && (
          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              📋 Memorized Surahs Progress
            </h4>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {getOverviewData().map((surah) => (
                <div key={surah.number} style={{
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
                    <div style={{ flex: '1', minWidth: '150px' }}>
                      <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>
                        {surah.number}. {surah.name}
                      </strong>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Pages {surah.startPage}-{surah.endPage}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        color: surah.percentage === 100 ? 'var(--success-color)' : 'var(--text-primary)'
                      }}>
                        {surah.memorizedCount}/{surah.totalPages}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        ({surah.percentage}%)
                      </div>
                    </div>
                  </div>

                  <div style={styles.progressBar}>
                    <div style={{
                      ...styles.progressFill,
                      width: `${surah.percentage}%`,
                      backgroundColor: surah.percentage === 100 ? 'var(--success-color)' : 'var(--info-color)'
                    }} />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--danger-color)' }}>🔴 {surah.colors.red}</span>
                    <span style={{ color: 'var(--success-color)' }}>🟢 {surah.colors.green}</span>
                    <span style={{ color: '#1b5e20' }}>🟢🟢 {surah.colors['super-green']}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
      <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
        <button
          style={{ ...styles.button, ...styles.dangerButton }}
          onClick={() => {
            if (window.confirm('Reset your review position to the beginning?')) {
              setCurrentPosition(0);
              setLastReviewDate(null);
            }
          }}
        >
          🔄 Reset Position
        </button>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Your data is saved automatically
        </p>
      </div>
    </div>
  );
}