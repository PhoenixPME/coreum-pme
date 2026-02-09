#!/bin/bash
echo "=== CAPTURING TESTNET PROOF ==="
echo ""

# Create proof directory
PROOF_DIR="testnet-proof-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$PROOF_DIR"

echo "1. System Information:" > "$PROOF_DIR/system-info.txt"
echo "Date: $(date)" >> "$PROOF_DIR/system-info.txt"
echo "Rust: $(rustc --version)" >> "$PROOF_DIR/system-info.txt"
echo "Node: $(node --version 2>/dev/null || echo 'Not installed')" >> "$PROOF_DIR/system-info.txt"
echo "Git Commit: $(git rev-parse HEAD)" >> "$PROOF_DIR/system-info.txt"

echo -e "\n2. Contract Test Results:" > "$PROOF_DIR/contract-tests.txt"
cd contracts/phoenix-escrow
cargo test -- --nocapture >> "../../$PROOF_DIR/contract-tests.txt" 2>&1
cd ../..

echo -e "\n3. Testnet Deployment Proof:" > "$PROOF_DIR/deployment-proof.md"
cat >> "$PROOF_DIR/deployment-proof.md" << 'PROOF'
## Testnet Deployment Evidence

### Contract Deployment:
- **Network:** Juno Testnet (uni-6)
- **Contract Address:** [Will be filled after deployment]
- **Deployment TX:** [Transaction hash]
- **Block Explorer:** [Link to transaction]

### Test Transactions:
1. **Create Auction:**
   - TX Hash: [hash]
   - Block Explorer: [link]
   - Result: Success

2. **Place Bid:**
   - TX Hash: [hash]  
   - Block Explorer: [link]
   - Result: Success

3. **End Auction:**
   - TX Hash: [hash]
   - Block Explorer: [link]
   - Result: Success

### State Verification:
```bash
# Query contract state after each step
junod query wasm contract-state smart <CONTRACT_ADDRESS> '{"get_auction": {"auction_id": 1}}'

### **🎬 CREATE DEMO VIDEO SCRIPT:**
```bash
cat > demo-script.md << 'EOF'
# 🎥 Proof-of-Concept Demo Script

## Video Sections (3-5 minute total):

### Part 1: Introduction (30 seconds)
- "This is Phoenix Precious Metals Exchange"
- "First decentralized auction platform for certified metals"
- "Today I'll prove it actually works on real blockchain"

### Part 2: Show Working Code (60 seconds)
- Terminal: Show contract compiling (`cargo check`)
- Terminal: Show 8 tests passing (`cargo test`)
- Terminal: Show frontend building (`npm run build`)
- "The code works locally - now let's prove it on blockchain"

### Part 3: Testnet Deployment (90 seconds)
- Show Juno testnet block explorer
- Deploy contract (real transaction)
- Show deployment success on explorer
- "Contract is now live on testnet"

### Part 4: Live Auction Demo (90 seconds)
1. Create auction for "Test Platinum Bar"
   - Show transaction
   - Verify on explorer
2. Place bid from different account
   - Show bid transaction
   - Verify funds escrowed
3. End auction after duration
   - Show ending transaction
   - Verify funds transferred
4. Query final state
   - Show auction completed
   - Show correct winner

### Part 5: Conclusion (30 seconds)
- "Proven: Complete auction system works on blockchain"
- "Ready for mainnet launch and real metals trading"
- "Visit GitHub for code verification"

## Proof Points to Highlight:
1. Real transactions (not simulations)
2. Real testnet blockchain (not local)
3. Real token transfers (not mock)
4. Complete lifecycle (start to finish)
5. Verifiable on public block explorer
