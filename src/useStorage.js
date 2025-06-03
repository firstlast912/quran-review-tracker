// useStorage.js - Storage management hook (localStorage + Firebase)
import { useState, useEffect, useCallback } from 'react';
import { saveUserData, getUserData, subscribeToUserData } from './firebase.js';

export const useStorage = (user) => {
  const [isCloudSync, setIsCloudSync] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'error'

  // Load data from appropriate source
  const loadData = useCallback(async (key, defaultValue) => {
    try {
      if (user && isCloudSync) {
        // Load from Firebase
        const userData = await getUserData(user.uid);
        return userData?.[key] || defaultValue;
      } else {
        // Load from localStorage
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
      }
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      // Fallback to localStorage
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    }
  }, [user, isCloudSync]);

  // Save data to appropriate source
  const saveData = useCallback(async (key, value) => {
    try {
      setSyncStatus('syncing');
      
      if (user && isCloudSync) {
        // Save to Firebase
        await saveUserData(user.uid, { [key]: value });
      } else {
        // Save to localStorage
        localStorage.setItem(key, JSON.stringify(value));
      }
      
      setSyncStatus('idle');
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      setSyncStatus('error');
      
      // Fallback to localStorage
      localStorage.setItem(key, JSON.stringify(value));
      
      // Reset error status after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  }, [user, isCloudSync]);

  // Migrate from localStorage to Firebase
  const migrateToCloud = useCallback(async (localData) => {
    if (!user) return;
    
    try {
      setSyncStatus('syncing');
      
      // Save all local data to Firebase
      await saveUserData(user.uid, localData);
      
      // Switch to cloud sync
      setIsCloudSync(true);
      localStorage.setItem('useCloudSync', 'true');
      
      setSyncStatus('idle');
    } catch (error) {
      console.error('Error migrating to cloud:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  }, [user]);

  // Switch back to local storage
  const switchToLocal = useCallback(() => {
    setIsCloudSync(false);
    localStorage.setItem('useCloudSync', 'false');
  }, []);

  // Setup real-time sync when user signs in
  useEffect(() => {
    if (user) {
      // Check if user previously enabled cloud sync
      const useCloud = localStorage.getItem('useCloudSync') === 'true';
      setIsCloudSync(useCloud);
      
      if (useCloud) {
        // Setup real-time listener
        const unsubscribe = subscribeToUserData(user.uid, (data) => {
          // Handle real-time updates here
          // This would trigger a callback to update the main app state
        });
        
        return unsubscribe;
      }
    } else {
      // User signed out, switch to local
      setIsCloudSync(false);
    }
  }, [user]);

  return {
    loadData,
    saveData,
    migrateToCloud,
    switchToLocal,
    isCloudSync,
    syncStatus,
  };
};