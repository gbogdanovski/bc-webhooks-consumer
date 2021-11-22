FROM node:14-slim
WORKDIR /app
# COPY serviceAccountKey.json .
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . ./
EXPOSE 80
CMD ["npm", "start" ]
ENV PORT=8080

# The name of the header that BC webhook will hold the Atraqt token value
ENV WEBHOOK_CUSTOM_HEADER_NAME="Attraqt-Access-Token"

# KONG api url
ENV KONG_URL=""

# CIDP api url
ENV CIDP_URL=""

# ENV GOOGLE_APPLICATION_CREDENTIALS="serviceAccountKey.json"