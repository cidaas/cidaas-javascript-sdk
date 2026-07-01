import { VerificationService }  from './VerificationService';
import { Helper } from "../common/Helper";
import { CancelAuthenticationRequest, CheckVerificationTypeConfiguredRequest, GetConfiguredAuthenticationMethodsRequest, InitiateAccountVerificationRequest, InitiateAuthenticationRequest, UpdateEnrollmentFriendlyNameRequest, VerifyAccountRequest, VerifyAuthenticationRequest } from './VerificationService.model';
import { OidcSettings } from '../authentication/Authentication.model';
import ConfigUserProvider from '../common/ConfigUserProvider';

const authority = 'baseURL';
const serviceBaseUrl: string = `${authority}/verification-srv`;
const actionsServiceBaseUrl: string = `${authority}/verification-actions-srv`;
const createFormSpy = jest.spyOn(Helper, 'createForm');
const submitFormSpy = jest.spyOn(HTMLFormElement.prototype, 'submit').mockImplementation();
const httpSpy = jest.spyOn(Helper, 'createHttpPromise');
let verificationService: VerificationService;

beforeAll(() => {
  const options: OidcSettings = {
    authority: authority,
    client_id: '',
    redirect_uri: ''
  };
  const configUserProvider: ConfigUserProvider = new ConfigUserProvider(options);
  verificationService = new VerificationService(configUserProvider);
});

test('initiateAccountVerification', () => {
  const options: InitiateAccountVerificationRequest = {
    sub: '123'
  };
  const serviceURL = `${actionsServiceBaseUrl}/account/initiation`;
  verificationService.initiateAccountVerification(options);
  expect(createFormSpy).toHaveBeenCalledWith(serviceURL, options);
  expect(submitFormSpy).toHaveBeenCalled();
});

test('verifyAccount', () => {
  const options: VerifyAccountRequest = {
    accvid: 'accvid',
    code: 'code'
  };
  const serviceURL = `${actionsServiceBaseUrl}/account`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  verificationService.verifyAccount(options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, headers);
});

describe('getConfiguredAuthenticationMethods', () => {
  test('withEmail', () => {
    const options: GetConfiguredAuthenticationMethodsRequest = {
      request_id: 'request_id',
      email: 'email'
    };
    const serviceURL = `${serviceBaseUrl}/public/graph/user/setup`;
    verificationService.getConfiguredAuthenticationMethods(options);
    expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, undefined);
  });

  test('withMobile', () => {
    const options: GetConfiguredAuthenticationMethodsRequest = {
      request_id: 'request_id',
      mobile_number: 'mobile_number'
    };
    const serviceURL = `${serviceBaseUrl}/public/graph/user/setup`;
    verificationService.getConfiguredAuthenticationMethods(options);
    expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, undefined);
  });

  test('withUsername', () => {
    const options: GetConfiguredAuthenticationMethodsRequest = {
      request_id: 'request_id',
      username: 'username'
    };
    const serviceURL = `${serviceBaseUrl}/public/graph/user/setup`;
    verificationService.getConfiguredAuthenticationMethods(options);
    expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, undefined);
  });

  test('withMaskedSub', () => {
    const options: GetConfiguredAuthenticationMethodsRequest = {
      request_id: 'request_id',
      sub: 'masked sub'
    };
    const serviceURL = `${serviceBaseUrl}/public/graph/user/setup`;
    verificationService.getConfiguredAuthenticationMethods(options);
    expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, undefined);
  });

  test('withQ', () => {
    const options: GetConfiguredAuthenticationMethodsRequest = {
      request_id: 'request_id',
      q: 'masked sub'
    };
    const serviceURL = `${serviceBaseUrl}/public/graph/user/setup`;
    verificationService.getConfiguredAuthenticationMethods(options);
    expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, undefined);
  });
});

test('cancelAuthentication', () => {
  const options: CancelAuthenticationRequest = {
    exchange_id: 'exchange_id',
    reason: 'reason',
    type: 'email'
  };
  const serviceURL = `${serviceBaseUrl}/authentication/email/cancel`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  verificationService.cancelAuthentication('email', { exchange_id: options.exchange_id, reason: options.reason }, headers);
  expect(httpSpy).toHaveBeenCalledWith({ exchange_id: options.exchange_id, reason: options.reason }, serviceURL, undefined, "POST", undefined, headers);
});

test('getAllVerificationMethods', () => {
  const accessToken = 'accessToken';
  const serviceURL = `${actionsServiceBaseUrl}/config`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  verificationService.getAllVerificationMethods(accessToken, headers);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, undefined, "GET", accessToken, headers);
});

test('initiateEnrollment with access token', () => {
  const method = 'fido2';
  const options = {
    deviceInfo: {
      deviceId: 'deviceId',
      location: { lat: 'lat', lon: 'lon' }
    }
  };
  const accessToken = 'accessToken';
  const serviceURL = `${actionsServiceBaseUrl}/setup/${method}/initiation`;
  verificationService.initiateEnrollment(method, options, undefined, accessToken);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'POST', accessToken);
});

test('initiateEnrollment with trackId', () => {
  const method = 'email';
  const options = { email: 'email' };
  const trackId = 'trackId';
  const serviceURL = `${actionsServiceBaseUrl}/setup/${method}/initiation/${trackId}`;
  verificationService.initiateEnrollment(method, options, trackId);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'POST');
});

test('getEnrollmentStatus', () => {
  const status_id = 'status_id';
  const accessToken = 'accessToken';
  const serviceURL = `${serviceBaseUrl}/v2/notification/status/${status_id}`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  verificationService.getEnrollmentStatus(status_id, accessToken, headers);
  expect(httpSpy).toHaveBeenCalledWith(undefined, serviceURL, undefined, "POST", accessToken, headers);
});

test('verifyEnrollment', () => {
  const method = 'fido2';
  const options = {
    exchange_id: 'exchange_id',
    device_id: 'device_id',
    client_id: 'client_id',
    pass_code: 'pass_code',
    fido2_client_response: {},
  };
  const serviceURL = `${actionsServiceBaseUrl}/setup/${method}/verification`;
  verificationService.verifyEnrollment(method, options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST");
});

test('checkVerificationTypeConfigured', () => {
  const options: CheckVerificationTypeConfiguredRequest = {
    email: 'email',
    request_id: 'request_id',
    verification_type: 'verification_type'
  };
  const serviceURL = `${serviceBaseUrl}/v2/setup/public/configured/check/${options.verification_type}`;
  verificationService.checkVerificationTypeConfigured(options);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST");
});

test('initiateAuthentication', () => {
  const options: Omit<InitiateAuthenticationRequest, 'type'> = {
    usage_type: 'usage_type',
    request_id: 'request_id',
  };
  const method = 'email';
  const serviceURL = `${serviceBaseUrl}/authentication/${method}/initiation`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  verificationService.initiateAuthentication(method, options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, false, "POST", undefined, headers);
});

test('verifyAuthentication', () => {
  const options: Omit<VerifyAuthenticationRequest, 'type'> = {
    exchange_id: 'exchange_id',
    pass_code: 'pass_code',
  };
  const method = 'email';
  const serviceURL = `${serviceBaseUrl}/authentication/${method}/verification`;
  const headers = {requestId: 'requestId', lat: 'lat value', lon: 'lon value'}
  verificationService.verifyAuthentication(method, options, headers);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, "POST", undefined, headers);
});

test('updateEnrollmentFriendlyName', () => {
  const options: UpdateEnrollmentFriendlyNameRequest = {
    sub: 'sub',
    friendly_name: 'friendly name'
  };
  const trackId = 'trackId';
  const method = 'email';
  const serviceURL = `${actionsServiceBaseUrl}/setup/users/friendlyname/${method.toUpperCase()}/${trackId}`;
  verificationService.updateEnrollmentFriendlyName(method, options, trackId);
  expect(httpSpy).toHaveBeenCalledWith(options, serviceURL, undefined, 'PUT');
});
