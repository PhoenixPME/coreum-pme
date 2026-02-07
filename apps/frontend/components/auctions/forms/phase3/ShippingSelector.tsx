'use client';

import * as React from 'react';

export type ShippingCarrier = 'USPS' | 'UPS' | 'FedEx' | 'DHL';
export type ShippingSpeed = 'economy' | 'standard' | 'expedited' | 'priority' | 'overnight';
export type PackageType = 'envelope' | 'pak' | 'tube' | 'box' | 'pallet';

export interface ShippingOption {
  carrier: ShippingCarrier;
  service: string;
  speed: ShippingSpeed;
  estimatedDays: number;
  cost: number;
  insuranceIncluded: boolean;
}

interface ShippingSelectorProps {
  value: {
    carrier?: ShippingCarrier;
    speed?: ShippingSpeed;
    packageType?: PackageType;
    insurance?: boolean;
    signatureRequired?: boolean;
    options?: ShippingOption[];
  };
  onChange: (shipping: {
    carrier?: ShippingCarrier;
    speed?: ShippingSpeed;
    packageType?: PackageType;
    insurance?: boolean;
    signatureRequired?: boolean;
    options?: ShippingOption[];
  }) => void;
}

const CARRIER_OPTIONS = [
  { id: 'USPS', label: 'USPS', color: 'bg-blue-100 text-blue-800', icon: '📮', description: 'United States Postal Service' },
  { id: 'UPS', label: 'UPS', color: 'bg-brown-100 text-brown-800', icon: '🚚', description: 'United Parcel Service' },
  { id: 'FedEx', label: 'FedEx', color: 'bg-purple-100 text-purple-800', icon: '✈️', description: 'Federal Express' },
  { id: 'DHL', label: 'DHL', color: 'bg-yellow-100 text-yellow-800', icon: '🌍', description: 'DHL Express' },
] as const;

const SPEED_OPTIONS = [
  { id: 'economy', label: 'Economy', days: '7-10', cost: '$', icon: '🐢' },
  { id: 'standard', label: 'Standard', days: '3-5', cost: '$$', icon: '🚗' },
  { id: 'expedited', label: 'Expedited', days: '2-3', cost: '$$$', icon: '🚄' },
  { id: 'priority', label: 'Priority', days: '1-2', cost: '$$$$', icon: '⚡' },
  { id: 'overnight', label: 'Overnight', days: '1', cost: '$$$$$', icon: '🚀' },
] as const;

const PACKAGE_TYPES = [
  { id: 'envelope', label: 'Envelope', icon: '✉️', maxWeight: 1, dimensions: '12" x 15"' },
  { id: 'pak', label: 'Pak', icon: '📦', maxWeight: 10, dimensions: '16" x 12" x 3"' },
  { id: 'tube', label: 'Tube', icon: '🎁', maxWeight: 20, dimensions: '38" x 6" x 6"' },
  { id: 'box', label: 'Box', icon: '📫', maxWeight: 70, dimensions: '24" x 24" x 24"' },
  { id: 'pallet', label: 'Pallet', icon: '🪵', maxWeight: 1000, dimensions: '48" x 40" x 48"' },
] as const;

// Pre-calculated shipping options based on carrier and speed
const getShippingOptions = (carrier: ShippingCarrier, speed: ShippingSpeed): ShippingOption[] => {
  const baseOptions: Record<ShippingCarrier, Record<ShippingSpeed, ShippingOption>> = {
    USPS: {
      economy: { carrier: 'USPS', service: 'USPS Retail Ground', speed: 'economy', estimatedDays: 7, cost: 12.95, insuranceIncluded: false },
      standard: { carrier: 'USPS', service: 'Priority Mail', speed: 'standard', estimatedDays: 3, cost: 19.95, insuranceIncluded: true },
      expedited: { carrier: 'USPS', service: 'Priority Mail Express', speed: 'expedited', estimatedDays: 2, cost: 34.95, insuranceIncluded: true },
      priority: { carrier: 'USPS', service: 'Priority Mail Express', speed: 'priority', estimatedDays: 1, cost: 49.95, insuranceIncluded: true },
      overnight: { carrier: 'USPS', service: 'Priority Mail Express Overnight', speed: 'overnight', estimatedDays: 1, cost: 64.95, insuranceIncluded: true },
    },
    UPS: {
      economy: { carrier: 'UPS', service: 'UPS Ground', speed: 'economy', estimatedDays: 5, cost: 18.95, insuranceIncluded: false },
      standard: { carrier: 'UPS', service: 'UPS 3-Day Select', speed: 'standard', estimatedDays: 3, cost: 29.95, insuranceIncluded: false },
      expedited: { carrier: 'UPS', service: 'UPS 2nd Day Air', speed: 'expedited', estimatedDays: 2, cost: 39.95, insuranceIncluded: true },
      priority: { carrier: 'UPS', service: 'UPS Next Day Air Saver', speed: 'priority', estimatedDays: 1, cost: 54.95, insuranceIncluded: true },
      overnight: { carrier: 'UPS', service: 'UPS Next Day Air', speed: 'overnight', estimatedDays: 1, cost: 79.95, insuranceIncluded: true },
    },
    FedEx: {
      economy: { carrier: 'FedEx', service: 'FedEx Ground', speed: 'economy', estimatedDays: 5, cost: 21.95, insuranceIncluded: false },
      standard: { carrier: 'FedEx', service: 'FedEx 3Day Freight', speed: 'standard', estimatedDays: 3, cost: 34.95, insuranceIncluded: false },
      expedited: { carrier: 'FedEx', service: 'FedEx 2Day', speed: 'expedited', estimatedDays: 2, cost: 44.95, insuranceIncluded: true },
      priority: { carrier: 'FedEx', service: 'FedEx Standard Overnight', speed: 'priority', estimatedDays: 1, cost: 59.95, insuranceIncluded: true },
      overnight: { carrier: 'FedEx', service: 'FedEx Priority Overnight', speed: 'overnight', estimatedDays: 1, cost: 84.95, insuranceIncluded: true },
    },
    DHL: {
      economy: { carrier: 'DHL', service: 'DHL Economy Select', speed: 'economy', estimatedDays: 8, cost: 24.95, insuranceIncluded: false },
      standard: { carrier: 'DHL', service: 'DHL Express Worldwide', speed: 'standard', estimatedDays: 4, cost: 39.95, insuranceIncluded: true },
      expedited: { carrier: 'DHL', service: 'DHL Express 12:00', speed: 'expedited', estimatedDays: 2, cost: 54.95, insuranceIncluded: true },
      priority: { carrier: 'DHL', service: 'DHL Express 10:30', speed: 'priority', estimatedDays: 1, cost: 69.95, insuranceIncluded: true },
      overnight: { carrier: 'DHL', service: 'DHL Express 9:00', speed: 'overnight', estimatedDays: 1, cost: 94.95, insuranceIncluded: true },
    },
  };

  return [baseOptions[carrier][speed]];
};

export default function ShippingSelector({ value, onChange }: ShippingSelectorProps) {
  const { carrier, speed, packageType, insurance = false, signatureRequired = false, options = [] } = value;

  const updateField = (field: string, fieldValue: any) => {
    const newValue = { ...value, [field]: fieldValue };
    
    // If carrier or speed changed, update options
    if (field === 'carrier' || field === 'speed') {
      const newCarrier = field === 'carrier' ? fieldValue : carrier;
      const newSpeed = field === 'speed' ? fieldValue : speed;
      
      if (newCarrier && newSpeed) {
        newValue.options = getShippingOptions(newCarrier, newSpeed);
      }
    }
    
    onChange(newValue);
  };

  return (
    <div className="space-y-8">
      {/* Carrier Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Carrier</h3>
        <p className="text-sm text-gray-600 mb-4">Select your preferred shipping carrier</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CARRIER_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => updateField('carrier', option.id)}
              className={`
                flex flex-col items-center justify-center p-4 rounded-xl border-2
                transition-all duration-200 hover:scale-105 text-center
                ${carrier === option.id 
                  ? `border-blue-500 ${option.color.replace('100', '50')}`
                  : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                }
              `}
            >
              <span className="text-2xl mb-2">{option.icon}</span>
              <span className="font-medium text-sm mb-1">{option.label}</span>
              <span className="text-xs opacity-75">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Speed Selection */}
      {carrier && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Speed</h3>
          <p className="text-sm text-gray-600 mb-4">How quickly should it arrive?</p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {SPEED_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => updateField('speed', option.id)}
                className={`
                  flex flex-col items-center justify-center p-4 rounded-lg border-2
                  transition-all duration-200 hover:scale-105 text-center
                  ${speed === option.id 
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }
                `}
              >
                <span className="text-2xl mb-2">{option.icon}</span>
                <span className="font-medium text-sm mb-1">{option.label}</span>
                <div className="text-xs space-y-1">
                  <div className="opacity-75">{option.days} days</div>
                  <div className="font-bold">{option.cost}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Package Type */}
      {carrier && speed && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Type</h3>
          <p className="text-sm text-gray-600 mb-4">What are you shipping?</p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {PACKAGE_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => updateField('packageType', type.id)}
                className={`
                  flex flex-col items-center justify-center p-4 rounded-lg border-2
                  transition-all duration-200 hover:scale-105 text-center
                  ${packageType === type.id 
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }
                `}
              >
                <span className="text-2xl mb-2">{type.icon}</span>
                <span className="font-medium text-sm mb-1">{type.label}</span>
                <div className="text-xs space-y-1">
                  <div className="opacity-75">Up to {type.maxWeight} lbs</div>
                  <div className="text-xs opacity-75">{type.dimensions}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Options */}
      {carrier && speed && packageType && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Shipping Options</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Insurance */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="text-lg">🛡️</div>
                    <div>
                      <h4 className="font-medium text-gray-900">Shipping Insurance</h4>
                      <p className="text-sm text-gray-600">Protect your shipment</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('insurance', !insurance)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    ${insurance ? 'bg-blue-600' : 'bg-gray-200'}
                  `}
                >
                  <span className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition
                    ${insurance ? 'translate-x-6' : 'translate-x-1'}
                  `} />
                </button>
              </div>
              {insurance && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    Insurance includes coverage up to $5,000. Additional insurance available.
                  </p>
                </div>
              )}
            </div>

            {/* Signature Required */}
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <div className="text-lg">✍️</div>
                    <div>
                      <h4 className="font-medium text-gray-900">Signature Required</h4>
                      <p className="text-sm text-gray-600">Require delivery signature</p>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('signatureRequired', !signatureRequired)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    ${signatureRequired ? 'bg-blue-600' : 'bg-gray-200'}
                  `}
                >
                  <span className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition
                    ${signatureRequired ? 'translate-x-6' : 'translate-x-1'}
                  `} />
                </button>
              </div>
              {signatureRequired && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-700">
                    Carrier will require recipient signature upon delivery.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shipping Quote */}
      {options.length > 0 && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Quote</h3>
          
          {options.map((option, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {option.carrier === 'USPS' ? '📮' : 
                     option.carrier === 'UPS' ? '🚚' :
                     option.carrier === 'FedEx' ? '✈️' : '🌍'}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{option.carrier} - {option.service}</h4>
                    <p className="text-sm text-gray-600">
                      Est. delivery: {option.estimatedDays} business day{option.estimatedDays !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${option.cost.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">
                    {option.insuranceIncluded ? 'Insurance included' : 'No insurance'}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-white p-2 rounded border text-center">
                  <div className="font-medium">Carrier</div>
                  <div className="text-gray-700">{option.carrier}</div>
                </div>
                <div className="bg-white p-2 rounded border text-center">
                  <div className="font-medium">Speed</div>
                  <div className="text-gray-700">{option.speed}</div>
                </div>
                <div className="bg-white p-2 rounded border text-center">
                  <div className="font-medium">Delivery</div>
                  <div className="text-gray-700">{option.estimatedDays} day{option.estimatedDays !== 1 ? 's' : ''}</div>
                </div>
                <div className="bg-white p-2 rounded border text-center">
                  <div className="font-medium">Package</div>
                  <div className="text-gray-700">{packageType}</div>
                </div>
              </div>
              
              {insurance && (
                <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm text-green-700">
                      Insurance added: $5,000 coverage included
                    </span>
                  </div>
                </div>
              )}
              
              {signatureRequired && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">✓</span>
                    <span className="text-sm text-blue-700">
                      Signature required upon delivery
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="mt-4 text-sm text-gray-600">
            <p>• Prices are estimates for domestic US shipping</p>
            <p>• International shipping available for additional cost</p>
            <p>• Final cost may vary based on actual weight and dimensions</p>
          </div>
        </div>
      )}

      {/* Help Information */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-2">Shipping Guidelines</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>USPS:</strong> Best for smaller packages, PO Box delivery available</li>
          <li>• <strong>UPS:</strong> Reliable ground service, extensive tracking</li>
          <li>• <strong>FedEx:</strong> Fast air service, premium options available</li>
          <li>• <strong>DHL:</strong> International specialist, global network</li>
          <li>• Precious metals should be shipped discreetly and insured</li>
          <li>• Signature required recommended for high-value items</li>
        </ul>
      </div>
    </div>
  );
}
