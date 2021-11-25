# BigCommerce Webhooks Consumer APP

## **Description**

NodeJS application written with TypeScript ready for Docker and Google Cloud Run, made for consuming BigCommerce webhooks events.

After receiving payload from BC, application will validate that payload by checking the custom header value against Firestore db.
This custom header value is set by the [BigCommerce-App](https://github.com/Attraqt/bigcommerce-app) and stored in Firestore db upon enabling webhooks for some BC store.

If the payload is valid the process proceeds to identifying the origin of the webhook event and from there, based on the origin of the event, it decides to which endpoint that payload will be send.
There are 2 endpoints that will receive data from this app:

- CIDP; if the webhook event is of origin `inventory`
- AEC Realtime Consumer; via KONG endpoint if the webhook event if different of `inventory`

This decision is made in the controller of the app called [bcWebhooksConsumerController](src\controllers\bc-webhooks-consumer.controller.ts) in the function called `payloadRouter`

## **App Flow**

With initialization, the app will:

- [start listening and accepting POST events on one endpoint](src\server.ts) - [{domain}/api/bc-webhooks-consumer](src\controllers\bc-webhooks-consumer.controller.ts),
- [it will start another process which will get access token from keycloak and it will keep it fresh by getting new one 5 seconds before the previous one expires](src\core\services\KeyCloakAuthService.ts)
- [and attach lister on firestore db to a specific collection changes.](src\core\services\FirebaseService.ts)

The token will be used for sending data to both CIDP and KONG.

After receiving data from BC webhook, the app will get the shops from

## **Requirements:**

- Firebase on Google Cloud or local running emulator
  - [install firebase on your local](https://firebase.google.com/docs/cli#install_the_firebase_cli)
- Keycloak credentials for getting access token used for sending data to CIDP
  - [install keycloak instance on your local](https://www.keycloak.org/getting-started/getting-started-docker)
- [Ngrok](https://ngrok.com/download) for exposing https endpoint from your local running instance
- Local running [Docker](https://www.docker.com/products/docker-desktop) instance
- No operating system dependencies

start ngrok: `ngrok http 8000`
start local firebase emulator: `firebase emulators:start --project bc-webhooks-consumer --import=./firestore_data --export-on-exit`
deploy using this manual: `https://cloud.google.com/run/docs/quickstarts/build-and-deploy/nodejs`

test the docker on your local docker: `docker build -t bc-webhooks-consumer-api:prod .`
run the docker image: `docker run -p 8000:8000 --name bc-webhooks-consumer-container -d bc-webhooks-consumer-api:prod`

deploy on gcloud:

- first download and install gcloud: `https://cloud.google.com/sdk/docs/quickstart?authuser=1`
- next init gcloud: `gcloud init`
- run in terminal: `gcloud run deploy --source .`
- set the name to: `bc-webhooks-consumer-api`
- for region choose: `15` - europe-west2 = London

local docker keycloack server following this manual: `https://www.keycloak.org/getting-started/getting-started-docker`

// keycloak url: `http://localhost:8080/auth/realms/bc-app-realm`
// keycloak realm name: `bc-app-realm`
// keycloak username: `bc_app_keycloak_user`
// keycloak password: `bc_app_keycloak_user`
