#!/bin/bash

echo "=== CLEAN DEPLOYMENT COMMANDS ==="
echo "Copy and paste these ONE LINE commands:"
echo ""

# Single line commands (no backslash continuation)
echo "1. STORE CONTRACT (single line):"
echo "cored tx wasm store phoenix_escrow_optimized.wasm --from your-wallet --chain-id coreum-testnet-1 --gas auto --gas-adjustment 1.3 --node https://full-node.testnet-1.coreum.dev:26657 --broadcast-mode block"
echo ""

echo "2. INSTANTIATE CONTRACT (single line, replace CODE_ID and ADMIN_ADDRESS):"
echo "cored tx wasm instantiate YOUR_CODE_ID '{\"admin\":\"core1youraddresshere\"}' --from your-wallet --label \"phoenix-escrow\" --chain-id coreum-testnet-1 --gas auto --node https://full-node.testnet-1.coreum.dev:26657 --broadcast-mode block"
echo ""

echo "3. TEST QUERY (single line, replace CONTRACT_ADDRESS):"
echo "cored query wasm contract-state smart YOUR_CONTRACT_ADDRESS '{\"get_config\":{}}' --node https://full-node.testnet-1.coreum.dev:26657"
echo ""

echo "=== OR Use Interactive Mode ==="
echo "Run this script step by step:"
echo "./deploy_interactive.sh"
