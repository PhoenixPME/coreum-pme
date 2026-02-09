#!/bin/bash
echo "=== PhoenixPME Structure Verification ==="
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
# Check for conflicting fee percentages
CONFLICTS=$(grep -r "0\.0[0-9]%" . --include="*.md" 2>/dev/null | grep -v "test-files" | wc -l)
if [ "$CONFLICTS" -eq 0 ]; then
    echo "  ✅ No conflicting fee percentages"
else
    echo "  ❌ Found $CONFLICTS conflicting fee mentions"
    ERRORS=$((ERRORS+1))
fi

# Check factual legal status exists
if [ -f "docs/FACTUAL_LEGAL_STATUS.md" ]; then
    echo "  ✅ FACTUAL_LEGAL_STATUS.md present"
else
    echo "  ❌ FACTUAL_LEGAL_STATUS.md missing"
    ERRORS=$((ERRORS+1))
fi

echo ""
echo "4. Git status:"
if [ -z "$(git status --porcelain)" ]; then
    echo "  ✅ All changes committed"
else
    echo "  ⚠️  Uncommitted changes exist"
    git status --porcelain | head -5
fi

echo ""
echo "=== SUMMARY ==="
if [ "$ERRORS" -eq 0 ]; then
    echo "🎉 ALL CHECKS PASSED! Structure is CORRECT and CONSISTENT!"
else
    echo "⚠️  Found $ERRORS issue(s) that need attention"
fi
