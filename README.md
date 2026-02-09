# PhoenixPME - Precious Metals Exchange

## Overview
Blockchain-based auction platform for physical precious metals with integrated insurance funding mechanism.

## Core Components

### 1. Auction Platform
- **Purpose**: Peer-to-peer trading of physical precious metals
- **Fee**: 1.1% per successful transaction
- **Features**:
  - Buy It Now & bidding functionality
  - Real-time market data integration
  - Seller-set grading premiums
  - Coreum blockchain settlement

### 2. Fee Distribution & Escrow Structure
Every transaction collects 1.1% which goes to a **single RLUSD escrow account** on XRPL:

**From each 1.1% fee collected:**
- **Entire 1.1%** → Single RLUSD escrow pool
- **Developer entitlement**: 10% of total escrow pool
- **Effective developer allocation**: ~0.2% of transaction volume
  - 0.1% direct allocation
  - Additional ~0.1% from 10% pool entitlement

### 3. Insurance Module (Future)
- **Activation**: When RLUSD escrow reaches sufficient capital
- **Purpose**: Provide blockchain-based insurance for precious metals
- **Control**: Developer retains 10% entitlement from pool
- **Rate**: Will be competitive with traditional insurance (exact % TBD)

## Technical Implementation
- **Single escrow account**: All 1.1% fees accumulate here
- **Developer access**: 10% entitlement via smart contract logic
- **Insurance capital**: Remaining 90% funds future insurance program
- **Transparency**: All allocations verifiable on XRPL ledger

## Technical Architecture
- **Frontend**: React/TypeScript (port 3000)
- **Backend**: Express.js/PostgreSQL (port 3001)
- **Blockchain**: Coreum (CosmWasm smart contracts)
- **Insurance Services**: Ports 3200-3204 (calculator, risk assessment, quotes, RLUSD monitor)

## Current Status
- ✅ Auction platform functional (http://localhost:3000)
- ✅ Backend API operational (http://localhost:3001)
- ✅ Insurance module services ready (ports 3200-3204)
- 🔄 RLUSD escrow: Building capital (0 → 50,000 RLUSD goal)
- 🔄 Smart contract deployment: In progress

## Development
- **Repository**: https://github.com/PhoenixPME/coreum-pme
- **Primary Developer**: Greg (@greg-gzillion)
- **Contact**: gjf20842@gmail.com

## Key Files
- `apps/frontend/` - Auction interface
- `apps/backend/` - API server
- `apps/insurance-module/` - Insurance services
- `contracts/` - Coreum smart contracts
- `legal/` - License and commercial terms

## Notes
- Platform fee (1.1%) is mandatory in all implementations
- All fees accumulate in single RLUSD escrow on XRPL
- Developer entitled to 10% of escrow pool (~0.2% effective rate)
- Insurance module activates automatically when RLUSD escrow reaches threshold
- Built for Coreum blockchain, compatible with upcoming tx (Coreum + Sologenic)
