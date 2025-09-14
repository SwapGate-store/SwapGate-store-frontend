import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  collection, 
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';

// Get USDT price from admin settings
export async function getUSDTPrice() {
  try {
    const docRef = doc(db, 'admin', 'usdtSettings');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().price || 0;
    } else {
      // Default price if not set
      return 320; // 1 USDT = 320 LKR (placeholder)
    }
  } catch (error) {
    console.error('Error fetching USDT price:', error);
    return 320; // fallback price
  }
}

// Update USDT price (admin function)
export async function updateUSDTPrice(price) {
  try {
    const docRef = doc(db, 'admin', 'usdtSettings');
    await setDoc(docRef, {
      price: parseFloat(price),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating USDT price:', error);
    return false;
  }
}

// Save user checkout data
export async function saveCheckoutData(checkoutData) {
  try {
    const docRef = await addDoc(collection(db, 'user_checkouts'), {
      ...checkoutData,
      createdAt: serverTimestamp(),
      status: 'pending'
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving checkout data:', error);
    throw error;
  }
}

// Save user input summary (without receipt)
export async function saveUserSummary(summaryData) {
  try {
    // Create custom document ID with format: "date - name"
    const currentDate = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
    const sanitizedName = summaryData.name.replace(/[^a-zA-Z0-9\s]/g, '').trim(); // Remove special characters
    const documentId = `${currentDate} - ${sanitizedName}`;
    
    const docRef = doc(db, 'user_summaries', documentId);
    await setDoc(docRef, {
      name: summaryData.name,
      exchangeName: summaryData.exchangeName,
      exchangeId: summaryData.exchangeId,
      usdtAmount: summaryData.usdtAmount,
      selectedBank: summaryData.selectedBank,
      createdAt: serverTimestamp(),
      timestamp: new Date().toISOString()
    });
    
    console.log('User summary saved with ID: ', documentId);
    return documentId;
  } catch (error) {
    console.error('Error saving user summary:', error);
    throw error;
  }
}

// Send data to external API
export async function sendToExternalAPI(orderData) {
  try {
    const formData = new FormData();
    
    // Add all order data to FormData
    Object.keys(orderData).forEach(key => {
      if (orderData[key] !== null && orderData[key] !== undefined) {
        formData.append(key, orderData[key]);
      }
    });

    const response = await fetch(process.env.NEXT_PUBLIC_EXTERNAL_API_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending to external API:', error);
    throw error;
  }
}

// Store Settings Firebase Functions

// Get store mode from Firebase
export async function getStoreMode() {
  try {
    const docRef = doc(db, 'admin', 'storeSettings');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().mode || 'normal';
    } else {
      // Initialize with default mode if not exists
      await updateStoreMode('normal');
      return 'normal';
    }
  } catch (error) {
    console.error('Error fetching store mode:', error);
    return 'normal'; // fallback to normal mode
  }
}

// Update store mode in Firebase
export async function updateStoreMode(mode) {
  try {
    // Validate mode
    if (!['24x7', 'normal', 'closed'].includes(mode)) {
      throw new Error('Invalid store mode');
    }

    const docRef = doc(db, 'admin', 'storeSettings');
    await setDoc(docRef, {
      mode: mode,
      updatedAt: serverTimestamp(),
      updatedBy: 'admin' // You can enhance this with actual user data
    });
    
    console.log('Store mode updated to:', mode);
    return true;
  } catch (error) {
    console.error('Error updating store mode:', error);
    return false;
  }
}

// Subscribe to store mode changes (real-time updates)
export function subscribeToStoreMode(callback) {
  const docRef = doc(db, 'admin', 'storeSettings');
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const mode = docSnap.data().mode || 'normal';
      callback(mode);
    } else {
      // Initialize with default mode if document doesn't exist
      updateStoreMode('normal').then(() => {
        callback('normal');
      });
    }
  }, (error) => {
    console.error('Error listening to store mode changes:', error);
    callback('normal'); // fallback
  });
}