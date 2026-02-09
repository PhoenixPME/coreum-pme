#!/bin/bash

echo "=== SAFE CONTRACT VALIDATION ==="
echo "Running checks without exiting shell..."
echo ""

# Store original exit behavior
set +e

# 1. Compilation check
echo "1. Compilation check..."
cargo check --quiet
if [ $? -eq 0 ]; then
    echo "   ✅ Compilation successful"
else
    echo "   ❌ Compilation failed"
    echo "   Last errors:"
    cargo check 2>&1 | tail -5
fi

echo ""

# 2. Test run
echo "2. Running tests..."
cargo test --quiet 2>&1 | tail -10 | grep -E "(test result|passed|failed|ok)"
TEST_EXIT=$?
if [ $TEST_EXIT -eq 0 ]; then
    echo "   ✅ Tests completed"
else
    echo "   ⚠️  Test issues (check details)"
fi

echo ""

# 3. File structure
echo "3. File structure..."
FILES_EXIST=0
for file in src/lib.rs src/contract.rs src/msg.rs src/state.rs; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
        ((FILES_EXIST++))
    else
        echo "   ❌ Missing: $file"
    fi
done
echo "   Found $FILES_EXIST/4 required files"

echo ""

# 4. Entry points
echo "4. Contract entry points..."
ENTRY_POINTS=$(grep -c "#\[entry_point\]" src/contract.rs 2>/dev/null || echo "0")
echo "   Found $ENTRY_POINTS entry points"
if [ $ENTRY_POINTS -eq 3 ]; then
    echo "   ✅ All entry points present"
else
    echo "   ⚠️  Expected 3 entry points"
fi

echo ""

# 5. WASM build test
echo "5. Testing WASM build..."
cargo wasm --quiet 2>&1 | tail -3
if [ $? -eq 0 ]; then
    echo "   ✅ WASM builds successfully"
    WASM_FILE=$(find target -name "*.wasm" -type f 2>/dev/null | head -1)
    if [ -n "$WASM_FILE" ]; then
        echo "   WASM size: $(ls -lh "$WASM_FILE" 2>/dev/null | awk '{print $5}')"
    fi
else
    echo "   ❌ WASM build failed"
fi

echo ""
echo "=== VALIDATION COMPLETE ==="
echo "Shell remains active!"
