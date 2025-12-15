# Security Policy

## 🔒 Overview

This document outlines the security measures, best practices, and vulnerability reporting procedures for the TerryBall project. As a learning project focused on security and networking concepts, this repository implements multiple layers of security protection to demonstrate real-world security practices.

## 📋 Table of Contents

- [Security Features](#security-features)
- [Reporting a Vulnerability](#reporting-a-vulnerability)
- [Security Best Practices](#security-best-practices)
- [Educational Resources](#educational-resources)

## 🛡️ Security Features

### 1. Branch Protection Rules

**What it does:** Prevents unauthorized or accidental changes to the main branch.

**Why it's important:** The main branch should always contain stable, reviewed code. Branch protection ensures:
- All changes go through pull requests
- Code is reviewed before merging
- Tests must pass before merging
- History cannot be rewritten with force pushes

**Implementation:** See [docs/BRANCH_PROTECTION_SETUP.md](docs/BRANCH_PROTECTION_SETUP.md) for setup instructions.

**Learn more:** [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

### 2. Dependabot Security Updates

**What it does:** Automatically scans dependencies for known vulnerabilities and creates pull requests to update them.

**Why it's important:** Dependencies can contain security vulnerabilities. Dependabot:
- Monitors the GitHub Advisory Database
- Checks npm packages for known CVEs (Common Vulnerabilities and Exposures)
- Alerts when vulnerabilities are found
- Can automatically create PRs to update vulnerable dependencies

**Implementation:** Configured in `.github/dependabot.yml`

**Learn more:** [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)

### 3. CodeQL Security Scanning

**What it does:** Performs automated semantic code analysis to find security vulnerabilities.

**Why it's important:** CodeQL can detect:
- SQL injection vulnerabilities
- Cross-site scripting (XSS) flaws
- Command injection issues
- Path traversal vulnerabilities
- Many other security weaknesses

**How it works:** CodeQL treats code as data, building a database from your code and running queries against it to find patterns that indicate security issues.

**Implementation:** Configured in `.github/workflows/codeql-analysis.yml`

**Learn more:** [CodeQL Documentation](https://codeql.github.com/docs/)

### 4. Security Monitoring Workflow

**What it does:** Runs comprehensive security checks on every push and pull request.

**Features:**
- **Secret scanning:** Detects accidentally committed passwords, API keys, tokens
- **File integrity monitoring:** Alerts on unexpected changes to critical files
- **Security audit:** Checks for common security misconfigurations
- **Dependency checking:** Verifies no malicious or vulnerable packages

**Why it's important:** Provides continuous security validation and catches issues before they reach production.

**Implementation:** `.github/workflows/security-monitoring.yml`

### 5. Repository Activity Monitoring

**What it does:** Logs and monitors changes to repository settings and access controls.

**Monitors:**
- Repository settings changes
- Collaborator additions/removals
- Branch creation/deletion
- Tag and release events
- Access permission modifications

**Why it's important:** Provides an audit trail for security-relevant events, helping detect unauthorized access or configuration changes.

**Implementation:** `.github/workflows/repo-monitor.yml`

### 6. File Integrity Monitoring

**What it does:** Creates cryptographic hashes of critical files and alerts on unexpected changes.

**Why it's important:** 
- Detects unauthorized modifications to important files
- Provides tamper detection for configuration files
- Helps maintain the integrity of security-critical code

**How it works:** Uses SHA-256 hashing to create fingerprints of files, then compares hashes on subsequent runs.

**Implementation:** `.github/workflows/file-integrity.yml`

### 7. Signed Commits (Recommended)

**What it does:** Uses GPG signatures to cryptographically sign Git commits.

**Why it's important:**
- Proves commits came from you (authentication)
- Prevents commit spoofing (anyone can set git config user.name/email)
- Provides non-repudiation (you can't deny making the commit)
- GitHub shows a "Verified" badge on signed commits

**Implementation:** See [docs/SIGNED_COMMITS_SETUP.md](docs/SIGNED_COMMITS_SETUP.md)

**Learn more:** [Signing Commits Documentation](https://docs.github.com/en/authentication/managing-commit-signature-verification)

## 🚨 Reporting a Vulnerability

### For Security Researchers

If you discover a security vulnerability in TerryBall, we appreciate your help in disclosing it responsibly.

**Please do NOT:**
- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before we've had a chance to address it

**Please DO:**
1. **Report privately:** Use GitHub's [Private Vulnerability Reporting](https://github.com/tjpools/TerryBall/security/advisories/new) feature
2. **Provide details:** Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)
3. **Give us time:** Allow reasonable time (typically 90 days) for us to address the issue

### What to Expect

1. **Acknowledgment:** We'll acknowledge receipt within 48 hours
2. **Assessment:** We'll assess the vulnerability and determine severity
3. **Fix:** We'll work on a fix and test it thoroughly
4. **Disclosure:** We'll coordinate disclosure timing with you
5. **Credit:** We'll credit you in the security advisory (if you wish)

### Severity Levels

We use the CVSS (Common Vulnerability Scoring System) to assess severity:

- **Critical (9.0-10.0):** Immediate threat, exploitation likely
- **High (7.0-8.9):** Significant risk, should be addressed urgently
- **Medium (4.0-6.9):** Moderate risk, should be addressed soon
- **Low (0.1-3.9):** Minor risk, address in regular updates

## 🔐 Security Best Practices

### For Contributors

1. **Never commit secrets:**
   - No passwords, API keys, tokens, or private keys
   - Use environment variables for sensitive data
   - Check files before committing: `git diff --cached`

2. **Keep dependencies updated:**
   - Respond to Dependabot alerts promptly
   - Review dependency changes in pull requests
   - Use `npm audit` to check for vulnerabilities

3. **Review code carefully:**
   - Look for potential security issues
   - Validate input handling
   - Check for XSS vulnerabilities in user-facing code
   - Ensure proper error handling

4. **Sign your commits:**
   - Set up GPG signing for better authenticity
   - See [docs/SIGNED_COMMITS_SETUP.md](docs/SIGNED_COMMITS_SETUP.md)

5. **Use secure connections:**
   - Always use HTTPS for git operations
   - Enable two-factor authentication (2FA) on GitHub

### For Repository Maintainers

1. **Enable all security features:**
   - Branch protection rules
   - Required status checks
   - Dependabot alerts
   - Code scanning
   - Secret scanning

2. **Review access regularly:**
   - Audit collaborator list quarterly
   - Remove inactive collaborators
   - Use least-privilege principle

3. **Monitor security alerts:**
   - Check Dependabot alerts weekly
   - Review CodeQL findings
   - Investigate suspicious activity

4. **Keep documentation updated:**
   - Update security policies as needed
   - Document new security measures
   - Keep contact information current

5. **Plan for incidents:**
   - Have a response plan
   - Know how to revoke access quickly
   - Document escalation procedures

## 📚 Educational Resources

### Understanding Security Concepts

**Defense in Depth:** Multiple layers of security controls. If one layer fails, others still protect the system.
- Example: Branch protection + code review + automated scanning

**Principle of Least Privilege:** Users/processes should have only the minimum access needed.
- Example: Collaborators get write access, not admin access

**Secure by Default:** Security features enabled from the start, not added later.
- Example: Branch protection configured before the first PR

### Common Vulnerabilities to Watch For

**Cross-Site Scripting (XSS):**
```javascript
// VULNERABLE - Don't do this:
element.innerHTML = userInput;

// SAFE - Do this instead:
element.textContent = userInput;
// or use a sanitization library
```

**Exposed Secrets:**
```javascript
// VULNERABLE - Don't do this:
const API_KEY = "sk_live_abc123xyz";

// SAFE - Do this instead:
const API_KEY = process.env.API_KEY;
```

**Insecure Dependencies:**
```bash
# Check for vulnerabilities:
npm audit

# Fix automatically when possible:
npm audit fix
```

### Recommended Learning Resources

1. **OWASP Top 10:** [https://owasp.org/www-project-top-ten/](https://owasp.org/www-project-top-ten/)
   - The most critical web application security risks

2. **GitHub Security Lab:** [https://securitylab.github.com/](https://securitylab.github.com/)
   - Research, tools, and educational content

3. **Web Security Academy:** [https://portswigger.net/web-security](https://portswigger.net/web-security)
   - Free online training with hands-on labs

4. **The Cyber Security Body of Knowledge:** [https://www.cybok.org/](https://www.cybok.org/)
   - Comprehensive knowledge base

## 🔄 Regular Security Maintenance

### Weekly Tasks
- [ ] Review Dependabot alerts
- [ ] Check CodeQL scan results
- [ ] Review security workflow outputs

### Monthly Tasks
- [ ] Review collaborator access
- [ ] Update documentation if needed
- [ ] Review and test incident response procedures
- [ ] Check for updates to security tools

### Quarterly Tasks
- [ ] Full security audit
- [ ] Review and update security policies
- [ ] Test backup and recovery procedures
- [ ] Security training for team members

## 📞 Contact

For security concerns, please use GitHub's private vulnerability reporting feature or contact the repository maintainers directly.

---

**Remember:** Security is not a one-time task but an ongoing process. Stay vigilant, keep learning, and always question assumptions about security.

*Last updated: December 2025*
