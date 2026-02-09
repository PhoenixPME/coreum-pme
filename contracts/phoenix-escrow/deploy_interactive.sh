#!/bin/bash

echo "=== INTERACTIVE DEPLOYMENT ==="
echo ""

# Step 1: Store
read -p "Step 1: Store contract? (y/n): " store
if [ "$store" = "y" ]; then
    echo ""
    echo "Running: cored tx wasm store phoenix_escrow_optimized.wasm --from your-wallet --chain-id coreum-testnet-1 --gas auto --gas-adjustment 1.3 --node https://full-node.testnet-1.coreum.dev:26657 --broadcast-mode block"
    echo ""
    echo "⚠️  ACTUAL COMMAND (copy and run manually):"
    echo "cored tx wasm store phoenix_escrow_optimized.wasm --from your-wallet --chain-id coreum-testnet-1 --gas auto --gas-adjustment 1.3 --node https://full-node.testnet-1.coreum.dev:26657 --broadcast-mode block"
    echo ""
    read -p "After running, enter the CODE_ID from output: " code_id
fi

# Step 2: Instantiate
read -p "Step 2: Instantiate contract? (y/n): " instantiate
if [ "$instantiate" = "y" ] && [ -n "$code_id" ]; then
    read -p "Enter admin address (core1...): " admin_addr
    echo ""
    echo "Running: cored tx wasm instantiate $code_id '{\"admin\":\"$admin_addr\"}' --from your-wallet --label \"phoenix-escrow\" --chain-id coreum-testnet-1 --gas auto --node https://full-node.testnet-1.coreum.dev:26657 --broadcast-mode block"
    echo ""
    echo "⚠️  ACTUAL COMMAND (copy and run manually):"
    echo "cored tx wasm instantiate $code_id '{\"admin\":\"$admin_addr\"}' --from your-wallet --label \"phoenix-escrow\" --chain-id coreum-testnet-1 --gas auto --node https://full-node.testnet-1.coreum.dev:26657 --broadcast-mode block"
    echo ""
    read -p "After running, enter the CONTRACT_ADDRESS from output: " contract_addr
fi

# Step 3: Test
read -p "Step 3: Test query? (y/n): " test
if [ "$test" = "y" ] && [ -n "$contract_addr" ]; then
    echo ""
    echo "Running: cored query wasm contract-state smart $contract_addr '{\"get_config\":{}}' --node https://full-node.testnet-1.coreum.dev:26657"
    echo ""
    echo "⚠️  ACTUAL COMMAND (copy and run manually):"
    echo "cored query wasm contract-state smart $contract_addr '{\"get_config\":{}}' --node https://full-node.testnet-1.coreum.dev:26657"
fi

echo ""
echo "=== DEPLOYMENT COMMANDS SAVED ==="
echo "Commands saved to: deployment_commands.txt"
cat > deployment_commands.txt << CMDS
# STORE
cored tx wasm store phoenix_escrow_optimized.wasm --from your-wallet --chain-id coreum-testnet-1 --gas auto --gas-adjustment 1.3 --node https://full-node.testnet-1.coreum.dev:26657 --broadcast-mode block

# INSTANTIATE (replace CODE_ID and ADMIN_ADDRESS)
cored tx wasm instantiate CODE_ID '{"admin":"core1youraddress"}' --from your-wallet --label "phoenix-escrow" --chain-id coreum-testnet-1 --gas auto --node https://full-node.testnet-1.coreum.dev:26657 --broadcast-mode block

# QUERY (replace CONTRACT_ADDRESS)
cored query wasm contract-state smart CONTRACT_ADDRESS '{"get_config":{}}' --node https://full-node.testnet-1.coreum.dev:26657
CMDS

echo "✅ Done! Copy commands from deployment_commands.txt"
