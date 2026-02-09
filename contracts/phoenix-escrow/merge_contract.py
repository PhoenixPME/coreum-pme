import re

# Read the clean template
with open('src/contract.rs.working', 'r') as f:
    template = f.read()

# Read the original to extract execute functions
with open('src/contract.rs.bak_all', 'r') as f:
    original = f.read()

# Find all execute functions
execute_pattern = r'(fn execute_[^{]+\{.*?\n\})'
execute_funcs = re.findall(execute_pattern, original, re.DOTALL)

print(f"Found {len(execute_funcs)} execute functions")

# Insert them before the #[cfg(test)] line
if execute_funcs:
    # Combine all execute functions
    all_executes = '\n'.join(execute_funcs)
    
    # Insert after the query functions
    insert_point = template.find('// Add your existing execute functions here')
    if insert_point != -1:
        new_template = template[:insert_point] + all_executes + '\n\n' + template[insert_point:]
        
        # Remove the placeholder comment
        new_template = new_template.replace('// Add your existing execute functions here', '')
        
        with open('src/contract.rs', 'w') as f:
            f.write(new_template)
        print("✅ Created final src/contract.rs")
    else:
        print("❌ Could not find insertion point")
        # Fallback: just use template
        with open('src/contract.rs', 'w') as f:
            f.write(template)
else:
    print("❌ No execute functions found, using template")
    with open('src/contract.rs', 'w') as f:
        f.write(template)

