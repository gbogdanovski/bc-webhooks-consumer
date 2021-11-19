start ngrok: `ngrok http 8080`
start local firebase emulator: `firebase emulators:start --project bc-webhooks-consumer --import=./firestore_data --export-on-exit`
deploy using this manual: https://cloud.google.com/run/docs/quickstarts/build-and-deploy/nodejs
`docker build -t bc-webhooks-consumer-api:prod .`
`docker run -p 8080:8080 --name bc-webhooks-consumer-container -d bc-webhooks-consumer-api:prod`

deploy on gcloud:

- run in terminal: `gcloud run deploy --source .`
- set the name to: `bc-webhooks-consumer-api`
- region is: `15` - europe-west2 = London
