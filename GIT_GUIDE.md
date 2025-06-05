# Git Usage Guide for Examinr Project

## Table of Contents
1. [Git Setup Status](#git-setup-status)
2. [Basic Git Commands](#basic-git-commands)
3. [Branch Management](#branch-management)
4. [Working with GitHub](#working-with-github)
5. [Daily Workflow](#daily-workflow)
6. [Emergency Recovery](#emergency-recovery)
7. [Best Practices](#best-practices)

## Git Setup Status

✅ **Git is now initialized in your project!**
- Repository created at: `/home/itzprince/examinr/`
- Initial commit made with all project files
- .gitignore configured to exclude sensitive files and dependencies

## Basic Git Commands

### Check Status
```bash
git status
```
Shows which files are modified, staged, or untracked.

### View History
```bash
git log --oneline
```
Shows commit history in a compact format.

### Stage Changes
```bash
# Stage specific files
git add filename.js

# Stage all changes
git add .

# Stage all changes in a directory
git add frontend/
```

### Commit Changes
```bash
# Commit with a message
git commit -m "Add user authentication feature"

# Commit with detailed message
git commit -m "Fix login bug" -m "Users were unable to login due to incorrect token validation"
```

### View Changes
```bash
# See unstaged changes
git diff

# See staged changes
git diff --staged

# See changes in a specific file
git diff filename.js
```

## Branch Management

### Create and Switch Branches
```bash
# Create a new branch
git branch feature/new-feature

# Switch to a branch
git checkout feature/new-feature

# Create and switch in one command
git checkout -b feature/new-feature
```

### List Branches
```bash
# List local branches
git branch

# List all branches (including remote)
git branch -a
```

### Merge Branches
```bash
# First, switch to main branch
git checkout main

# Then merge your feature branch
git merge feature/new-feature
```

### Delete Branches
```bash
# Delete a merged branch
git branch -d feature/old-feature

# Force delete a branch
git branch -D feature/abandoned-feature
```

## Working with GitHub

### 1. Create a GitHub Repository
1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it: `examinr`
4. Keep it PRIVATE (since it contains sensitive code)
5. DON'T initialize with README (we already have one)
6. Click "Create repository"

### 2. Connect to GitHub
After creating the repository, GitHub will show you commands. Use these:

```bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR_USERNAME/examinr.git

# Push your code to GitHub
git push -u origin main
```

### 3. GitHub Authentication
If prompted for authentication:
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate a new token with "repo" permissions
3. Use this token as your password when pushing

### Working with Remote Repository
```bash
# Push changes to GitHub
git push

# Pull latest changes from GitHub
git pull

# Fetch changes without merging
git fetch
```

## Daily Workflow

### Before Starting Work
```bash
# 1. Make sure you're on the right branch
git branch

# 2. Pull latest changes
git pull

# 3. Create a new branch for your feature
git checkout -b feature/todays-work
```

### While Working
```bash
# Check what you've changed
git status

# Stage and commit regularly
git add .
git commit -m "Implement quiz timer feature"
```

### After Finishing Work
```bash
# 1. Push your branch to GitHub
git push -u origin feature/todays-work

# 2. Switch back to main
git checkout main

# 3. Pull latest main
git pull

# 4. Merge your work (if ready)
git merge feature/todays-work
git push
```

## Emergency Recovery

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)
```bash
git reset --hard HEAD~1
```

### Discard All Local Changes
```bash
# WARNING: This will delete all uncommitted changes!
git reset --hard HEAD
```

### Recover Deleted Files
```bash
# See what was deleted
git status

# Restore specific file
git checkout -- path/to/deleted/file.js

# Restore all deleted files
git checkout -- .
```

### View Previous Version of a File
```bash
# List commits that modified the file
git log --oneline path/to/file.js

# View file at specific commit
git show COMMIT_HASH:path/to/file.js
```

### Create a Backup Branch
```bash
# Before doing something risky
git checkout -b backup/before-major-change
git checkout main
```

## Best Practices

### 1. Commit Messages
- Use present tense: "Add feature" not "Added feature"
- Be descriptive: "Fix login validation error" not "Fix bug"
- Keep first line under 50 characters

### 2. Commit Frequency
- Commit when you complete a logical unit of work
- Don't commit broken code
- Make small, focused commits

### 3. Branch Naming
- `feature/` - New features (feature/user-profile)
- `fix/` - Bug fixes (fix/login-error)
- `hotfix/` - Urgent fixes (hotfix/security-patch)
- `refactor/` - Code improvements (refactor/auth-system)

### 4. Before Risky Operations
```bash
# Always create a backup branch
git checkout -b backup/$(date +%Y%m%d-%H%M%S)
git checkout main
```

### 5. Keep Your Repository Clean
```bash
# Remove untracked files (careful!)
git clean -n  # Dry run to see what would be deleted
git clean -f  # Actually delete untracked files
```

## Quick Reference Card

```bash
# Save your work
git add . && git commit -m "Your message"

# Create backup before risky work
git checkout -b backup/safe-point

# See what changed
git status
git diff

# Upload to GitHub
git push

# Download from GitHub
git pull

# Switch branches
git checkout branch-name

# Emergency undo
git reset --hard HEAD
```

## Next Steps

1. **Create your GitHub repository** following the instructions above
2. **Push your code** to GitHub as a backup
3. **Practice the daily workflow** to build good habits
4. **Create a backup branch** before any major changes

Remember: Git is your safety net. Use it frequently, and you'll never lose code again!