# Session Management

## Extending Session
Shortly before access token expired, Cidaas Javascript SDK will [automatically get a new token](access-token-management.md#refresh-token-flow), if refresh token is configured. To get refresh token, scope: `offline_access`needs to be provided in [OIDC Settings](configuration.md). 

## Ending Session
