import re

with open('src/msg.rs', 'r') as f:
    content = f.read()

# Find the QueryMsg enum
if 'pub enum QueryMsg' in content:
    # Add GetCompletedAuctions to the enum
    content = re.sub(
        r'pub enum QueryMsg \{([^}]+)\}',
        r'pub enum QueryMsg {\1    #[returns(Vec<Auction>)]\n    GetCompletedAuctions {\n        start_after: Option<u64>,\n        limit: Option<u32>,\n    },\n}',
        content,
        flags=re.DOTALL
    )
    
    with open('src/msg.rs', 'w') as f:
        f.write(content)
    print("✅ Updated QueryMsg enum")
else:
    print("❌ Could not find QueryMsg enum")
