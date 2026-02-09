with open('src/state.rs', 'r') as f:
    lines = f.readlines()

# Find Auction struct
for i, line in enumerate(lines):
    if 'pub struct Auction' in line:
        # Find the closing brace of Auction struct
        for j in range(i, len(lines)):
            if '}' in lines[j] and j > i:
                # Insert buy_now_price before the closing brace
                # Look for reserve_price field to insert after it
                for k in range(i, j):
                    if 'reserve_price:' in lines[k]:
                        # Insert after reserve_price
                        lines.insert(k + 1, '    pub buy_now_price: Option<cosmwasm_std::Uint128>,\n')
                        print("✅ Added buy_now_price field to Auction struct")
                        break
                break
        break

with open('src/state.rs', 'w') as f:
    f.writelines(lines)
