# Overview

Cidaas Javascript SDK helps integrating cidaas to your client application easily. It manages tokens and communicate with cidaas apis.

After adding Cidaas Javascript SDK Library to client side application and [configuring](configuration.md) it using oidc settings, it will be able to integrate cidaas functionalities such as:

* authenticating user using [PKCE flow](pkce-flow.md)
* [session management](session-management)
* user management
* consent management
* implementing multifactor authentication

Aside from that, Cidaas Javascript SDK also provide useful functionalities such as:

* [access token management](access-token-management.md): storing, retrieving & renewal of tokens
* [automatically assign access token](access-token-management.md#storing--getting-access-token-information) to api calls which needs it
* providing data model for each of cidaas api calls
* offline access token check



