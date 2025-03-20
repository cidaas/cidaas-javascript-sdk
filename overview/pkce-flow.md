# Integrating PKCE Flow

By calling loginWithBrowser() function, the sdk will call cidaas authz url, which will resolve into user predefined login url. This could be either in form of default hosted page or custom login page, if configured.

After successful user authentication in the login page, user will be be redirected to predefined redirecturl, which has been configured in configuration file, alongside with code to be exchanged as tokens. 

By calling loginCallback() from the redirect url afterwards, the SDK will exchange the code from cidaas into tokens. This includes Access Token, Id Token & Refresh Token. The SDK will save the tokens afterwards as default behaviour. This can be disabled.

```mermaid
---
title: Integration PKCE Flow
---
sequenceDiagram
  Actor User
  participant ClientApp as client app
  participant CidaasSDK as cidaas javascript SDK
  participant CidaasAPI as cidaas API

User ->> ClientApp: login to app

activate ClientApp
ClientApp ->> CidaasSDK: call loginWithBrowser()
deactivate ClientApp

activate CidaasSDK
CidaasSDK ->> CidaasSDK: generate code verifier & code challenge
CidaasSDK ->> CidaasAPI: call cidaas API
deactivate CidaasSDK

activate CidaasAPI
CidaasAPI ->> User: redirect to login page
User ->> CidaasAPI: do authentication
CidaasAPI -->> ClientApp: redirect to main page, along with authorization code
deactivate CidaasAPI

activate ClientApp
ClientApp ->> CidaasSDK: call loginCallback()
deactivate ClientApp

activate CidaasSDK
CidaasSDK ->> CidaasAPI: exchange authorization code & code verifier with tokens
deactivate CidaasSDK

activate CidaasAPI
CidaasAPI -->> CidaasSDK: Access Token, Id Token, Refresh Token
deactivate CidaasAPI

activate CidaasSDK
CidaasSDK ->> CidaasSDK: save informations in user storage
CidaasSDK -->> ClientApp: user informations
deactivate CidaasSDK

```