with open('src/msg.rs', 'r') as f:
    lines = f.readlines()

# Fix 1: Ensure BuyNow has proper syntax
for i, line in enumerate(lines):
    if 'BuyNow {' in line and 'auction_id:' not in lines[i+1]:
        # This line is malformed - need to see actual structure
        print(f"Line {i+1}: {line.strip()}")
        # Let's rewrite this section properly
        
# Better approach: rebuild the ExecuteMsg enum
new_lines = []
in_execute_msg = False
execute_msg_content = []

for i, line in enumerate(lines):
    if 'pub enum ExecuteMsg' in line:
        in_execute_msg = True
        new_lines.append(line)
        continue
    
    if in_execute_msg and line.strip() == '}':
        # Rebuild with proper BuyNow
        new_lines.append('    CreateAuction {\n')
        new_lines.append('        item_id: String,\n')
        new_lines.append('        description: String,\n')
        new_lines.append('        metal_type: String,\n')
        new_lines.append('        product_form: String,\n')
        new_lines.append('        weight: u32,\n')
        new_lines.append('        starting_price: Uint128,\n')
        new_lines.append('        reserve_price: Option<Uint128>,\n')
        new_lines.append('        buy_now_price: Option<Uint128>,\n')
        new_lines.append('        duration_hours: u64,\n')
        new_lines.append('    },\n')
        new_lines.append('    PlaceBid {\n')
        new_lines.append('        auction_id: u64,\n')
        new_lines.append('        amount: Uint128,\n')
        new_lines.append('    },\n')
        new_lines.append('    EndAuction {\n')
        new_lines.append('        auction_id: u64,\n')
        new_lines.append('    },\n')
        new_lines.append('    ReleaseFunds {\n')
        new_lines.append('        auction_id: u64,\n')
        new_lines.append('    },\n')
        new_lines.append('    CancelAuction {\n')
        new_lines.append('        auction_id: u64,\n')
        new_lines.append('    },\n')
        new_lines.append('    BuyNow {\n')
        new_lines.append('        auction_id: u64,\n')
        new_lines.append('    },\n')
        new_lines.append('}\n')
        in_execute_msg = False
        continue
    
    if not in_execute_msg:
        new_lines.append(line)

with open('src/msg.rs', 'w') as f:
    f.writelines(new_lines)

print("✅ Rebuilt ExecuteMsg enum with proper syntax")
