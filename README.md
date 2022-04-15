# virtual-assistant-ng

## SKETCH

<img src = 'docs/virtual-assistant.png' />

## main areas

- Home Page
- Companies (C R U D)
- Users (C R U D)
- Visitors (C R U D)
- Attachment 

 (C R U D) => list page, edit page, view page
 (R U)  => single edit page, single view page

## security domain
```
export const keycloakConfig: KeycloakConfig = {
  url: 'https://sso.n-ess.it/auth/',
  realm: 'virtual-assistant',
  clientId: 'virtual-assistant-ng',
};
```

### users to test login:
- virtual-assistant_admin/12345678

## rest api:

https://virtual-assistant.n-ess.it/api/v1/

- attachments
- companies
- users
- visitors
