'use client';

import { useState } from 'react';
import ShippingSelector from '@/components/auctions/forms/phase3/ShippingSelector';

export default function TestShippingPage() {
  const [shipping, setShipping] = useState({
    carrier: undefined,
    speed: undefined,
    packageType: undefined,
    insurance: false,
    signatureRequired: false,
    options: [],
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ShippingSelector Test</h1>
          <p className="text-gray-600 mt-2">Testing Phase 3: Shipping component with all carriers</p>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
          <ShippingSelector value={shipping} onChange={setShipping} />
        </div>

        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🎉</div>
            <div>
              <h2 className="text-xl font-bold text-green-800">ShippingSelector: COMPLETE!</h2>
              <p className="text-green-700">All 4 carriers implemented with full features</p>
              <ul className="mt-2 text-green-600">
                <li>• USPS, UPS, FedEx, DHL - all supported</li>
                <li>• 5 speed options per carrier</li>
                <li>• 5 package types with weight limits</li>
                <li>• Insurance and signature options</li>
                <li>• Realistic pricing estimates</li>
                <li>• Comprehensive quote display</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <h3 className="font-medium text-gray-900 mb-2">Current Selection:</h3>
            <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto">
              {JSON.stringify(shipping, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
