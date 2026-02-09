with open('src/contract.rs', 'r') as f:
    lines = f.readlines()

# Find the execute function match statement
for i, line in enumerate(lines):
    if 'match msg {' in line and 'execute' in lines[i-2]:
        # Find CancelAuction to insert BuyNow after it
        for j in range(i, len(lines)):
            if 'ExecuteMsg::CancelAuction' in lines[j]:
                # Insert BuyNow handler
                indent = ' ' * 8
                buynow_handler = f'{indent}ExecuteMsg::BuyNow {{ auction_id }} => execute_buy_now(deps, env, info, auction_id),\n'
                lines.insert(j + 1, buynow_handler)
                print("✅ Added BuyNow handler to execute function")
                break
        break

with open('src/contract.rs', 'w') as f:
    f.writelines(lines)
