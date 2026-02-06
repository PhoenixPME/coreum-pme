# PhoenixPME Auction Escrow: State Machine Specification

## 1. Overview
The PhoenixPME Auction Escrow is a state machine that manages the lifecycle of a peer-to-peer physical precious metals trade. Its primary purpose is to **custody funds securely** and **enforce rules transparently** until both parties fulfill their obligations. Security is initiated by a seller bond.

## 2. Definitions
- **Seller Bond (Security Deposit)**: Funds locked by the seller to guarantee performance (shipment of described item). Forfeited in whole or part for bad faith actions.
- **Reserve Price**: The minimum sale price set by the seller. The auction only succeeds if a bid meets or exceeds this amount.
- **Winning Bid**: The highest valid bid at the close of the auction.

## 3. Core States & Transitions

### State: `AWAITING_SELLER_BOND`
**Purpose:** The initial state. Ensures the seller has "skin in the game" before the auction is publicly listed, thwarting fake or non-committal listings.

**Parameters & Storage:**
- `seller_bond_amount`: Calculated as a percentage (e.g., 120%) of the seller's `reserve_price` or a fixed minimum.
- `seller_bond_deadline`: A timer (e.g., 24 hours). If the bond is not posted, the listing is cancelled.

**Valid Triggers & Next States:**
1.  `SELLER_DEPOSITS_BOND` → `LISTING_ACTIVE`
    - The seller successfully locks the required bond with the smart contract.
    - The auction listing becomes visible to buyers.
2.  `SELLER_CANCELS` → `CANCELLED`
    - The seller chooses not to proceed before the bond deadline.
    - No penalty, as no bond was locked.
3.  `BOND_DEADLINE_EXPIRED` → `CANCELLED`
    - The `seller_bond_deadline` passes without a deposit.
    - The listing is automatically invalidated.

**On-Chain Logic:**
- The contract must verify the deposited asset (e.g., COREUM, XRP) and amount matches `seller_bond_amount`.
- The bonded funds are held in escrow until the auction concludes in `COMPLETE`, `CANCELLED` (by seller before bids), or `DISPUTE_RESOLVED`.

---

### State: `LISTING_ACTIVE`
**Purpose:** The auction is live and visible. Buyers can place bids or trigger a "Buy It Now" if the seller has set that option.

**Parameters & Storage:**
- `reserve_price`: The minimum price to win.
- `buy_it_now_price`: (Optional) If set by the seller, a price at which any buyer can instantly win.
- `auction_end_time`: The timestamp when bidding closes.
- `current_highest_bid` & `current_winning_bidder`: Tracks the leading bid.

**Valid Triggers & Next States:**
1.  `BUYER_TRIGGERS_BUY_IT_NOW` → `AWAITING_PAYMENT`
    - **Condition:** `buy_it_now_price` must be set.
    - **Action:** The triggering buyer must immediately lock the `buy_it_now_price` as payment. The auction closes instantly.
2.  `BUYER_PLACES_BID` → (Remains in `LISTING_ACTIVE`)
    - **Condition:** Bid must be > `current_highest_bid` and >= `reserve_price`.
    - **Action:** The previous highest bid is refunded. The new bid is locked in escrow.
3.  `AUCTION_TIMER_EXPIRES` → `BIDDING_CLOSED`
    - **Condition:** `auction_end_time` is reached.
    - **Action:** Bidding closes. If the `current_highest_bid` >= `reserve_price`, the auction proceeds to settlement. If not, it proceeds to cancellation.
4.  `SELLER_CANCELS` → `CANCELLED`
    - **Condition:** Typically only allowed if *no bids have been placed*, to prevent abuse.
    - **Action:** The seller's bond is returned. Any bids are refunded.

**On-Chain Logic:**
- The contract must manage the locking and refunding of bid amounts with each new higher bid.
- If `buy_it_now_price` is triggered, the contract must validate and lock the full payment before transitioning.

---
