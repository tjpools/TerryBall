# Branch Protection Setup Guide

## 🎯 Overview

Branch protection rules help maintain code quality and security by controlling how changes are made to important branches. This guide walks you through setting up comprehensive branch protection for the `main` branch.

## 📚 Table of Contents

- [Why Branch Protection Matters](#why-branch-protection-matters)
- [Prerequisites](#prerequisites)
- [Step-by-Step Setup](#step-by-step-setup)
- [Understanding Each Protection](#understanding-each-protection)
- [Testing Your Setup](#testing-your-setup)
- [Troubleshooting](#troubleshooting)

## 🔒 Why Branch Protection Matters

### Security Perspective

Branch protection prevents several security risks:

1. **Accidental Destructive Changes:** Prevents force pushes that could erase history or hide malicious commits
2. **Unauthorized Modifications:** Requires review before code reaches production
3. **Malicious Code Introduction:** Code review catches potentially harmful changes
4. **Audit Trail Preservation:** Prevents history rewriting that could hide security incidents

### Quality Perspective

Beyond security, branch protection ensures:
- Code review before merging
- Automated tests pass before deployment
- Documentation is up-to-date
- Consistent code quality

## ✅ Prerequisites

Before setting up branch protection, ensure you have:

- [ ] **Admin access** to the repository
- [ ] At least **one other collaborator** (for review requirements)
- [ ] **GitHub Actions workflows** set up (for status check requirements)
- [ ] Understanding of Git branching model

> **Note:** You need admin permissions to configure branch protection rules.

## 📖 Step-by-Step Setup

### Step 1: Navigate to Branch Protection Settings

1. Go to your repository on GitHub
2. Click on **Settings** tab (top right)
3. In the left sidebar, click **Branches**
4. Under "Branch protection rules", click **Add rule** or **Add classic branch protection rule**

![Branch Protection Navigation](https://docs.github.com/assets/cb-26136/images/help/repository/repository-settings-branches.png)

### Step 2: Specify the Branch

In the "Branch name pattern" field, enter: `main`

**Why:** This applies the protection rules to your main branch. You can use patterns like `main` or `release/*` to protect multiple branches.

### Step 3: Require Pull Request Reviews

✅ **Check:** "Require a pull request before merging"

Then configure:
- ✅ **Check:** "Require approvals"
- **Set:** "Required number of approvals before merging" to **1** (minimum)

Optional but recommended:
- ✅ **Check:** "Dismiss stale pull request approvals when new commits are pushed"
- ✅ **Check:** "Require review from Code Owners" (if you have a CODEOWNERS file)

**What this does:**
- Forces all changes to go through pull requests
- Requires at least one person to review and approve changes
- Ensures fresh review when code changes after approval
- Prevents self-approval (cannot merge your own PRs)

**Security benefit:** Implements the "four eyes principle" - no single person can introduce malicious code alone.

### Step 4: Require Status Checks

✅ **Check:** "Require status checks to pass before merging"

Then:
- ✅ **Check:** "Require branches to be up to date before merging"
- **Select status checks** from the list (these appear after you've run workflows at least once):
  - `security-scan` (if you have security monitoring workflow)
  - `codeql-analysis` (if you have CodeQL workflow)
  - `build` or `test` (if you have CI/CD workflows)

**What this does:**
- Ensures automated tests pass before merging
- Requires branch to be current with main (prevents merge conflicts)
- Runs security scans before accepting changes

**Security benefit:** Automated security checks catch vulnerabilities before they reach main branch.

### Step 5: Require Signed Commits (Recommended)

✅ **Check:** "Require signed commits"

**What this does:**
- Requires all commits to be signed with GPG or S/MIME
- Verifies commit authenticity
- Prevents commit spoofing

**Security benefit:** Ensures commits actually came from the claimed author. Without this, anyone can impersonate you by setting `git config user.email`.

**Setup required:** See [SIGNED_COMMITS_SETUP.md](SIGNED_COMMITS_SETUP.md) for how to configure GPG signing.

> **Note:** Only enable this after team members have set up commit signing, or they won't be able to push.

### Step 6: Prevent Force Pushes and Deletions

✅ **Check:** "Do not allow bypassing the above settings"
✅ **Check:** "Do not allow force pushes"
✅ **Check:** "Do not allow deletions"

**What this does:**
- **No force pushes:** Prevents `git push --force` which rewrites history
- **No deletions:** Prevents accidental or malicious branch deletion
- **No bypassing:** Admins must follow the rules too (unless they uncheck this)

**Security benefit:**
- Preserves audit trail (can't rewrite history to hide malicious commits)
- Prevents accidental data loss
- Maintains git history integrity

### Step 7: Additional Settings (Optional)

Consider enabling:

✅ **"Require linear history"**
- Forces rebase or squash merges instead of merge commits
- Keeps history clean and easier to audit

✅ **"Require deployments to succeed before merging"**
- If you have deployment workflows, ensures they succeed
- Prevents broken deployments

✅ **"Lock branch"**
- Makes branch read-only (for archived/released code)
- Extreme protection for completed releases

### Step 8: Save Your Settings

Click **Create** or **Save changes** at the bottom of the page.

## 🎓 Understanding Each Protection

### Protection Matrix

| Protection | Security Impact | Quality Impact | Convenience Impact |
|------------|----------------|----------------|-------------------|
| Require PR | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⚠️ Slower deployment |
| Require Reviews | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⚠️⚠️ Need reviewers |
| Status Checks | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⚠️ Wait for CI |
| Signed Commits | ⭐⭐⭐⭐⭐ | ⭐ | ⚠️⚠️⚠️ Setup required |
| No Force Push | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⚠️ Can't fix mistakes |
| No Deletion | ⭐⭐⭐⭐ | ⭐⭐ | ⚠️ Rare issue |

### Real-World Attack Scenarios Prevented

#### Scenario 1: The Force Push Attack
**Without protection:**
```bash
# Attacker gets access to account
git push --force origin main  # Rewrites history, hides malicious commit
```
**With protection:** ❌ Force push rejected. History preserved.

#### Scenario 2: The Self-Approval
**Without protection:**
```bash
# Developer pushes malicious code
git push origin feature/backdoor
# Then merges their own PR without review
```
**With protection:** ❌ Cannot merge without another person's approval.

#### Scenario 3: The Commit Spoofing
**Without protection:**
```bash
# Attacker sets up fake identity
git config user.name "Trusted Developer"
git config user.email "trusted@company.com"
git commit -m "Totally safe code"
# Commit appears to be from trusted developer
```
**With protection (signed commits):** ❌ Commit rejected - not signed by trusted developer's GPG key.

#### Scenario 4: The Failed Test Bypass
**Without protection:**
```bash
# Code breaks tests
# Developer merges anyway hoping no one notices
```
**With protection:** ❌ Cannot merge while tests are failing.

## 🧪 Testing Your Setup

### Test 1: Try Direct Push (Should Fail)

```bash
# Clone the repo
git clone https://github.com/yourusername/TerryBall.git
cd TerryBall

# Make a change
echo "test" >> README.md
git add README.md
git commit -m "Test direct push"

# Try to push directly to main
git push origin main
```

**Expected result:** ❌ `[remote rejected] main -> main (protected branch hook declined)`

**What this proves:** Direct pushes to main are blocked.

### Test 2: Create PR Without Review (Should Block Merge)

```bash
# Create a feature branch
git checkout -b test-branch
echo "test" >> README.md
git add README.md
git commit -m "Test PR without review"
git push origin test-branch
```

Then on GitHub:
1. Create a pull request
2. Try to click "Merge pull request"

**Expected result:** ❌ Merge button disabled or shows "X reviews required"

**What this proves:** Cannot merge without required approvals.

### Test 3: Try Force Push (Should Fail)

```bash
# On your feature branch
git commit --amend -m "Changed commit message"
git push --force origin test-branch

# Try on main (will definitely fail)
git checkout main
git push --force origin main
```

**Expected result:** ❌ Force push to main rejected

**What this proves:** History rewriting is prevented.

### Test 4: Unsigned Commit (Should Fail if Required)

If you enabled "Require signed commits":

```bash
# Without GPG signing configured
git commit -m "Unsigned commit"
git push origin feature-branch
```

**Expected result:** ❌ Push rejected due to unsigned commits

**What this proves:** Only verified commits are accepted.

## 🔧 Troubleshooting

### Problem: Can't Enable Branch Protection

**Symptom:** "You need admin access to configure branch protection"

**Solution:** 
- Ask repository owner for admin permissions
- Or have owner configure protection for you

### Problem: Status Checks Not Appearing

**Symptom:** Cannot select status checks in the list

**Solution:**
1. Workflows must run at least once before appearing
2. Create a PR and let workflows run
3. Return to branch protection settings
4. Status checks should now appear in the list

### Problem: Locked Out After Enabling Protection

**Symptom:** Cannot merge PRs because status checks never pass

**Solution:**
1. Go to branch protection settings
2. Temporarily uncheck "Require status checks"
3. Fix the workflows
4. Re-enable protection once workflows work

### Problem: Need to Bypass Protection in Emergency

**Symptom:** Critical hotfix needed, but protection blocks it

**Solution:**
1. Go to Settings → Branches
2. Find your branch protection rule
3. Click "Edit"
4. Temporarily uncheck protections
5. Make your fix
6. **Immediately re-enable protections**

> ⚠️ **Warning:** Only bypass protection in true emergencies. Document why you did it.

### Problem: Signed Commits Failing

**Symptom:** Pushes rejected due to unsigned commits

**Solution:** See [SIGNED_COMMITS_SETUP.md](SIGNED_COMMITS_SETUP.md) for GPG setup instructions.

## 📊 Recommended Configurations

### For Solo Projects (Learning)

Minimal protection while learning:
- ✅ Require pull request
- ✅ No force push
- ✅ No deletion
- ⚠️ Can merge your own PRs (no review requirement)

### For Small Teams (2-5 people)

Balanced security and convenience:
- ✅ Require pull request
- ✅ Require 1 approval
- ✅ Require status checks
- ✅ No force push
- ✅ No deletion
- ⚠️ Signed commits optional

### For Production Projects

Maximum security:
- ✅ Require pull request
- ✅ Require 2+ approvals
- ✅ Require status checks
- ✅ Require branches up to date
- ✅ Require signed commits
- ✅ No force push
- ✅ No deletion
- ✅ No bypassing rules (even for admins)
- ✅ Dismiss stale reviews
- ✅ Require Code Owners review

## 📚 Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [Pull Request Best Practices](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security/getting-started/github-security-features)
- [Git Branching Model](https://nvie.com/posts/a-successful-git-branching-model/)

## 🎯 Next Steps

After setting up branch protection:

1. ✅ Complete this guide
2. ➡️ Set up [Signed Commits](SIGNED_COMMITS_SETUP.md)
3. ➡️ Configure GitHub Actions workflows
4. ➡️ Review [Security Checklist](../.github/SECURITY_CHECKLIST.md)
5. ➡️ Read main [SECURITY.md](../SECURITY.md) document

---

**Remember:** Branch protection is one layer in defense-in-depth. Combine it with code review, automated testing, and security scanning for maximum protection.

*Last updated: December 2025*
