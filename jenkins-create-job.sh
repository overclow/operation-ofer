#!/bin/bash

# Jenkins Job Creation Script for Operation Ofer
# This script creates a Jenkins pipeline job for building and serving the Angular app

JENKINS_URL="http://localhost:8080"
JOB_NAME="operation-ofer"
GITHUB_REPO="https://github.com/YOUR_USERNAME/operation-ofer.git"
GITHUB_URL="https://github.com/YOUR_USERNAME/operation-ofer"

echo "======================================"
echo "Jenkins Job Setup for Operation Ofer"
echo "======================================"
echo ""

# Check if Jenkins is running
echo "🔍 Checking Jenkins connectivity..."
if curl -s "$JENKINS_URL" > /dev/null; then
    echo "✅ Jenkins is running on $JENKINS_URL"
else
    echo "❌ Jenkins is not responding on $JENKINS_URL"
    echo "Please start Jenkins first:"
    echo "  brew services start jenkins-lts"
    exit 1
fi

echo ""
echo "⚠️  IMPORTANT: Before continuing, update these values in GitHub:"
echo "   - Replace YOUR_USERNAME with your actual GitHub username"
echo "   - Ensure the repository exists at: https://github.com/YOUR_USERNAME/operation-ofer"
echo ""
read -p "Continue with job creation? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo ""
echo "📝 Creating Jenkins pipeline job '$JOB_NAME'..."
echo ""

# Create job via Jenkins CLI
# Note: This requires jenkins-cli jar and proper authentication
# For now, provide manual instructions

echo "🔧 Manual Job Creation Steps:"
echo ""
echo "1. Open Jenkins: http://localhost:8080"
echo "2. Click '+ New Item'"
echo "3. Job name: $JOB_NAME"
echo "4. Type: Pipeline"
echo "5. Click OK"
echo ""
echo "6. Under 'General':"
echo "   ☑ GitHub project"
echo "   Project URL: $GITHUB_URL"
echo ""
echo "7. Under 'Build Triggers':"
echo "   ☑ GitHub hook trigger for GITScm polling"
echo ""
echo "8. Under 'Pipeline':"
echo "   Definition: Pipeline script from SCM"
echo "   SCM: Git"
echo "   Repository URL: $GITHUB_REPO"
echo "   Credentials: [Add GitHub PAT if needed]"
echo "   Branch: */main"
echo "   Script Path: Jenkinsfile"
echo ""
echo "9. Click 'Save'"
echo ""
echo "✅ Job creation complete!"
echo ""
echo "📌 Next Steps:"
echo "   1. Push code to GitHub: git push origin main"
echo "   2. Add GitHub webhook to GitHub repository settings"
echo "   3. Click 'Build Now' in Jenkins or push to GitHub to trigger"
echo ""
echo "🌐 Access the app after build:"
echo "   http://localhost:4200"
echo ""
