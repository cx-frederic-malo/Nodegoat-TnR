# Security Policy

## ⚠️ Important: This Is an Intentionally Vulnerable Application

**OWASP NodeGoat** is a deliberately insecure Node.js web application designed to teach developers about [OWASP Top 10](https://owasp.org/www-project-top-ten/) security risks. The vulnerabilities present in the application code are **intentional and by design** — they are features, not bugs.

### Do NOT report the following as security issues:
- SQL/NoSQL Injection vulnerabilities in the application
- Cross-Site Scripting (XSS) vulnerabilities in the application
- Broken Authentication weaknesses in the application
- Insecure Direct Object References in the application
- Security Misconfiguration in the application
- Sensitive Data Exposure in the application
- Missing Function Level Access Control in the application
- Cross-Site Request Forgery (CSRF) in the application
- Using Components with Known Vulnerabilities (intentional)
- Unvalidated Redirects and Forwards in the application
- Server-Side Request Forgery (SSRF) in the application
- Regular Expression Denial of Service (ReDoS) in the application

These are all part of the educational curriculum. Each vulnerability has a corresponding tutorial page and a commented-out fix in the source code.

## Reporting Actual Security Issues

If you discover a security issue in the **project infrastructure** (e.g., the CI/CD pipeline, deployment configuration, or the project website) that is **not** part of the intentional learning environment, please report it responsibly:

1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. **Email** the OWASP NodeGoat project leaders via the [OWASP Project Page](https://owasp.org/www-project-nodegoat/)
3. Include a detailed description of the vulnerability and steps to reproduce

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Safe Usage Guidelines

- **Never** deploy NodeGoat on a public-facing server or production environment
- Always run NodeGoat in an **isolated environment** (e.g., local machine, Docker, or a private VM)
- Use NodeGoat **only** for educational and training purposes
- Review the [tutorial pages](https://github.com/OWASP/NodeGoat/wiki) to understand each vulnerability and its fix
