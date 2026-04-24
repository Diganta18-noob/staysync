# StaySync Compliance Checklist

## GDPR (General Data Protection Regulation)

| Article | Requirement | Status | Implementation |
|---------|------------|--------|---------------|
| Art. 5 | Data minimization | ✅ | Only collect necessary fields in User schema |
| Art. 6 | Lawful basis | ✅ | Legitimate interest for PG management |
| Art. 12 | Transparent information | ⚠️ | Privacy policy page needed |
| Art. 15 | Right of access | ✅ | `GET /api/users/me/data-export` |
| Art. 17 | Right to erasure | ✅ | `DELETE /api/users/me` — anonymizes PII |
| Art. 20 | Data portability | ✅ | JSON export of all personal data |
| Art. 25 | Data protection by design | ✅ | `gdprHeaders` middleware, password hashing |
| Art. 30 | Records of processing | ✅ | `AuditLog` model tracks all data mutations |
| Art. 32 | Security of processing | ✅ | Helmet, HSTS, CSP, rate limiting |
| Art. 33 | Breach notification | ⚠️ | Manual process — no automated alerting yet |

## FedRAMP Alignment

| Control | Requirement | Status | Implementation |
|---------|------------|--------|---------------|
| AC-2 | Account management | ✅ | Role-based user model, admin seed |
| AC-3 | Access enforcement | ✅ | RBAC middleware, Permission model |
| AC-7 | Unsuccessful login attempts | ⚠️ | Rate limiter protects, but no lockout |
| AC-17 | Remote access | ✅ | HSTS header enforced |
| AU-2 | Audit events | ✅ | AuditLog with 20+ action types |
| AU-3 | Content of audit records | ✅ | User, IP, UserAgent, timestamp, details |
| AU-11 | Audit retention | ✅ | `dataRetentionService.js` (configurable) |
| IA-2 | User identification | ✅ | JWT + Google OAuth |
| SC-8 | Transmission confidentiality | ✅ | HSTS, secure cookies |
| SC-13 | Cryptographic protection | ✅ | bcrypt for passwords, JWT signing |
| SC-18 | Anti-framing | ✅ | X-Frame-Options: DENY |
| SI-3 | Information protection | ✅ | CSP headers, input validation |

## Security Headers (complianceHeaders.js)

- [x] `Strict-Transport-Security` — HSTS with preload
- [x] `Content-Security-Policy` — restrictive CSP
- [x] `X-Frame-Options` — DENY
- [x] `X-Content-Type-Options` — nosniff
- [x] `Referrer-Policy` — strict-origin-when-cross-origin
- [x] `Permissions-Policy` — camera, mic, geo disabled
- [x] `X-XSS-Protection` — 1; mode=block
- [x] `Cache-Control` — no-store on sensitive endpoints

## Data Retention

| Data Type | Retention Period | Action |
|-----------|-----------------|--------|
| Audit logs | Configurable (default 365 days) | Auto-purge via `dataRetentionService` |
| Payment records | Configurable (default 365 days) | Archived (not deleted) |
| User accounts | Until deletion request | Anonymized on erasure |

## Outstanding Items

- [ ] Privacy policy / terms of service page
- [ ] Cookie consent banner (if cookies are used)
- [ ] Automated breach notification system
- [ ] Account lockout after N failed login attempts
- [ ] Data Processing Agreement (DPA) template
- [ ] Regular penetration testing schedule
