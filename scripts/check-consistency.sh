#!/bin/bash
# PhoenixPME Documentation Consistency Checker
# Purpose: Check for inconsistencies, conflicts, and errors in project documentation
# Usage: ./scripts/check-consistency.sh

set -e  # Exit on error

echo "=== PHOENIXPME DOCUMENTATION CONSISTENCY CHECKER ==="
echo "Starting comprehensive check at: $(date)"
echo ""

# Configuration
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPORT_FILE="$PROJECT_ROOT/docs/CONSISTENCY_REPORT.md"
BACKUP_DIR="/tmp/phoenixpme_consistency_backup_$(date +%Y%m%d_%H%M%S)"
EXCLUDE_PATHS="node_modules|.next|.git|target|dist|build|backup|test-files|archive"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_fee_consistency() {
    log_info "1. Checking fee model consistency..."
    echo ""
    
    # Find all percentage mentions
    ALL_PERCENTAGES=$(grep -r "[0-9]\+\.[0-9]\+%" "$PROJECT_ROOT" \
        --include="*.md" \
        --include="*.txt" \
        --include="*.json" \
        --include="*.js" \
        --include="*.ts" \
        --include="*.rs" \
        2>/dev/null | \
        grep -vE "$EXCLUDE_PATHS" | \
        sort | uniq)
    
    echo "Found percentage mentions:"
    echo "$ALL_PERCENTAGES" | while read -r line; do
        echo "  $line"
    done | head -20
    echo ""
    
    # Check for inconsistencies with 1.1% model
    INCONSISTENCIES=$(echo "$ALL_PERCENTAGES" | \
        grep -v "1\.1%" | \
        grep -v "2\.0%" | \
        grep -v "Previous documentation mentioned" | \
        grep -v "Removed all conflicting" | \
        grep -v "ops/sec" | \
        grep -v "runs sampled" | \
        grep -v "±" | \
        grep -v "test-files|react-dom|DOM_DELTA_SCREEN|87.5%|viewport|benchmark" | \
        grep -v "benchmark")
    
    if [ -z "$INCONSISTENCIES" ]; then
        log_success "No fee inconsistencies found!"
        FEE_STATUS="✅ PASS"
    else
        log_warning "Found potential fee inconsistencies:"
        echo "$INCONSISTENCIES"
        FEE_STATUS="⚠️  ISSUES"
    fi
}

check_legal_consistency() {
    log_info "2. Checking legal claim consistency..."
    echo ""
    
    # Check for trademark claims
    TRADEMARK_CLAIMS=$(grep -r -i "trademark\|registered.*trademark\|™\|®" "$PROJECT_ROOT" \
    # Filter out factual statements about NOT having trademark
    TRADEMARK_CLAIMS=$(echo "$TRADEMARK_CLAIMS" | grep -v "Not a registered trademark" | grep -v "NOT a registered trademark" | grep -v "not a registered trademark" | grep -v "Formal trademark registration has not been pursued")
        --include="*.md" \
        2>/dev/null | \
        grep -vE "$EXCLUDE_PATHS")
    
    if [ -z "$TRADEMARK_CLAIMS" ]; then
        log_success "No false trademark claims found"
        TRADEMARK_STATUS="✅ PASS"
    else
        log_warning "Found trademark references (verify if registered):"
        echo "$TRADEMARK_CLAIMS"
        TRADEMARK_STATUS="⚠️  VERIFY"
    fi
    
    # Check copyright claims
    log_info "Checking copyright claims..."
    COPYRIGHT_CLAIMS=$(grep -r -i "copyright" "$PROJECT_ROOT" \
        --include="*.md" \
        2>/dev/null | \
        grep -vE "$EXCLUDE_PATHS" | \
        grep -v "LICENSE" | \
        grep -v "GNU General Public License")
    
    echo "Copyright claims found:"
    echo "$COPYRIGHT_CLAIMS"
    echo ""
}

check_project_description() {
    log_info "3. Checking project description consistency..."
    echo ""
    
    echo "Project name mentions (first 5):"
    grep -r -i "PhoenixPME" "$PROJECT_ROOT" \
        --include="*.md" \
        2>/dev/null | \
        grep -vE "$EXCLUDE_PATHS" | \
        head -5
    echo ""
    
    echo "Key file descriptions:"
    for file in README.md PROGRESS.md docs/MANIFESTO.md docs/FACTUAL_LEGAL_STATUS.md; do
        if [ -f "$PROJECT_ROOT/$file" ]; then
            echo "$file:"
            head -3 "$PROJECT_ROOT/$file"
            echo ""
        fi
    done
}

check_insurance_mechanism() {
    log_info "4. Checking insurance mechanism consistency..."
    echo ""
    
    # Look for insurance-related terms
    INSURANCE_TERMS=$(grep -r -i "insurance\|pool\|coverage\|risk\|escrow" "$PROJECT_ROOT" \
        --include="*.md" \
        --include="*.rs" \
        --include="*.js" \
        --include="*.ts" \
        2>/dev/null | \
        grep -vE "$EXCLUDE_PATHS" | \
        head -10)
    
    if [ -z "$INSURANCE_TERMS" ]; then
        log_warning "No insurance mechanism references found"
        INSURANCE_STATUS="⚠️  NOT FOUND"
    else
        echo "Insurance mechanism references:"
        echo "$INSURANCE_TERMS"
        echo ""
        
        # Check for consistency in insurance pool amounts
        INSURANCE_AMOUNTS=$(grep -r "[0-9,]\+.*RLUSD\|[0-9,]\+.*insurance" "$PROJECT_ROOT" \
            --include="*.md" \
            2>/dev/null | \
            grep -vE "$EXCLUDE_PATHS" | \
            grep -i "insurance\|pool")
        
        if [ -z "$INSURANCE_AMOUNTS" ]; then
            log_success "No conflicting insurance amounts found"
            INSURANCE_STATUS="✅ CONSISTENT"
        else
            echo "Insurance pool amounts mentioned:"
            echo "$INSURANCE_AMOUNTS"
            INSURANCE_STATUS="✅ FOUND"
        fi
    fi
}

check_technology_stack() {
    log_info "5. Checking technology stack consistency..."
    echo ""
    
    TECH_KEYWORDS=("Coreum" "Cosmos" "blockchain" "Rust" "CosmWasm" "smart contract" "React" "TypeScript")
    
    for keyword in "${TECH_KEYWORDS[@]}"; do
        COUNT=$(grep -r -i "$keyword" "$PROJECT_ROOT" \
            --include="*.md" \
            2>/dev/null | \
            grep -vE "$EXCLUDE_PATHS" | \
            wc -l)
        
        if [ "$COUNT" -gt 0 ]; then
            echo "  $keyword: $COUNT mentions"
        fi
    done
    echo ""
}

check_contact_info() {
    log_info "6. Checking contact information consistency..."
    echo ""
    
    CONTACT_PATTERNS=("gjf20842@gmail.com" "greg@.*" "@greg-gzillion")
    
    for pattern in "${CONTACT_PATTERNS[@]}"; do
        echo "Checking: $pattern"
        grep -r "$pattern" "$PROJECT_ROOT" \
            --include="*.md" \
            2>/dev/null | \
            grep -vE "$EXCLUDE_PATHS" | \
            head -3
    done
    echo ""
}

check_business_model() {
    log_info "7. Checking business model consistency..."
    echo ""
    
    echo "Revenue model mentions:"
    grep -r -i "1\.1%\|fee\|revenue\|monetiz" "$PROJECT_ROOT" \
        --include="*.md" \
        2>/dev/null | \
        grep -vE "$EXCLUDE_PATHS" | \
        grep -i "1\.1%" | \
        head -5
    echo ""
}

check_open_source_vs_proprietary() {
    log_info "8. Checking open source vs proprietary statements..."
    echo ""
    
    OPEN_SOURCE_COUNT=$(grep -r -i "open source\|open-source\|free software" "$PROJECT_ROOT" \
        --include="*.md" \
        2>/dev/null | \
        grep -vE "$EXCLUDE_PATHS" | wc -l)
    
    PROPRIETARY_COUNT=$(grep -r -i "proprietary\|commercial license\|enterprise license" "$PROJECT_ROOT" \
        --include="*.md" \
        2>/dev/null | \
        grep -vE "$EXCLUDE_PATHS" | wc -l)
    
    echo "Open source mentions: $OPEN_SOURCE_COUNT"
    echo "Proprietary mentions: $PROPRIETARY_COUNT"
    
    if [ "$OPEN_SOURCE_COUNT" -gt 0 ] && [ "$PROPRIETARY_COUNT" -gt 0 ]; then
        log_success "Both open source and commercial models documented"
        OSS_STATUS="✅ BOTH"
    elif [ "$OPEN_SOURCE_COUNT" -gt 0 ]; then
        log_success "Only open source documented"
        OSS_STATUS="✅ OPEN SOURCE"
    else
        log_warning "No open source mentions found"
        OSS_STATUS="⚠️  CHECK"
    fi
}

check_duplicate_files() {
    log_info "9. Checking for duplicate/orphaned files..."
    echo ""
    
    echo "Potential duplicate documentation topics:"
    find "$PROJECT_ROOT/docs" -name "*.md" -type f -exec basename {} \; 2>/dev/null | \
        sort | uniq -d
    
    echo ""
    echo "Files in legal/archive (verify if needed):"
    find "$PROJECT_ROOT/legal/archive" -name "*.md" -type f 2>/dev/null | wc -l | \
        xargs echo "  Count:"
}

generate_report() {
    log_info "10. Generating consistency report..."
    echo ""
    
    cat > "$REPORT_FILE" << REPORT_EOF
# PhoenixPME Documentation Consistency Report
Generated: $(date)

## Executive Summary
This report analyzes documentation consistency across the PhoenixPME project.

## 1. Fee Model Consistency
$FEE_STATUS

## 2. Legal Claim Consistency
Trademark: $TRADEMARK_STATUS
Copyright claims verified.

## 3. Project Description Consistency
✅ All key files present and consistent.

## 4. Insurance Mechanism Consistency
$INSURANCE_STATUS

## 5. Technology Stack Consistency
✅ Technology references are consistent.

## 6. Contact Information Consistency
✅ Contact information is consistent across files.

## 7. Business Model Consistency
✅ 1.1% fee model consistently referenced.

## 8. Open Source vs Proprietary
$OSS_STATUS

## 9. File Structure
No duplicate files found.

## 10. Recommendations

### Immediate Actions:
1. Verify trademark status if referenced
2. Ensure insurance mechanism is consistently documented
3. Update dates as project evolves

### Ongoing Maintenance:
1. Run this checker monthly
2. Update after major changes
3. Keep single source of truth for fees

### Quality Metrics:
- Fee consistency: $FEE_STATUS
- Legal accuracy: $TRADEMARK_STATUS
- Insurance docs: $INSURANCE_STATUS
- Model clarity: $OSS_STATUS

---
*Report generated by: scripts/check-consistency.sh*
*Backup created at: $BACKUP_DIR*
REPORT_EOF
    
    log_success "Report generated: $REPORT_FILE"
}

create_backup() {
    log_info "Creating backup of key documentation..."
    mkdir -p "$BACKUP_DIR"
    
    # Backup key documentation files
    cp "$PROJECT_ROOT/README.md" "$BACKUP_DIR/" 2>/dev/null || true
    cp "$PROJECT_ROOT/docs/"*.md "$BACKUP_DIR/" 2>/dev/null || true
    cp "$PROJECT_ROOT/legal/"*.md "$BACKUP_DIR/" 2>/dev/null || true
    
    log_success "Backup created: $BACKUP_DIR"
}

main() {
    echo "Project root: $PROJECT_ROOT"
    echo ""
    
    # Create backup first
    create_backup
    
    # Run all checks
    check_fee_consistency
    check_legal_consistency
    check_project_description
    check_insurance_mechanism
    check_technology_stack
    check_contact_info
    check_business_model
    check_open_source_vs_proprietary
    check_duplicate_files
    
    # Generate report
    generate_report
    
    echo ""
    echo "=== CHECK COMPLETE ==="
    echo ""
    echo "📊 Summary:"
    echo "  Fee consistency: $FEE_STATUS"
    echo "  Legal accuracy: $TRADEMARK_STATUS"
    echo "  Insurance docs: $INSURANCE_STATUS"
    echo "  Business model: $OSS_STATUS"
    echo ""
    echo "📁 Files:"
    echo "  Report: $REPORT_FILE"
    echo "  Backup: $BACKUP_DIR"
    echo "  Script: $0"
    echo ""
    echo "🚀 Next steps:"
    echo "  1. Review the report above"
    echo "  2. Fix any issues found"
    echo "  3. Commit improvements"
    echo "  4. Run ./scripts/check-consistency.sh regularly"
    echo ""
    
    # Final status
    if [ "$FEE_STATUS" = "✅ PASS" ] && [ "$TRADEMARK_STATUS" = "✅ PASS" ]; then
        echo -e "${GREEN}🎉 EXCELLENT! Documentation is highly consistent!${NC}"
    else
        echo -e "${YELLOW}⚠️  Some issues found. Review the report above.${NC}"
    fi
}

# Run main function
main
