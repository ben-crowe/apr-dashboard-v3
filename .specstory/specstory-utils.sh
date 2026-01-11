#!/bin/bash
# SpecStory Utility Script
# Helper commands to navigate and use SpecStory history

set -e

SPECSTORY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HISTORY_DIR="$SPECSTORY_DIR/history"
FEATURES_DIR="$SPECSTORY_DIR/features"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Show help
show_help() {
    echo "SpecStory Utility - Navigate your conversation history"
    echo ""
    echo "Usage: ./specstory-utils.sh [command] [options]"
    echo ""
    echo "Commands:"
    echo "  list              List all sessions (default)"
    echo "  latest [N]        Show latest N sessions (default: 5)"
    echo "  search <term>     Search for term in all sessions"
    echo "  find-file <file>  Find sessions that mention a file"
    echo "  find-topic <term> Find sessions about a topic"
    echo "  show <filename>   Show full content of a session"
    echo "  stats             Show statistics about history"
    echo "  features          List all feature documentation"
    echo "  feature <name>    Show a specific feature document"
    echo "  help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./specstory-utils.sh latest 10"
    echo "  ./specstory-utils.sh search 'image configurator'"
    echo "  ./specstory-utils.sh find-file ImageConfiguratorDemo.tsx"
    echo "  ./specstory-utils.sh show 2026-01-06_22-45Z-image-page-configurator-color-discrepancy.md"
}

# List all sessions
list_sessions() {
    if [ ! -d "$HISTORY_DIR" ]; then
        echo "History directory not found: $HISTORY_DIR"
        exit 1
    fi
    
    echo -e "${BLUE}SpecStory Session History:${NC}"
    echo ""
    ls -lh "$HISTORY_DIR"/*.md 2>/dev/null | awk '{print $9, "(" $5 ")"}' | sed "s|$HISTORY_DIR/||" | nl
}

# Show latest sessions
show_latest() {
    local count=${1:-5}
    echo -e "${BLUE}Latest $count Sessions:${NC}"
    echo ""
    ls -lt "$HISTORY_DIR"/*.md 2>/dev/null | head -n $count | awk '{printf "%-50s %s %s %s\n", $9, $6, $7, $8}' | sed "s|$HISTORY_DIR/||"
}

# Search for term
search_sessions() {
    local term=$1
    if [ -z "$term" ]; then
        echo "Error: Please provide a search term"
        echo "Usage: ./specstory-utils.sh search <term>"
        exit 1
    fi
    
    echo -e "${BLUE}Searching for:${NC} $term"
    echo ""
    grep -l "$term" "$HISTORY_DIR"/*.md 2>/dev/null | sed "s|$HISTORY_DIR/||" | nl
}

# Find sessions mentioning a file
find_file() {
    local file=$1
    if [ -z "$file" ]; then
        echo "Error: Please provide a filename"
        echo "Usage: ./specstory-utils.sh find-file <filename>"
        exit 1
    fi
    
    echo -e "${BLUE}Sessions mentioning file:${NC} $file"
    echo ""
    grep -l "$file" "$HISTORY_DIR"/*.md 2>/dev/null | sed "s|$HISTORY_DIR/||" | nl
}

# Find sessions about a topic
find_topic() {
    local topic=$1
    if [ -z "$topic" ]; then
        echo "Error: Please provide a topic"
        echo "Usage: ./specstory-utils.sh find-topic <topic>"
        exit 1
    fi
    
    echo -e "${BLUE}Sessions about topic:${NC} $topic"
    echo ""
    grep -l -i "$topic" "$HISTORY_DIR"/*.md 2>/dev/null | sed "s|$HISTORY_DIR/||" | nl
}

# Show full session content
show_session() {
    local filename=$1
    if [ -z "$filename" ]; then
        echo "Error: Please provide a filename"
        echo "Usage: ./specstory-utils.sh show <filename>"
        exit 1
    fi
    
    local filepath="$HISTORY_DIR/$filename"
    if [ ! -f "$filepath" ]; then
        echo "Error: File not found: $filepath"
        exit 1
    fi
    
    echo -e "${BLUE}Session:${NC} $filename"
    echo ""
    cat "$filepath"
}

# Show statistics
show_stats() {
    echo -e "${BLUE}SpecStory Statistics:${NC}"
    echo ""
    
    local total=$(ls -1 "$HISTORY_DIR"/*.md 2>/dev/null | wc -l | tr -d ' ')
    echo "Total sessions: $total"
    
    if [ "$total" -gt 0 ]; then
        local total_size=$(du -sh "$HISTORY_DIR" 2>/dev/null | awk '{print $1}')
        echo "Total size: $total_size"
        
        echo ""
        echo -e "${YELLOW}Oldest session:${NC}"
        ls -t "$HISTORY_DIR"/*.md 2>/dev/null | tail -1 | xargs basename
        
        echo ""
        echo -e "${YELLOW}Newest session:${NC}"
        ls -t "$HISTORY_DIR"/*.md 2>/dev/null | head -1 | xargs basename
        
        echo ""
        echo -e "${YELLOW}Largest session:${NC}"
        ls -lhS "$HISTORY_DIR"/*.md 2>/dev/null | head -1 | awk '{print $9 " (" $5 ")"}' | sed "s|$HISTORY_DIR/||"
    fi
    
    # Feature docs stats
    if [ -d "$FEATURES_DIR" ]; then
        local feature_count=$(ls -1 "$FEATURES_DIR"/*.md 2>/dev/null | grep -v TEMPLATE | wc -l | tr -d ' ')
        if [ "$feature_count" -gt 0 ]; then
            echo ""
            echo -e "${GREEN}Feature Documentation:${NC}"
            echo "Total features documented: $feature_count"
        fi
    fi
}

# List feature documentation
list_features() {
    if [ ! -d "$FEATURES_DIR" ]; then
        echo "Features directory not found: $FEATURES_DIR"
        exit 1
    fi
    
    echo -e "${BLUE}Feature Documentation:${NC}"
    echo ""
    ls -lh "$FEATURES_DIR"/*.md 2>/dev/null | grep -v TEMPLATE | awk '{print $9, "(" $5 ")"}' | sed "s|$FEATURES_DIR/||" | nl
}

# Show feature document
show_feature() {
    local name=$1
    if [ -z "$name" ]; then
        echo "Error: Please provide a feature name"
        echo "Usage: ./specstory-utils.sh feature <name>"
        echo ""
        echo "Available features:"
        list_features
        exit 1
    fi
    
    # Try exact match first
    local filepath="$FEATURES_DIR/$name"
    if [ ! -f "$filepath" ]; then
        # Try with .md extension
        filepath="$FEATURES_DIR/${name}.md"
        if [ ! -f "$filepath" ]; then
            # Try partial match
            filepath=$(ls "$FEATURES_DIR"/*${name}*.md 2>/dev/null | grep -v TEMPLATE | head -1)
            if [ -z "$filepath" ] || [ ! -f "$filepath" ]; then
                echo "Error: Feature not found: $name"
                echo ""
                echo "Available features:"
                list_features
                exit 1
            fi
        fi
    fi
    
    echo -e "${BLUE}Feature:${NC} $(basename $filepath)"
    echo ""
    cat "$filepath"
}

# Main command handler
main() {
    case "${1:-list}" in
        list)
            list_sessions
            ;;
        latest)
            show_latest "$2"
            ;;
        search)
            search_sessions "$2"
            ;;
        find-file)
            find_file "$2"
            ;;
        find-topic)
            find_topic "$2"
            ;;
        show)
            show_session "$2"
            ;;
        stats)
            show_stats
            ;;
        features)
            list_features
            ;;
        feature)
            show_feature "$2"
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            echo "Unknown command: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

main "$@"
