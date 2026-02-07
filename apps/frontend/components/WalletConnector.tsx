'use client';

import { useState, useEffect } from 'react';

export default function WalletConnector() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [leapAvailable, setLeapAvailable] = useState(false);

  useEffect(() => {
    // Simpler check - just see if Leap exists
    setLeapAvailable(!!window.leap);
    
    // Check for saved address
    const saved = localStorage.getItem('phoenix_wallet');
    if (saved) setAddress(saved);
  }, []);

  const connectWallet = async () => {
    if (!leapAvailable) {
      alert('Please install Leap Wallet from https://leapwallet.io');
      window.open('https://leapwallet.io', '_blank');
      return;
    }

    setLoading(true);
    try {
      // Try different Leap APIs
      if (window.leap.getOfflineSigner) {
        // Cosmos mode
        const signer = window.leap.getOfflineSigner('coreum-testnet-1');
        const accounts = await signer.getAccounts();
        if (accounts.length > 0) {
          const addr = accounts[0].address;
          setAddress(addr);
          localStorage.setItem('phoenix_wallet', addr);
        }
      } else if (window.leap.request) {
        // Standard mode
        const accounts = await window.leap.request({
          method: 'cosmos_requestAccounts',
          params: { chainId: 'coreum-testnet-1' }
        });
        if (accounts && accounts.length > 0) {
          const addr = accounts[0].address;
          setAddress(addr);
          localStorage.setItem('phoenix_wallet', addr);
        }
      } else {
        alert('Leap installed but API not found. Try switching to Cosmos mode.');
      }
    } catch (error) {
      console.error('Leap error:', error);
      alert('Connection failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAddress('');
    localStorage.removeItem('phoenix_wallet');
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return addr.substring(0, 10) + '...' + addr.substring(addr.length - 6);
  };

  // Show Install button if Leap not available
  if (!leapAvailable) {
    return (
      <button
        onClick={() => window.open('https://leapwallet.io', '_blank')}
        style={{
          padding: '10px 20px',
          background: '#666',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Install Leap
      </button>
    );
  }

  // Show connection buttons if Leap is available
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      {address ? (
        <>
          <div style={{ 
            padding: '8px 16px', 
            background: '#2a2a2a', 
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '14px',
            color: 'white'
          }}>
            {formatAddress(address)}
          </div>
          <button
            onClick={disconnectWallet}
            style={{
              padding: '8px 16px',
              background: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Disconnect
          </button>
        </>
      ) : (
        <button
          onClick={connectWallet}
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
}
