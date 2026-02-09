with open('src/state.rs', 'r') as f:
    lines = f.readlines()

# Find AuctionStatus enum
found = False
for i, line in enumerate(lines):
    if 'pub enum AuctionStatus' in line:
        found = True
        # Check what variants it has
        j = i + 1
        while j < len(lines) and '}' not in lines[j]:
            j += 1
        
        variants = []
        for k in range(i+1, j):
            if 'Active' in lines[k]:
                variants.append('Active')
            if 'Ended' in lines[k]:
                variants.append('Ended')
            if 'Cancelled' in lines[k]:
                variants.append('Cancelled')
            if 'Completed' in lines[k]:
                variants.append('Completed')
        
        print(f"Current AuctionStatus variants: {variants}")
        
        # If Completed is missing, add it
        if 'Completed' not in variants:
            # Add before the closing brace
            lines.insert(j, '    Completed,\n')
            print("✅ Added 'Completed' variant to AuctionStatus")
        
        break

if not found:
    print("❌ Could not find AuctionStatus enum")

with open('src/state.rs.fixed', 'w') as f:
    f.writelines(lines)

print("✅ Created src/state.rs.fixed")
