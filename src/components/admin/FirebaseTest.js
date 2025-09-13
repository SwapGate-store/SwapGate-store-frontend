'use client'

import { useState } from 'react';
import { useUSDT } from '@/context/USDTContext';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function FirebaseTest() {
  const { 
    availableUSDT, 
    priceRanges, 
    isLoading, 
    updateAvailableUSDT, 
    updatePriceRanges, 
    refreshData 
  } = useUSDT();
  
  const [testValue, setTestValue] = useState('');

  const testFirebaseWrite = async () => {
    try {
      const result = await updateAvailableUSDT(parseFloat(testValue) || 5000);
      if (result.success) {
        toast.success('Firebase write test successful!');
      } else {
        toast.error('Firebase write test failed!');
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
  };

  const testFirebaseRead = async () => {
    try {
      await refreshData();
      toast.success('Firebase read test successful!');
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
  };

  if (isLoading) {
    return <div>Loading Firebase test...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border-2 border-yellow-200">
      <h3 className="text-lg font-semibold mb-4 text-yellow-700">🧪 Firebase Integration Test</h3>
      
      <div className="space-y-4">
        <div>
          <p><strong>Current Available USDT:</strong> {availableUSDT}</p>
          <p><strong>Price Ranges Count:</strong> {priceRanges.length}</p>
          <p><strong>Loading State:</strong> {isLoading ? 'Loading...' : 'Ready'}</p>
        </div>

        <div className="flex gap-2">
          <input
            type="number"
            value={testValue}
            onChange={(e) => setTestValue(e.target.value)}
            placeholder="Test USDT value"
            className="border p-2 rounded text-black"
          />
          <Button onClick={testFirebaseWrite} size="sm">
            Test Write
          </Button>
          <Button onClick={testFirebaseRead} variant="secondary" size="sm">
            Test Read
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          <p>• Enter a test value and click &quot;Test Write&quot; to save to Firebase</p>
          <p>• Click &quot;Test Read&quot; to refresh data from Firebase</p>
          <p>• Check console for detailed Firebase operation logs</p>
        </div>
      </div>
    </div>
  );
}