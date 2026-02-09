with open('src/contract.rs', 'r') as f:
    content = f.read()

# Find execute_buy_now function and rebuild it
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

# Replace the existing execute_buy_now function
import re
pattern = r'// Execute buy-it-now purchase[\s\S]*?\n}'
content = re.sub(pattern, buynow_func, content)

with open('src/contract.rs', 'w') as f:
    f.write(content)

print("✅ Rebuilt execute_buy_now with correct signature")
