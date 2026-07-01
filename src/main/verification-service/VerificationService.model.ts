import { ProcessingType, UsageType, VerificationType } from "../common/Common.model";

export interface InitiateAccountVerificationRequest {
  /** email of user */
  email?: string;
  /** mobile number of user */
  mobile?: string;
  /** phone number of user */
  phone?: string;
  /** username of user */
  username?: string;
  /** described which medium (email, mobile, username) to be used for verifying user */
  verificationMedium?: string;
  /**
   * can be either CODE, LINK, or GENERAL
   */
  processingType?: ProcessingType;
  /** Request id returned from the authorization call */
  requestId?: string;
  /** Unique identifier of client app, can be found in app setting under admin ui */
  client_id?: string;
  /** Specify the url where the user needs to be redirected after successful login */
  redirect_uri?: string;
  /** response type expected for the process */
  response_type?: string;
  /** Subject (User) identifier */
  sub?: string;
  /** Refers to a template or predefined message/key associated with the opt-in reminder. */
  templateKey?: string;
  /** name of user */
  name?: string;
  /** Response language, which is configured in cidaas admin ui */
  accept_language?: string;
}

export interface VerifyAccountRequest {
  /** accvid will be given after initiate account verification process */
  accvid: string;
  /** code which has been sent to predetermined verification medium */
  code: string;
}

export interface GetConfiguredAuthenticationMethodsRequest {
  /** Request id returned from the authorization call */
  request_id: string;
  /** Email of the user */
  email?: string;
  /** Mobile number of the user */
  mobile_number?: string;
  /** Username of the user */
  username?: string;
  /**
   * Masked user id from the login redirect query string.
   * Either `sub` or `q` may be present in the URL depending on the hosted page.
   */
  sub?: string;
  /**
   * Masked user id (`q` query param). Alternative to `sub` on some hosted pages.
   */
  q?: string;
  /** Unified login identifier when available */
  identifier?: string;
}

/**
 * @deprecated Use {@link GetConfiguredAuthenticationMethodsRequest} instead.
 */
export type GetMFAListRequest = GetConfiguredAuthenticationMethodsRequest;

export interface CancelAuthenticationRequest {
  /** Session exchange id from the initiation response */
  exchange_id: string;
  /** Reason for cancellation */
  reason: string;
  /** Verification method (URL path segment) */
  type: string;
}

/**
 * @deprecated Use {@link CancelAuthenticationRequest} instead.
 */
export type CancelMFARequest = CancelAuthenticationRequest;

/**
 * Request body for POST /verification-actions-srv/setup/{method}/initiation[/{trackId}].
 * Pass the verification method as the first argument to `initiateEnrollment()`.
 */
export interface InitiateEnrollmentRequest {
  /** Email address for EMAIL enrollment */
  email?: string;
  /** Mobile number for SMS enrollment */
  mobile_number?: string;
  /** Phone number for IVR enrollment */
  phone?: string;
  /** Device details for physical verification methods (e.g. FACE, PUSH) */
  deviceInfo?: DeviceInfo;
  /**
   * @deprecated Pass the method as the first argument to `initiateEnrollment()` instead.
   */
  verification_type?: string;
}

/**
 * @deprecated Use {@link InitiateEnrollmentRequest} with `initiateEnrollment(method, options, trackId?)`.
 */
export type InitiateVerificationRequest = InitiateEnrollmentRequest;

/**
 * Request body for POST /verification-actions-srv/setup/{method}/verification.
 * Pass the verification method as the first argument to `verifyEnrollment()`.
 */
export interface VerifyEnrollmentRequest {
  /** Subject (user) identifier */
  sub?: string;
  /** Session exchange id from `initiateEnrollment()` */
  exchange_id?: string;
  /** WebAuthn client response after the enrollment ceremony */
  fido2_client_response?: FIDO2EnrollEntity;
  /** Device id */
  device_id?: string;
  /** Client app id */
  client_id?: string;
  /** OTP or enrollment code */
  pass_code?: string;
  /**
   * @deprecated Pass the method as the first argument to `verifyEnrollment()` instead.
   */
  verification_type?: string;
}

/**
 * @deprecated Use {@link VerifyEnrollmentRequest} instead.
 */
export type EnrollVerificationRequest = VerifyEnrollmentRequest;

/**
 * @deprecated Use {@link VerifyEnrollmentRequest} with `verifyEnrollment(method, options)`.
 */
export type ConfigureVerificationRequest = VerifyEnrollmentRequest;

export interface CheckVerificationTypeConfiguredRequest extends GetConfiguredAuthenticationMethodsRequest {
  /** Verification method to check (URL path segment) */
  verification_type: string;
}

/**
 * Request body for POST /verification-srv/authentication/{method}/initiation.
 * The `{method}` path segment is taken from `type` (e.g. `email`, `sms`, `fido2`).
 * Required by the server: `request_id` and `usage_type`.
 */
export interface InitiateAuthenticationRequest {
  /**
   * Verification method to initiate. Also used as the `{method}` URL path segment
   * (case-insensitive; the server normalizes to uppercase).
   */
  type?: VerificationType | string;
  /**
   * OAuth authorization request id from the authz flow (`requestId` / `request_id`).
   * Required. Used to load app settings, allowed MFA methods, and session context.
   */
  request_id?: string;
  /**
   * Why this authentication is started. Required.
   * Use `INITIAL_AUTHENTICATION` for first-factor passwordless login (including unified `identifier`),
   * `MULTIFACTOR_AUTHENTICATION` on the MFA screen during an active login.
   * `PASSWORDLESS_AUTHENTICATION` is legacy; prefer `INITIAL_AUTHENTICATION`.
   */
  usage_type?: UsageType | string;
  /**
   * Unified login identifier (email, mobile, username, or custom field value).
   * Use when the user enters a single identifier field instead of separate email/mobile/username.
   * Only valid with `usage_type` = `INITIAL_AUTHENTICATION`.
   */
  identifier?: string;
  /**
   * Masked user id from the login redirect query string (`sub` or `q` URL param).
   * Use on pre-login MFA / account-verification pages when the real user id is not available.
   */
  sub?: string;
  /** User email. Used to resolve the account when `identifier` is not set (legacy field). */
  email?: string;
  /** User mobile number. Used to resolve the account for SMS/IVR/CHAT (legacy field). */
  mobile_number?: string;
  /** Username when the tenant allows login with username. */
  username?: string;
  /** Username type hint when multiple identifier types are allowed (e.g. `email`, `mobile`). */
  username_type?: string;
  /**
   * Specific medium to use for EMAIL, SMS, IVR, or CHAT when the user has more than one enrolled address or number.
   * Value is the `id` from a `mediums` entry returned by **getConfiguredAuthenticationMethods()**
   * (`POST /verification-srv/v2/setup/public/configured/list`).
   * If omitted, the server picks the matching medium from the user's enrolled methods.
   */
  medium_id?: string;
  /**
   * How the user completes verification for EMAIL.
   * `CODE` (default): user enters an OTP. `LINK`: user clicks a magic link (verify via GET).
   */
  processingType?: ProcessingType;
  /**
   * Login precheck track id from the hosted login/MFA page.
   * Ties this initiation to the current login session on the MFA screen.
   */
  trackId?: string;
  /**
   * Custom user-id fields for tenants with custom login attributes (deprecated; prefer `identifier`).
   */
  customFields?: {
    [key: string]: string
  };
  /**
   * Current page origin for FIDO2 cross-domain / WebAuthn RP ID resolution
   * (e.g. `https://app.example.com`).
   */
  domainURL?: string;
  /**
   * Allowed origins for FIDO2 relying party validation when using `domainURL`.
   * Must include the origin where the WebAuthn ceremony runs.
   */
  allowedDomains?: string[];
}

/**
 * @deprecated Use {@link InitiateAuthenticationRequest} instead.
 */
export type InitiateMFARequest = InitiateAuthenticationRequest;

/**
 * Request body for POST /verification-srv/authentication/{method}/verification.
 * For EMAIL magic-link flows the server also accepts GET with `exchange_id` and `trackId` query params.
 * Required by the server: `exchange_id` (from the initiation response).
 */
export interface VerifyAuthenticationRequest {
  /**
   * Verification method. Also used as the `{method}` URL path segment
   * (case-insensitive; the server normalizes to uppercase).
   */
  type: VerificationType | string;
  /**
   * Session exchange id from `initiateAuthentication()` response (`exchange_id`).
   * Rotates on each step; always send the latest value. Required.
   */
  exchange_id: string;
  /**
   * One-time code: OTP from email/SMS/IVR/CHAT, TOTP, backup code, pattern, or PUSH number.
   * Required for most methods. Not used for FACE. Optional for EMAIL when completing via magic link (GET).
   */
  pass_code?: string;
  /**
   * User password. Required when `type` is PASSWORD; use instead of `pass_code`.
   */
  password?: string;
  /**
   * WebAuthn client assertion from the browser/device.
   * Required when `type` is FIDO2.
   */
  fido2_client_response?: FIDO2AuthenticateEntity;
  /** User subject id when already known. Usually resolved from the exchange session. */
  sub?: string;
  /**
   * OAuth authorization request id. Optional client-side correlation;
   * not part of the server authenticate body but may be sent in custom headers.
   */
  requestId?: string;
}

/**
 * @deprecated Use {@link VerifyAuthenticationRequest} instead.
 */
export type AuthenticateMFARequest = VerifyAuthenticationRequest;

/**
 * WebAuthn assertion returned by the browser after a FIDO2 authentication ceremony.
 * Submit as `fido2_client_response` on verify.
 */
export interface FIDO2AuthenticateEntity {
  /** Credential assertion from `navigator.credentials.get()`. */
  client_response?: FIDO2ClientResponse;
  /** FIDO request id from `initiateAuthentication()` response (`fido2_entity.fidoRequestId`). */
  fidoRequestId?: string;
}

/** Shape of the WebAuthn public-key credential returned by the browser. */
export interface FIDO2ClientResponse {
  id?: string;
  rawId?: string;
  type?: string;
  authenticatorAttachment?: string;
  response?: {
    authenticatorData?: string;
    clientDataJSON?: string;
    signature?: string;
    userHandle?: string;
  };
  getClientExtensionResults?: {
    [key: string]: unknown;
  };
}

export interface DeviceInfo {
  /** id of the device */
  deviceId: string;
  /** location details of the device */
  location: Location;
}

export interface Location {
  /** latitude of the device */
  lat: string;
  /** longitude of the device */
  lon: string;
}

export interface FIDO2EnrollEntity {
  /** details of client response */
  client_response?: any;
  /** unique identifier assigned to a FIDO2 authentication request. The value comes from initiate enrollment process */
  fidoRequestId?: string;
}

export interface UpdateEnrollmentFriendlyNameRequest {
  /** Id from status verification API */
  id?: string;
  /** Physical verification id from status verification API */
  ph_id?: string;
  /** Id from enrollment API */
  device_id?: string;
  /** Friendly name for the device */
  friendly_name?: string;
  /** Subject (user) identifier */
  sub?: string;
}

/**
 * @deprecated Use {@link UpdateEnrollmentFriendlyNameRequest} with `updateEnrollmentFriendlyName(method, options, trackId)`.
 */
export type ConfigureFriendlyNameRequest = UpdateEnrollmentFriendlyNameRequest;
