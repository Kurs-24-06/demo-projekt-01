# node version als basis image
FROM node:18-alpine

# arbeitsverzeichnis im container
WORKDIR /app

# package.json und package-lock.json kopieren
# diese werden zuerst kopiert, damit der cache für node_modules genutzt werden kann
COPY package*.json ./

# dependencies installieren
# --production flag würde dev dependencies weglassen, wir brauchen aber nodemon
RUN npm install

# alle anderen dateien kopieren
COPY . .

# port freigeben, damit von außen zugegriffen werden kann
EXPOSE 5000

# standardbefehl zum starten der anwendung
# hier nutzen wir nodemon für hot reloading während der entwicklung
CMD ["npm", "run", "dev"]