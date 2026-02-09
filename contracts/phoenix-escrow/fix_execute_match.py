with open('src/contract.rs', 'r') as f:
    lines = f.readlines()

# Find the execute function
execute_start = -1
for i, line in enumerate(lines):
    if 'pub fn execute(' in line:
        execute_start = i
        break

if execute_start != -1:
    # Find the match statement
    for i in range(execute_start, len(lines)):
        if 'match msg {' in lines[i]:
            match_start = i
            # Replace from match_start to the closing brace
            # Find the closing brace
            brace_count = 0
            for j in range(match_start, len(lines)):
                brace_count += lines[j].count('{')
                brace_count -= lines[j].count('}')
                if brace_count == 0 and j > match_start:
                    match_end = j
                    break
            
            # Build new match statement
            new_match = '''    match msg {
        ExecuteMsg::CreateAuction {
            item_id,
            description,
            metal_type,
            product_form,
            weight,
            starting_price,
            reserve_price,
            buy_now_price,
            duration_hours,
        } => execute_create_auction(
            deps,
            env,
            info,
            item_id,
            description,
            metal_type,
            product_form,
            weight,
            starting_price,
            reserve_price,
            buy_now_price,
            duration_hours,
        ),
        ExecuteMsg::PlaceBid { auction_id, amount } => {
            execute_place_bid(deps, env, info, auction_id, amount)
        }
        ExecuteMsg::EndAuction { auction_id } => execute_end_auction(deps, env, info, auction_id),
        ExecuteMsg::ReleaseFunds { auction_id } => execute_release_funds(deps, env, info, auction_id),
        ExecuteMsg::CancelAuction { auction_id } => execute_cancel_auction(deps, env, info, auction_id),
        ExecuteMsg::BuyNow { auction_id } => execute_buy_now(deps, env, info, auction_id),
    }'''
            
            # Replace the old match block
            lines[match_start:match_end+1] = [new_match + '\n']
            print("✅ Rebuilt execute match statement with correct argument order")
            break

with open('src/contract.rs', 'w') as f:
    f.writelines(lines)
