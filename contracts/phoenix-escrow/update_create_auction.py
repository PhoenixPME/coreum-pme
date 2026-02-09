with open('src/msg.rs', 'r') as f:
    lines = f.readlines()

# Find CreateAuction in ExecuteMsg
in_create_auction = False
for i, line in enumerate(lines):
    if 'CreateAuction {' in line:
        in_create_auction = True
    if in_create_auction and 'duration_hours:' in line:
        # Add buy_now_price after duration_hours
        lines.insert(i + 1, '        buy_now_price: Option<Uint128>,\n')
        print("✅ Added buy_now_price to CreateAuction message")
        break

with open('src/msg.rs', 'w') as f:
    f.writelines(lines)
