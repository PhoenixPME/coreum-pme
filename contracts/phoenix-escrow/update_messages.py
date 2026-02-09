with open('src/msg.rs', 'r') as f:
    content = f.read()

# Add BuyNow variant to ExecuteMsg
import re

# Find ExecuteMsg and add BuyNow variant before the closing brace
execute_pattern = r'(pub enum ExecuteMsg \{.*?)(\n\s*\})'
def add_buy_now(match):
    before = match.group(1)
    closing = match.group(2)
    
    # Add BuyNow variant (alphabetically between CancelAuction and CreateAuction)
    new_variant = '\n    BuyNow {\n        auction_id: u64,\n    },'
    
    # Insert after CancelAuction
    if 'CancelAuction' in before:
        parts = before.split('CancelAuction')
        new_content = parts[0] + 'CancelAuction' + parts[1] + new_variant
    else:
        # Just add before closing brace
        new_content = before + new_variant
    
    return new_content + closing

new_content = re.sub(execute_pattern, add_buy_now, content, flags=re.DOTALL)

with open('src/msg.rs', 'w') as f:
    f.write(new_content)

print("✅ Added BuyNow to ExecuteMsg")
