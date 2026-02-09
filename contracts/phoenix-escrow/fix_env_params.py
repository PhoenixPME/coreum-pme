with open('src/contract.rs', 'r') as f:
    content = f.read()

# Functions that USE env (should NOT have underscore):
# 1. execute function - passes env to handlers
# 2. execute_create_auction - uses env.block.time
# 3. execute_place_bid - uses env.block.time
# 4. execute_end_auction - might use env
# 5. execute_release_funds - might use env  
# 6. execute_cancel_auction - might use env

# Fix 1: execute function signature
content = content.replace('    _env: Env,', '    env: Env,')

# Fix 2: execute_create_auction function signature  
content = content.replace('    _env: Env,', '    env: Env,', 1)  # Only first occurrence

# Fix 3: execute_place_bid function signature
# Need to be careful - replace the specific occurrence
lines = content.split('\n')
fixed_lines = []
in_place_bid = False
place_bid_fixed = False

for line in lines:
    if 'fn execute_place_bid(' in line:
        in_place_bid = True
    if in_place_bid and not place_bid_fixed and '_env: Env,' in line:
        line = line.replace('_env: Env,', 'env: Env,')
        place_bid_fixed = True
        in_place_bid = False
    fixed_lines.append(line)

content = '\n'.join(fixed_lines)

# Fix 4,5,6: Other execute functions that might use env
# Let's just replace all remaining '_env: Env,' with 'env: Env,' in execute_ functions
import re
pattern = r'(fn execute_\w+\([^)]*)_env: Env,'
content = re.sub(pattern, r'\1env: Env,', content)

# Also fix the unused 'info' parameter warning in instantiate
content = content.replace('    info: MessageInfo,', '    _info: MessageInfo,')

with open('src/contract.rs', 'w') as f:
    f.write(content)

print("✅ Fixed env parameter issues")
print("Changed _env back to env where it's actually used")
print("Changed unused info to _info in instantiate function")
