# Deployment Instructions

This document provides step-by-step instructions for deploying the Scanitknowit application to the GitHub repository.

## Prerequisites

1. Git must be installed on your system
2. You must have a GitHub account
3. You must have the necessary permissions to push to the repository

## Option 1: Push an Existing Repository

If you've already cloned or downloaded the repository files, follow these steps:

```bash
# Navigate to the project directory
cd Scanitknowit

# Initialize Git repository (if not already done)
git init

# Add all files to Git
git add .

# Commit the files
git commit -m "Initial commit: Complete Lens-style product scanner implementation"

# Set the main branch
git branch -M main

# Add the remote origin
git remote add origin https://github.com/jahnavitry-tech/Scanitknowit.git

# Push to GitHub
git push -u origin main
```

## Option 2: Create a New Repository

If you're starting from scratch, follow these steps:

```bash
# Navigate to the project directory
cd Scanitknowit

# Initialize Git repository
git init

# Add the README file first
echo "# Scanitknowit" >> README.md
git add README.md

# Make the first commit
git commit -m "first commit"

# Set the main branch
git branch -M main

# Add the remote origin
git remote add origin https://github.com/jahnavitry-tech/Scanitknowit.git

# Push to GitHub
git push -u origin main

# Add all remaining files
git add .

# Commit the rest of the files
git commit -m "Add complete Lens-style product scanner implementation"

# Push to GitHub
git push
```

## Verification

After pushing, you can verify that everything was uploaded correctly by visiting:
https://github.com/jahnavitry-tech/Scanitknowit

You should see all the files and directories including:
- `api/` directory with `analyze.js`
- `src/` directory with all React components
- Configuration files (`package.json`, `vite.config.js`, etc.)
- Documentation files (`README.md`, `LICENSE`, etc.)

## Post-Deployment

After deployment, users can clone and run the application with:

```bash
# Clone the repository
git clone https://github.com/jahnavitry-tech/Scanitknowit.git
cd Scanitknowit

# Install dependencies
npm install

# Run the application
npm start
```

Then open http://localhost:5173 in their browser.