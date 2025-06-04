// useStorage.js - Storage management hook (localStorage + Firebase) with real-time sync
import { useState, useEffect, useCallback, useRef } from 'react';
import { saveUserData, getUserData, subscribeToUserData } from './firebase.js';

export const useStorage = (user) => {
  const [isCloudSync, setIsCloudSync] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle', 'syncing', 'error'
  const [cloudUpdateCallbacks, setCloudUpdateCallbacks] = useState({});
  const unsubscribeRef = useRef(null);
  const lastCloudUpdateRef = useRef(null);

  // Register callbacks for real-time updates
  const registerCloudUpdateCallback = useCallback((key, callback) => {
    setCloudUpdateCallbacks(prev => ({
      ...prev,
      [key]: callback
    }));
  }, []);

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
      return { success: true };
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      setSyncStatus('error');
      
      // Fallback to localStorage
      localStorage.setItem(key, JSON.stringify(value));
      
      // Reset error status after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000);
      return { success: false, error: error.message };
    }
  }, [user, isCloudSync]);

  // Batch save all data at once (more efficient for real-time sync)
  const saveAllData = useCallback(async (dataObject) => {
    try {
      setSyncStatus('syncing');
      
      if (user && isCloudSync) {
        await saveUserData(user.uid, dataObject);
      } else {
        // Save each piece to localStorage
        Object.entries(dataObject).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
      }
      
      setSyncStatus('idle');
      return { success: true };
    } catch (error) {
      console.error('Error saving data:', error);
      setSyncStatus('error');
      
      // Fallback to localStorage
      Object.entries(dataObject).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
      
      setTimeout(() => setSyncStatus('idle'), 3000);
      return { success: false, error: error.message };
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
    // Clean up real-time listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    
    setIsCloudSync(false);
    localStorage.setItem('useCloudSync', 'false');
  }, []);

  // Setup real-time listener when user signs in and cloud sync is enabled
  useEffect(() => {
    if (user && isCloudSync) {
      console.log('Setting up real-time listener for user:', user.uid);
      
      const unsubscribe = subscribeToUserData(user.uid, (cloudData) => {
        console.log('Received cloud update:', cloudData);
        
        // Prevent infinite loops by checking if data actually changed
        const cloudDataString = JSON.stringify(cloudData);
        if (lastCloudUpdateRef.current === cloudDataString) {
          return;
        }
        lastCloudUpdateRef.current = cloudDataString;
        
        // Call all registered callbacks with the new data
        Object.entries(cloudUpdateCallbacks).forEach(([key, callback]) => {
          if (cloudData[key] !== undefined) {
            console.log(`Updating ${key} from cloud:`, cloudData[key]);
            callback(cloudData[key]);
          }
        });
      });
      
      unsubscribeRef.current = unsubscribe;
      
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } else {
      // Clean up listener if not using cloud sync
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    }
  }, [user, isCloudSync, cloudUpdateCallbacks]);

  // Check cloud sync preference on user change
  useEffect(() => {
    if (user) {
      // Check if user previously enabled cloud sync
      const useCloud = localStorage.getItem('useCloudSync') === 'true';
      setIsCloudSync(useCloud);
    } else {
      // User signed out, switch to local
      setIsCloudSync(false);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    }
  }, [user]);

  return {
    loadData,
    saveData,
    saveAllData, // New: batch save function
    migrateToCloud,
    switchToLocal,
    isCloudSync,
    syncStatus,
    registerCloudUpdateCallback, // New: register callbacks for real-time updates
  };
};