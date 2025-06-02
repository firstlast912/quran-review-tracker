import { useState, useEffect } from 'react';

export default function App() {
  // Load data from localStorage or use defaults
  const loadFromStorage = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
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

  // Initialize state from localStorage
  const [memorizedPages, setMemorizedPages] = useState(() =>
    loadFromStorage('quranMemorizedPages', defaultPages)
  );

  const [currentPosition, setCurrentPosition] = useState(() =>
    loadFromStorage('quranCurrentPosition', 0)
  );

  const [lastReviewDate, setLastReviewDate] = useState(() =>
    loadFromStorage('quranLastReviewDate', null)
  );

  const [reviewHistory, setReviewHistory] = useState(() =>
    loadFromStorage('quranReviewHistory', [])
  );

  const [showPageSelector, setShowPageSelector] = useState(false);
  const [expandedSurahs, setExpandedSurahs] = useState(new Set());
  const [surahSearch, setSurahSearch] = useState('');
  const [showOverview, setShowOverview] = useState(false);
  const [importError, setImportError] = useState('');

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('quranMemorizedPages', JSON.stringify(memorizedPages));
  }, [memorizedPages]);

  useEffect(() => {
    localStorage.setItem(
      'quranCurrentPosition',
      JSON.stringify(currentPosition)
    );
  }, [currentPosition]);

  useEffect(() => {
    localStorage.setItem('quranLastReviewDate', JSON.stringify(lastReviewDate));
  }, [lastReviewDate]);

  useEffect(() => {
    localStorage.setItem('quranReviewHistory', JSON.stringify(reviewHistory));
  }, [reviewHistory]);

  // Complete Quran surah info with all 114 surahs
  const surahInfo = [
    { number: 1, name: 'Al-Fatihah', startPage: 1, endPage: 1 },
    { number: 2, name: 'Al-Baqarah', startPage: 2, endPage: 49 },
    { number: 3, name: 'Aal-E-Imran', startPage: 50, endPage: 76 },
    { number: 4, name: 'An-Nisa', startPage: 77, endPage: 106 },
    { number: 5, name: 'Al-Maidah', startPage: 106, endPage: 127 },
    { number: 6, name: "Al-An'am", startPage: 128, endPage: 151 },
    { number: 7, name: "Al-A'raf", startPage: 151, endPage: 176 },
    { number: 8, name: 'Al-Anfal', startPage: 177, endPage: 187 },
    { number: 9, name: 'At-Tawbah', startPage: 187, endPage: 207 },
    { number: 10, name: 'Yunus', startPage: 208, endPage: 221 },
    { number: 11, name: 'Hud', startPage: 221, endPage: 235 },
    { number: 12, name: 'Yusuf', startPage: 235, endPage: 249 },
    { number: 13, name: "Ar-Ra'd", startPage: 249, endPage: 255 },
    { number: 14, name: 'Ibrahim', startPage: 255, endPage: 261 },
    { number: 15, name: 'Al-Hijr', startPage: 262, endPage: 267 },
    { number: 16, name: 'An-Nahl', startPage: 267, endPage: 281 },
    { number: 17, name: 'Al-Isra', startPage: 282, endPage: 293 },
    { number: 18, name: 'Al-Kahf', startPage: 293, endPage: 304 },
    { number: 19, name: 'Maryam', startPage: 305, endPage: 312 },
    { number: 20, name: 'Taha', startPage: 312, endPage: 322 },
    { number: 21, name: 'Al-Anbiya', startPage: 322, endPage: 332 },
    { number: 22, name: 'Al-Hajj', startPage: 332, endPage: 341 },
    { number: 23, name: "Al-Mu'minun", startPage: 342, endPage: 350 },
    { number: 24, name: 'An-Nur', startPage: 350, endPage: 359 },
    { number: 25, name: 'Al-Furqan', startPage: 359, endPage: 366 },
    { number: 26, name: "Ash-Shu'ara", startPage: 367, endPage: 377 },
    { number: 27, name: 'An-Naml', startPage: 377, endPage: 385 },
    { number: 28, name: 'Al-Qasas', startPage: 385, endPage: 396 },
    { number: 29, name: 'Al-Ankabut', startPage: 396, endPage: 404 },
    { number: 30, name: 'Ar-Rum', startPage: 404, endPage: 411 },
    { number: 31, name: 'Luqman', startPage: 411, endPage: 414 },
    { number: 32, name: 'As-Sajdah', startPage: 415, endPage: 417 },
    { number: 33, name: 'Al-Ahzab', startPage: 418, endPage: 427 },
    { number: 34, name: 'Saba', startPage: 428, endPage: 434 },
    { number: 35, name: 'Fatir', startPage: 434, endPage: 440 },
    { number: 36, name: 'Ya-Sin', startPage: 440, endPage: 445 },
    { number: 37, name: 'As-Saffat', startPage: 446, endPage: 453 },
    { number: 38, name: 'Sad', startPage: 453, endPage: 458 },
    { number: 39, name: 'Az-Zumar', startPage: 458, endPage: 467 },
    { number: 40, name: 'Ghafir', startPage: 467, endPage: 477 },
    { number: 41, name: 'Fussilat', startPage: 477, endPage: 482 },
    { number: 42, name: 'Ash-Shuraa', startPage: 483, endPage: 489 },
    { number: 43, name: 'Az-Zukhruf', startPage: 489, endPage: 496 },
    { number: 44, name: 'Ad-Dukhan', startPage: 496, endPage: 499 },
    { number: 45, name: 'Al-Jathiyah', startPage: 499, endPage: 502 },
    { number: 46, name: 'Al-Ahqaf', startPage: 502, endPage: 507 },
    { number: 47, name: 'Muhammad', startPage: 507, endPage: 511 },
    { number: 48, name: 'Al-Fath', startPage: 511, endPage: 515 },
    { number: 49, name: 'Al-Hujurat', startPage: 515, endPage: 517 },
    { number: 50, name: 'Qaf', startPage: 518, endPage: 520 },
    { number: 51, name: 'Adh-Dhariyat', startPage: 520, endPage: 523 },
    { number: 52, name: 'At-Tur', startPage: 523, endPage: 526 },
    { number: 53, name: 'An-Najm', startPage: 526, endPage: 528 },
    { number: 54, name: 'Al-Qamar', startPage: 528, endPage: 531 },
    { number: 55, name: 'Ar-Rahman', startPage: 531, endPage: 534 },
    { number: 56, name: "Al-Waqi'ah", startPage: 534, endPage: 537 },
    { number: 57, name: 'Al-Hadid', startPage: 537, endPage: 541 },
    { number: 58, name: 'Al-Mujadila', startPage: 542, endPage: 545 },
    { number: 59, name: 'Al-Hashr', startPage: 545, endPage: 549 },
    { number: 60, name: 'Al-Mumtahanah', startPage: 549, endPage: 551 },
    { number: 61, name: 'As-Saff', startPage: 551, endPage: 553 },
    { number: 62, name: "Al-Jumu'ah", startPage: 553, endPage: 554 },
    { number: 63, name: 'Al-Munafiqun', startPage: 554, endPage: 556 },
    { number: 64, name: 'At-Taghabun', startPage: 556, endPage: 558 },
    { number: 65, name: 'At-Talaq', startPage: 558, endPage: 560 },
    { number: 66, name: 'At-Tahrim', startPage: 560, endPage: 562 },
    { number: 67, name: 'Al-Mulk', startPage: 562, endPage: 564 },
    { number: 68, name: 'Al-Qalam', startPage: 564, endPage: 566 },
    { number: 69, name: 'Al-Haqqah', startPage: 566, endPage: 568 },
    { number: 70, name: "Al-Ma'arij", startPage: 568, endPage: 570 },
    { number: 71, name: 'Nuh', startPage: 570, endPage: 572 },
    { number: 72, name: 'Al-Jinn', startPage: 572, endPage: 574 },
    { number: 73, name: 'Al-Muzzammil', startPage: 574, endPage: 575 },
    { number: 74, name: 'Al-Muddaththir', startPage: 575, endPage: 577 },
    { number: 75, name: 'Al-Qiyamah', startPage: 577, endPage: 578 },
    { number: 76, name: 'Al-Insan', startPage: 578, endPage: 580 },
    { number: 77, name: 'Al-Mursalat', startPage: 580, endPage: 581 },
    { number: 78, name: 'An-Naba', startPage: 581, endPage: 582 },
    { number: 79, name: "An-Nazi'at", startPage: 582, endPage: 583 },
    { number: 80, name: 'Abasa', startPage: 583, endPage: 584 },
    { number: 81, name: 'At-Takwir', startPage: 584, endPage: 585 },
    { number: 82, name: 'Al-Infitar', startPage: 585, endPage: 585 },
    { number: 83, name: 'Al-Mutaffifin', startPage: 585, endPage: 587 },
    { number: 84, name: 'Al-Inshiqaq', startPage: 587, endPage: 587 },
    { number: 85, name: 'Al-Buruj', startPage: 587, endPage: 588 },
    { number: 86, name: 'At-Tariq', startPage: 588, endPage: 588 },
    { number: 87, name: "Al-A'la", startPage: 588, endPage: 589 },
    { number: 88, name: 'Al-Ghashiyah', startPage: 589, endPage: 590 },
    { number: 89, name: 'Al-Fajr', startPage: 590, endPage: 591 },
    { number: 90, name: 'Al-Balad', startPage: 591, endPage: 591 },
    { number: 91, name: 'Ash-Shams', startPage: 591, endPage: 592 },
    { number: 92, name: 'Al-Layl', startPage: 592, endPage: 592 },
    { number: 93, name: 'Ad-Duhaa', startPage: 592, endPage: 593 },
    { number: 94, name: 'Ash-Sharh', startPage: 593, endPage: 593 },
    { number: 95, name: 'At-Tin', startPage: 593, endPage: 594 },
    { number: 96, name: 'Al-Alaq', startPage: 594, endPage: 595 },
    { number: 97, name: 'Al-Qadr', startPage: 595, endPage: 595 },
    { number: 98, name: 'Al-Bayyinah', startPage: 595, endPage: 596 },
    { number: 99, name: 'Az-Zalzalah', startPage: 596, endPage: 596 },
    { number: 100, name: 'Al-Adiyat', startPage: 596, endPage: 597 },
    { number: 101, name: "Al-Qari'ah", startPage: 597, endPage: 597 },
    { number: 102, name: 'At-Takathur', startPage: 597, endPage: 598 },
    { number: 103, name: 'Al-Asr', startPage: 598, endPage: 598 },
    { number: 104, name: 'Al-Humazah', startPage: 598, endPage: 598 },
    { number: 105, name: 'Al-Fil', startPage: 598, endPage: 599 },
    { number: 106, name: 'Quraysh', startPage: 599, endPage: 599 },
    { number: 107, name: "Al-Ma'un", startPage: 599, endPage: 599 },
    { number: 108, name: 'Al-Kawthar', startPage: 599, endPage: 600 },
    { number: 109, name: 'Al-Kafirun', startPage: 600, endPage: 600 },
    { number: 110, name: 'An-Nasr', startPage: 600, endPage: 600 },
    { number: 111, name: 'Al-Masad', startPage: 600, endPage: 601 },
    { number: 112, name: 'Al-Ikhlas', startPage: 601, endPage: 601 },
    { number: 113, name: 'Al-Falaq', startPage: 601, endPage: 602 },
    { number: 114, name: 'An-Nas', startPage: 602, endPage: 604 },
  ];

  // Get sorted list of memorized pages
  const getMemorizedPagesList = () => {
    return Object.entries(memorizedPages)
      .map(([page, color]) => ({ page: parseInt(page), color }))
      .sort((a, b) => a.page - b.page);
  };

  // Toggle surah expansion
  const toggleSurah = (surahNumber) => {
    const newExpanded = new Set(expandedSurahs);
    if (newExpanded.has(surahNumber)) {
      newExpanded.delete(surahNumber);
    } else {
      newExpanded.add(surahNumber);
    }
    setExpandedSurahs(newExpanded);
  };

  // Get memorized pages count for a surah
  const getSurahMemorizedCount = (surah) => {
    let count = 0;
    for (let page = surah.startPage; page <= surah.endPage; page++) {
      if (memorizedPages[page]) count++;
    }
    return count;
  };

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
    link.download = `quran-tracker-backup-${
      new Date().toISOString().split('T')[0]
    }.json`;
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
    const encodedData = encodeURIComponent(dataStr);

    const subject = encodeURIComponent(
      'Quran Memorization Tracker - Backup Data'
    );
    const body = encodeURIComponent(
      `Hi,\n\nHere's your Quran memorization tracker backup data.\n\nTo import this data:\n1. Copy the JSON data below\n2. Save it as a .json file\n3. Use the Import button in your tracker\n\nBackup Date: ${new Date().toLocaleString()}\nTotal Memorized Pages: ${
        Object.keys(memorizedPages).length
      }\n\n--- JSON DATA (copy everything between the lines) ---\n${dataStr}\n--- END JSON DATA ---\n\nBest regards!`
    );

    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;

    // Try mailto first, then fallback to copy
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
      alert(
        '✅ Backup data copied to clipboard!\n\nYou can now paste it into any email, message, or document.'
      );
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = emailContent;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(
        '✅ Backup data copied to clipboard!\n\nYou can now paste it into any email, message, or document.'
      );
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
        if (
          !importedData.memorizedPages ||
          typeof importedData.memorizedPages !== 'object'
        ) {
          throw new Error('Invalid backup file format');
        }

        // Import the data
        if (importedData.memorizedPages)
          setMemorizedPages(importedData.memorizedPages);
        if (typeof importedData.currentPosition === 'number')
          setCurrentPosition(importedData.currentPosition);
        if (importedData.lastReviewDate)
          setLastReviewDate(importedData.lastReviewDate);
        if (
          importedData.reviewHistory &&
          Array.isArray(importedData.reviewHistory)
        ) {
          setReviewHistory(importedData.reviewHistory);
        }

        setImportError('');
        alert(
          `✅ Data imported successfully!\nPages: ${
            Object.keys(importedData.memorizedPages).length
          }\nLast backup: ${
            importedData.exportDate
              ? new Date(importedData.exportDate).toLocaleString()
              : 'Unknown'
          }`
        );
      } catch (error) {
        setImportError(
          "Error importing file. Please check that it's a valid backup file."
        );
        console.error('Import error:', error);
      }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };
  const getEstimatedCycleDuration = () => {
    const pagesList = getMemorizedPagesList();
    if (pagesList.length === 0) return 0;

    let totalDays = 0;
    let position = 0;

    // Simulate the review cycle from start to finish
    while (position < pagesList.length) {
      let currentRankSum = 0;
      let pagesInThisDay = 0;

      // Calculate how many pages would be reviewed on this day
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

      // If no pages fit, take at least one page
      if (pagesInThisDay === 0) {
        pagesInThisDay = 1;
      }

      position += pagesInThisDay;
      totalDays++;
    }

    return totalDays;
  };

  // Calculate remaining days from current position
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
  const getOverviewData = () => {
    const memorizedSurahs = surahInfo.filter(
      (surah) => getSurahMemorizedCount(surah) > 0
    );
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

        return {
          ...surah,
          memorizedCount,
          totalPages,
          percentage,
          colors,
        };
      })
      .sort((a, b) => a.number - b.number);
  };
  const filteredSurahs = surahInfo.filter(
    (surah) =>
      surah.name.toLowerCase().includes(surahSearch.toLowerCase()) ||
      surah.number.toString().includes(surahSearch)
  );

  // Toggle page memorization
  const togglePage = (pageNum) => {
    const newMemorized = { ...memorizedPages };
    if (newMemorized[pageNum]) {
      delete newMemorized[pageNum];
    } else {
      newMemorized[pageNum] = 'red'; // Default to red for new pages
    }
    setMemorizedPages(newMemorized);
  };

  // Change color of memorized page
  const changePageColor = (pageNum, color) => {
    setMemorizedPages((prev) => ({
      ...prev,
      [pageNum]: color,
    }));
  };

  // Get rank value for a color
  const getRank = (color) => {
    switch (color) {
      case 'super-green':
        return 1;
      case 'green':
        return 2;
      case 'red':
        return 3;
      default:
        return 3;
    }
  };

  // Calculate pages to review using rank-based system
  const getPagesToReview = () => {
    const pagesList = getMemorizedPagesList();
    if (pagesList.length === 0) return [];

    const maxRankSum = 4;
    let currentRankSum = 0;
    const pagesToReview = [];

    // Start from current position and add pages until we hit the rank limit
    for (let i = currentPosition; i < pagesList.length; i++) {
      const page = pagesList[i];
      const pageRank = getRank(page.color);

      // Check if adding this page would exceed the limit
      if (currentRankSum + pageRank > maxRankSum) {
        break; // Stop here, don't add this page
      }

      // Add this page to today's review
      pagesToReview.push(page);
      currentRankSum += pageRank;

      // If we've reached exactly the max rank sum, we can stop
      if (currentRankSum === maxRankSum) {
        break;
      }
    }

    // Ensure we always review at least 1 page (even if it exceeds the limit)
    if (pagesToReview.length === 0 && pagesList.length > currentPosition) {
      pagesToReview.push(pagesList[currentPosition]);
    }

    return pagesToReview;
  };

  const getColorStyle = (color) => {
    switch (color) {
      case 'red':
        return { backgroundColor: '#ffcdd2', color: '#c62828' };
      case 'green':
        return { backgroundColor: '#c8e6c9', color: '#2e7d32' };
      case 'super-green':
        return { backgroundColor: '#81c784', color: '#1b5e20' };
      default:
        return {};
    }
  };

  const memorizedPagesList = getMemorizedPagesList();
  const todaysPages = getPagesToReview();

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <h1>Quran Memorization Tracker</h1>

      <div
        style={{
          margin: '20px 0',
          padding: '15px',
          border: '2px solid #4CAF50',
          borderRadius: '8px',
          backgroundColor: '#f5f5f5',
        }}
      >
        <h2>Today's Review</h2>
        <p>
          Position: {currentPosition + 1} of {memorizedPagesList.length} pages
        </p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Cycle Progress: {getRemainingDays()} days remaining • Full cycle:{' '}
          {getEstimatedCycleDuration()} days
        </p>

        {todaysPages.length > 0 && (
          <div style={{ margin: '15px 0' }}>
            <strong>Review these pages today:</strong>
            <div
              style={{
                margin: '10px 0',
                padding: '10px',
                backgroundColor: '#e3f2fd',
                borderRadius: '5px',
                fontSize: '14px',
              }}
            >
              <strong>
                Total Difficulty Rank:{' '}
                {todaysPages.reduce(
                  (sum, page) => sum + getRank(page.color),
                  0
                )}
                /4
              </strong>
              <div
                style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}
              >
                Rank values: 🟢🟢 = 1, 🟢 = 2, 🔴 = 3
              </div>
            </div>
            {todaysPages.map((page, idx) => (
              <div
                key={idx}
                style={{
                  margin: '5px 0',
                  padding: '8px',
                  backgroundColor: 'white',
                  borderRadius: '5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>Page {page.page}</span>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    Rank {getRank(page.color)}
                  </span>
                  <span style={getColorStyle(page.color)}>
                    {page.color === 'super-green'
                      ? '🟢🟢'
                      : page.color === 'green'
                      ? '🟢'
                      : '🔴'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {showOverview && (
          <div
            style={{
              margin: '20px 0',
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <h3>Progress Overview</h3>

            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    padding: '15px',
                    backgroundColor: '#ffcdd2',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#c62828',
                    }}
                  >
                    {memorizedPagesList.filter((p) => p.color === 'red').length}
                  </div>
                  <div style={{ color: '#c62828' }}>🔴 Red Pages</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Need more work
                  </div>
                </div>

                <div
                  style={{
                    padding: '15px',
                    backgroundColor: '#c8e6c9',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#2e7d32',
                    }}
                  >
                    {
                      memorizedPagesList.filter((p) => p.color === 'green')
                        .length
                    }
                  </div>
                  <div style={{ color: '#2e7d32' }}>🟢 Green Pages</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Well known
                  </div>
                </div>

                <div
                  style={{
                    padding: '15px',
                    backgroundColor: '#81c784',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#1b5e20',
                    }}
                  >
                    {
                      memorizedPagesList.filter(
                        (p) => p.color === 'super-green'
                      ).length
                    }
                  </div>
                  <div style={{ color: '#1b5e20' }}>🟢🟢 Super Green</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Very solid
                  </div>
                </div>

                <div
                  style={{
                    padding: '15px',
                    backgroundColor: '#e1f5fe',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#0277bd',
                    }}
                  >
                    {memorizedPagesList.length}
                  </div>
                  <div style={{ color: '#0277bd' }}>📖 Total Pages</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {Math.round((memorizedPagesList.length / 604) * 100)}% of
                    Quran
                  </div>
                </div>
              </div>
            </div>

            <h4>Memorized Surahs Progress</h4>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {getOverviewData().map((surah) => (
                <div
                  key={surah.number}
                  style={{
                    marginBottom: '15px',
                    padding: '15px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    <div>
                      <strong>
                        {surah.number}. {surah.name}
                      </strong>
                      <span
                        style={{
                          marginLeft: '10px',
                          fontSize: '14px',
                          color: '#666',
                        }}
                      >
                        Pages {surah.startPage}-{surah.endPage}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: surah.percentage === 100 ? '#4CAF50' : '#666',
                      }}
                    >
                      {surah.memorizedCount}/{surah.totalPages} (
                      {surah.percentage}%)
                    </div>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#e0e0e0',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${surah.percentage}%`,
                        backgroundColor:
                          surah.percentage === 100 ? '#4CAF50' : '#2196F3',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>

                  <div
                    style={{ display: 'flex', gap: '15px', fontSize: '13px' }}
                  >
                    <span style={{ color: '#c62828' }}>
                      🔴 {surah.colors.red}
                    </span>
                    <span style={{ color: '#2e7d32' }}>
                      🟢 {surah.colors.green}
                    </span>
                    <span style={{ color: '#1b5e20' }}>
                      🟢🟢 {surah.colors['super-green']}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px',
          }}
          onClick={() => {
            const newPosition = currentPosition + todaysPages.length;
            const reviewDate = new Date().toLocaleDateString();

            // Add to review history
            const newHistoryEntry = {
              date: reviewDate,
              pagesReviewed: todaysPages.map((p) => ({
                page: p.page,
                color: p.color,
                rank: getRank(p.color),
              })),
              totalRank: todaysPages.reduce(
                (sum, page) => sum + getRank(page.color),
                0
              ),
              position: currentPosition + 1,
              cycleCompleted: newPosition >= memorizedPagesList.length,
            };

            setReviewHistory((prev) => [newHistoryEntry, ...prev].slice(0, 30)); // Keep last 30 entries

            if (newPosition >= memorizedPagesList.length) {
              setCurrentPosition(0); // Loop back to beginning
            } else {
              setCurrentPosition(newPosition);
            }
            setLastReviewDate(reviewDate);
          }}
        >
          Complete Review & Next
        </button>

        {lastReviewDate && (
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Last review: {lastReviewDate}
          </p>
        )}
      </div>

      <button
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '10px 10px 10px 0',
        }}
        onClick={() => setShowPageSelector(!showPageSelector)}
      >
        {showPageSelector ? 'Hide' : 'Show'} Page Selector
      </button>

      <button
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#FF9800',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          margin: '10px 0',
        }}
        onClick={() => setShowOverview(!showOverview)}
      >
        {showOverview ? 'Hide' : 'Show'} Progress Overview
      </button>

      <div
        style={{
          margin: '20px 0',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
        }}
      >
        <h3>📊 Data Management</h3>

        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '15px',
          }}
        >
          <button
            style={{
              padding: '10px 15px',
              fontSize: '14px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={exportData}
          >
            📥 Export Progress
          </button>

          <button
            style={{
              padding: '10px 15px',
              fontSize: '14px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={emailData}
          >
            📧 Email Backup
          </button>

          <button
            style={{
              padding: '10px 15px',
              fontSize: '14px',
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={copyToClipboard}
          >
            📋 Copy Backup
          </button>

          <label
            style={{
              padding: '10px 15px',
              fontSize: '14px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'inline-block',
            }}
          >
            📤 Import Progress
            <input
              type="file"
              accept=".json"
              onChange={importData}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {importError && (
          <div
            style={{
              padding: '10px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              borderRadius: '5px',
              fontSize: '14px',
              marginBottom: '10px',
            }}
          >
            ❌ {importError}
          </div>
        )}

        <div style={{ fontSize: '12px', color: '#666' }}>
          <strong>Export:</strong> Downloads backup file •{' '}
          <strong>Email:</strong> Try to open email • <strong>Copy:</strong>{' '}
          Copy to clipboard • <strong>Import:</strong> Restore from backup
        </div>
      </div>

      {showPageSelector && (
        <div
          style={{
            margin: '20px 0',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h3>Select Memorized Pages</h3>

            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                placeholder="Search surahs (name or number)..."
                value={surahSearch}
                onChange={(e) => setSurahSearch(e.target.value)}
                style={{
                  padding: '8px 12px',
                  width: '250px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginRight: '10px',
                }}
              />
              <button
                onClick={() =>
                  setExpandedSurahs(
                    new Set(filteredSurahs.map((s) => s.number))
                  )
                }
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginRight: '5px',
                }}
              >
                Expand All
              </button>
              <button
                onClick={() => setExpandedSurahs(new Set())}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Collapse All
              </button>
            </div>
          </div>

          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {filteredSurahs.map((surah) => {
              const memorizedCount = getSurahMemorizedCount(surah);
              const totalPages = surah.endPage - surah.startPage + 1;
              const isExpanded = expandedSurahs.has(surah.number);

              return (
                <div
                  key={surah.number}
                  style={{
                    marginBottom: '10px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '5px',
                  }}
                >
                  <div
                    style={{
                      padding: '12px',
                      backgroundColor:
                        memorizedCount > 0 ? '#e8f5e9' : '#fafafa',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                    onClick={() => toggleSurah(surah.number)}
                  >
                    <div>
                      <strong>
                        {isExpanded ? '▼' : '▶'} {surah.number}. {surah.name}
                      </strong>
                      <span
                        style={{
                          marginLeft: '10px',
                          fontSize: '14px',
                          color: '#666',
                        }}
                      >
                        (Pages {surah.startPage}-{surah.endPage})
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {memorizedCount}/{totalPages} memorized
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '15px', backgroundColor: 'white' }}>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        {Array.from(
                          { length: surah.endPage - surah.startPage + 1 },
                          (_, i) => surah.startPage + i
                        ).map((pageNum) => (
                          <div
                            key={pageNum}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '6px 8px',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              backgroundColor: memorizedPages[pageNum]
                                ? '#e8f5e9'
                                : 'white',
                              fontSize: '13px',
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={!!memorizedPages[pageNum]}
                              onChange={() => togglePage(pageNum)}
                              style={{ marginRight: '6px' }}
                            />
                            <span
                              style={{ marginRight: '8px', minWidth: '45px' }}
                            >
                              P{pageNum}
                            </span>
                            {memorizedPages[pageNum] && (
                              <select
                                value={memorizedPages[pageNum]}
                                onChange={(e) =>
                                  changePageColor(pageNum, e.target.value)
                                }
                                style={{
                                  padding: '2px 4px',
                                  borderRadius: '3px',
                                  fontSize: '11px',
                                  border: '1px solid #ccc',
                                  ...getColorStyle(memorizedPages[pageNum]),
                                }}
                              >
                                <option value="red">🔴</option>
                                <option value="green">🟢</option>
                                <option value="super-green">🟢🟢</option>
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

          <h4>Review History</h4>
          <div
            style={{ maxHeight: '300px', overflowY: 'auto', marginTop: '15px' }}
          >
            {reviewHistory.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                No review history yet. Complete a review to see your progress!
              </p>
            ) : (
              reviewHistory.map((entry, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '10px',
                    padding: '12px',
                    backgroundColor: 'white',
                    borderRadius: '6px',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <strong style={{ color: '#333' }}>{entry.date}</strong>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        Position {entry.position}
                      </span>
                      {entry.cycleCompleted && (
                        <span
                          style={{
                            fontSize: '12px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '10px',
                          }}
                        >
                          🎉 Cycle Complete
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', marginBottom: '5px' }}>
                    <strong>Pages reviewed:</strong>{' '}
                    {entry.pagesReviewed.map((p) => `P${p.page}`).join(', ')}
                  </div>

                  <div
                    style={{
                      fontSize: '12px',
                      color: '#666',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>
                      Difficulty:{' '}
                      {entry.pagesReviewed
                        .map((p) =>
                          p.color === 'super-green'
                            ? '🟢🟢'
                            : p.color === 'green'
                            ? '🟢'
                            : '🔴'
                        )
                        .join(' ')}
                    </span>
                    <span>Total Rank: {entry.totalRank}/4</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        <strong>Statistics:</strong>
        <br />
        Total memorized: {memorizedPagesList.length} pages
        <br />
        🔴 Red: {memorizedPagesList.filter((p) => p.color === 'red').length} |
        🟢 Green: {memorizedPagesList.filter((p) => p.color === 'green').length}{' '}
        | 🟢🟢 Super:{' '}
        {memorizedPagesList.filter((p) => p.color === 'super-green').length}
      </div>

      <div
        style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #ddd',
        }}
      >
        <button
          style={{
            padding: '8px 16px',
            fontSize: '14px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => {
            if (
              window.confirm(
                'This will reset your review position to the beginning. Continue?'
              )
            ) {
              setCurrentPosition(0);
              setLastReviewDate(null);
            }
          }}
        >
          Reset Review Position
        </button>

        <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
          Your data is automatically saved in your browser
        </p>
      </div>
    </div>
  );
}
