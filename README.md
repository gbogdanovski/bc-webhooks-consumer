start ngrok: `ngrok http 8000`
start local firebase emulator: `firebase emulators:start --project bc-webhooks-consumer --import=./firestore_data --export-on-exit`
deploy using this manual: `https://cloud.google.com/run/docs/quickstarts/build-and-deploy/nodejs`

test the docker on your local docker: `docker build -t bc-webhooks-consumer-api:prod .`
run the docker image: `docker run -p 8000:8000 --name bc-webhooks-consumer-container -d bc-webhooks-consumer-api:prod`

deploy on gcloud:

- first init gcloud: `gcloud init`
- run in terminal: `gcloud run deploy --source .`
- set the name to: `bc-webhooks-consumer-api`
- for region choose: `15` - europe-west2 = London

local docker keycloack server following this manual: `https://www.keycloak.org/getting-started/getting-started-docker`

// keycloak url: `http://localhost:8080/auth/realms/bc-app-realm`
// keycloak realm name: `bc-app-realm`
// keycloak username: `bc_app_keycloak_user`
// keycloak password: `bc_app_keycloak_user`
