// useAuth.js - Authentication hook
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signOutUser, saveUserData, getUserData, subscribeToUserData } from './firebase.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSignInBanner, setShowSignInBanner] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
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
      return user;
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

  const syncLocalDataToCloud = async (localData) => {
    if (!user) return;
    
    try {
      // Get existing cloud data
      const cloudData = await getUserData(user.uid);
      
      if (!cloudData) {
        // No cloud data exists, upload local data
        await saveUserData(user.uid, localData);
        return localData;
      } else {
        // Cloud data exists, user should choose which to keep
        return { cloudData, localData, needsResolution: true };
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
  };
};