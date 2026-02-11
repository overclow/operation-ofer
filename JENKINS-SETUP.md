# Jenkins Setup for Operation Ofer

This guide explains how to set up the Operation Ofer Angular project in Jenkins with GitHub integration and automatic deployment.

## Prerequisites

- Jenkins running on `http://localhost:8080`
- GitHub account with personal access token
- Git installed locally
- GitHub CLI (optional but recommended)

## Step 1: Create GitHub Repository

### Option A: Using GitHub Web Interface

1. Go to https://github.com/new
2. **Repository name**: `operation-ofer`
3. **Description**: Angular 11.1.1 ECharts Axis Positioning Application
4. **Visibility**: Public
5. Click **Create repository**

### Option B: Using GitHub CLI

```bash
gh auth login  # First time only - authenticate with GitHub

cd /Users/overclaw/projects/operation-ofer
gh repo create operation-ofer --public --source=. --remote=origin --push
```

## Step 2: Configure Git Remote

Once you have the GitHub repository created:

```bash
cd /Users/overclaw/projects/operation-ofer

# Add remote (if not using gh CLI)
git remote add origin https://github.com/YOUR_USERNAME/operation-ofer.git

# Push code
git branch -M main
git push -u origin main
```

**Expected URL**: `https://github.com/YOUR_USERNAME/operation-ofer.git`

## Step 3: Create Jenkins Job

### Via Jenkins Web UI

1. **Open** Jenkins: http://localhost:8080
2. Click **+ New Item**
3. **Job Name**: `operation-ofer`
4. **Type**: Pipeline
5. Click **OK**

### Configure Pipeline

In the job configuration:

1. **General Tab**:
   - Check: **GitHub project**
   - Project URL: `https://github.com/YOUR_USERNAME/operation-ofer`

2. **Build Triggers** Tab:
   - ☑ GitHub hook trigger for GITScm polling

3. **Pipeline** Tab:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
     - **Repository URL**: `https://github.com/YOUR_USERNAME/operation-ofer.git`
     - **Credentials**: (Select or add GitHub PAT)
     - **Branch**: `*/main`
   - **Script Path**: `Jenkinsfile`

4. Click **Save**

### Via Jenkins CLI (Alternative)

```bash
jenkins-lts-cli -s http://localhost:8080 create-job operation-ofer < jenkins-config.xml
```

## Step 4: GitHub Webhook Setup

### Add Webhook to GitHub Repository

1. Go to your GitHub repo: https://github.com/YOUR_USERNAME/operation-ofer
2. **Settings** → **Webhooks** → **Add webhook**
3. **Payload URL**: `http://your-jenkins-host:8080/github-webhook/`
4. **Content type**: `application/json`
5. **Events**: 
   - ☑ Push events
   - ☑ Pull requests
6. Click **Add webhook**

## Step 5: Trigger First Build

### Via Jenkins Web UI

1. Go to http://localhost:8080/job/operation-ofer
2. Click **Build Now**
3. Watch the build logs

### Via GitHub Push

```bash
cd /Users/overclaw/projects/operation-ofer
echo "# Build trigger" >> README.md
git add README.md
git commit -m "Trigger Jenkins build"
git push origin main
```

## Build Details

The Jenkinsfile performs these stages:

1. **Checkout** - Clone repository
2. **Setup** - Verify Node.js and npm
3. **Install Dependencies** - `npm install --legacy-peer-deps`
4. **Lint** - Run linter (optional)
5. **Build** - `npm run build -- --configuration=production`
6. **Archive Build** - Verify build artifacts
7. **Verify Server Port** - Check port 4200 availability
8. **Deploy & Serve** - Start Angular dev server
9. **Health Check** - Verify server is responding
10. **Report** - Display build summary

## Access the Application

After successful build:

```
URL: http://localhost:4200
Logs: /tmp/operation-ofer-serve.log
```

## Troubleshooting

### GitHub Authentication Issues

1. Create GitHub Personal Access Token:
   - Go to https://github.com/settings/tokens
   - Click **Generate new token (classic)**
   - Scopes: `repo`, `workflow`
   - Copy token

2. Add to Jenkins:
   - Jenkins → Credentials → System → Global credentials
   - Click **+ Add credentials**
   - Kind: **Username with password**
   - Username: Your GitHub username
   - Password: Personal access token
   - ID: `github-token`

### Port 4200 Already in Use

The pipeline automatically kills existing processes on port 4200:

```bash
lsof -ti:4200 | xargs kill -9
```

Or manually:

```bash
sudo lsof -i :4200
kill -9 <PID>
```

### Node Version Issues

The pipeline uses Node 18. If issues occur:

```bash
node --version  # Should be v18.x
npm --version   # Should be 9.x or 10.x
```

## Environment Variables

To customize the build, set Jenkins environment variables:

```groovy
environment {
    NODE_VERSION = '18'          # Node.js version
    PORT = '4200'                # Server port
    APP_NAME = 'operation-ofer'  # Application name
}
```

## Deployment Options

### Option 1: Development Server (Current)

Server runs via `ng serve` - hot reload enabled, perfect for development.

### Option 2: Production Build

To serve production build:

```bash
npx http-server dist/operation-ofer -p 4200 -g
```

### Option 3: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build -- --configuration=production
EXPOSE 4200
CMD ["npx", "http-server", "dist/operation-ofer", "-p", "4200"]
```

Build and run:

```bash
docker build -t operation-ofer .
docker run -p 4200:4200 operation-ofer
```

## Pipeline Status

Once configured, you can:

1. **Monitor builds**: http://localhost:8080/job/operation-ofer
2. **View logs**: Click build → **Console Output**
3. **Check commits**: Click **Git Polling Log**

## Key Files

| File | Purpose |
|------|---------|
| `Jenkinsfile` | Pipeline definition |
| `package.json` | Dependencies and build scripts |
| `angular.json` | Angular build configuration |
| `README.md` | Project documentation |

## Support

For issues:

- Check Jenkins logs: `/var/log/jenkins/jenkins.log`
- Check build logs: http://localhost:8080/job/operation-ofer/lastBuild/console
- Review GitHub Actions if using GitHub workflows

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Push code to GitHub
3. ✅ Create Jenkins job with Jenkinsfile
4. ✅ Set up GitHub webhook
5. ✅ Trigger first build
6. ✅ Access http://localhost:4200
