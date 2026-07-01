import { OidcManager, OidcSettings } from "../authentication-service/AuthenticationService.model";
import { HTTPRequestHeader } from "../common/Common.model";
import ConfigUserProvider from "../common/ConfigUserProvider";
import { Helper, CustomException } from "../common/Helper";
import { CancelAuthenticationRequest, CheckVerificationTypeConfiguredRequest, GetConfiguredAuthenticationMethodsRequest, InitiateAccountVerificationRequest, InitiateAuthenticationRequest, InitiateEnrollmentRequest, UpdateEnrollmentFriendlyNameRequest, VerifyAccountRequest, VerifyAuthenticationRequest, VerifyEnrollmentRequest } from "./VerificationService.model";
import { VerificationType } from "../common/Common.model";

export class VerificationService {
	private config: OidcSettings;
	private userManager: OidcManager;

	constructor(configUserProvider: ConfigUserProvider) {
		this.config = configUserProvider.getConfig();
		this.userManager = configUserProvider.getUserManager();
	}

	/**
	 * To initiate the account verification, call **initiateAccountVerification()**. This will send verification code  email or sms or ivr based on the verificationMedium you mentioned.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/cgans5erj5alg-init-account-verification for more details.
	 * @example
	 * ```js
	 * cidaasVerificationService.initiateAccountVerification({
	 *   verificationMedium: 'email',
	 *   requestId: 'your requestId',
	 *   processingType: ProcessingType.Code, 
	 *   email: 'your email'
	 * }).then(function (response) {
	 *   // the response will give you account verification details.
	 * }).catch(function(ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	initiateAccountVerification(options: InitiateAccountVerificationRequest) {
		try {
			const url = `${this.config.authority}/verification-actions-srv/account/initiation`;
			const form = Helper.createForm(url, options)
			document.body.appendChild(form);
			form.submit();
		} catch (ex) {
			throw new CustomException(String(ex), 417);
		}
	}

	/**
	 * To complete the verification, call **verifyAccount()**.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/r8h9mvavvw2e6-verify-account for more details.
	 * @example
	 * ```js
	 * cidaasVerificationService.verifyAccount({
	 *   accvid: 'your accvid', // which you will get on initiate account verification response
	 *   code: 'your code in email or sms or ivr'
	 * }).then(function (response) {
	 *   // the response will give you account verification ID and unique code.
	 * }).catch(function(ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	verifyAccount(options: VerifyAccountRequest, headers?: HTTPRequestHeader) {
		const _serviceURL = `${this.config.authority}/verification-actions-srv/account`;
		return Helper.createHttpPromise(options, _serviceURL, false, "POST", undefined, headers);
	}

	/**
	 * Returns verification methods configured for the current user (pre-login / MFA screen).
	 * Maps to `POST /verification-srv/public/graph/user/setup`.
	 *
	 * Pass `request_id` plus one identifier: `email`, `mobile_number`, `username`, or `identifier`.
	 * On pre-login pages without user details, pass `sub` or `q` from the redirect query string.
	 *
	 * Use `configured_list[].mediums[].id` as `medium_id` when initiating authentication.
	 * @example
	 * ```js
	 * cidaasVerificationService.getConfiguredAuthenticationMethods({
	 *   request_id: 'your request id',
	 *   email: 'your email'
	 * }).then(function (response) {
	 *   // configured_list with mediums
	 * }).catch(function(ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	getConfiguredAuthenticationMethods(options: GetConfiguredAuthenticationMethodsRequest, headers?: HTTPRequestHeader) {
		const _serviceURL = this.config.authority + "/verification-srv/public/graph/user/setup";
		return Helper.createHttpPromise(options, _serviceURL, false, "POST", undefined, headers);
	}

	/**
	 * Cancels an in-progress authentication step.
	 * @example
	 * ```js
	 * cidaasVerificationService.cancelAuthentication('email', {
	 *   exchange_id: 'exchange id from initiateAuthentication() response',
	 *   reason: 'user cancelled'
	 * }).then(function (response) {
	 *   // your success code here
	 * }).catch(function(ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	cancelAuthentication(method: VerificationType | string, options: Omit<CancelAuthenticationRequest, 'type'>, headers?: HTTPRequestHeader) {
		const _serviceURL = `${this.config.authority}/verification-srv/authentication/${method}/cancel`;
		return Helper.createHttpPromise(options, _serviceURL, undefined, "POST", undefined, headers);
	}

	/**
	 * To get all verification methods configured for the client app, call **getAllVerificationMethods()**.
	 * Requires an access token (passed as parameter or read from user storage).
	 * @example
	 * ```js
	 * cidaasVerificationService.getAllVerificationMethods()
	 * .then(function (response) {
	 *   // type your code here
	 * })
	 * .catch(function (ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	getAllVerificationMethods(access_token?: string, headers?: HTTPRequestHeader) {
		const _serviceURL = `${this.config.authority}/verification-actions-srv/config`;
		if (access_token) {
			return Helper.createHttpPromise(undefined, _serviceURL, undefined, "GET", access_token, headers);
		}
		return Helper.getAccessTokenFromUserStorage(this.userManager).then((accessToken) => {
			return Helper.createHttpPromise(undefined, _serviceURL, undefined, "GET", accessToken, headers);
		});
	}

	/**
	 * Starts enrollment for a verification method.
	 * Maps to `POST /verification-actions-srv/setup/{method}/initiation` (profile UI, access token required)
	 * or `POST /verification-actions-srv/setup/{method}/initiation/{trackId}` (suggest-verification / login UI).
	 * @example
	 * ```js
	 * // Profile UI (logged in)
	 * cidaasVerificationService.initiateEnrollment('FIDO2', {
	 *   deviceInfo: { deviceId: '...', location: { lat: '...', lon: '...' } }
	 * })
	 *
	 * // Suggest verification during login
	 * cidaasVerificationService.initiateEnrollment('email', { email: 'user@example.com' }, trackId)
	 * ```
	 */
	initiateEnrollment(method: VerificationType | string, options?: Omit<InitiateEnrollmentRequest, 'verification_type'>, trackId?: string, access_token?: string): Promise<any> {
		const enrollmentOptions = options ?? {};
		const setupBase = `${this.config.authority}/verification-actions-srv/setup/${method}`;
		const serviceURL = trackId ? `${setupBase}/initiation/${trackId}` : `${setupBase}/initiation`;
		if (trackId) {
			return Helper.createHttpPromise(enrollmentOptions, serviceURL, undefined, 'POST');
		}
		if (access_token) {
			return Helper.createHttpPromise(enrollmentOptions, serviceURL, undefined, 'POST', access_token);
		}
		return Helper.getAccessTokenFromUserStorage(this.userManager).then((accessToken) => {
			return Helper.createHttpPromise(enrollmentOptions, serviceURL, undefined, 'POST', accessToken);
		});
	}

	/**
	 * to get the status of MFA enrollment, call **getEnrollmentStatus()**.
	 * Please refer to the api document https://docs.cidaas.com/docs/cidaas-iam/branches/master/b06447d02d8e0-get-status-of-physical-verification-setup-configuration for more details.
	 * @example
	 * ```js
	 * cidaasVerificationService.getEnrollmentStatus('statusId from initiateEnrollment()')
	 * .then(function (response) {
	 *   // type your code here
	 * })
	 * .catch(function (ex) {
	 *   // your failure code here
	 * });
	 * ```
	*/
	getEnrollmentStatus(status_id: string, access_token?: string, headers?: HTTPRequestHeader) {
		const _serviceURL = this.config.authority + "/verification-srv/v2/notification/status/" + status_id;
		if (access_token) {
			return Helper.createHttpPromise(undefined, _serviceURL, undefined, "POST", access_token, headers);
		}
		return Helper.getAccessTokenFromUserStorage(this.userManager).then((accessToken) => {
			return Helper.createHttpPromise(undefined, _serviceURL, undefined, "POST", accessToken, headers);
		});
	}

	/**
	 * Completes enrollment for a verification method.
	 * Maps to `POST /verification-actions-srv/setup/{method}/verification`.
	 */
	verifyEnrollment(method: VerificationType | string, options: Omit<VerifyEnrollmentRequest, 'verification_type'>): Promise<any> {
		const serviceURL = `${this.config.authority}/verification-actions-srv/setup/${method}/verification`;
		return Helper.createHttpPromise(options, serviceURL, undefined, 'POST');
	}

	/**
	 * to see details of configured verification type, call **checkVerificationTypeConfigured()**.
	 * @example
	 * ```js
	 * cidaasVerificationService.checkVerificationTypeConfigured({
	 *   request_id: 'your request id',
	 *   email: 'your email',
	 *   verification_type: 'email'
	 * }).then(function (response) {
	 *   // type your code here
	 * })
	 * .catch(function (ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	checkVerificationTypeConfigured(options: CheckVerificationTypeConfiguredRequest) {
		const _serviceURL = this.config.authority + "/verification-srv/v2/setup/public/configured/check/" + options.verification_type;
		return Helper.createHttpPromise(options, _serviceURL, undefined, "POST");
	}

	/**
	 * Starts an authentication step for the given verification method.
	 * Maps to `POST /verification-srv/authentication/{method}/initiation`.
	 *
	 * Required body fields: `request_id`, `usage_type`.
	 * @example
	 * ```js
	 * cidaasVerificationService.initiateAuthentication('email', {
	 *   request_id: 'your request id',
	 *   usage_type: 'INITIAL_AUTHENTICATION',
	 *   email: 'your email'
	 * })
	 * .then(function (response) {
	 *   // exchange_id, fido2_entity, etc.
	 * })
	 * .catch(function (ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	initiateAuthentication(method: VerificationType | string, options: Omit<InitiateAuthenticationRequest, 'type'>, headers?: HTTPRequestHeader) {
		const _serviceURL = `${this.config.authority}/verification-srv/authentication/${method}/initiation`;
		return Helper.createHttpPromise(options, _serviceURL, false, "POST", undefined, headers);
	}

	/**
	 * Completes an authentication step for the given verification method.
	 * Maps to `POST /verification-srv/authentication/{method}/verification`.
	 *
	 * Required body field: `exchange_id` (from the latest initiation response).
	 * Use `password` for PASSWORD, `fido2_client_response` for FIDO2, `pass_code` for OTP-based methods.
	 * @example
	 * ```js
	 * cidaasVerificationService.verifyAuthentication('email', {
	 *   exchange_id: 'exchange id from initiateAuthentication()',
	 *   pass_code: 'code from email'
	 * }).then(function (response) {
	 *   // authentication result
	 * })
	 * .catch(function (ex) {
	 *   // your failure code here
	 * });
	 * ```
	 */
	verifyAuthentication(method: VerificationType | string, options: Omit<VerifyAuthenticationRequest, 'type'>, headers?: HTTPRequestHeader) {
		const _serviceURL = `${this.config.authority}/verification-srv/authentication/${method}/verification`;
		return Helper.createHttpPromise(options, _serviceURL, undefined, "POST", undefined, headers);
	}

	/**
	 * Sets a friendly name on an enrolled device.
	 * Maps to `PUT /verification-actions-srv/setup/users/friendlyname/{METHOD}/{trackId}`.
	 */
	updateEnrollmentFriendlyName(method: VerificationType | string, options: UpdateEnrollmentFriendlyNameRequest, trackId: string) {
		const serviceURL = `${this.config.authority}/verification-actions-srv/setup/users/friendlyname/${method.toUpperCase()}/${trackId}`;
		return Helper.createHttpPromise(options, serviceURL, undefined, 'PUT');
	}

}
