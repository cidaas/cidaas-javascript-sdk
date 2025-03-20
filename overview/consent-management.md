# Consent Management

Cidaas supports consent flow in form of default consent hosted pages. In case of having custom flow or wanting custom page, cidaas javascript SDK provides functions to call cidaas api, which can be used to create custom consent page / flow in the client app.

## Building Custom Consent
By using getConsentDetails() as well as getConsentVersionDetails(), it is possibile to get all consent details and build custom consent page / flow based on the details.

```mermaid
---
title: Build Custom Consent Page
---
sequenceDiagram
  participant ClientApp as client app
  participant CidaasSDK as cidaas javascript SDK
  participant CidaasAPI as cidaas API

par Consent Details
    ClientApp ->> CidaasSDK: call getConsentDetails()
    
    activate CidaasSDK
    CidaasSDK ->> CidaasAPI: call cidaas API
    deactivate CidaasSDK

    activate CidaasAPI
    CidaasAPI -->> ClientApp: consent details
    deactivate CidaasAPI

and Consent Version Details
    ClientApp ->> CidaasSDK: call getConsentVersionDetails()

    activate CidaasSDK
    CidaasSDK ->> CidaasAPI: call cidaas API
    deactivate CidaasSDK

    activate CidaasAPI
    CidaasAPI -->> ClientApp: consent version details
    deactivate CidaasAPI
end

activate ClientApp
ClientApp ->> ClientApp: build custom consent page
deactivate ClientApp
```
## Accepting Custom Consent

Cidaas provides 3 types of consents: 
* app level consent
* scope consent
* claim consent

To accept these different consents, the following functions should be called:
* acceptConsent()
* acceptScopeConsent()
* acceptClaimConsent()

```mermaid
---
title: Accept Custom Consent
---
sequenceDiagram
  Actor User
  participant ClientApp as client app
  participant CidaasSDK as cidaas javascript SDK
  participant CidaasAPI as cidaas API
User ->> ClientApp: click on accept button

alt App Level Consent
    ClientApp ->> CidaasSDK: call acceptConsent()
    activate CidaasSDK
    CidaasSDK ->> CidaasAPI: call app consent API
    deactivate CidaasSDK
else Scope Consent
    ClientApp ->> CidaasSDK: call acceptScopeConsent()
    activate CidaasSDK
    CidaasSDK ->> CidaasAPI: call scope consent API
    deactivate CidaasSDK
else Claim Consent
    ClientApp ->> CidaasSDK: call acceptClaimConsent()
    activate CidaasSDK
    CidaasSDK ->> CidaasAPI: call claim consent API
    deactivate CidaasSDK
end
CidaasAPI ->> ClientApp: complete accept consent
```

