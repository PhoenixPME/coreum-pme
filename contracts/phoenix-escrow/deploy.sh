#!/bin/bash
echo "=== Phoenix Escrow Contract Deployment ==="
echo ""
echo "1. Build contract:"
cargo wasm
echo ""
echo "2. Check if built successfully:"
ls -lh target/wasm32-unknown-unknown/release/*.wasm
echo ""
echo "3. To deploy to Coreum testnet:"
echo "   a. Store the contract:"
echo "      cored tx wasm store phoenix_escrow.wasm --from <your-wallet> --chain-id coreum-testnet-1 --gas auto --gas-adjustment 1.3"
echo ""
echo "   b. Instantiate the contract:"
echo "      cored tx wasm instantiate <code-id> '{\"admin\":\"<admin-address>\"}' --from <your-wallet> --label \"phoenix-escrow\" --chain-id coreum-testnet-1 --gas auto"
echo ""
echo "4. Test the contract:"
echo "   cargo test"
