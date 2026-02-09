#!/bin/bash
echo "=== Testing GetCompletedAuctions Implementation ==="

# Check msg.rs has the new query
echo "1. Checking msg.rs..."
if grep -q "GetCompletedAuctions" src/msg.rs; then
    echo "✅ GetCompletedAuctions found in QueryMsg"
else
    echo "❌ GetCompletedAuctions NOT found"
fi

# Check contract.rs has the handler
echo -e "\n2. Checking contract.rs..."
if grep -q "query_completed_auctions" src/contract.rs; then
    echo "✅ query_completed_auctions function found"
else
    echo "❌ query_completed_auctions NOT found"
fi

# Check imports
echo -e "\n3. Checking imports..."
if grep -q "use cosmwasm_std::Order" src/contract.rs || grep -q "Order::Ascending" src/contract.rs; then
    echo "✅ Order import found"
else
    echo "⚠️  Might need to add: use cosmwasm_std::Order;"
fi

echo -e "\n4. Final compilation check..."
cargo check 2>&1 | tail -5
