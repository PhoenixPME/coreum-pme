'use client';

import * as React from 'react';

export type PaymentMethod = 'XRP' | 'SOLO' | 'COREUM' | 'USDT' | 'Escrow';
export type ConversionType = 'direct' | 'converted';

export interface PaymentOption {
  method: PaymentMethod;
  description: string;
  icon: string;
  color: string;
  feePercent: number;
  settlementTime: string;
  minAmount?: number;
  maxAmount?: number;
}

interface PaymentSelectorProps {
  value: {
    method?: PaymentMethod;
    conversionType?: ConversionType;
    useEscrow?: boolean;
    escrowFeePercent?: number;
  };
  onChange: (payment: {
    method?: PaymentMethod;
    conversionType?: ConversionType;
    useEscrow?: boolean;
    escrowFeePercent?: number;
  }) => void;
}

const PAYMENT_METHODS: PaymentOption[] = [
  {
    method: 'XRP',
    description: 'XRP Ledger Native',
    icon: '⚡',
    color: 'bg-black text-white',
    feePercent: 0.01,
    settlementTime: 'Instant',
    minAmount: 10,
  },
  {
    method: 'SOLO',
    description: 'Sologenic Token',
    icon: '🔷',
    color: 'bg-blue-100 text-blue-800',
    feePercent: 0.02,
    settlementTime: '2-5 minutes',
    minAmount: 25,
  },
  {
    method: 'COREUM',
    description: 'Coreum Network',
    icon: '🟣',
    color: 'bg-purple-100 text-purple-800',
    feePercent: 0.015,
    settlementTime: '1-3 minutes',
    minAmount: 20,
  },
  {
    method: 'USDT',
    description: 'Tether (converted to XRP)',
    icon: '💵',
    color: 'bg-green-100 text-green-800',
    feePercent: 0.03,
    settlementTime: '5-10 minutes',
    minAmount: 50,
  },
];

const ESCROW_OPTIONS = {
  basic: { fee: 1.5, description: 'Basic escrow - 3 business days release' },
  standard: { fee: 2.5, description: 'Standard escrow - 24-hour release' },
  premium: { fee: 3.5, description: 'Premium escrow - Smart contract with arbitration' },
};

export default function PaymentSelector({ value, onChange }: PaymentSelectorProps) {
  const { method, conversionType = 'direct', useEscrow = false, escrowFeePercent = 2.5 } = value;

  const updateField = (field: string, fieldValue: any) => {
    onChange({ ...value, [field]: fieldValue });
  };

  const toggleEscrow = () => {
    const newUseEscrow = !useEscrow;
    updateField('useEscrow', newUseEscrow);
    
    if (newUseEscrow && !method) {
      // Auto-select XRP if enabling escrow without a method
      updateField('method', 'XRP');
    }
  };

  return (
    <div className="space-y-8">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
        <p className="text-sm text-gray-600 mb-4">How would you like to receive payment?</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PAYMENT_METHODS.map((option) => (
            <button
              key={option.method}
              type="button"
              onClick={() => updateField('method', option.method)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border-2
                transition-all duration-200 hover:scale-105 text-center
                ${method === option.method 
                  ? `border-blue-500 ${option.color}`
                  : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }
              `}
            >
              <span className="text-2xl mb-2">{option.icon}</span>
              <span className="font-medium text-sm mb-1">{option.method}</span>
              <span className="text-xs opacity-75">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conversion Type (for USDT) */}
      {method === 'USDT' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">USDT Conversion</h3>
          <p className="text-sm text-gray-600 mb-4">How should USDT be handled?</p>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => updateField('conversionType', 'direct')}
              className={`
                flex flex-col items-center justify-center p-4 rounded-lg border-2
                transition-all duration-200 hover:scale-105 text-center
                ${conversionType === 'direct'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }
              `}
            >
              <span className="text-2xl mb-2">💵→⚡</span>
              <span className="font-medium text-sm mb-1">Auto-convert to XRP</span>
              <span className="text-xs opacity-75">Platform handles conversion</span>
            </button>
            
            <button
              type="button"
              onClick={() => updateField('conversionType', 'converted')}
              className={`
                flex flex-col items-center justify-center p-4 rounded-lg border-2
                transition-all duration-200 hover:scale-105 text-center
                ${conversionType === 'converted'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }
              `}
            >
              <span className="text-2xl mb-2">💵</span>
              <span className="font-medium text-sm mb-1">Receive USDT directly</span>
              <span className="text-xs opacity-75">You handle conversion</span>
            </button>
          </div>
        </div>
      )}

      {/* Escrow Toggle */}
      <div className="bg-gray-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🤝</div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Escrow Protection</h4>
                <p className="text-sm text-gray-600">Secure transaction with third-party holding</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleEscrow}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full
              ${useEscrow ? 'bg-blue-600' : 'bg-gray-200'}
            `}
          >
            <span className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition
              ${useEscrow ? 'translate-x-6' : 'translate-x-1'}
            `} />
          </button>
        </div>

        {useEscrow && (
          <div className="mt-6 space-y-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Escrow Service Level</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(ESCROW_OPTIONS).map(([level, details]) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => updateField('escrowFeePercent', details.fee)}
                    className={`
                      p-4 rounded-lg border-2 text-left transition-all duration-200
                      ${escrowFeePercent === details.fee
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                      }
                    `}
                  >
                    <div className="font-medium capitalize mb-1">{level} Escrow</div>
                    <div className="text-sm opacity-75 mb-2">{details.description}</div>
                    <div className="font-bold text-lg">{details.fee}% fee</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
              <h5 className="font-medium text-blue-800 mb-2">How Escrow Works:</h5>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Buyer sends payment to escrow smart contract</li>
                <li>Seller ships item with tracking</li>
                <li>Buyer confirms receipt and condition</li>
                <li>Escrow releases payment to seller</li>
                <li>Disputes go to PhoenixPME arbitration</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Payment Summary */}
      {method && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {PAYMENT_METHODS.find(m => m.method === method)?.icon}
                </span>
                <div>
                  <div className="font-medium text-gray-900">{method}</div>
                  <div className="text-sm text-gray-600">
                    {PAYMENT_METHODS.find(m => m.method === method)?.description}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-gray-900">
                  {PAYMENT_METHODS.find(m => m.method === method)?.feePercent}% fee
                </div>
                <div className="text-sm text-gray-600">
                  {PAYMENT_METHODS.find(m => m.method === method)?.settlementTime}
                </div>
              </div>
            </div>

            {method === 'USDT' && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Conversion:</span>
                  <span className="font-medium">
                    {conversionType === 'direct' ? 'Auto-convert to XRP' : 'Receive USDT directly'}
                  </span>
                </div>
              </div>
            )}

            {useEscrow && (
              <div className="bg-blue-50 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-blue-800">Escrow Protection</span>
                    <div className="text-sm text-blue-700">
                      {Object.entries(ESCROW_OPTIONS).find(([_, d]) => d.fee === escrowFeePercent)?.[0]} level
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-800">{escrowFeePercent}% fee</div>
                    <div className="text-sm text-blue-700">Added to transaction</div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Total Platform Fees:</span>
                <span className="font-bold text-lg text-gray-900">
                  {PAYMENT_METHODS.find(m => m.method === method)!.feePercent + (useEscrow ? escrowFeePercent : 0)}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Fees are deducted from final settlement amount. Minimum amounts apply.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Information */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
        <h4 className="font-medium text-green-800 mb-2">Payment Security</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• <strong>XRP:</strong> Fastest settlement, lowest fees (0.01%)</li>
          <li>• <strong>SOLO:</strong> Sologenic ecosystem, moderate fees</li>
          <li>• <strong>COREUM:</strong> IBC compatible, smart contract ready</li>
          <li>• <strong>USDT:</strong> Stablecoin option, auto-conversion available</li>
          <li>• <strong>Escrow:</strong> Recommended for high-value items or new buyers</li>
          <li>• All payments settled on-chain with immutable records</li>
        </ul>
      </div>
    </div>
  );
}
