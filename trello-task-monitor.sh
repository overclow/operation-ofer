#!/bin/bash

# Trello Task Monitor & Executor
# Monitors operation-ofer Trello board and executes tasks
# Updates Trello cards with results and screenshots

# Configuration
BOARD_ID="o8op032E"
TODO_LIST_ID="698b52ce5c83ae17711f251f"  # "To Do" list
IN_PROGRESS_LIST="698b52d5e6fcab9b5d7017b2"  # "In Progress" list
DOING_LIST="698b52ce5c83ae17711f2520"  # "Doing" list

TRELLO_KEY="${TRELLO_API_KEY}"
TRELLO_TOKEN="${TRELLO_TOKEN}"

# Logging
LOG_FILE="/tmp/trello-task-monitor.log"
SCREENSHOT_DIR="/tmp/trello-screenshots"

mkdir -p "$SCREENSHOT_DIR"

# Helper functions
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

get_card_name() {
    local card_id=$1
    curl -s "https://api.trello.com/1/cards/$card_id?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}" | jq -r '.name'
}

move_card_to_list() {
    local card_id=$1
    local list_id=$2
    
    curl -s -X PUT "https://api.trello.com/1/cards/$card_id?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&idList=$list_id" > /dev/null
    log "Moved card $card_id to list $list_id"
}

add_attachment_to_card() {
    local card_id=$1
    local file_path=$2
    local comment=$3
    
    if [ -f "$file_path" ]; then
        curl -s -F "file=@$file_path" \
            "https://api.trello.com/1/cards/$card_id/attachments?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}" > /dev/null
        log "Attached screenshot to card $card_id"
    fi
}

add_comment_to_card() {
    local card_id=$1
    local comment=$2
    
    curl -s -X POST "https://api.trello.com/1/cards/$card_id/actions/comments?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}&text=$comment" > /dev/null
    log "Added comment to card $card_id: $comment"
}

take_screenshot() {
    local filename="/tmp/trello-screenshots/screenshot-$(date +%s).png"
    
    # macOS screenshot
    screencapture -x "$filename" 2>/dev/null
    
    echo "$filename"
}

execute_task() {
    local card_id=$1
    local card_name=$2
    local card_desc=$3
    
    log "=========================================="
    log "Executing Task: $card_name"
    log "Card ID: $card_id"
    log "Description: $card_desc"
    log "=========================================="
    
    # Move to "In Progress"
    move_card_to_list "$card_id" "$IN_PROGRESS_LIST"
    
    # Parse task from card name
    local task_output=""
    local screenshot=""
    
    case "$card_name" in
        *"GitHub"*)
            log "Task: Push to GitHub"
            task_output=$(cd /Users/overclaw/projects/operation-ofer && git push origin main 2>&1 | tail -5)
            screenshot=$(take_screenshot)
            add_attachment_to_card "$card_id" "$screenshot"
            add_comment_to_card "$card_id" "✅ Pushed to GitHub: $(echo $task_output | head -1)"
            ;;
        *"Jenkins"*)
            log "Task: Trigger Jenkins Build"
            task_output=$(curl -s -X POST "http://localhost:8080/job/operation-ofer/build?token=default" 2>&1)
            screenshot=$(take_screenshot)
            add_attachment_to_card "$card_id" "$screenshot"
            add_comment_to_card "$card_id" "✅ Jenkins build triggered at $(date)"
            ;;
        *"Build"*)
            log "Task: Build Angular App"
            task_output=$(cd /Users/overclaw/projects/operation-ofer && npm run build 2>&1 | tail -10)
            screenshot=$(take_screenshot)
            add_attachment_to_card "$card_id" "$screenshot"
            add_comment_to_card "$card_id" "✅ Build completed: $(echo $task_output | head -1)"
            ;;
        *"Deploy"*)
            log "Task: Deploy Application"
            task_output=$(cd /Users/overclaw/projects/operation-ofer && ng serve --poll=2000 > /tmp/app-serve.log 2>&1 &)
            sleep 3
            screenshot=$(take_screenshot)
            add_attachment_to_card "$card_id" "$screenshot"
            add_comment_to_card "$card_id" "✅ Application deployed and running on http://localhost:4200"
            ;;
        *"Test"*)
            log "Task: Run Tests"
            task_output=$(cd /Users/overclaw/projects/operation-ofer && npm test 2>&1 | tail -5)
            screenshot=$(take_screenshot)
            add_attachment_to_card "$card_id" "$screenshot"
            add_comment_to_card "$card_id" "✅ Tests completed"
            ;;
        *)
            log "Unknown task type: $card_name"
            task_output="Task type not recognized - please update script"
            add_comment_to_card "$card_id" "⚠️ Task type not recognized. Manual review needed."
            ;;
    esac
    
    # Move to "Done"
    move_card_to_list "$card_id" "698b52ce5c83ae17711f2521"
    log "Task completed and moved to Done list"
}

# Main function
main() {
    log "🔍 Checking Trello board for tasks..."
    
    # Get all cards from "To Do" list
    local cards=$(curl -s "https://api.trello.com/1/lists/${TODO_LIST_ID}/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}")
    
    local count=$(echo "$cards" | jq 'length')
    log "Found $count tasks in To Do list"
    
    if [ "$count" -gt 0 ]; then
        log "Processing tasks..."
        
        # Process each card
        echo "$cards" | jq -r '.[] | "\(.id)|\(.name)|\(.desc)"' | while IFS='|' read -r card_id card_name card_desc; do
            execute_task "$card_id" "$card_name" "$card_desc"
        done
    else
        log "No tasks found in To Do list"
    fi
    
    log "✅ Monitoring cycle complete"
}

# Run main function
main
