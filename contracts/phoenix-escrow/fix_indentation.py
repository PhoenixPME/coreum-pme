with open('src/contract.rs', 'r') as f:
    lines = f.readlines()

# Track indentation levels
brace_stack = []
fixed_lines = []
line_num = 0

for i, line in enumerate(lines):
    line_num += 1
    stripped = line.strip()
    
    # Skip if it's in a problematic empty block
    if "GetActiveAuctions {} => {" in line:
        print(f"⚠️  Found problematic GetActiveAuctions at line {line_num}")
        # Skip this entire empty block
        j = i + 1
        while j < len(lines) and not lines[j].strip().startswith('}'):
            j += 1
        # Skip to after the closing brace
        continue
    
    # Track opening braces
    if '{' in line and '}' not in line:  # Opening brace without closing
        brace_stack.append(i)
    
    # Track closing braces
    if '}' in line and '{' not in line:  # Closing brace without opening
        if brace_stack:
            brace_stack.pop()
        else:
            print(f"⚠️  Extra closing brace at line {line_num}: {stripped}")
            # This might be the problematic one
    
    fixed_lines.append(line)

# Write fixed file
with open('src/contract.rs.fixed', 'w') as f:
    f.writelines(fixed_lines)

print("✅ Created fixed file: src/contract.rs.fixed")
