export interface LoginPrecheckRequest {
    /** Track id returned from login call */
    track_id: string;
}

/** Type of verification to be used to authenticate user */
export enum VerificationType {
    Password = 'PASSWORD',
    TouchId = 'TOUCHID',
    Fido2 = 'FIDO2',
    SecurityQuestion = 'SECURITY_QUESTION',
    Sms = 'SMS',
    Ivr = 'IVR',
    Face = 'FACE',
    Totp = 'TOTP',
    Email = 'EMAIL',
    BackupCode = 'BACKUPCODE',
    Pattern = 'PATTERN',
    Push = 'PUSH',
    Chat = 'CHAT',
    Voice = 'VOICE',
}

/**
 * Describes why authentication is being initiated.
 * Sent as `usage_type` to verification-srv/authentication/{method}/initiation.
 */
export enum UsageType {
    /**
     * First-factor login before the user is fully authenticated.
     * Use for passwordless login and when sending a unified `identifier` (required for that field).
     * Preferred over `PasswordlessAuthentication`.
     */
    InitialAuthentication = 'INITIAL_AUTHENTICATION',
    /**
     * Legacy first-factor passwordless login usage type.
     * @deprecated Use `InitialAuthentication` instead. Still accepted by verification-srv for backward compatibility.
     */
    PasswordlessAuthentication = 'PASSWORDLESS_AUTHENTICATION',
    /** Additional verification step during an existing login session (MFA screen). */
    MultifactorAuthentication = 'MULTIFACTOR_AUTHENTICATION',
}
export interface HTTPRequestHeader {
    /** Request id returned from the authorization call */
    requestId: string;
    /** Response language, which is configured in cidaas admin ui */
    acceptlanguage?: string;
    /** Identifier generated after successful authentication but unfulfilled prechecks */
    trackId?: string;
    /** Latitude is the string location parameter sent in the headers */
    lat?: string;
    /** Longitude is the string location parameter sent in the headers */
    lon?: string;
}

/** defines whether the the process will be done via email link or whether the user needs to enter a code to complete the process. */
export enum ProcessingType {
    Code = 'CODE',
    Link = 'LINK'
}