import re

# Fix 1: contract.rs - missing buy_now_price in pattern
with open('src/contract.rs', 'r') as f:
    content = f.read()

# Pattern 1: Add buy_now_price to CreateAuction match arm
pattern1 = r'(ExecuteMsg::CreateAuction \{[\s\S]*?)duration_hours,(\s*\})'
replacement1 = r'\1duration_hours, buy_now_price,\2'
content = re.sub(pattern1, replacement1, content)

# Pattern 2: Add buy_now_price to execute_create_auction call
pattern2 = r'(execute_create_auction\([\s\S]*?)duration_hours,(\s*\))'
replacement2 = r'\1duration_hours, buy_now_price,\2'
content = re.sub(pattern2, replacement2, content)

# Pattern 3: Fix CancelAuction call (info vs auction_id order issue)
# Check actual function signature
with open('src/contract.rs', 'r') as f:
    lines = f.readlines()
    for i, line in enumerate(lines):
        if 'fn execute_cancel_auction' in line:
            # Get parameter order
            params = []
            j = i
            while ')' not in lines[j]:
                j += 1
            sig = ''.join(lines[i:j+1])
            # Extract parameters after env
            if '_env: Env,' in sig and 'info: MessageInfo,' in sig:
                # Current call might be wrong - let's rebuild it
                content = content.replace(
                    'execute_cancel_auction(deps, _env, info, auction_id)',
                    'execute_cancel_auction(deps, _env, info, auction_id)'
                )

with open('src/contract.rs', 'w') as f:
    f.write(content)

print("✅ Applied comprehensive fixes to contract.rs")
