# Upgrading Notes — v6.0

This document describes breaking changes when upgrading from **cidaas-javascript-sdk v5.x** to **v6.0**, focused on `VerificationService` authentication and enrollment APIs.

**Requirements:** Node.js **18+** for building and developing the SDK (`package.json` `engines`). Browser runtime is unchanged — the published bundle still targets ES2016.

---

## 1. Method renames (`VerificationService`)

### Login authentication (`verification-srv/authentication/...`)

| Removed (v5) | v6 API | Notes |
|--------------|--------|-------|
| `getMFAList()` | `getConfiguredAuthenticationMethods()` | |
| `initiateMFA(options)` | `initiateAuthentication(method, options)` | Method is the **first argument** |
| `authenticateMFA(options)` | `verifyAuthentication(method, options)` | Method is the **first argument** |
| `cancelMFA(options)` | `cancelAuthentication(method, options)` | Method is the **first argument** |
| `getAllVerificationList()` | `getAllVerificationMethods()` | Renamed only |

### Factor enrollment (`verification-actions-srv/setup/...`)

| Removed (v5) | v6 API | Backend path |
|--------------|--------|--------------|
| `initiateEnrollment({ verification_type, ... })` | `initiateEnrollment(method, options, trackId?, access_token?)` | `POST .../setup/{method}/initiation[/{trackId}]` |
| `initiateVerification(options, trackId, method)` | `initiateEnrollment(method, options, trackId)` | `.../initiation/{trackId}` (was `.../initiate/{trackId}`) |
| `enrollVerification(options)` | `verifyEnrollment(method, options)` | `POST .../setup/{method}/verification` |
| `configureVerification(options, method)` | `verifyEnrollment(method, options)` | same |
| `configureFriendlyName(options, trackId, method)` | `updateEnrollmentFriendlyName(method, options, trackId)` | `PUT .../setup/users/friendlyname/{METHOD}/{trackId}` |

**Pairing:** `initiateAuthentication` → `verifyAuthentication` and `initiateEnrollment` → `verifyEnrollment`.

### Authentication — before / after

```js
// v5
verificationService.initiateMFA({
  type: 'EMAIL',
  request_id: requestId,
  usage_type: 'MULTIFACTOR_AUTHENTICATION',
});

// v6
verificationService.initiateAuthentication('EMAIL', {
  request_id: requestId,
  usage_type: 'MULTIFACTOR_AUTHENTICATION',
});
```

### Enrollment — before / after

```js
// v5
verificationService.initiateEnrollment({ verification_type: 'FIDO2', deviceInfo });
verificationService.enrollVerification({ verification_type: 'FIDO2', exchange_id, pass_code });
verificationService.initiateVerification({ email }, trackId, 'email');
verificationService.configureVerification({ exchange_id, sub, pass_code }, 'email');

// v6 — profile UI (access token)
verificationService.initiateEnrollment('FIDO2', { deviceInfo });

// v6 — suggest verification during login (trackId)
verificationService.initiateEnrollment('email', { email }, trackId);

// v6 — complete enrollment
verificationService.verifyEnrollment('email', { exchange_id, sub, pass_code });

// v6 — friendly name
verificationService.updateEnrollmentFriendlyName('email', { sub, friendly_name }, trackId);
```

### Password and FIDO2 authentication

```js
verificationService.verifyAuthentication('PASSWORD', {
  exchange_id: exchangeId,
  password: userPassword,  // not pass_code
});

verificationService.verifyAuthentication('FIDO2', {
  exchange_id: exchangeId,
  fido2_client_response: {
    client_response: webAuthnCredential,
    fidoRequestId: initiateResponse.fido2_entity.fidoRequestId,
  },
});
```

---

## 2. Type renames (`VerificationService.model`)

| Removed (v5) | v6 type |
|--------------|---------|
| `GetMFAListRequest` | `GetConfiguredAuthenticationMethodsRequest` |
| `InitiateMFARequest` | `InitiateAuthenticationRequest` |
| `AuthenticateMFARequest` | `VerifyAuthenticationRequest` |
| `CancelMFARequest` | `CancelAuthenticationRequest` |
| `EnrollVerificationRequest` | `VerifyEnrollmentRequest` |
| `InitiateVerificationRequest` | `InitiateEnrollmentRequest` |
| `ConfigureVerificationRequest` | `VerifyEnrollmentRequest` |
| `ConfigureFriendlyNameRequest` | `UpdateEnrollmentFriendlyNameRequest` |

---

## 3. Signature and field changes

- **Method-first only** — `type` and `verification_type` are removed from request bodies. Pass the verification method as the first argument.
- **`UsageType.PasswordlessAuthentication`** removed — use `UsageType.InitialAuthentication`.
- **`password`** required for PASSWORD auth (not `pass_code`).

| Field | Meaning |
|-------|---------|
| **method** (first argument) | `EMAIL`, `FIDO2`, `PASSWORD`, etc. — URL path segment on the server |
| `usage_type` (auth body) | `INITIAL_AUTHENTICATION` or `MULTIFACTOR_AUTHENTICATION` |
| `trackId` (enrollment) | Login precheck track id for suggest-verification; omit for profile UI |
| `medium_id` (auth body) | From `getConfiguredAuthenticationMethods()` → `configured_list[].mediums[].id` |

---

## 4. Endpoint migrations

| v6 SDK method | v6 backend path | Notes |
|---------------|-----------------|-------|
| `getConfiguredAuthenticationMethods` | `verification-srv/public/graph/user/setup` | was `verification-srv/v2/setup/public/configured/list` |
| `initiateAuthentication` | `verification-srv/authentication/{method}/initiation` | unchanged |
| `verifyAuthentication` | `verification-srv/authentication/{method}/verification` | unchanged |
| `cancelAuthentication` | `verification-srv/authentication/{method}/cancel` | was `verification-srv/v2/authenticate/cancel/{method}`. Enrollment cancel uses `verification-actions-srv/setup/{method}/cancellation` separately. |
| `initiateEnrollment` | `verification-actions-srv/setup/{method}/initiation[/{trackId}]` | was `verification-srv/v2/setup/initiate/...` and `.../initiate/{trackId}` |
| `verifyEnrollment` | `verification-actions-srv/setup/{method}/verification` | was `verification-srv/v2/setup/enroll/...` |
| `getEnrollmentStatus` | TBD — confirm tenant backend | was `verification-srv/v2/notification/status/{id}` |
| `checkVerificationTypeConfigured` | TBD — confirm tenant backend | was `verification-srv/v2/setup/public/configured/check/...` |

Account verification (`initiateAccountVerification`, `verifyAccount`) is unchanged.

---

## 5. Other v6 improvements

- **Discriminated request types** per verification method so TypeScript catches wrong fields at compile time.
- **EMAIL magic-link helper** for `GET /verification-srv/authentication/email/verification?exchange_id&trackId`.
- **HTTP error handling** — API calls reject on non-2xx with a structured error (see [API_PATHS.md](docs/API_PATHS.md#response-and-error-handling)).

---

## 6. Migration checklist

- [ ] Replace `getMFAList` → `getConfiguredAuthenticationMethods`
- [ ] Replace `initiateMFA` → `initiateAuthentication(method, options)`
- [ ] Replace `authenticateMFA` → `verifyAuthentication(method, options)`
- [ ] Replace `cancelMFA` → `cancelAuthentication(method, options)`
- [ ] Replace `getAllVerificationList` → `getAllVerificationMethods`
- [ ] Replace `initiateEnrollment({ verification_type })` → `initiateEnrollment(method, options, trackId?)`
- [ ] Replace `initiateVerification` → `initiateEnrollment(method, options, trackId)`
- [ ] Replace `enrollVerification` / `configureVerification` → `verifyEnrollment(method, options)`
- [ ] Replace `configureFriendlyName` → `updateEnrollmentFriendlyName(method, options, trackId)`
- [ ] Remove `type` / `verification_type` from request objects
- [ ] Use `UsageType.InitialAuthentication` instead of `PasswordlessAuthentication`
- [ ] Use `password` for PASSWORD auth (not `pass_code`)
- [ ] Update type imports to v6 names
- [ ] Re-test auth: first-factor, MFA, PASSWORD, FIDO2, EMAIL CODE/LINK
- [ ] Re-test enrollment: profile UI (token) and suggest-verification (trackId)

See also [API_PATHS.md](docs/API_PATHS.md) for the full endpoint mapping.
