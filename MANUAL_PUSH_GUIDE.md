# Manual Instructions to Push Code to GitHub

Since we've been having persistent authentication issues, here's a step-by-step manual approach to push your code to GitHub.

## Step 1: Create a Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token"
3. Give it a name like "Scanitknowit Push"
4. Select the `repo` scope (full control of private repositories)
5. Click "Generate token"
6. Copy the generated token (you won't see it again) - it looks like a long string of characters like `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Step 2: Add Remote with Token Authentication

Run this command in your terminal (replace YOUR_USERNAME and YOUR_TOKEN with your actual values):

```bash
git remote add origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/Scanitknowit.git
```

For example:
```bash
git remote add origin https://ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@github.com/jahnavitry-tech/Scanitknowit.git
```

## Step 3: Push the Code

```bash
git push -u origin main
```

## Alternative Method: Using Username/Password (Less Secure)

If the token method doesn't work, you can try this method (but it's less secure):

1. Add the remote without authentication:
   ```bash
   git remote add origin https://github.com/jahnavitry-tech/Scanitknowit.git
   ```

2. When you push, Git will prompt for credentials:
   ```bash
   git push -u origin main
   ```

   Enter:
   - Username: jahnavitry-tech
   - Password: YOUR_PERSONAL_ACCESS_TOKEN (not your regular password)

## If Repository Already Exists

If the repository already exists on GitHub, you might need to force push:

```bash
git push -u origin main --force
```

## Troubleshooting

### Clear Cached Credentials (Windows)

1. Open Control Panel
2. Go to User Accounts
3. Click "Credential Manager"
4. Select "Windows Credentials"
5. Look for any GitHub-related credentials and remove them
6. Try pushing again

### Verify Remote URL

Check that your remote URL is correct:
```bash
git remote -v
```

You should see:
```
origin  https://github.com/jahnavitry-tech/Scanitknowit.git (fetch)
origin  https://github.com/jahnavitry-tech/Scanitknowit.git (push)
```

### Check Current Branch

Make sure you're on the main branch:
```bash
git branch
```

If you're not on main, switch to it:
```bash
git checkout main
```

## Verification

After successfully pushing, visit https://github.com/jahnavitry-tech/Scanitknowit to verify that your code is there.

The repository should contain:
- Frontend React components in `src/`
- Backend API in `api/analyze.js`
- Configuration files (`package.json`, `vite.config.js`, etc.)
- Documentation files (`README.md`, `DEPLOYMENT.md`, etc.)