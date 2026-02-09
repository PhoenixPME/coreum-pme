with open('src/contract.rs', 'r') as f:
    lines = f.readlines()

# Find and fix specific functions
fixes = {
    'execute_end_auction': False,
    'execute_release_funds': False, 
    'execute_cancel_auction': False
}

for i, line in enumerate(lines):
    for func in fixes.keys():
        if f'fn {func}(' in line:
            # Find the parameter line
            for j in range(i, min(i+10, len(lines))):
                if 'env: Env,' in lines[j]:
                    lines[j] = lines[j].replace('env: Env,', '_env: Env,')
                    fixes[func] = True
                    print(f"Fixed {func}: added underscore to env")
                    break

with open('src/contract.rs', 'w') as f:
    f.writelines(lines)

print("✅ Fixed unused env parameters in functions that don't use env")
