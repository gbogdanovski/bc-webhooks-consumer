# BigCommerce Webhooks Consumer APP

## **Description**

<p>
NodeJS application written with TypeScript ready for Docker and Google Cloud Run, made for consuming BigCommerce webhooks events and shipping that data to external services.
</p><br>

> ## Requirements:

- Firebase on Google Cloud or local running emulator
  - [install firebase on your local](https://firebase.google.com/docs/cli#install_the_firebase_cli)
- Keycloak credentials for getting access token used for sending data to CIDP
  - [install keycloak instance on your local](https://www.keycloak.org/getting-started/getting-started-docker)
- [Ngrok](https://ngrok.com/download) for exposing https endpoint from your local running instance
- Local running [Docker](https://www.docker.com/products/docker-desktop) instance
- No operating system dependencies
  <br><br>

> ## App Flow

With initialization, the app will:

- [start listening and accepting POST events on one endpoint](src/server.ts) - [{domain}/api/bc-webhooks-consumer](src/controllers/bc-webhooks-consumer.controller.ts),
- [it will start another process which will get access token from keycloak and it will keep it fresh by getting new one 5 seconds before the previous one expires](src/core/services/KeyCloakAuthService.ts)
- [and attach listener on firestore db to a specific collection changes.](src/core/services/FirebaseService.ts)

**The token will be used for sending data to both CIDP and KONG.**

<p>
After receiving payload from BC, application will validate that payload by checking the custom header value against Firestore db.
This custom header value is set by the [BigCommerce-App](https://github.com/Attraqt/bigcommerce-app) and stored in Firestore db upon enabling webhooks for some BC store.
</p>
<p>
If the payload is valid the process proceeds to identifying the origin of the webhook event and from there, based on the origin of the event, it decides to which endpoint that payload will be send.
There are 2 external endpoints that will receive data from this app:

- CIDP; if the webhook event is of origin `inventory`
- AEC Realtime Consumer; via KONG endpoint if the webhook event if different of `inventory`
</p>
<p>
This decision is made in the controller of the app called [bcWebhooksConsumerController](src/controllers/bc-webhooks-consumer.controller.ts) in the function called `payloadRouter`
</p><br>

> ## Firebase on Google Cloud or local emulator

The development is possible with these two options, cloud or local Firebase.

<p>If you decide to use Firebase on Google Cloud, you will need service account json file stored and ignored in [.gitigore](.gitignore) file locally. The value of the service account json file will have to be passed to the FireStore instance that is initialized in [FirebaseService](src/core/services/FirebaseService.ts) using require('path/of/the/service-account.json').
</p>
<p>
If you decide to use the locally running emulator, which is preferred and way more easier option, then just start the emulator by running this command in terminal `firebase emulators:start --project bc-webhooks-consumer --import=./firestore_data --export-on-exit`
This command import some initial data and it will save all changes that were made in the db after stopping it with `ctrl+c` in the terminal where it was started.
</p>

#### **_NOTE: If code that id requiring service account json file to start Firestore is deployed on Google Cloud Run, you may experience issues starting the app_**

<br><br>

> ## Deploy on Google Cloud

In order to deploy this app to Google Cloud Run, you will have to follow [these steps](https://cloud.google.com/sdk/docs/quickstart)
After finishing the initial requirements from GCP by running `gcloud init` in terminal, next step is to deploy the app to Google Cloud Run by executing this commands in your terminal:

- open new terminal and run: `gcloud run deploy --source .`
- when gcloud ask for name: `bc-webhooks-consumer-api`
- and finally the region: `15` or europe-west2 = London

<br/>
<br/>

> ## Other useful commands

- start ngrok: `ngrok http 8000`
- test the docker on your local docker: `docker build -t bc-webhooks-consumer-api:prod .`
- run the docker image: `docker run -p 8000:8000 --name bc-webhooks-consumer-container -d bc-webhooks-consumer-api:prod`
- local docker keycloack server following this manual: `https://www.keycloak.org/getting-started/getting-started-docker`
