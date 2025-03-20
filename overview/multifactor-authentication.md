# Multifactor Authentication

Cidaas javascript SDK provides functions which calls cidaas api for managing multifactor authentication as following:

| SDK Function | Description |
|----------------- | ----------------------- |
|  getMFAList | Get all mfa, which has been configured by current active user |
|  getAllVerificationList | Get all mfa possibilities for the client app |

## MFA Verification

By calling initiateMFA(), user will start MFA verification process. From here user will be able to either complete the MFA process or cancel it. By calling authenticateMFA() and finishing authentication e.g. by providing pass code, the MFA verification process will be completed. Whereas calling cancelMFA() will cancel and end the verification process.

```mermaid
---
title: MFA Verification
---
sequenceDiagram
  Actor User 
  participant ClientApp as client app
  participant CidaasSDK as cidaas javascript SDK
  participant CidaasAPI as cidaas API

User ->> ClientApp: login

activate ClientApp
ClientApp ->> CidaasSDK: call initiateMFA()
deactivate ClientApp

activate CidaasSDK
CidaasSDK ->> CidaasAPI: call cidaas API
deactivate CidaasSDK

activate CidaasAPI
CidaasAPI ->> User: start MFA verification process
deactivate CidaasAPI


alt Cancel MFA Process
    User ->> ClientApp: cancel MFA

    activate ClientApp
    ClientApp ->> CidaasSDK: call cancelMFA()
    deactivate ClientApp

    activate CidaasSDK
    CidaasSDK ->> CidaasAPI: call cidaas API
    deactivate CidaasSDK

    activate CidaasAPI
    CidaasAPI ->> ClientApp: Cancel MFA Process
    deactivate CidaasAPI
else Complete MFA Process
    User ->> ClientApp: authenticate MFA

    activate ClientApp
    ClientApp ->> CidaasSDK: call authenticateMFA()
    deactivate ClientApp

    activate CidaasSDK
    CidaasSDK ->> CidaasAPI: call cidaas API
    deactivate CidaasSDK

    activate CidaasAPI
    CidaasAPI ->> ClientApp: Complete MFA Process
    deactivate CidaasAPI
end
```

## Enroll new Authentication Method

To enroll a new MFA method, you can call initiateEnrollment() function. This will generate exchange id, which will be used by enrollVerification() to complete enrollment process.

```mermaid
---
title: Enroll new Authentication
---
sequenceDiagram
  Actor User
  participant ClientApp as client app
  participant CidaasSDK as cidaas javascript SDK
  participant CidaasAPI as cidaas API

User ->> ClientApp: add new MFA Method

activate ClientApp
ClientApp ->> CidaasSDK: call initiateEnrollment()
deactivate ClientApp

activate CidaasSDK
CidaasSDK ->> CidaasAPI: call cidaas API
deactivate CidaasSDK

activate CidaasAPI
CidaasAPI -->> ClientApp: exchange id
deactivate CidaasAPI

activate ClientApp
ClientApp ->> CidaasSDK: call enrollVerification()
deactivate ClientApp

activate CidaasSDK
CidaasSDK ->> CidaasAPI: call cidaas API
deactivate CidaasSDK

activate CidaasAPI
CidaasAPI ->> ClientApp: complete MFA enrollment process
deactivate CidaasAPI
```

By using getEnrollmentStatus(), the status of enrollment process can be tracked.
By using checkVerificationTypeConfigured(), you can check whether a specific MFA method has been enrolled.