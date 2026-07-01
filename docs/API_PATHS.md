# Cidaas JavaScript SDK – API paths (for NEW PATH verification)

All paths are relative to `config.authority` (e.g. `https://tenant.cidaas.com`). Use this list to check whether a **NEW PATH** exists in the backend for each capability.

---

## Authentication (OIDC – via oidc-client-ts / UserManager)

| SDK usage | Backend path / note | HTTP | Service |
|-----------|----------------------|------|---------|
| Login/register redirect URL | From OIDC discovery (e.g. `/.well-known/openid-configuration`) + authz endpoint | GET (redirect) | AuthenticationService |
| Token exchange (code → tokens) | **/token-srv/token** | POST | TokenService |
| UserInfo from storage | No direct HTTP in SDK; storage from oidc-client-ts | - | AuthenticationService |
| Silent renew | Uses refresh_token against token endpoint from discovery | POST | oidc-client-ts |

---

## Authz / public

| SDK method | Backend path | HTTP | Service |
|------------|--------------|------|---------|
| getRequestId | **/authz-srv/authrequest/authz/generate** | POST | PublicService |
| getTenantInfo | **/public-srv/tenantinfo/basic** | GET | PublicService |
| getClientInfo | **/public-srv/public/{requestId}** | GET | PublicService |
| getMissingFields (social) | **/public-srv/public/trackinfo/{requestId}/{trackId}** | GET | PublicService |
| initiateDeviceCode | **/authz-srv/device/authz?client_id=** | GET | TokenService |

---

## Token / prelogin

| SDK method | Backend path | HTTP | Service |
|------------|--------------|------|---------|
| generateTokenFromCode | **/token-srv/token** | POST | TokenService |
| loginPrecheck | **/token-srv/prelogin/metadata/{track_id}** | GET | TokenService |
| getMissingFields | **/token-srv/prelogin/metadata/{trackId}** | GET | TokenService |
| deviceCodeVerify | **/token-srv/device/verify** (form GET submit) | GET | TokenService |

---

## Login (login-srv)

| SDK method | Backend path | HTTP | Service |
|------------|--------------|------|---------|
| loginWithCredentials | **/login-srv/login** | POST (form) | LoginService |
| loginWithSocial | **/login-srv/social/login/{provider}/{requestId}** | Redirect | LoginService |
| registerWithSocial | **/login-srv/social/register/{provider}/{requestId}** | Redirect | LoginService  - to be removed|
| passwordlessLogin | **/login-srv/verification/login** | POST (form) | LoginService |
| consentContinue | **/login-srv/precheck/continue/{track_id}** | POST (form) | LoginService |
| mfaContinue | **/login-srv/precheck/continue/{track_id}** | POST (form) | LoginService |
| firstTimeChangePassword | **/login-srv/precheck/continue/{trackId}** | POST (form) | LoginService |
| progressiveRegistration | **/login-srv/progressive/update/user** | POST | LoginService |
| loginAfterRegister | **/login-srv/login/handle/afterregister/{trackId}** | POST (form) | LoginService |
| actionGuestLogin | **/login-srv/login/guest/{requestId}** | Redirect | LoginService |

---

## Users (users-srv, useractions-srv, fieldsetup-srv, etc.)

| SDK method | Backend path | HTTP | Service |
|------------|--------------|------|---------|
| getUserProfile | **/users-srv/userinfo** | GET | UserService |
| getRegistrationSetup | **/fieldsetup-srv/public/fields** (query: requestId, ui_locales) | GET | UserService |
| register | **/users-srv/register** (optional ?invite_id=) | POST | UserService |
| getInviteUserDetails | **/useractions-srv/invitations/{invite_id}** or **/users-srv/invite/info/{invite_id}** | GET | UserService |
| getCommunicationStatus | **/users-srv/user/communication/status/{sub}** | GET | UserService |
| initiateResetPassword | **/users-srv/resetpassword/initiate** | POST | UserService |
| handleResetPassword | **/users-srv/resetpassword/validatecode** | POST or form | UserService |
| resetPassword | **/users-srv/resetpassword/accept** | POST or form | UserService |
| getDeduplicationDetails | **/users-srv/deduplication/info/{trackId}** | GET | UserService |
| deduplicationLogin | **/users-srv/deduplication/login/redirection** (query: trackId, requestId, sub) | Redirect | UserService |
| registerDeduplication | **/users-srv/deduplication/register/{trackId}** | POST | UserService |
| changePassword | **/users-srv/changepassword** | POST | UserService |
| updateProfile | **/users-srv/user/profile/{sub}** | PUT | UserService |
| initiateLinkAccount | **/users-srv/user/link/initiate** | POST | UserService |
| completeLinkAccount | **/users-srv/user/link/complete** | POST | UserService |
| getLinkedUsers | **/users-srv/userinfo/social/{sub}** | GET | UserService |
| unlinkAccount | **/users-srv/user/unlink/{identityId}** | POST | UserService |
| deleteUserAccount | **/users-srv/user/unregister/scheduler/schedule/{sub}** | POST | UserService |
| userCheckExists | **/useractions-srv/userexistence/{requestId}** (optional ?webfinger, rememberMe) | POST | UserService |
| getUserActivities | **/activity-streams-srv/user-activities** | POST | UserService |
| updateProfileImage | **/image-srv/profile/upload** | POST (multipart) | UserService |
| userActionOnEnrollment | **/auth-actions-srv/validation/{trackId}** | POST | UserService |

---

## Verification (verification-srv, verification-actions-srv)

| SDK method (preferred) | Deprecated alias | Backend path | HTTP | Service |
|------------------------|------------------|--------------|------|---------|
| initiateAccountVerification | — | **/verification-actions-srv/account/initiation** | Form redirect | VerificationService |
| verifyAccount | — | **/verification-actions-srv/account** | POST | VerificationService |
| getConfiguredAuthenticationMethods | getMFAList | **/verification-srv/v2/setup/public/configured/list** | POST | VerificationService |
| cancelAuthentication | cancelMFA | **/verification-srv/v2/authenticate/cancel/{method}** | POST | VerificationService |
| getAllVerificationMethods | getAllVerificationList | **/verification-actions-srv/config** | GET | VerificationService |
| initiateEnrollment | — | **/verification-actions-srv/setup/{method}/initiation** or **.../initiation/{trackId}** | POST | VerificationService |
| getEnrollmentStatus | — | **/verification-srv/v2/notification/status/{status_id}** | POST | VerificationService |
| verifyEnrollment | enrollVerification, configureVerification | **/verification-actions-srv/setup/{method}/verification** | POST | VerificationService |
| checkVerificationTypeConfigured | — | **/verification-srv/v2/setup/public/configured/check/{verification_type}** | POST | VerificationService |
| initiateAuthentication | initiateMFA | **/verification-srv/authentication/{method}/initiation** | POST | VerificationService |
| verifyAuthentication | authenticateMFA | **/verification-srv/authentication/{method}/verification** | POST | VerificationService |
| initiateVerification | — (use initiateEnrollment) | **/verification-actions-srv/setup/{method}/initiation/{trackId}** | POST | VerificationService |
| updateEnrollmentFriendlyName | configureFriendlyName | **/verification-actions-srv/setup/users/friendlyname/{METHOD}/{trackId}** | PUT | VerificationService |

---

## Consent (consent-management-srv)

| SDK method | Backend path | HTTP | Service |
|------------|--------------|------|---------|
| getConsentDetails | **/consent-management-srv/v2/consent/usage/public/info** | POST | ConsentService |
| acceptConsent | **/consent-management-srv/v2/consent/usage/accept** | POST | ConsentService |
| getConsentVersionDetails | **/consent-management-srv/v2/consent/versions/details/{consentid}** (?locale=) | GET | ConsentService |
| acceptScopeConsent | **/consent-management-srv/consent/scope/accept** | POST | ConsentService |
| acceptClaimConsent | **/consent-management-srv/consent/claim/accept** | POST | ConsentService |
| revokeClaimConsent | **/consent-management-srv/consent/claim/revoke** | POST | ConsentService |

---

## Device (device-srv)

| SDK method | Backend path | HTTP | Service |
|------------|--------------|------|---------|
| getDevicesInfo | **/device-srv/devices** | GET | DeviceService |
| deleteDevice | **/device-srv/device/{device_id}** | DELETE | DeviceService |
| createDeviceInfo | **/device-srv/deviceinfo** | POST | DeviceService |

---

## Id validation (idval-sign-srv)

| SDK method | Backend path | HTTP | Service |
|------------|--------------|------|---------|
| invokeIdValidationCase | **/idval-sign-srv/caseinvocation** | POST | IdValidationService |

---

## Backend service prefix summary

When the backend introduces a **NEW PATH** (e.g. new version or new service), cross-check with these prefixes used by the SDK:

| Prefix | Purpose |
|--------|---------|
| **authz-srv** | Auth request generation, device authz |
| **token-srv** | Token, prelogin metadata, device verify |
| **login-srv** | Login, social, precheck continue, progressive, guest |
| **users-srv** | Userinfo, register, invite, communication, reset password, deduplication, profile, link, unlink, delete, activities, profile image |
| **useractions-srv** | Invitations, userexistence |
| **fieldsetup-srv** | Public fields (registration field setup) |
| **activity-streams-srv** | User-activities |
| **image-srv** | Profile upload |
| **auth-actions-srv** | Validation (enrollment action) |
| **verification-srv** | v2 setup (list, initiate, enroll, status, check), authentication (initiation, verification), cancel |
| **verification-actions-srv** | Account initiation/verification, config, setup (initiate, verification, friendlyname) |
| **consent-management-srv** | v2 consent usage (info, accept), versions/details, scope/accept, claim/accept, claim/revoke |
| **device-srv** | Devices, device/{id}, deviceinfo |
| **public-srv** | tenantinfo/basic, public/{requestId} |
| **idval-sign-srv** | caseinvocation |

---

## Validation against public-apis (reference)

Checked against the **public-apis** project `reference/*.yaml` and `reference/versioned/3.101.21/*.yaml`. Status: **Documented** (path exists in reference), **Not documented** (no matching path in reference), **Might be replaced** (reference documents a different path for the same capability, e.g. newer service or version).

### Documented (still good)

| SDK method | Backend path | Reference |
|------------|--------------|-----------|
| getClientInfo | /public-srv/public/{requestId} | public-service.yaml |
| getRegistrationSetup | /fieldsetup-srv/public/fields | fieldSettings.yaml |
| getConfiguredAuthenticationMethods | /verification-srv/v2/setup/public/configured/list | public-service.yaml |
| generateTokenFromCode | /token-srv/token | authentication.yaml |
| loginPrecheck / getMissingFields | /token-srv/prelogin/metadata/{track_id} | authentication.yaml |
| initiateDeviceCode | /authz-srv/device/authz | authentication.yaml |
| loginWithCredentials | /login-srv/login | authentication.yaml |
| loginWithSocial | /login-srv/social/login/{provider_name}/{requestId} | authentication.yaml |
| passwordlessLogin | /login-srv/verification/login | authentication.yaml |
| consentContinue / mfaContinue / firstTimeChangePassword | /login-srv/precheck/continue/{trackid} | authentication.yaml |
| loginAfterRegister | /login-srv/login/handle/afterregister/{track_id} | authentication.yaml |
| progressiveRegistration | /login-srv/progressive/update/user | users.yaml (server: login-srv) |
| getUserProfile | /users-srv/userinfo | users.yaml |
| updateProfile | /users-srv/user/profile/{sub} | users.yaml |
| getInviteUserDetails | /useractions-srv/invitations/{inviteId}, /users-srv/invite/info/{invite_id} | users.yaml |
| userCheckExists | /useractions-srv/userexistence/{requestId} | users.yaml |
| deleteUserAccount | /users-srv/user/unregister/scheduler/schedule/{sub} | users.yaml |
| getUserActivities | /activity-streams-srv/user-activities | activitystreams.yaml |
| initiateAccountVerification | /verification-actions-srv/account/initiation | verification.yaml |
| verifyAccount | /verification-actions-srv/account | verification.yaml |
| initiateVerification | /verification-actions-srv/setup/{method}/initiation/{trackId} | verification.yaml (note: ref has **initiation**, SDK uses **initiate**) |
| configureVerification | /verification-actions-srv/setup/{method}/verification | verification.yaml |
| userActionOnEnrollment | /auth-actions-srv/validation/{track_id} | verification.yaml |
| acceptConsent | /consent-management-srv/v2/consent/usage/accept | consent-management.yaml |
| acceptScopeConsent | /consent-management-srv/consent/scope/accept | consent-management.yaml |
| acceptClaimConsent | /consent-management-srv/consent/claim/accept | consent-management.yaml |
| createDeviceInfo | /device-srv/deviceinfo | deviceBoundLogout.yaml |
| initiateAuthentication | /verification-srv/authentication/{method}/initiation | authentication.yaml |
| verifyAuthentication | /verification-srv/authentication/{method}/verification | authentication.yaml |

### Not documented in reference

| SDK method | Backend path | Note |
|------------|--------------|------|
| getRequestId | /authz-srv/authrequest/authz/generate | Reference has GET /authz-srv/authrequest/{requestId} (view request), not POST authz/generate. |
| getTenantInfo | /public-srv/tenantinfo/basic | No path in public-service.yaml. |
| deviceCodeVerify | /token-srv/device/verify | Not in authentication.yaml paths. |
| actionGuestLogin | /login-srv/login/guest/{requestId} | Not in authentication.yaml. |
| register | /users-srv/register | users.yaml has /useractions-srv/registration; no users-srv/register. |
| getCommunicationStatus | /users-srv/user/communication/status/{sub} | Not in users.yaml paths. |
| getDeduplicationDetails | /users-srv/deduplication/info/{trackId} | Not in users.yaml. |
| deduplicationLogin | /users-srv/deduplication/login/redirection | Not in users.yaml. |
| registerDeduplication | /users-srv/deduplication/register/{trackId} | Not in users.yaml. |
| initiateLinkAccount | /users-srv/user/link/initiate | users.yaml has /useractions-srv/users/{sub}/link (different shape). |
| completeLinkAccount | /users-srv/user/link/complete | Not in users.yaml. |
| getLinkedUsers | /users-srv/userinfo/social/{sub} | Not in users.yaml. |
| unlinkAccount | /users-srv/user/unlink/{identityId} | Not in users.yaml. |
| updateProfileImage | /image-srv/profile/upload | No image-srv in reference. |
| cancelMFA | /verification-srv/v2/authenticate/cancel/{type} | Not in verification.yaml. |
| getAllVerificationMethods | /verification-actions-srv/config | verification.yaml has /verification-srv/notification/status/{status_id}; versioned README maps config to verification-actions-srv/config. |
| initiateEnrollment | /verification-srv/v2/setup/initiate/{verification_type} | verification.yaml uses verification-actions-srv/setup/{method}/initiation/{trackId}. |
| getEnrollmentStatus | /verification-srv/v2/notification/status/{status_id} | verification.yaml has /verification-srv/notification/status/{status_id} (no v2). |
| enrollVerification | /verification-srv/v2/setup/enroll/{verification_type} | verification.yaml has verification-actions-srv/setup/{method}/verification. |
| checkVerificationTypeConfigured | /verification-srv/v2/setup/public/configured/check/{verification_type} | Not in verification.yaml. |
| configureFriendlyName | /verification-actions-srv/setup/users/friendlyname/{METHOD}/{trackId} | verification.yaml has friendlyname/{method} only (no trackId). |
| getConsentDetails | /consent-management-srv/v2/consent/usage/public/info | Not in consent-management.yaml. |
| getConsentVersionDetails | /consent-management-srv/v2/consent/versions/details/{consentid} | consent-management.yaml has consent-srv/consent/versions/{id}, not v2/consent/versions/details. |
| revokeClaimConsent | /consent-management-srv/consent/claim/revoke | Not in consent-management.yaml. |
| getDevicesInfo | /device-srv/devices | deviceBoundLogout.yaml has GET /device-srv/device/{deviceId} (single device), not GET /devices. |
| deleteDevice | /device-srv/device/{device_id} | deviceBoundLogout.yaml has DELETE /device-srv/devicemaps/{userDeviceId}, not DELETE device/{id}. |
| invokeIdValidationCase | /idval-sign-srv/caseinvocation | No idval-sign-srv in reference. |

### Might be replaced (reference shows different path)

| SDK method | SDK path | Documented alternative | Reference |
|------------|----------|------------------------|-----------|
| initiateResetPassword | /users-srv/resetpassword/initiate | /password-srv/resetpassword?action=initiatereset | password-management.yaml |
| handleResetPassword | /users-srv/resetpassword/validatecode | /password-srv/resetpassword?action=validatecode | password-management.yaml |
| resetPassword | /users-srv/resetpassword/accept | /password-srv/resetpassword?action=acceptreset | password-management.yaml |
| changePassword | /users-srv/changepassword | /password-srv/password (and /password-srv/password/{sub}) | password-management.yaml; versioned README says old path was users-srv/changepassword, new is password-srv/password. |
| initiateVerification (path segment) | .../setup/{method}/**initiate**/{trackId} | .../setup/{method}/**initiation**/{trackId} | verification.yaml uses **initiation**; SDK uses **initiate**. Confirm backend accepts both. |

---

## Response and error handling (e.g. validatecode wrong code)

### How it is currently handled

The SDK uses **Helper.createHttpPromise** in [Helper.ts](../src/main/common/Helper.ts) for all API calls (including `handleResetPassword` / validatecode). It uses **XMLHttpRequest** and does **not** check **HTTP status**:

- When `readyState === 4`, it only checks **responseText**:
  - If there is response text → **resolve(JSON.parse(http.responseText))**.
  - If there is no response text → **resolve(errorResolver)** (boolean passed in).
- **http.status is never read.** So when the backend returns 4xx or 5xx (e.g. wrong code on validatecode), the Promise still **resolves** with the response body. It **never rejects** on status code.

So for `handleResetPassword(..., true)` (JSON mode): if validatecode returns e.g. 417 with a JSON body like `{ success: false, error: "...", status: 417 }`, the caller gets that object in **.then()**, not in **.catch()**. The SDK does not treat non-2xx as a failed request. That can make responses “hang” or confuse the app: callers that only handle errors in `.catch()` never see the error, and the success path receives an error payload.

### How to handle it (recommended)

**Option A – In the app (current contract):**  
Treat the SDK Promise as “always resolve with the backend JSON.” In `.then()`, always check for error semantics before treating the result as success, e.g.:

```js
cidaasUserService.handleResetPassword(payload, true, headers)
  .then((response) => {
    if (response && (response.success === false || (response.status && response.status >= 400))) {
      // Backend returned error body (e.g. wrong code) – treat as failure
      return Promise.reject(response);
    }
    // Real success
    return response;
  })
  .then((data) => { /* success */ })
  .catch((err) => { /* network error or error body */ });
```

So: **wrong code / different status code** → same Promise resolution, but your code should treat `response.success === false` or `response.status >= 400` as failure and either reject or branch to error UI.

**Option B – In the SDK (better long-term):**  
Change **Helper.createHttpPromise** so that non-2xx responses **reject** with a structured error (e.g. status + parsed body), and document that all API methods can reject with that shape. Then validatecode (and similar) would naturally flow to `.catch()` when the code is wrong. Example:

- If `http.status >= 400`: reject with e.g. `{ statusCode: http.status, body: parsed }` or a **CidaasApiError** type.
- Keep resolving only for 2xx, with parsed body.

That way callers can rely on `.catch()` for any “error response” (wrong code, 417, 500, etc.) and the response no longer “hangs” in the success path.

---

*Last updated from SDK source (v5). Validation against public-apis reference. Update this file when adding or changing backend paths in the SDK.*
