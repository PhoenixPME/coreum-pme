with open('src/contract.rs', 'r') as f:
    lines = f.readlines()

# Find and fix the query function
in_query = False
in_match = False
brace_count = 0
fixed_lines = []

for i, line in enumerate(lines):
    if 'pub fn query(' in line:
        in_query = True
    if in_query and 'match msg {' in line:
        in_match = True
        brace_count = 1
    
    if in_match:
        # Count braces
        brace_count += line.count('{')
        brace_count -= line.count('}')
        
        # Remove empty GetActiveAuctions block
        if 'QueryMsg::GetActiveAuctions {} => {' in line:
            # Skip this line and find the closing brace
            j = i
            while j < len(lines) and lines[j].strip() != '}':
                j += 1
            # Skip the entire block
            i = j
            continue
    
    fixed_lines.append(line)

# Write fixed file
with open('src/contract.rs', 'w') as f:
    f.writelines(''.join(fixed_lines))
    
print("✅ Removed empty GetActiveAuctions block")
