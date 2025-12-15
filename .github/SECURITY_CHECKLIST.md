# Security Setup Checklist

## 🎯 Overview

This interactive checklist guides you through setting up comprehensive security for the TerryBall repository. Complete each item in order for best results.

**Estimated time:** 2-3 hours for initial setup

## 📋 Initial Security Setup

### Phase 1: Documentation & Understanding (30 minutes)

- [ ] **Read SECURITY.md**
  - [ ] Understand all security features
  - [ ] Note resources for further learning
  - [ ] Bookmark for future reference
  - **Why:** Foundation for all security decisions

- [ ] **Read Branch Protection Setup Guide**
  - [ ] Understand each protection rule
  - [ ] Note prerequisites for your team
  - [ ] Plan which protections to enable
  - **Why:** Branch protection is your first line of defense

- [ ] **Read Signed Commits Guide**
  - [ ] Understand GPG signing benefits
  - [ ] Check if your team can support it
  - [ ] Plan rollout strategy
  - **Why:** Prevents commit spoofing attacks

### Phase 2: Repository Configuration (45 minutes)

- [ ] **Enable Vulnerability Alerts**
  - [ ] Go to Settings → Security & analysis
  - [ ] Enable "Dependency graph"
  - [ ] Enable "Dependabot alerts"
  - [ ] Enable "Dependabot security updates"
  - **Why:** Automatic security vulnerability detection

- [ ] **Configure Dependabot**
  - [ ] Review `.github/dependabot.yml`
  - [ ] Adjust update schedule if needed
  - [ ] Configure for all package ecosystems in use
  - [ ] Test: Wait for first Dependabot PR
  - **Why:** Keeps dependencies up-to-date and secure

- [ ] **Enable Secret Scanning**
  - [ ] Go to Settings → Security & analysis
  - [ ] Enable "Secret scanning"
  - [ ] Enable "Push protection"
  - **Why:** Prevents accidental credential commits

- [ ] **Enable Code Scanning**
  - [ ] Go to Security → Code scanning
  - [ ] Set up CodeQL (or verify workflow exists)
  - [ ] Run first scan
  - [ ] Review any alerts
  - **Why:** Detects security vulnerabilities in code

### Phase 3: Branch Protection (30 minutes)

- [ ] **Set Up Branch Protection for `main`**
  - [ ] Follow [docs/BRANCH_PROTECTION_SETUP.md](../docs/BRANCH_PROTECTION_SETUP.md)
  - [ ] Enable pull request requirement
  - [ ] Configure review requirements
  - [ ] Enable status check requirements
  - [ ] Disable force pushes
  - [ ] Disable branch deletion
  - [ ] Test protections (try direct push - should fail)
  - **Why:** Prevents unauthorized changes to main branch

- [ ] **Decide on Signed Commits**
  - [ ] Evaluate if team can support GPG signing
  - [ ] If yes: Follow [docs/SIGNED_COMMITS_SETUP.md](../docs/SIGNED_COMMITS_SETUP.md)
  - [ ] Each team member sets up GPG
  - [ ] Enable "Require signed commits" in branch protection
  - [ ] If no: Document decision and revisit quarterly
  - **Why:** Authenticates commit authorship

### Phase 4: GitHub Actions Workflows (45 minutes)

- [ ] **Verify Security Monitoring Workflow**
  - [ ] Check `.github/workflows/security-monitoring.yml` exists
  - [ ] Review configuration
  - [ ] Trigger manually to test
  - [ ] Review output and alerts
  - **Why:** Continuous security scanning

- [ ] **Verify CodeQL Analysis Workflow**
  - [ ] Check `.github/workflows/codeql-analysis.yml` exists
  - [ ] Ensure JavaScript language configured
  - [ ] Wait for scheduled run or trigger manually
  - [ ] Review findings in Security tab
  - **Why:** Deep static analysis for vulnerabilities

- [ ] **Verify Repository Monitor Workflow**
  - [ ] Check `.github/workflows/repo-monitor.yml` exists
  - [ ] Review what events are monitored
  - [ ] Test by creating a test branch
  - [ ] Check workflow run logs
  - **Why:** Audit trail for repository changes

- [ ] **Verify File Integrity Workflow**
  - [ ] Check `.github/workflows/file-integrity.yml` exists
  - [ ] Understand which files are monitored
  - [ ] Test by modifying a critical file
  - [ ] Verify alert generated
  - **Why:** Detects unauthorized file changes

### Phase 5: Access Control (15 minutes)

- [ ] **Review Repository Access**
  - [ ] Go to Settings → Collaborators
  - [ ] Document current collaborators
  - [ ] Verify each person needs access
  - [ ] Remove unnecessary collaborators
  - [ ] Use least-privilege principle
  - **Why:** Minimize attack surface

- [ ] **Configure Team Permissions** (if applicable)
  - [ ] Review team roles
  - [ ] Use "Write" not "Admin" where possible
  - [ ] Document who has admin access
  - **Why:** Limit potential for accidental/malicious changes

- [ ] **Enable Two-Factor Authentication**
  - [ ] Verify 2FA required for organization (if applicable)
  - [ ] Each team member enables 2FA
  - [ ] Document recovery procedures
  - **Why:** Prevents account takeover

## 🔄 Regular Security Maintenance

### Weekly Tasks (15 minutes)

- [ ] **Review Dependabot Alerts**
  - [ ] Check for new security alerts
  - [ ] Prioritize critical and high severity
  - [ ] Review and merge Dependabot PRs
  - [ ] Investigate false positives
  - **Schedule:** Every Monday morning

- [ ] **Check CodeQL Scan Results**
  - [ ] Go to Security → Code scanning alerts
  - [ ] Review any new alerts
  - [ ] Triage: Fix, false positive, or won't fix
  - [ ] Document decisions
  - **Schedule:** Every Wednesday

- [ ] **Review Security Workflow Outputs**
  - [ ] Check recent workflow runs
  - [ ] Investigate any failures
  - [ ] Review security scan findings
  - [ ] Update ignored findings list if needed
  - **Schedule:** Every Friday

### Monthly Tasks (30 minutes)

- [ ] **Access Audit**
  - [ ] Review collaborator list
  - [ ] Remove inactive collaborators
  - [ ] Verify permission levels still appropriate
  - [ ] Document changes
  - **Schedule:** First of each month

- [ ] **Review Security Logs**
  - [ ] Check repo-monitor workflow logs
  - [ ] Look for suspicious activity
  - [ ] Verify all changes were authorized
  - [ ] Investigate anomalies
  - **Schedule:** 15th of each month

- [ ] **Update Documentation**
  - [ ] Review SECURITY.md for accuracy
  - [ ] Update contact information if changed
  - [ ] Add new security measures implemented
  - [ ] Remove outdated information
  - **Schedule:** Last day of month

- [ ] **Test Incident Response**
  - [ ] Role-play security incident scenario
  - [ ] Practice emergency access procedures
  - [ ] Verify contact information works
  - [ ] Update response plan if needed
  - **Schedule:** Last Friday of month

### Quarterly Tasks (1-2 hours)

- [ ] **Full Security Audit**
  - [ ] Review all security settings
  - [ ] Test all security workflows
  - [ ] Review access logs comprehensively
  - [ ] Document findings and improvements
  - **Schedule:** January, April, July, October

- [ ] **Security Training**
  - [ ] Review latest security best practices
  - [ ] Study recent security incidents (other projects)
  - [ ] Update team on new threats
  - [ ] Practice security procedures
  - **Schedule:** End of each quarter

- [ ] **Policy Review**
  - [ ] Review SECURITY.md
  - [ ] Update vulnerability reporting process
  - [ ] Review and update security checklist
  - [ ] Get team feedback on security measures
  - **Schedule:** End of each quarter

- [ ] **Dependency Audit**
  - [ ] Run `npm audit` (or equivalent)
  - [ ] Review all dependencies
  - [ ] Remove unused dependencies
  - [ ] Update to latest secure versions
  - [ ] Document any known issues
  - **Schedule:** March, June, September, December

### Annual Tasks (2-3 hours)

- [ ] **Comprehensive Security Review**
  - [ ] Review entire security posture
  - [ ] Compare against industry standards
  - [ ] Identify gaps and weaknesses
  - [ ] Create improvement roadmap
  - **Schedule:** January

- [ ] **GPG Key Renewal** (if using signed commits)
  - [ ] Check key expiration dates
  - [ ] Renew keys before expiration
  - [ ] Update public keys on GitHub
  - [ ] Test signing after renewal
  - **Schedule:** Before key expiration

- [ ] **Backup and Recovery Test**
  - [ ] Verify repository backups exist
  - [ ] Test recovery procedures
  - [ ] Update disaster recovery plan
  - [ ] Document lessons learned
  - **Schedule:** June

- [ ] **Security Metrics Review**
  - [ ] Calculate key security metrics:
    - [ ] Mean time to patch vulnerabilities
    - [ ] Number of vulnerabilities found vs fixed
    - [ ] Code review coverage percentage
    - [ ] Failed security scans
  - [ ] Compare year-over-year
  - [ ] Set goals for next year
  - **Schedule:** December

## 🚨 Incident Response Checklist

Use this if you suspect a security incident:

- [ ] **Immediate Response (within 1 hour)**
  - [ ] Do NOT panic or rush
  - [ ] Document what you observed
  - [ ] Take screenshots of suspicious activity
  - [ ] Note exact times (use UTC)
  - [ ] Do NOT delete anything yet

- [ ] **Assessment (within 4 hours)**
  - [ ] Determine scope of incident
  - [ ] Identify what was compromised
  - [ ] Check git logs: `git log --all --source --full-history`
  - [ ] Review workflow run logs
  - [ ] Check access logs in Settings → Logs

- [ ] **Containment (within 24 hours)**
  - [ ] Revoke compromised credentials immediately
  - [ ] Remove unauthorized collaborators
  - [ ] Lock affected branches if needed
  - [ ] Disable compromised integrations
  - [ ] Change all potentially exposed secrets

- [ ] **Investigation (within 1 week)**
  - [ ] Review all commits during incident window
  - [ ] Check for backdoors or malicious code
  - [ ] Scan for exposed secrets
  - [ ] Interview team members if needed
  - [ ] Determine root cause

- [ ] **Remediation (within 2 weeks)**
  - [ ] Remove malicious code if found
  - [ ] Patch vulnerabilities exploited
  - [ ] Implement additional controls
  - [ ] Update security procedures
  - [ ] Document lessons learned

- [ ] **Communication**
  - [ ] Notify stakeholders appropriately
  - [ ] File security advisory if needed
  - [ ] Update SECURITY.md if process issues found
  - [ ] Conduct post-mortem review
  - [ ] Share learnings (sanitized) with community

## 🎓 Security Review Procedures

### Pre-Merge Security Review Checklist

Use this for every pull request:

- [ ] **Code Review**
  - [ ] No hardcoded secrets or credentials
  - [ ] No commented-out sensitive code
  - [ ] Input validation implemented
  - [ ] Output encoding/escaping used
  - [ ] Error messages don't leak sensitive info

- [ ] **Dependencies**
  - [ ] New dependencies justified
  - [ ] Dependencies from trusted sources
  - [ ] No known vulnerabilities
  - [ ] License compatible with project

- [ ] **Security Scans**
  - [ ] CodeQL scan passed
  - [ ] Security monitoring workflow passed
  - [ ] No new alerts introduced
  - [ ] Existing alerts addressed or documented

- [ ] **Testing**
  - [ ] Security-relevant tests included
  - [ ] Edge cases tested
  - [ ] Error handling tested
  - [ ] No test-only security bypasses

### Release Security Checklist

Before each release:

- [ ] **Pre-Release Audit**
  - [ ] All security scans passing
  - [ ] No critical or high vulnerabilities
  - [ ] Dependencies updated
  - [ ] Security documentation current

- [ ] **Release Signing**
  - [ ] Create signed git tag: `git tag -s vX.Y.Z`
  - [ ] Verify signature: `git tag -v vX.Y.Z`
  - [ ] Sign release artifacts if applicable

- [ ] **Post-Release**
  - [ ] Monitor for new vulnerabilities
  - [ ] Document known issues in SECURITY.md
  - [ ] Update version badges
  - [ ] Announce security improvements

## 📊 Security Metrics to Track

Document these metrics to measure security posture improvement:

### Vulnerability Metrics
- [ ] Total open security alerts
- [ ] Average time to fix critical vulnerabilities
- [ ] Average time to fix high vulnerabilities
- [ ] Number of vulnerabilities by severity
- [ ] False positive rate

### Process Metrics
- [ ] Percentage of commits signed
- [ ] Percentage of PRs with security review
- [ ] Number of direct pushes to main (should be 0)
- [ ] Number of force pushes (should be 0)
- [ ] Code review participation rate

### Compliance Metrics
- [ ] Branch protection rules compliance
- [ ] Required status checks passing rate
- [ ] Dependabot PR response time
- [ ] Security training completion rate

## 🔗 Quick Reference Links

### Internal Documentation
- [Main Security Policy](../SECURITY.md)
- [Branch Protection Setup](../docs/BRANCH_PROTECTION_SETUP.md)
- [Signed Commits Setup](../docs/SIGNED_COMMITS_SETUP.md)

### GitHub Security Pages
- [Security Overview](../../security)
- [Code Scanning Alerts](../../security/code-scanning)
- [Dependabot Alerts](../../security/dependabot)
- [Secret Scanning Alerts](../../security/secret-scanning)

### External Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Docs](https://docs.github.com/en/code-security)
- [CVE Database](https://cve.mitre.org/)
- [Security Best Practices](https://security.googleblog.com/)

## 📝 Notes Section

Use this space to track custom items specific to your repository:

### Custom Security Requirements
- [ ] _(Add your custom requirements here)_

### Known Issues / Exceptions
- _(Document any security exceptions or known issues)_

### Team Contacts
- Security Lead: _(Name and contact)_
- Incident Response: _(Contact method)_
- Escalation: _(Who to escalate to)_

### Important Dates
- Next security audit: _(Date)_
- Key expiration dates: _(Dates)_
- Policy review date: _(Date)_

---

## ✅ Completion Status

Track overall progress:

- [ ] Initial Setup Complete (All Phase 1-5 items)
- [ ] First Week Maintenance Done
- [ ] First Month Maintenance Done  
- [ ] First Quarter Review Done
- [ ] Annual Review Done

**Last updated:** _[Date]_  
**Updated by:** _[Name]_  
**Next review:** _[Date]_

---

**Remember:** Security is a continuous process, not a one-time task. Regular reviews and updates are essential.

*This checklist should be reviewed and updated quarterly to reflect new threats and best practices.*
