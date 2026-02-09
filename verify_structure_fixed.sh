#!/bin/bash
echo "=== PhoenixPME Structure Verification (FIXED v2) ==="
echo ""

ERRORS=0

# Check critical files
echo "1. Critical files in root:"
for file in README.md PROGRESS.md LICENSE CONTRIBUTING.md; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file missing"
        ERRORS=$((ERRORS+1))
    fi
done

echo ""
echo "2. Folder structure:"
for folder in docs legal scripts apps contracts; do
    if [ -d "$folder" ]; then
        echo "  ✅ $folder/"
    else
        echo "  ❌ $folder/ missing"
        ERRORS=$((ERRORS+1))
    fi
done

echo ""
echo "3. Documentation consistency:"
echo "  Searching for ACTUAL fee conflicts (excluding historical references)..."
# Find REAL conflicts: percentages that are NOT 1.1% or 2.0% and NOT in historical context
REAL_CONFLICTS=$(grep -r "[0-9]\+\.[0-9]\+%" . --include="*.md" 2>/dev/null | \
    grep -v "1\.1%" | \
    grep -v "2\.0%" | \
    grep -v "node_modules" | \
    grep -v "\.next" | \
    grep -v "ops/sec" | \
    grep -v "runs sampled" | \
    grep -v "±" | \
    grep -v "Removed all conflicting" | \
    grep -v "Previous documentation mentioned" | \
    grep -v "etc\.)" | \
    wc -l)

if [ "$REAL_CONFLICTS" -eq 0 ]; then
    echo "  ✅ No ACTUAL conflicting fee percentages"
else
    echo "  ❌ Found $REAL_CONFLICTS ACTUAL conflicting fee mentions"
    echo "  Showing ACTUAL conflicts:"
    grep -r "[0-9]\+\.[0-9]\+%" . --include="*.md" 2>/dev/null | \
        grep -v "1\.1%" | \
        grep -v "2\.0%" | \
        grep -v "node_modules" | \
        grep -v "\.next" | \
        grep -v "ops/sec" | \
        grep -v "runs sampled" | \
        grep -v "±" | \
        grep -v "Removed all conflicting" | \
        grep -v "Previous documentation mentioned" | \
        grep -v "etc\.)"
    ERRORS=$((ERRORS+1))
fi

# Check factual legal status exists
if [ -f "docs/FACTUAL_LEGAL_STATUS.md" ]; then
    echo "  ✅ FACTUAL_LEGAL_STATUS.md present"
else
    echo "  ❌ FACTUAL_LEGAL_STATUS.md missing"
    ERRORS=$((ERRORS+1))
fi

# Check FEE_MODEL.md exists
if [ -f "docs/FEE_MODEL.md" ]; then
    echo "  ✅ FEE_MODEL.md present"
else
    echo "  ❌ FEE_MODEL.md missing"
    ERRORS=$((ERRORS+1))
fi

echo ""
echo "4. Git status:"
if [ -z "$(git status --porcelain)" ]; then
    echo "  ✅ All changes committed"
else
    echo "  ⚠️  Uncommitted changes exist"
    git status --porcelain | head -10
fi

echo ""
echo "=== SUMMARY ==="
if [ "$ERRORS" -eq 0 ]; then
    echo "🎉 ALL CHECKS PASSED! Structure is CORRECT and CONSISTENT!"
else
    echo "⚠️  Found $ERRORS issue(s) that need attention"
fi
