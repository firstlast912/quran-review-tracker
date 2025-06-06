// useStorage.js - Enhanced Storage management hook with better cloud detection
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

  // Check if user has cloud data
  const hasCloudData = useCallback(async (userId) => {
    if (!userId) return false;
    
    try {
      const cloudData = await getUserData(userId);
      return cloudData && cloudData.memorizedPages && Object.keys(cloudData.memorizedPages).length > 0;
    } catch (error) {
      console.error('Error checking cloud data:', error);
      return false;
    }
  }, []);

  // Load data from appropriate source
  const loadData = useCallback(async (key, defaultValue) => {
    try {
      // If user is signed in, check cloud first
      if (user) {
        const useCloud = localStorage.getItem('useCloudSync') === 'true';
        
        // For signed-in users, check if they have cloud data
        if (!useCloud) {
          const hasData = await hasCloudData(user.uid);
          if (hasData) {
            // Auto-enable cloud sync for users with existing cloud data
            console.log('Found existing cloud data, enabling cloud sync');
            localStorage.setItem('useCloudSync', 'true');
            setIsCloudSync(true);
            
            // Load from Firebase
            const userData = await getUserData(user.uid);
            console.log(`Loaded ${key} from cloud:`, userData?.[key]);
            return userData?.[key] !== undefined ? userData[key] : defaultValue;
          }
        } else {
          // User has cloud sync enabled, load from Firebase
          const userData = await getUserData(user.uid);
          console.log(`Loaded ${key} from cloud:`, userData?.[key]);
          return userData?.[key] !== undefined ? userData[key] : defaultValue;
        }
      }
      
      // Load from localStorage for non-signed-in users or users without cloud data
      const stored = localStorage.getItem(key);
      const parsed = stored ? JSON.parse(stored) : defaultValue;
      console.log(`Loaded ${key} from localStorage:`, parsed);
      return parsed;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      // Fallback to localStorage
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    }
  }, [user, hasCloudData]);

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
  const saveAllData = useCallback(async (dataObject, immediate = false) => {
    try {
      setSyncStatus('syncing');
      
      // For immediate saves, log it
      if (immediate) {
        console.log('Immediate save requested for:', Object.keys(dataObject));
      }
      
      if (user && isCloudSync) {
        // Add timestamp to ensure data is fresh
        const dataWithTimestamp = {
          ...dataObject,
          lastUpdated: new Date().toISOString()
        };
        
        await saveUserData(user.uid, dataWithTimestamp);
        console.log('Data saved to cloud successfully');
      } else {
        // Save each piece to localStorage
        Object.entries(dataObject).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
        console.log('Data saved to localStorage successfully');
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
      
      // Check if user already has cloud data
      const hasExistingData = await hasCloudData(user.uid);
      
      if (hasExistingData) {
        // User has cloud data, don't overwrite - ask them to resolve conflict
        const cloudData = await getUserData(user.uid);
        setSyncStatus('idle');
        return {
          success: false,
          conflict: true,
          cloudData,
          localData
        };
      }
      
      // No cloud data, safe to migrate
      await saveUserData(user.uid, localData);
      
      // Switch to cloud sync
      setIsCloudSync(true);
      localStorage.setItem('useCloudSync', 'true');
      
      setSyncStatus('idle');
      return { success: true };
    } catch (error) {
      console.error('Error migrating to cloud:', error);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
      return { success: false, error: error.message };
    }
  }, [user, hasCloudData]);

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
        console.log('Received cloud update:', {
          currentPosition: cloudData.currentPosition,
          lastReviewDate: cloudData.lastReviewDate,
          memorizedPagesCount: Object.keys(cloudData.memorizedPages || {}).length,
          reviewHistoryCount: (cloudData.reviewHistory || []).length
        });
        
        // Prevent infinite loops by checking if data actually changed
        const cloudDataString = JSON.stringify(cloudData);
        if (lastCloudUpdateRef.current === cloudDataString) {
          console.log('Cloud data unchanged, skipping update');
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
    const checkCloudStatus = async () => {
      if (user) {
        // First check if user has cloud data
        const hasData = await hasCloudData(user.uid);
        
        if (hasData) {
          // User has cloud data, auto-enable sync
          console.log('User has existing cloud data, enabling cloud sync');
          setIsCloudSync(true);
          localStorage.setItem('useCloudSync', 'true');
        } else {
          // Check local preference
          const useCloud = localStorage.getItem('useCloudSync') === 'true';
          setIsCloudSync(useCloud);
        }
      } else {
        // User signed out, switch to local
        setIsCloudSync(false);
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      }
    };
    
    checkCloudStatus();
  }, [user, hasCloudData]);

  return {
    loadData,
    saveData,
    saveAllData,
    migrateToCloud,
    switchToLocal,
    isCloudSync,
    syncStatus,
    registerCloudUpdateCallback,
    hasCloudData,
  };
};