🦅 coreum-pme: Phoenix Precious Metals Exchange
Decentralized P2P precious metals trading on Coreum & XRPL

🚀 Quick Start for Contributors
Read: Async Communication Protocol - Our no-talk workflow
Review: Contribution Scorecard - How contributions are evaluated
Pick Task: PROJECTS_NEW.md - Open tasks needing implementation
Submit PR: Fork repo and submit pull request
Earn: Grants via CONTRIBUTOR_GUIDE.md
📚 Documentation
State Machine Specification - Core protocol logic
Development Roadmap - Mermaid Gantt timeline
Technical FAQ - Common questions
DAO Operations - Governance & fee model (0% → 0.03%)
Tokenomics - Governance token design
🏗️ Project Phases
✅ Phase 6: Backend Integration - COMPLETE 🎉
Delivered: 8 components (~1,200 lines) Components: Authentication System, User Controller, Auction Controller, Bidding System, Database Models, Middleware, PostgreSQL Database, API Server Features: Complete REST API with JWT auth, auction management, bidding system, PostgreSQL database Full Documentation: docs/PHASE_6_BACKEND_INTEGRATION.md

✅ Phase 5: Admin Dashboard System - COMPLETE
Delivered: 6 components (4,106 lines) Components: Auction Management, User Management, Transaction Monitoring, Dispute Resolution, Analytics & Reporting, API Management Features: Complete admin platform for monitoring, management, analytics, and security Full Documentation

✅ Phase 4: Checkout & Payment Processing - COMPLETE
Delivered: 5 components (1,850 lines) Components: OrderSummary, ConfirmationStep, PaymentProcessor, ReceiptGenerator, EmailNotifications Features: Complete checkout flow, multi-wallet payment, receipt generation, email notifications Full Documentation

✅ Phase 3: Shipping & Payment - COMPLETE
Delivered: 4 components (1,400 lines): ShippingSelector, PaymentSelector, CurrencyConverter, EscrowTerms Features: rUSD stablecoin, real-time conversion, complete shipping, smart escrow

✅ Phase 2: Auction Interface - COMPLETE
Delivered: Core auction components and UI

✅ Phase 1: Project Foundation - COMPLETE
Delivered: Repository setup, documentation, project structure

📊 Project Statistics
Total Lines of Code: 7,156+ (Phases 1-6) Components Built: 23+ Status: Ready for Phase 7 - Blockchain Integration

🔄 Current Phase: Phase 7 - Blockchain Integration
Status: Planning Components Needed:

Coreum Smart Contracts for auction escrow
XRPL Payment integration
Wallet connectivity (Keplr, Xumm, GemWallet)
Tokenization of precious metals
Blockchain event listeners
💬 Community & Discussion
All communication is async and written-only:

Discussions - Q&A, ideas, announcements
Issues - Bug reports & feature requests
Email: gjf20842@gmail.com (for serious collaboration inquiries)
🛠️ Technical Stack
Frontend: React, TypeScript, Tailwind CSS (5,956 lines complete)
Backend: Express.js, TypeScript, PostgreSQL, Prisma (~1,200 lines complete)
Blockchain: Coreum (CosmWasm), XRPL
Wallets: Keplr (Coreum), Xumm (XRPL), GemWallet (EVM)
Design: Mobile-first, responsive, professional UI
🎯 Immediate Next Steps
Phase 7 Planning: Blockchain architecture design
Smart Contracts: Coreum CosmWasm contracts for escrow
Wallet Integration: Connect Keplr, Xumm, GemWallet
Payment Processing: XRPL payment integration
Token Bridge: Cross-chain asset transfers
📈 Progress Summary
✅ Frontend UI complete (15+ components)
✅ Admin dashboard complete (6 components)
✅ Checkout flow complete (5 components)
✅ Auction interface complete
✅ Backend API complete (8 components)
⏳ Smart contracts needed
⏳ Production deployment needed
Ready for blockchain integration to enable decentralized trading!

About
Decentralized P2P precious metals trading protocol specification

Topics
open-source gold silver tokenization auctions platinum precious-metals defi xrpl rwa cosmwasm freetrade cosmos-ecosystem coreum freebay sologenic
Resources
 Readme
License
 GPL-3.0 license
Contributing
 Contributing
 Activity
 Custom properties
Stars
 0 stars
Watchers
 0 watching
Forks
 0 forks
 Audit log
Report repository
Releases
 1 tags
Create a new release
Packages
No packages published
Publish your first package
Contributors
2
@gjf24104
gjf24104
@greg-gzillion
greg-gzillion
Languages
TypeScript
93.7%
 
Rust
4.4%
 
Shell
1.5%
 
Other
0.4%
## 🚀 Current Status: Targeting tx Blockchain

Phoenix Precious Metals Exchange is now being developed for the upcoming **tx blockchain** (Coreum + Sologenic merger).

### ✅ Completed
- Frontend UI (React/TypeScript/Tailwind)
- Backend API (Express.js/PostgreSQL)
- Admin Dashboard
- Checkout & Payment Flows
- Smart Contract Foundation (`phoenix-escrow`)

### 🔄 In Progress
- Completing escrow auction smart contract
- Multi-chain deployment setup (Juno → Coreum → tx)
- Security audit preparation

### 🎯 tx Launch Ready
Our architecture is CosmWasm-based and will deploy to tx testnet upon launch.

### 🔧 Development Workflow
- All code merged via protected Pull Requests
- Automated CI/CD testing on every commit
- Security vulnerability reporting via SECURITY.md
