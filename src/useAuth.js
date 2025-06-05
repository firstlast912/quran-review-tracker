// useAuth.js - Enhanced Authentication hook
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signOutUser, saveUserData, getUserData } from './firebase.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignInBanner, setShowSignInBanner] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      // If user is signed in, check if they have cloud data
      if (user) {
        try {
          const cloudData = await getUserData(user.uid);
          // If user has cloud data, auto-enable cloud sync
          if (cloudData && cloudData.memorizedPages) {
            localStorage.setItem('useCloudSync', 'true');
          }
        } catch (error) {
          console.error('Error checking cloud data:', error);
        }
      }
      
      setLoading(false);
      
      // Show sign-in banner for new users (not signed in and no stored preference)
      if (!user && !localStorage.getItem('hideSignInBanner')) {
        setShowSignInBanner(true);
      }
    });

    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const user = await signInWithGoogle();
      setShowSignInBanner(false);
      
      // Check if user has existing cloud data
      const hasExistingData = await checkExistingUser(user.uid);
      
      return { user, hasExistingData };
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOutUser();
      // Reset cloud sync preference on sign out
      localStorage.removeItem('useCloudSync');
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const dismissSignInBanner = () => {
    setShowSignInBanner(false);
    localStorage.setItem('hideSignInBanner', 'true');
  };

  const checkExistingUser = async (userId) => {
    try {
      const cloudData = await getUserData(userId);
      
      // Check if user has meaningful data
      if (cloudData) {
        // Check if they have memorized pages
        if (cloudData.memorizedPages && Object.keys(cloudData.memorizedPages).length > 0) {
          return {
            hasData: true,
            data: cloudData,
            pageCount: Object.keys(cloudData.memorizedPages).length
          };
        }
        
        // Check if they've completed onboarding
        if (cloudData.onboardingComplete) {
          return {
            hasData: true,
            data: cloudData,
            onboardingComplete: true
          };
        }
      }
      
      return {
        hasData: false,
        data: null
      };
    } catch (error) {
      console.error('Error checking existing user:', error);
      return {
        hasData: false,
        data: null,
        error: error.message
      };
    }
  };

  const syncLocalDataToCloud = async (localData) => {
    if (!user) return null;
    
    try {
      // Get existing cloud data
      const existingCheck = await checkExistingUser(user.uid);
      
      if (!existingCheck.hasData) {
        // No cloud data exists, upload local data
        await saveUserData(user.uid, localData);
        localStorage.setItem('useCloudSync', 'true');
        return { 
          synced: true, 
          localData,
          action: 'uploaded'
        };
      } else {
        // Cloud data exists
        const cloudData = existingCheck.data;
        
        // Compare data to determine if there's a real conflict
        const localPageCount = Object.keys(localData.memorizedPages || {}).length;
        const cloudPageCount = Object.keys(cloudData.memorizedPages || {}).length;
        
        // If local has no data, just use cloud
        if (localPageCount === 0) {
          localStorage.setItem('useCloudSync', 'true');
          return {
            synced: true,
            cloudData,
            action: 'used-cloud'
          };
        }
        
        // If cloud has no data, upload local
        if (cloudPageCount === 0) {
          await saveUserData(user.uid, localData);
          localStorage.setItem('useCloudSync', 'true');
          return {
            synced: true,
            localData,
            action: 'uploaded'
          };
        }
        
        // Both have data - need user to choose
        return { 
          cloudData, 
          localData, 
          needsResolution: true,
          localPageCount,
          cloudPageCount
        };
      }
    } catch (error) {
      console.error('Error syncing data:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    showSignInBanner,
    handleSignIn,
    handleSignOut,
    dismissSignInBanner,
    syncLocalDataToCloud,
    checkExistingUser,
  };
};