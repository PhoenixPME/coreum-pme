use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},
    
    #[error("Auction not active")]
    AuctionNotActive {},
    
    #[error("Auction already ended")]
    AuctionEnded {},
    
    #[error("Bid too low")]
    BidTooLow {},
    
    #[error("Auction not ended")]
    AuctionNotEnded {},
    
    #[error("No winning bid")]
    NoWinningBid {},
}
