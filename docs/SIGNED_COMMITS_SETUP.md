# GPG Signed Commits Setup Guide

## 🎯 Overview

GPG (GNU Privacy Guard) signing provides cryptographic proof that commits came from you. This guide explains why signed commits matter and how to set them up.

## 📚 Table of Contents

- [Why Sign Commits?](#why-sign-commits)
- [How GPG Signing Works](#how-gpg-signing-works)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## 🔐 Why Sign Commits?

### The Problem: Anyone Can Impersonate You

Git allows anyone to set any name and email:

```bash
# Attacker can pretend to be you
git config user.name "Your Name"
git config user.email "your.email@example.com"
git commit -m "Added backdoor"
# This commit will appear to be from you!
```

Without signing, there's no way to prove a commit actually came from you.

### The Solution: Cryptographic Signatures

GPG signatures provide:

1. **Authentication:** Proves the commit came from someone with your private key (you)
2. **Integrity:** Proves the commit hasn't been altered since signing
3. **Non-repudiation:** You cannot deny making a signed commit
4. **Trust:** GitHub shows a "Verified" badge on signed commits

### Real-World Scenarios

**Scenario 1: The Impersonation Attack**
- Attacker gains access to your GitHub account (password leaked)
- Commits malicious code with your name
- **Without signing:** Looks legitimate
- **With signing:** No "Verified" badge alerts reviewers

**Scenario 2: The Supply Chain Attack**
- Dependency maintainer account compromised
- Malicious update pushed with maintainer's name
- **Without signing:** Users trust the update
- **With signing:** Missing signature raises alarm

**Scenario 3: The Legal Defense**
- Company claims you committed sensitive code before leaving
- **Without signing:** Hard to prove it wasn't you
- **With signing:** Cryptographic proof it wasn't signed by your key

## 🔬 How GPG Signing Works

### The Basics

GPG uses **asymmetric cryptography**:

1. **Private Key:** Kept secret, used to sign commits
2. **Public Key:** Shared with GitHub, used to verify signatures

```
Your Computer                  GitHub
┌─────────────┐               ┌──────────────┐
│ Private Key │               │  Public Key  │
│  (secret)   │               │   (shared)   │
└──────┬──────┘               └──────┬───────┘
       │                              │
       ▼                              ▼
    [Sign]                        [Verify]
       │                              │
       └──────► Commit ──────────────►│
                 with                 │
               Signature          ✓ Verified
```

### The Process

1. **You make a commit:** Git creates commit data (message, files, timestamp)
2. **Git signs it:** Uses your private key to create a signature
3. **You push:** Commit + signature uploaded to GitHub
4. **GitHub verifies:** Uses your public key to verify signature
5. **Badge appears:** GitHub shows "Verified" if signature valid

### What Gets Signed

The signature covers:
- Commit message
- File changes
- Author information
- Timestamp
- Parent commit hash

If anything changes, the signature becomes invalid.

## ✅ Prerequisites

- [ ] Operating system: Linux, macOS, or Windows
- [ ] Git installed (version 2.0+)
- [ ] GitHub account
- [ ] Email address verified on GitHub
- [ ] 15-30 minutes for setup

## 📖 Setup Instructions

### Step 1: Install GPG

**Linux (Debian/Ubuntu):**
```bash
sudo apt update
sudo apt install gnupg
```

**Linux (Fedora/RHEL):**
```bash
sudo dnf install gnupg
```

**macOS:**
```bash
# Using Homebrew
brew install gnupg

# Or download from https://www.gnupg.org/
```

**Windows:**
```bash
# Download from: https://www.gnupg.org/download/
# Or use Windows Subsystem for Linux (WSL)
```

**Verify installation:**
```bash
gpg --version
```

### Step 2: Generate a GPG Key

```bash
gpg --full-generate-key
```

**Select options:**

1. **Key type:** Select `(1) RSA and RSA` (default)
2. **Key size:** Enter `4096` (more secure than default 3072)
3. **Expiration:** 
   - Recommended: `1y` (expires in 1 year)
   - Alternative: `0` (never expires)
   - **Why expiration?** Limits damage if key is compromised
4. **Confirm:** Type `y`
5. **Name:** Enter your real name (must match GitHub)
6. **Email:** Enter your GitHub email address
   - **Important:** Must be verified on GitHub
   - Must match commits
7. **Comment:** Optional (e.g., "GitHub Signing Key")
8. **Confirm:** Type `O` (okay)
9. **Passphrase:** Enter a strong passphrase
   - You'll need this every time you sign commits
   - Use a password manager

**Output will look like:**
```
gpg: key 3AA5C34371567BD2 marked as ultimately trusted
```

The `3AA5C34371567BD2` is your **key ID**.

### Step 3: List Your Keys

```bash
gpg --list-secret-keys --keyid-format=long
```

**Output:**
```
/home/user/.gnupg/pubring.kbx
-----------------------------
sec   rsa4096/3AA5C34371567BD2 2025-12-15 [SC] [expires: 2026-12-15]
      ABCDEF1234567890ABCDEF1234567890ABCDEF12
uid                 [ultimate] Your Name <your.email@example.com>
ssb   rsa4096/4BB6D44482678CE3 2025-12-15 [E] [expires: 2026-12-15]
```

Your **GPG key ID** is: `3AA5C34371567BD2`

### Step 4: Export Your Public Key

Replace `3AA5C34371567BD2` with your actual key ID:

```bash
gpg --armor --export 3AA5C34371567BD2
```

**Output:**
```
-----BEGIN PGP PUBLIC KEY BLOCK-----

mQINBGabc...
[many lines of random-looking characters]
...xyz123==
-----END PGP PUBLIC KEY BLOCK-----
```

**Copy this entire block** (including the BEGIN and END lines).

### Step 5: Add Key to GitHub

1. Go to GitHub: [https://github.com/settings/keys](https://github.com/settings/keys)
2. Click **New GPG key**
3. Paste your public key (from Step 4)
4. Click **Add GPG key**
5. Confirm with your GitHub password

### Step 6: Configure Git to Sign Commits

```bash
# Tell Git which GPG key to use
git config --global user.signingkey 3AA5C34371567BD2

# Sign all commits by default (recommended)
git config --global commit.gpgsign true

# Sign all tags by default (optional)
git config --global tag.gpgSign true
```

**Verify configuration:**
```bash
git config --global --list | grep gpg
```

**Expected output:**
```
user.signingkey=3AA5C34371567BD2
commit.gpgsign=true
```

### Step 7: Configure GPG Agent (Optional but Recommended)

To avoid entering your passphrase constantly:

**Create/edit `~/.gnupg/gpg-agent.conf`:**
```bash
# Cache passphrase for 1 hour
default-cache-ttl 3600
max-cache-ttl 7200
```

**Restart GPG agent:**
```bash
gpg-connect-agent reloadagent /bye
```

### Step 8: Test Signing

```bash
# Create a test commit
mkdir /tmp/gpg-test
cd /tmp/gpg-test
git init
echo "test" > test.txt
git add test.txt
git commit -m "Test signed commit"
```

**Enter your passphrase when prompted.**

**Verify the signature:**
```bash
git log --show-signature
```

**Expected output:**
```
commit abc123...
gpg: Signature made Mon 15 Dec 2025 10:30:00 AM EST
gpg:                using RSA key 3AA5C34371567BD2
gpg: Good signature from "Your Name <your.email@example.com>"
```

## ✅ Verification

### Verify on GitHub

1. Push a signed commit to GitHub
2. View the commit on GitHub
3. Look for the **"Verified"** badge next to your commit

### Verify Locally

```bash
# Show signature for last commit
git log --show-signature -1

# Show signature for specific commit
git log --show-signature abc123
```

### Understanding Signature States

**On GitHub:**
- ✅ **Verified:** Valid signature from a known key
- ⚠️ **Unverified:** Signature present but key not on GitHub
- ❌ **Unverified (no key):** Signature invalid or missing

**Locally:**
```
gpg: Good signature         ✅ Valid signature
gpg: BAD signature          ❌ Signature invalid (commit tampered)
gpg: Can't check signature  ⚠️ Public key not in your keyring
```

## 🔧 Troubleshooting

### Problem: "gpg: signing failed: Inappropriate ioctl for device"

**Cause:** GPG can't prompt for passphrase

**Solution:**
```bash
export GPG_TTY=$(tty)
```

**Permanent fix:** Add to `~/.bashrc` or `~/.zshrc`:
```bash
echo 'export GPG_TTY=$(tty)' >> ~/.bashrc
source ~/.bashrc
```

### Problem: Commits Not Showing "Verified" on GitHub

**Possible causes:**

1. **Email mismatch:**
   ```bash
   # Check email in commit
   git log -1 --format="%ae"
   
   # Check email in GPG key
   gpg --list-keys
   
   # Must match!
   ```

2. **Public key not on GitHub:**
   - Re-export: `gpg --armor --export YOUR_KEY_ID`
   - Re-add to GitHub

3. **Key expired:**
   ```bash
   # Check expiration
   gpg --list-keys
   
   # Extend expiration
   gpg --edit-key YOUR_KEY_ID
   gpg> expire
   gpg> save
   
   # Re-export and update on GitHub
   ```

### Problem: "gpg: signing failed: No secret key"

**Cause:** Git can't find your private key

**Solution:**
```bash
# List keys to verify key exists
gpg --list-secret-keys --keyid-format=long

# Reconfigure Git with correct key ID
git config --global user.signingkey YOUR_KEY_ID
```

### Problem: Passphrase Prompt Appearing Too Often

**Solution:** Increase cache time in `~/.gnupg/gpg-agent.conf`:
```
default-cache-ttl 7200    # 2 hours
max-cache-ttl 28800       # 8 hours
```

Then restart agent:
```bash
gpg-connect-agent reloadagent /bye
```

### Problem: Can't Push Signed Commits

**Symptoms:** Push rejected with "unsigned commit"

**Solution:**
1. Check branch protection requires signed commits
2. Verify your commits are actually signed:
   ```bash
   git log --show-signature
   ```
3. If unsigned, amend and re-sign:
   ```bash
   git commit --amend --no-edit -S
   ```

### Problem: Lost/Forgotten Passphrase

**Bad news:** Cannot recover passphrase

**Solution:**
1. Generate new key (Step 2)
2. Add new public key to GitHub
3. Remove old key from GitHub
4. Update Git config with new key ID

**Prevention:** Store passphrase in a password manager

## 🎯 Best Practices

### Key Management

1. **Backup your private key:**
   ```bash
   # Export private key
   gpg --export-secret-keys --armor YOUR_KEY_ID > private-key-backup.asc
   
   # Store securely (password manager, encrypted drive)
   # Never share this file!
   ```

2. **Set expiration dates:**
   - Keys should expire (1-2 years recommended)
   - Renew before expiration
   - Expired keys can still verify old signatures

3. **Use strong passphrases:**
   - Minimum 20 characters
   - Mix of letters, numbers, symbols
   - Store in password manager

4. **One key per device (optional):**
   - More secure than copying keys
   - Revoke individual keys if device lost

### Commit Hygiene

1. **Always verify emails match:**
   ```bash
   # Git email
   git config user.email
   
   # GPG key email
   gpg --list-keys
   
   # GitHub verified emails
   # Check at: https://github.com/settings/emails
   ```

2. **Check before pushing:**
   ```bash
   git log --show-signature -5
   ```

3. **Sign tags for releases:**
   ```bash
   git tag -s v1.0.0 -m "Release version 1.0.0"
   ```

### Security

1. **Never commit your private key:**
   ```bash
   # Add to .gitignore
   echo "*.asc" >> .gitignore
   echo "*.gpg" >> .gitignore
   ```

2. **Revoke compromised keys immediately:**
   ```bash
   gpg --gen-revoke YOUR_KEY_ID > revoke.asc
   gpg --import revoke.asc
   # Then update GitHub
   ```

3. **Use different keys for different purposes:**
   - Signing key
   - Encryption key
   - Authentication key

4. **Keep software updated:**
   ```bash
   # Update GPG regularly
   sudo apt update && sudo apt upgrade gnupg  # Linux
   brew upgrade gnupg                          # macOS
   ```

## 📚 Additional Resources

### Official Documentation
- [GitHub: Signing Commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)
- [Git: Signing Your Work](https://git-scm.com/book/en/v2/Git-Tools-Signing-Your-Work)
- [GnuPG: Documentation](https://www.gnupg.org/documentation/)

### Learning Resources
- [Understanding GPG](https://www.gnupg.org/gph/en/manual.html)
- [Web of Trust Concepts](https://www.gnupg.org/gph/en/manual/x334.html)
- [Keybase: GPG Tutorial](https://keybase.io/docs/command_line)

### Alternative Tools
- **Keybase:** Simplified key management
- **SSH signing:** GitHub now supports SSH signatures (alternative to GPG)
- **Hardware keys:** YubiKey can store GPG keys securely

## 🔄 Key Renewal Process

When your key is about to expire:

```bash
# 1. Edit the key
gpg --edit-key YOUR_KEY_ID

# 2. Extend expiration
gpg> expire
# Select new expiration date
# Enter passphrase

# 3. Save changes
gpg> save

# 4. Export updated public key
gpg --armor --export YOUR_KEY_ID

# 5. Update on GitHub
# Paste new public key at: https://github.com/settings/keys
```

## ❓ FAQ

**Q: Do I need to sign every commit?**
A: If `commit.gpgsign = true`, yes (automatic). Otherwise, use `-S` flag: `git commit -S -m "message"`

**Q: Can I use the same key on multiple computers?**
A: Yes, but more secure to use different keys and revoke individually if needed.

**Q: What if my private key is compromised?**
A: Immediately revoke the key and generate a new one. Update GitHub with the new public key.

**Q: Does signing slow down commits?**
A: Slightly (~0.1-0.5 seconds), but negligible with GPG agent caching.

**Q: Can I sign old commits?**
A: Yes, but rewrites history (changes commit hashes). Use `git rebase -S`.

**Q: Is SSH signing better than GPG?**
A: Different trade-offs. GPG is more widely supported; SSH is simpler if you already use SSH keys.

## 🎓 Next Steps

After setting up signed commits:

1. ✅ Complete this guide
2. ➡️ Review [Branch Protection Setup](BRANCH_PROTECTION_SETUP.md)
3. ➡️ Enable "Require signed commits" in branch protection
4. ➡️ Read main [SECURITY.md](../SECURITY.md) document
5. ➡️ Complete [Security Checklist](../.github/SECURITY_CHECKLIST.md)

---

**Remember:** Signed commits are one layer of defense. Combine with code review, branch protection, and security scanning for comprehensive security.

*Last updated: December 2025*
