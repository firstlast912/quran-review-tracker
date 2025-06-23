# 📖 Quran Review Tracker

A Progressive Web Application (PWA) designed to help you memorize and review the Quran using a spaced repetition system with a medal-based quality tracking approach.

🌐 **Live Demo**: [https://quran-review-tracker.vercel.app](https://quran-review-tracker.vercel.app)

## ✨ Features

### 🎯 Core Features
- **Spaced Repetition System**: Smart algorithm that schedules daily reviews based on a 4-point difficulty system
- **Medal-Based Quality Tracking**: 
  - 🥉 Bronze (3 points) - Recently memorized or needs more practice
  - 🥈 Silver (2 points) - Can recall with some effort
  - 🥇 Gold (1 point) - Confident recall + used in prayer
- **Daily Review Sessions**: Automatically selects pages for review (up to 4 difficulty points per day)
- **Progress Tracking**: Monitor your memorization journey with detailed statistics

### 📱 PWA Features
- **Install as App**: Add to home screen on iOS/Android
- **Offline Support**: Works without internet connection
- **Cross-Device Sync**: Optional Google sign-in for cloud synchronization
- **App Shortcuts**: Quick access to daily review, add pages, and progress

### 🔧 Additional Features
- **Surah Organization**: Browse and manage pages by Surah (114 chapters)
- **Search Functionality**: Find Surahs by name or number
- **Data Management**: Export, import, email, or copy your progress data
- **Dark Mode Support**: Automatic theme based on device preference
- **Batch Quality Updates**: Update multiple page qualities after review sessions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Firebase project (for cloud sync features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/firstlast912/quran-review-tracker.git
cd quran-review-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase (optional, for cloud sync):
   - Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Google provider)
   - Enable Firestore Database
   - Update `src/firebase.js` with your Firebase config

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📖 Usage Guide

### Getting Started with the App

1. **First Time Setup**:
   - Choose to sign in with Google (for cloud sync) or continue locally
   - Select the pages you've already memorized
   - Assign quality levels to each page

2. **Daily Review**:
   - Open the app to see "Today's Review"
   - Review the selected pages (up to 4 difficulty points)
   - After review, update page qualities based on your performance

3. **Adding New Pages**:
   - Click "Add Pages" to mark newly memorized pages
   - Assign initial quality (usually Bronze)
   - Pages are automatically added to the review cycle

4. **Tracking Progress**:
   - Click "Show Overview" to see detailed statistics
   - View medal distribution and cycle progress
   - Monitor your memorization journey

### Understanding the Review System

The app uses a position-based cycling system:
- Reviews start from your current position in the memorized pages list
- Each day advances the position by the number of pages reviewed
- After reaching the end, it cycles back to the beginning
- This ensures all pages are reviewed regularly

## 🛠️ Technical Stack

- **Frontend**: React 19 with Hooks
- **Build Tool**: Vite
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google provider)
- **Hosting**: Vercel
- **PWA**: Service Worker, Web App Manifest
- **Styling**: CSS-in-JS with CSS Variables

## 📁 Project Structure

```
quran-review-tracker/
├── public/
│   ├── icon-*.png         # PWA icons
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service Worker
├── src/
│   ├── App.jsx           # Main app component
│   ├── EnhancedComponents.jsx # UI components
│   ├── OnboardingFlow.jsx    # New user onboarding
│   ├── firebase.js       # Firebase configuration
│   ├── quranData.js      # Quran data and utilities
│   ├── styles.js         # Styling system
│   ├── useAuth.js        # Authentication hook
│   ├── useOnboarding.js  # Onboarding hook
│   ├── useQuranTracker.js # Core business logic
│   └── useStorage.js     # Storage management
└── index.html
```

## 🔐 Security

- Firebase Security Rules ensure users can only access their own data
- No sensitive data is stored in the client code
- Authentication required for cloud features
- Local storage option for privacy-conscious users

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Quran page data based on the standard Madani Mushaf (604 pages)
- Icons and medal system inspired by gamification best practices
- Built with modern web technologies for optimal user experience

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on [GitHub Issues](https://github.com/firstlast912/quran-review-tracker/issues)
- Check existing issues for solutions

---

Made with ❤️ for the Muslim community to help in Quran memorization journey