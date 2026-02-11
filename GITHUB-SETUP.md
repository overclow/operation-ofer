# GitHub Repository Setup for Operation Ofer

This guide shows how to create and push the Operation Ofer project to GitHub.

## Prerequisites

- GitHub account: https://github.com
- Git installed on your local machine
- Project already initialized and committed locally ✅

## Step 1: Create GitHub Repository

### Via GitHub Web UI (Easiest)

1. Go to **https://github.com/new**
2. Fill in the details:
   - **Repository name**: `operation-ofer`
   - **Description**: Angular 11.1.1 ECharts Axis Positioning Application - Drag & drop interface for positioning items on X/Y axes
   - **Visibility**: **Public** (or Private if you prefer)
   - **Initialize**: Leave empty (we already have commits)
3. Click **Create repository**

### Via GitHub CLI

```bash
gh auth login  # Authenticate with GitHub first (one time)

cd /Users/overclaw/projects/operation-ofer
gh repo create operation-ofer --public --source=. --remote=origin --push
```

## Step 2: Get Your GitHub Username

Visit https://github.com/settings/profile and note your username (or use `gh auth status`).

## Step 3: Configure Git Remote

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
cd /Users/overclaw/projects/operation-ofer

# Add the GitHub remote (if not using gh CLI)
git remote add origin https://github.com/YOUR_USERNAME/operation-ofer.git

# Set main as default branch
git branch -M main

# Push code to GitHub
git push -u origin main
```

**Example** (if your username is "overclaw"):
```bash
git remote add origin https://github.com/overclaw/operation-ofer.git
git push -u origin main
```

## Step 4: Verify Push

Check that code is on GitHub:

```bash
# View remote
git remote -v

# Check GitHub
# Visit: https://github.com/YOUR_USERNAME/operation-ofer
```

Expected output from `git remote -v`:
```
origin  https://github.com/YOUR_USERNAME/operation-ofer.git (fetch)
origin  https://github.com/YOUR_USERNAME/operation-ofer.git (push)
```

## Step 5: Create Personal Access Token (for Jenkins)

Jenkins needs authentication to pull from GitHub.

1. Go to **https://github.com/settings/tokens**
2. Click **Generate new token (classic)**
3. **Token name**: `jenkins-operation-ofer`
4. **Expiration**: 90 days (or No expiration)
5. **Scopes**: Check these:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
6. Click **Generate token**
7. **Copy the token** (you won't see it again!)

## Step 6: Add Token to Jenkins

Now Jenkins can authenticate with GitHub.

1. Open Jenkins: http://localhost:8080
2. Go to **Manage Jenkins** → **Manage Credentials**
3. Click **System** (on the left)
4. Click **Global credentials (unrestricted)**
5. Click **+ Add Credentials**
6. Fill in:
   - **Kind**: Username with password
   - **Username**: `YOUR_USERNAME`
   - **Password**: Paste the PAT you generated
   - **ID**: `github-token`
   - **Description**: GitHub PAT for operation-ofer
7. Click **Create**

## Step 7: Test Authentication

Verify the token works:

```bash
# Replace YOUR_TOKEN and YOUR_USERNAME
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/user

# Should return your GitHub user info
```

## Step 8: Set Up GitHub Webhook (Optional but Recommended)

GitHub can automatically trigger Jenkins builds when you push code.

1. Go to your GitHub repo: https://github.com/YOUR_USERNAME/operation-ofer
2. **Settings** → **Webhooks** → **Add webhook**
3. Fill in:
   - **Payload URL**: `http://localhost:8080/github-webhook/`
   - **Content type**: `application/json`
   - **Events**: 
     - ✅ Push events
     - ✅ Pull requests
   - **Active**: ✅ Checked
4. Click **Add webhook**

Test webhook:
- Go to **Settings** → **Webhooks**
- Click the webhook
- Click **Recent Deliveries**
- You should see a successful delivery (green checkmark)

## Verification Checklist

- ✅ GitHub repository created
- ✅ Code pushed to `main` branch
- ✅ PAT generated and saved
- ✅ Jenkins credentials added
- ✅ GitHub webhook configured (optional)

## Common Issues

### "fatal: remote origin already exists"

The remote was already added. List existing remotes:
```bash
git remote -v
```

To remove and re-add:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/operation-ofer.git
```

### "fatal: 'origin' does not appear to be a 'git' repository"

This means the remote isn't configured. Add it:
```bash
git remote add origin https://github.com/YOUR_USERNAME/operation-ofer.git
```

### "Permission denied (publickey)"

You're using SSH. Either:
1. Use HTTPS instead: `https://github.com/YOUR_USERNAME/operation-ofer.git`
2. Or configure SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### Jenkins Can't Access Repository

Make sure:
1. Repository is public OR
2. Credentials are added to Jenkins with correct PAT
3. Webhook shows successful delivery

## Next Steps

1. ✅ Repository created on GitHub
2. ✅ Code pushed to main branch
3. ✅ PAT created for Jenkins
4. ➡️ **Create Jenkins job** (see JENKINS-SETUP.md)
5. ➡️ **Trigger first build**
6. ➡️ **Access at http://localhost:4200**

## Useful Links

- GitHub Docs: https://docs.github.com
- GitHub CLI: https://cli.github.com
- Creating PAT: https://github.com/settings/tokens
- Repository Settings: https://github.com/YOUR_USERNAME/operation-ofer/settings
