import CreateAuctionForm from '@/components/auctions/CreateAuctionForm';
import WalletConnector from '@/components/WalletConnector';

export default function CreateAuctionPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Header */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: '2rem' }}>🦅</div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937' }}>PhoenixPME</h1>
          </div>
          <WalletConnector />
        </header>

        {/* Main Content */}
        <main>
          <div style={{ 
            background: 'white', 
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden'
          }}>
            <CreateAuctionForm />
          </div>

          {/* Info Panel */}
          <div style={{ 
            marginTop: '2rem',
            padding: '1.5rem',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
              How Auctions Work on PhoenixPME
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🛡️</div>
                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Secure Escrow</h4>
                <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                  Funds held in smart contract until delivery confirmed. No counterparty risk.
                </p>
              </div>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚖️</div>
                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Transparent Bidding</h4>
                <p style={{ color: '#6B7280', fontSize: '0.875' }}>
                  All bids on-chain. No hidden fees. 0% platform fees during bootstrap phase.
                </p>
              </div>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔗</div>
                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Cross-Chain Settlement</h4>
                <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                  Pay with Coreum tokens, XRP, or stablecoins. Physical delivery with tracking.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
