# Trello Task Automation for Operation Ofer

This document explains the automated Trello task monitoring system for the operation-ofer project.

## Overview

The system monitors your Trello board at https://trello.com/b/o8op032E/operation-ofer every 5 minutes and automatically executes tasks from the "To Do" list.

## How It Works

### 1. Task Monitoring (Every 5 Minutes)

The cron job runs every 300 seconds (5 minutes) and:

1. **Fetches tasks** from the "To Do" list on your Trello board
2. **Moves task** to "In Progress" list
3. **Executes the task** based on the card name/description
4. **Takes a screenshot** of the result
5. **Updates the Trello card** with:
   - Comment describing what was done
   - Screenshot attachment
6. **Moves task** to "Done" list

### 2. Supported Task Types

The system recognizes and executes:

| Task Name | Action | Result |
|-----------|--------|--------|
| **GitHub** | Push code to GitHub | `git push origin main` |
| **Jenkins** | Trigger Jenkins build | POST to Jenkins webhook |
| **Build** | Build Angular app | `npm run build` |
| **Deploy** | Deploy & serve app | Start `ng serve` on port 4200 |
| **Test** | Run tests | `npm test` |

### 3. Trello Board Setup

**Board**: https://trello.com/b/o8op032E/operation-ofer

**Lists Required**:
- 📋 **To Do** - Tasks to execute
- 🔄 **In Progress** - Currently executing
- ✅ **Done** - Completed tasks

**Task Cards**:
- Card Name: Task description (e.g., "Build Angular App")
- Card Description: Optional details
- Attachments: Screenshots added automatically

## Configuration

### Cron Job Details

```
Schedule: Every 5 minutes (300 seconds)
Type: Agent Turn (isolated session)
Status: Enabled ✅
Next Run: Automatically scheduled
```

### Trello API

- **API Key**: Stored in `TRELLO_API_KEY` environment variable
- **Token**: Stored in `TRELLO_TOKEN` environment variable
- **Board ID**: `o8op032E`
- **Lists**: 
  - To Do: `698b52ce5c83ae17711f251f`
  - In Progress: `698b52d5e6fcab9b5d7017b2`
  - Done: `698b52ce5c83ae17711f2521`

## Monitoring the System

### Check Status

```bash
# View latest log
tail -50 /tmp/trello-task-monitor.log

# View screenshots taken
ls -lh /tmp/trello-screenshots/

# Check cron job status
# (Managed through OpenClaw cron system)
```

### View Results on Trello

1. Go to: https://trello.com/b/o8op032E/operation-ofer
2. Open a "Done" list card
3. You'll see:
   - 💬 **Comments** - What was executed and when
   - 📎 **Attachments** - Screenshot of the result

### Example Card Flow

**Initial State:**
```
Card: "Build Angular App"
List: "To Do"
```

**During Execution:**
```
Card: "Build Angular App"
List: "In Progress"
Comments: "Building..."
```

**Completed:**
```
Card: "Build Angular App"
List: "Done"
Comments: "✅ Build completed: Built application with 0 errors"
Attachments: [screenshot.png]
```

## Task Definition Examples

### Simple Task (Build)

**Card Name**: `Build Angular App`
**Card Description**: (optional)
**Result**: 
- Runs: `npm run build`
- Takes screenshot
- Updates Trello with result

### Complex Task (Deploy)

**Card Name**: `Deploy Application`
**Card Description**: Start development server on port 4200
**Result**:
- Runs: `ng serve --poll=2000`
- Waits 3 seconds for startup
- Takes screenshot
- Updates Trello with deployment status

### GitHub Task

**Card Name**: `Push to GitHub`
**Card Description**: (optional)
**Result**:
- Runs: `git push origin main`
- Takes screenshot
- Updates Trello with push result

## Logs

### Monitor Real-Time Logs

```bash
tail -f /tmp/trello-task-monitor.log
```

### Log Format

```
[2026-02-11 12:15:30] 🔍 Checking Trello board for tasks...
[2026-02-11 12:15:31] Found 2 tasks in To Do list
[2026-02-11 12:15:31] Processing tasks...
[2026-02-11 12:15:31] ==========================================
[2026-02-11 12:15:31] Executing Task: Build Angular App
[2026-02-11 12:15:31] Card ID: 698b52de630033be0a4a7100
[2026-02-11 12:15:32] Moved card 698b52de630033be0a4a7100 to list 698b52d5e6fcab9b5d7017b2
[2026-02-11 12:15:45] Attached screenshot to card 698b52de630033be0a4a7100
[2026-02-11 12:15:46] Added comment to card: ✅ Build completed: Built application with 0 errors
[2026-02-11 12:15:46] Task completed and moved to Done list
[2026-02-11 12:15:47] ✅ Monitoring cycle complete
```

## Screenshots

All screenshots are saved to `/tmp/trello-screenshots/` with timestamp filenames:

```
/tmp/trello-screenshots/
├── screenshot-1707606931.png   (2026-02-11 12:15:31)
├── screenshot-1707607231.png   (2026-02-11 12:20:31)
└── screenshot-1707607531.png   (2026-02-11 12:25:31)
```

## Troubleshooting

### No Tasks Being Executed

1. **Check Trello List ID**:
   ```bash
   curl -s "https://api.trello.com/1/boards/o8op032E?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}&lists=open" | jq '.lists'
   ```

2. **Verify Credentials**:
   ```bash
   echo $TRELLO_API_KEY
   echo $TRELLO_TOKEN
   ```

3. **Check Card List Position**:
   - Make sure cards are in the "To Do" list
   - Card name should match a recognized task type

### Credentials Not Working

1. **Generate New Token**:
   - Go to: https://trello.com/app-key
   - Click "Token" link
   - Copy new token
   - Update environment variables

2. **Set Environment**:
   ```bash
   export TRELLO_API_KEY="your_key"
   export TRELLO_TOKEN="your_token"
   ```

### Cron Job Not Running

1. **Check if enabled**:
   ```bash
   # OpenClaw cron status
   ```

2. **Check logs**:
   - View `/tmp/trello-task-monitor.log`
   - Look for errors

3. **Manual test**:
   ```bash
   bash /Users/overclaw/projects/operation-ofer/trello-task-monitor.sh
   ```

## Advanced Usage

### Add Custom Task Type

Edit `trello-task-monitor.sh` and add to the case statement:

```bash
*"CustomTask"*)
    log "Task: Custom Task Execution"
    task_output=$(your_command_here 2>&1)
    screenshot=$(take_screenshot)
    add_attachment_to_card "$card_id" "$screenshot"
    add_comment_to_card "$card_id" "✅ Custom task completed"
    ;;
```

### Change Monitoring Interval

Default is every 5 minutes (300 seconds). To change:

1. Update cron schedule in OpenClaw
2. Or modify shell script timing

## Integration Points

| System | Integration |
|--------|-------------|
| **Trello** | Task source + result updates |
| **GitHub** | Push commits from tasks |
| **Jenkins** | Trigger builds |
| **Angular** | Build & deploy |
| **Screenshots** | Visual verification |

## Future Enhancements

- [ ] Support for parallel task execution
- [ ] Task priority/queue management
- [ ] Email notifications on task completion
- [ ] Slack integration
- [ ] Custom webhook notifications
- [ ] Task result filtering/aggregation
- [ ] Performance metrics tracking

## Support

For issues or questions:

1. Check `/tmp/trello-task-monitor.log`
2. View Trello card comments for execution details
3. Review attached screenshots
4. Check Trello API documentation: https://developer.atlassian.com/cloud/trello/rest/

## Summary

✅ **Status**: Automated task monitoring active  
📋 **Frequency**: Every 5 minutes  
📊 **Logs**: `/tmp/trello-task-monitor.log`  
📸 **Screenshots**: `/tmp/trello-screenshots/`  
🔗 **Board**: https://trello.com/b/o8op032E/operation-ofer
