'use client';

import { useState } from 'react';

type MetalType = 'Gold' | 'Silver' | 'Platinum' | 'Palladium' | 'Other';

export default function CreateAuctionForm() {
  const [itemType, setItemType] = useState<MetalType>('Gold');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState(1);
  const [weightUnit, setWeightUnit] = useState<'troy_oz' | 'grams'>('troy_oz');
  const [startingPrice, setStartingPrice] = useState(0);
  const [buyNowPrice, setBuyNowPrice] = useState<number | undefined>(undefined);

  const metalTypes: MetalType[] = ['Gold', 'Silver', 'Platinum', 'Palladium', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Auction created! (Mock for now)');
  };

  return (
    <div style={{ padding: '2rem', background: 'white', borderRadius: '8px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Create Auction</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Metal Type */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2>Metal Type</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {metalTypes.map((metal) => (
              <button
                key={metal}
                type="button"
                onClick={() => setItemType(metal)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: itemType === metal ? '#3b82f6' : '#f3f4f6',
                  color: itemType === metal ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {metal}
              </button>
            ))}
          </div>
        </div>

        {/* Item Name */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Item Name</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px' }}
            placeholder="e.g., 1oz Gold Eagle Coin"
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px' }}
            placeholder="Describe your item..."
          />
        </div>

        {/* Weight */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Weight</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value))}
              style={{ flex: 1, padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px' }}
            />
            <select
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value as 'troy_oz' | 'grams')}
              style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px' }}
            >
              <option value="troy_oz">Troy Ounces</option>
              <option value="grams">Grams</option>
            </select>
          </div>
        </div>

        {/* Pricing */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2>Pricing</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Starting Price (TEST tokens)</label>
            <input
              type="number"
              value={startingPrice}
              onChange={(e) => setStartingPrice(parseFloat(e.target.value))}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Buy Now Price (Optional, TEST tokens)
            </label>
            <input
              type="number"
              value={buyNowPrice || ''}
              onChange={(e) => setBuyNowPrice(e.target.value ? parseFloat(e.target.value) : undefined)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px' }}
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          style={{
            padding: '1rem 2rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Create Auction
        </button>
      </form>
    </div>
  );
}
