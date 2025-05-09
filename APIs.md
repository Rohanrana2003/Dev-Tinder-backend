# DevTinder APIs

## AuthRouter

- POST: /signup
- POST: /login
- POST: /logout

## ProfileRouter

- GET: /profile/view
- PATCH: /profile/edit
- PATCH: /profile/forgotPassword

## RequestsRouter

- POST: request/send/interested/userId:
- POST: request/send/ignored/userId:

- POST: request/review/pending/userId:
- POST: request/review/accepted/userId:
- POST: request/review/rejected/userId:

## UserRouter

- GET: /user/feed
- GET: /user/connections
- GET: /user/requests
