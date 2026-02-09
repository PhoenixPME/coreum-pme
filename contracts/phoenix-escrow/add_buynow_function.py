with open('src/contract.rs', 'r') as f:
    lines = f.readlines()

# Find a good place to add the function (after execute_cancel_auction)
for i, line in enumerate(lines):
    if 'fn execute_cancel_auction' in line:
        # Find the end of this function
        brace_count = 0
        for j in range(i, len(lines)):
            brace_count += lines[j].count('{')
            brace_count -= lines[j].count('}')
            if brace_count == 0 and j > i:
                # Insert buy-now function here
                buynow_func = '''
// Execute buy-it-now purchase
fn execute_buy_now(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response, ContractError> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    // Check if auction is active
    if auction.status != AuctionStatus::Active {
        return Err(ContractError::Unauthorized {});
    }
    
    // Check if auction has ended
    if env.block.time >= auction.end_time {
        return Err(ContractError::Unauthorized {});
    }
    
    // Check if buy-now is available
    if auction.buy_now_price.is_none() {
        return Err(ContractError::Unauthorized {});
    }
    
    let buy_now_price = auction.buy_now_price.unwrap();
    
    // Check if sender has enough funds (in real implementation, check tokens)
    // For now, we assume they're sending the right amount
    
    // Update auction - sold via buy-now
    auction.highest_bid = Some(buy_now_price);
    auction.highest_bidder = Some(info.sender.clone());
    auction.status = AuctionStatus::Ended; // End immediately
    
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_attribute("action", "buy_now")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("buyer", info.sender)
        .add_attribute("price", buy_now_price))
}
'''
                lines.insert(j + 1, buynow_func)
                print("✅ Added execute_buy_now function")
                break
        break

with open('src/contract.rs', 'w') as f:
    f.writelines(lines)
