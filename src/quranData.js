// quranData.js - Static data and utility functions

export const surahInfo = [
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
  
  export const defaultMemorizedPages = {
    2: 'red',
    3: 'red',
    599: 'super-green',
    600: 'super-green',
    601: 'super-green',
    602: 'super-green',
    603: 'super-green',
    604: 'super-green',
  };
  
  // Utility functions
  export const getRank = (color) => {
    switch (color) {
      case 'super-green': return 1;
      case 'green': return 2;
      case 'red': return 3;
      default: return 3;
    }
  };
  
  export const getMemorizedPagesList = (memorizedPages) => {
    return Object.entries(memorizedPages)
      .map(([page, color]) => ({ page: parseInt(page), color }))
      .sort((a, b) => a.page - b.page);
  };
  
  export const getPagesToReview = (memorizedPages, currentPosition) => {
    const pagesList = getMemorizedPagesList(memorizedPages);
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
  
  export const getEstimatedCycleDuration = (memorizedPages) => {
    const pagesList = getMemorizedPagesList(memorizedPages);
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
  
  export const getRemainingDays = (memorizedPages, currentPosition) => {
    const pagesList = getMemorizedPagesList(memorizedPages);
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
  
  export const getSurahMemorizedCount = (surah, memorizedPages) => {
    let count = 0;
    for (let page = surah.startPage; page <= surah.endPage; page++) {
      if (memorizedPages[page]) count++;
    }
    return count;
  };
  
  export const getOverviewData = (memorizedPages) => {
    const memorizedSurahs = surahInfo.filter((surah) => 
      getSurahMemorizedCount(surah, memorizedPages) > 0
    );
    
    return memorizedSurahs
      .map((surah) => {
        const memorizedCount = getSurahMemorizedCount(surah, memorizedPages);
        const totalPages = surah.endPage - surah.startPage + 1;
        const percentage = Math.round((memorizedCount / totalPages) * 100);
  
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