# node version als basis image
FROM node:18-alpine

# arbeitsverzeichnis im container
WORKDIR /app

# package.json und package-lock.json kopieren
# diese werden zuerst kopiert für besseres caching
COPY package*.json ./

# dependencies installieren
RUN npm install

# alle anderen dateien kopieren
COPY . .

# port freigeben, damit von außen zugegriffen werden kann
EXPOSE 3000

# standardbefehl zum starten der anwendung
# wir nutzen hier den development server für hot reloading
CMD ["npm", "start"]