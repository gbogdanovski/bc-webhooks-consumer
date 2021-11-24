FROM node:14-slim
WORKDIR /app
# COPY serviceAccountKey.json .
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . ./
EXPOSE 80
CMD ["npm", "start" ]
ENV PORT=8000

# The name of the header that BC webhook will hold the Atraqt token value
ENV WEBHOOK_CUSTOM_HEADER_NAME="Attraqt-Access-Token"

# KONG api url
ENV KONG_URL=""

# CIDP api url
ENV CIDP_URL=""

ENV KEYCLOAK_URL="http://iam-dev.attraqt.io/auth/realms/master/protocol/openid-connect/token"
ENV KEYCLOAK_CLIENT_ID="attraqt-aec"
ENV KEYCLOAK_CLIENT_SECRET="917b4372-e40e-44fb-b3dd-4223f8c87ba1"