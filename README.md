start ngrok: `ngrok http 8080`
start local firebase emulator: `firebase emulators:start --project bc-webhooks-consumer --import=./firestore_data --export-on-exit`
deploy using this manual: https://cloud.google.com/run/docs/quickstarts/build-and-deploy/nodejs

test the docker on your local docker: `docker build -t bc-webhooks-consumer-api:prod .`
run the docker image: `docker run -p 8080:8080 --name bc-webhooks-consumer-container -d bc-webhooks-consumer-api:prod`

deploy on gcloud:

- first init gcloud: `gcloud init`
- run in terminal: `gcloud run deploy --source .`
- set the name to: `bc-webhooks-consumer-api`
- for region choose: `15` - europe-west2 = London
