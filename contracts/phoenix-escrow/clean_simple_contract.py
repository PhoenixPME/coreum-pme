import re

with open('src/contract.rs', 'r') as f:
    content = f.read()

# Find ALL query function definitions
query_pattern = r'pub fn query\([^)]*\)[^{]*\{.*?\n\}'
matches = list(re.finditer(query_pattern, content, re.DOTALL))

if len(matches) > 1:
    print(f"Found {len(matches)} query functions, keeping only the last one")
    
    # Keep everything before the first query
    new_content = content[:matches[0].start()]
    
    # Add the last query function
    new_content += content[matches[-1].start():matches[-1].end()]
    
    # Add everything after the last query
    new_content += content[matches[-1].end():]
    
    with open('src/contract.rs', 'w') as f:
        f.write(new_content)
    print("✅ Removed duplicate query functions")
else:
    print("✅ Only one query function found")
