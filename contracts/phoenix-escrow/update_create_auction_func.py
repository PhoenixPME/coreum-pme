with open('src/contract.rs', 'r') as f:
    content = f.read()

# Update execute_create_auction parameters
import re

# Find execute_create_auction function signature
func_pattern = r'(fn execute_create_auction\([^)]*reserve_price: Option<cosmwasm_std::Uint128>,\s*duration_hours: u64,)'
new_params = r'\1\n    buy_now_price: Option<cosmwasm_std::Uint128>,'
content = re.sub(func_pattern, new_params, content)

# Update where Auction is created in the function
auction_pattern = r'(let auction = Auction \{.*?reserve_price,)'
new_auction = r'\1\n        buy_now_price,'
content = re.sub(auction_pattern, new_auction, content, flags=re.DOTALL)

with open('src/contract.rs', 'w') as f:
    f.write(content)

print("✅ Updated execute_create_auction to handle buy_now_price")
