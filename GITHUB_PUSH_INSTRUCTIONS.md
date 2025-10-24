# How to Push This Repository to GitHub

Since we encountered authentication issues when trying to push the code programmatically, here's how you can manually push this repository to your GitHub account.

## Prerequisites

1. Make sure you have Git installed on your system
2. Make sure you have proper permissions to the `jahnavitry-tech/Scanitknowit` repository

## Steps to Push the Repository

### Option 1: Using the Batch Script (Recommended)

1. Double-click on the `PUSH_TO_GITHUB.bat` file in this folder
2. When prompted for credentials, enter:
   - Username: Your GitHub username (`jahnavitry-tech`)
   - Password: Your GitHub Personal Access Token (NOT your regular password)

### Option 2: Manual Commands

1. Open a terminal/command prompt in this directory
2. Run the following commands:

```bash
# Configure Git user
git config user.name "jahnavitry-tech"
git config user.email "your-email@example.com"

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Scanitknowit Lens-style product scanner"

# Add remote origin
git remote add origin https://github.com/jahnavitry-tech/Scanitknowit.git

# Rename branch to main
git branch -M main

# Push to GitHub (this will prompt for credentials)
git push -u origin main
```

## Creating a Personal Access Token

If you don't have a Personal Access Token yet, you'll need to create one:

1. Go to https://github.com/settings/tokens
2. Click "Generate new token"
3. Select the appropriate scopes (at minimum `repo` scope)
4. Generate the token and copy it
5. Use this token as your password when pushing to GitHub

## Troubleshooting

If you continue to have issues:

1. Make sure you have proper permissions to the repository
2. Verify that the repository URL is correct
3. Clear any cached credentials in Windows Credential Manager
4. Try using SSH instead of HTTPS (requires SSH key setup)

For more help, visit: https://docs.github.com/en/authentication