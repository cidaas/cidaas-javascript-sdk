# Session Management

## Extending Session

Shortly before access token expired, cidaas javascript SDK will [automatically get a new token](access-token-management.md#refresh-token-flow), if refresh token is configured. To get refresh token, scope: `offline_access` needs to be provided in [Oidc Settings](overview.md#oidc-settings). 

## Ending Session

By calling logout(), the sdk will call Cidaas endsession endpoint and providing needed parameters such as client id, id token hint as well as post logout url from [Oidc Settings](overview.md#oidc-settings) & user storage to the endpoint.

```mermaid
---
title: Ending Session
---
sequenceDiagram
  Actor User
  participant ClientApp as client app
  participant CidaasSDK as cidaas javascript SDK
  participant CidaasAPI as cidaas API

User ->> ClientApp: click on logout button

activate ClientApp
ClientApp ->> CidaasSDK: call logout()
deactivate ClientApp

activate CidaasSDK
CidaasSDK ->> CidaasSDK: get needed informations to end session
CidaasSDK ->> CidaasAPI: call endsession api
deactivate CidaasSDK

activate CidaasAPI
CidaasAPI ->> User: redirect to post logout uri
deactivate CidaasAPI


```