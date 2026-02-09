import re

with open('src/contract.rs', 'r') as f:
    content = f.read()

# 1. Find the query function and add the new match arm
if 'pub fn query(' in content:
    # Add GetCompletedAuctions to match statement
    pattern = r'pub fn query\([^)]+\)[^{]+\{([^}]+match msg \{)([^}]+)(GetAuction \{ id \} =>[^,]+,)([^}]+)\}'
    
    content = re.sub(
        r'(GetAuction \{ id \} =>[^,]+,)',
        r'\1\n        QueryMsg::GetCompletedAuctions { start_after, limit } => \n            to_binary(&query_completed_auctions(deps, start_after, limit)?),',
        content,
        flags=re.DOTALL
    )
    
    # 2. Add the query_completed_auctions function
    # Find a good place to add it (after other query functions)
    if 'fn query_auction(' in content:
        # Add after the last query function
        insert_point = content.find('fn query_auction(')
        end_of_function = content.find('\n}\n', insert_point)
        
        new_function = '''
// Query completed/ended auctions
fn query_completed_auctions(
    deps: Deps,
    start_after: Option<u64>,
    limit: Option<u32>,
) -> StdResult<Vec<Auction>> {
    let limit = limit.unwrap_or(50).min(100) as usize;
    let start = start_after.map(Bound::exclusive);
    
    AUCTIONS
        .range(deps.storage, start, None, Order::Ascending)
        .filter(|item| {
            if let Ok((_, auction)) = item {
                auction.status == AuctionStatus::Ended
            } else {
                false
            }
        })
        .take(limit)
        .map(|item| item.map(|(_, auction)| auction))
        .collect()
}
'''
        
        content = content[:end_of_function+3] + new_function + content[end_of_function+3:]
    
    with open('src/contract.rs', 'w') as f:
        f.write(content)
    
    print("✅ Updated contract.rs with GetCompletedAuctions query")
else:
    print("❌ Could not find query function")
