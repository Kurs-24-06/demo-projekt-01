# Task Manager - Multi-Tier Docker Demo

Eine minimalistische Demo-Anwendung zur Veranschaulichung einer Multi-Tier-Architektur mit Docker. Diese Anwendung besteht aus:

- **Frontend**: React.js
- **Backend**: Node.js mit Express
- **Datenbank**: MongoDB

## Architekturübersicht

Die Anwendung folgt einer klassischen 3-Tier-Architektur:

1. **Präsentationsschicht** (Frontend):
   - React Single-Page-Application
   - Kommuniziert mit dem Backend über REST API
   - Läuft in einem eigenen Docker-Container

2. **Anwendungsschicht** (Backend):
   - Express.js REST API
   - Implementiert die Geschäftslogik
   - Läuft in einem eigenen Docker-Container

3. **Datenschicht** (Datenbank):
   - MongoDB für persistente Datenspeicherung
   - Läuft in einem eigenen Docker-Container

## Projektstruktur

```
multi-tier-docker-demo/
├── frontend/              # React Frontend-Code
│   ├── public/            # Statische Dateien
│   ├── src/               # React Komponenten und Logik
│   │   ├── components/    # Wiederverwendbare UI-Komponenten
│   │   ├── App.js         # Hauptkomponente
│   │   └── ...
│   ├── Dockerfile         # Frontend-Docker-Konfiguration
│   └── package.json       # Frontend-Dependencies
│
├── backend/               # Node.js/Express Backend-Code
│   ├── src/
│   │   ├── models/        # Datenmodelle (Mongoose Schemas)
│   │   ├── routes/        # API-Endpunkte
│   │   └── index.js       # Server-Einstiegspunkt
│   ├── Dockerfile         # Backend-Docker-Konfiguration
│   └── package.json       # Backend-Dependencies
│
└── docker-compose.yml     # Orchestrierung aller Services
```

## Kommunikationsfluss

1. Der Nutzer interagiert mit dem Frontend im Browser
2. Frontend sendet HTTP-Anfragen an das Backend
3. Backend verarbeitet die Anfragen und interagiert mit der Datenbank
4. Backend sendet Antworten zurück an das Frontend
5. Frontend aktualisiert die Benutzeroberfläche

## Installation und Start

Voraussetzungen:
- Docker und Docker Compose installiert

Anwendung starten:

```bash
# Klonen des Repositories (falls vorhanden)
git clone <repository-url>
cd multi-tier-docker-demo

# Starten der Anwendung mit Docker Compose
docker-compose up
```

Nach dem Start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- MongoDB: läuft auf Port 27017

## Verwendete Technologien

- **Frontend**:
  - React.js
  - Axios für HTTP-Anfragen
  - CSS für Styling

- **Backend**:
  - Node.js
  - Express.js für REST API
  - Mongoose als MongoDB-Schnittstelle
  - Cors für Cross-Origin Resource Sharing

- **Datenbank**:
  - MongoDB

- **DevOps**:
  - Docker
  - Docker Compose


# Das Zusammenspiel der Multi-Tier-Anwendung - Eine anfängerfreundliche Erklärung

## Was ist eine Multi-Tier-Anwendung?

Stell dir vor, du baust ein Haus. Da gibt es verschiedene Stockwerke, die unterschiedliche Funktionen haben. Im Keller sind die Rohre und Leitungen, im Erdgeschoss ist vielleicht das Wohnzimmer und in den oberen Stockwerken sind die Schlafzimmer. Ähnlich ist es bei einer Multi-Tier-Anwendung!

Eine Multi-Tier-Anwendung (oder Mehrschichtenanwendung) ist wie ein Haus mit verschiedenen Stockwerken, wobei jedes "Stockwerk" (oder "Tier") eine bestimmte Aufgabe hat:

1. **Frontend (Präsentationsschicht)**: Was der Benutzer sieht und womit er interagiert - wie die Inneneinrichtung deines Hauses.
2. **Backend (Logikschicht)**: Die Gehirnzentrale, wo alle Entscheidungen getroffen werden - wie die Elektrik und Steuerung im Haus.
3. **Datenbank (Datenschicht)**: Wo alle Informationen gespeichert werden - wie der Keller, wo alles aufbewahrt wird.

## Warum Docker?

Docker ist wie ein Umzugscontainer für deine Anwendung. Du packst alles, was deine Anwendung braucht, in einen Container. Dieser Container kann dann überall hingebracht werden - auf deinem Computer, auf einem Server oder in der Cloud. Die Anwendung funktioniert immer gleich, egal wo der Container steht.

## Unsere Anwendung im Detail

Unsere Task-Manager-Anwendung besteht aus drei Hauptteilen, die jeweils in eigenem Docker-Container laufen:

1. **Frontend-Container**: Enthält die React-App
2. **Backend-Container**: Enthält den Express-Server
3. **Datenbank-Container**: Enthält MongoDB

Lass uns genau durchgehen, was passiert, wenn du die Anwendung benutzt:

### 1. Startprozess

Wenn du `docker-compose up` ausführst, passiert Folgendes:

1. Docker liest die `docker-compose.yml` Datei
2. Es erstellt drei Container gemäß den Anweisungen in dieser Datei
3. Es startet die Container in der richtigen Reihenfolge:
   - Zuerst die Datenbank (MongoDB)
   - Dann das Backend (wenn die Datenbank bereit ist)
   - Dann das Frontend (wenn das Backend bereit ist)

### 2. Die Datenbank (MongoDB)

Die Datenbank ist wie ein großes Regal mit Schubladen. Jede Schublade (Collection) kann viele Notizzettel (Dokumente) enthalten.

- **Was tut sie?** Sie speichert alle Aufgaben (Tasks) dauerhaft.
- **Wo ist sie?** Sie läuft in einem eigenen Container.
- **Wie ist sie konfiguriert?** In `docker-compose.yml` wird sie mit der offiziellen MongoDB-Image konfiguriert.
- **Wie werden Daten gespeichert?** Durch ein Docker-Volume (`mongo-data`), sodass die Daten auch nach einem Neustart erhalten bleiben.

Wenn du die Anwendung startest, erstellt MongoDB eine Datenbank namens `taskdb` mit einer Collection für Tasks.

### 3. Das Backend (Express + Node.js)

Das Backend ist wie ein Kellner in einem Restaurant. Es nimmt Bestellungen (Anfragen) entgegen, geht in die Küche (Datenbank), holt oder verarbeitet das Essen (Daten) und bringt es zurück zum Gast (Frontend).

- **Was tut es?** Es stellt eine API bereit, mit der das Frontend kommunizieren kann.
- **Wo ist es?** Es läuft in einem eigenen Container.
- **Aus welchen Teilen besteht es?**
  - `index.js`: Der Haupteintrittspunkt. Startet den Server und verbindet sich mit der Datenbank.
  - `models/Task.js`: Definiert, wie ein Task aussieht (Schema) und wie er mit der Datenbank interagiert.
  - `routes/taskRoutes.js`: Definiert die API-Endpunkte (URLs), die das Frontend aufrufen kann.

#### Genauer Blick auf das Backend

1. **Verbindung zur Datenbank**:
   In `index.js` wird eine Verbindung zu MongoDB hergestellt:
   ```javascript
   mongoose.connect(MONGO_URI)
   ```
   Die Adresse `mongodb://mongo:27017/taskdb` zeigt auf den MongoDB-Container. Hier ist `mongo` der Name des Containers (definiert in `docker-compose.yml`).

2. **Modellierung der Daten**:
   In `models/Task.js` wird definiert, wie ein Task aussieht:
   ```javascript
   const taskSchema = new mongoose.Schema({
     title: { type: String, required: true },
     description: { type: String },
     completed: { type: Boolean, default: false },
     createdAt: { type: Date, default: Date.now }
   });
   ```
   Dieses Schema sagt: "Ein Task hat einen Titel (muss vorhanden sein), eine Beschreibung (optional), einen Status (erledigt oder nicht) und ein Erstellungsdatum."

3. **API-Endpunkte**:
   In `routes/taskRoutes.js` werden die verschiedenen API-Endpunkte definiert:
   - `GET /api/tasks`: Liste aller Tasks abrufen
   - `POST /api/tasks`: Neuen Task erstellen
   - `PUT /api/tasks/:id`: Task aktualisieren
   - `DELETE /api/tasks/:id`: Task löschen

### 4. Das Frontend (React)

Das Frontend ist wie das Benutzerinterface eines Geräts. Es zeigt Informationen an und nimmt Eingaben entgegen.

- **Was tut es?** Es zeigt eine Benutzeroberfläche an und kommuniziert mit dem Backend.
- **Wo ist es?** Es läuft in einem eigenen Container.
- **Aus welchen Teilen besteht es?**
  - `App.js`: Die Hauptkomponente, die alles zusammenhält.
  - `components/TaskForm.js`: Formular zum Erstellen neuer Tasks.
  - `components/TaskList.js`: Liste aller Tasks.
  - `components/TaskItem.js`: Anzeige eines einzelnen Tasks.

#### Genauer Blick auf das Frontend

1. **Verbindung zum Backend**:
   In `App.js` wird die Verbindung zum Backend hergestellt:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
   ```
   Diese URL wird verwendet, um Anfragen an das Backend zu senden.

2. **Daten abrufen**:
   Wenn die App startet, ruft sie alle Tasks ab:
   ```javascript
   useEffect(() => {
     fetchTasks();
   }, []);

   const fetchTasks = async () => {
     const response = await axios.get(`${API_URL}/tasks`);
     setTasks(response.data);
   };
   ```
   Hier wird ein GET-Request an `/api/tasks` gesendet und die Antwort im State gespeichert.

3. **Neue Tasks erstellen**:
   Wenn ein Benutzer das Formular ausfüllt und absendet, wird ein POST-Request gesendet:
   ```javascript
   const addTask = async (task) => {
     const response = await axios.post(`${API_URL}/tasks`, task);
     setTasks([response.data, ...tasks]);
   };
   ```

4. **Tasks aktualisieren/löschen**:
   Ähnlich funktionieren die Update- und Delete-Operationen mit PUT und DELETE Requests.

## Der Informationsfluss - Ein Beispiel

Lass uns ein konkretes Beispiel durchgehen: Du erstellst eine neue Aufgabe "Einkaufen gehen".

1. **Frontend**: Du tippst "Einkaufen gehen" in das Formular und klickst auf "Hinzufügen".

2. **Was im Frontend passiert**:
   - Die `TaskForm`-Komponente ruft die `onAddTask`-Funktion auf.
   - Diese Funktion ist in `App.js` definiert und sendet eine POST-Anfrage an das Backend.
   - Der Request enthält die Daten des neuen Tasks (Titel und Beschreibung).

3. **Was im Backend passiert**:
   - Die Anfrage erreicht den Express-Server am Endpunkt `POST /api/tasks`.
   - Der Server verarbeitet die Anfrage und erstellt ein neues Task-Objekt.
   - Dieses Task-Objekt wird mit Mongoose in der MongoDB gespeichert.
   - Der Server sendet eine Antwort mit dem gespeicherten Task (inklusive generierter ID).

4. **Was in der Datenbank passiert**:
   - MongoDB speichert das neue Task-Dokument in der Collection.
   - Die Daten bleiben auch nach einem Neustart erhalten.

5. **Was wieder im Frontend passiert**:
   - Die Antwort des Servers wird empfangen.
   - Der neue Task wird im React-State gespeichert.
   - Die TaskList wird aktualisiert und zeigt den neuen Task an.

## Warum diese Architektur sinnvoll ist

Diese Aufteilung hat mehrere Vorteile:

1. **Skalierbarkeit**: Wenn viele Benutzer die App nutzen, kannst du einfach mehr Backend-Container starten, ohne das Frontend oder die Datenbank zu verändern.

2. **Trennung der Verantwortlichkeiten**: Jeder Teil kümmert sich um seine eigene Aufgabe. Das macht die Wartung einfacher.

3. **Entwicklungsfreundlichkeit**: Verschiedene Teams können an verschiedenen Teilen arbeiten, ohne sich gegenseitig zu stören.

4. **Wiederverwendbarkeit**: Du könntest das gleiche Backend mit einem anderen Frontend verwenden (z.B. einer mobilen App).

## Die Rolle von Docker

Docker macht das Zusammenspiel dieser drei Teile einfacher:

1. **Isolierung**: Jeder Container hat seine eigene Umgebung, als wäre es ein separater Computer.

2. **Vernetzung**: Docker Compose erstellt ein Netzwerk, in dem die Container miteinander kommunizieren können.

3. **Konfiguration**: Über Umgebungsvariablen können die Container konfiguriert werden.

4. **Portabilität**: Du kannst die gesamte Anwendung einfach auf andere Systeme übertragen.

## Zusammenfassung

Die Multi-Tier-Anwendung besteht aus drei Hauptteilen:

1. **Frontend (React)**: Zeigt die Benutzeroberfläche an und kommuniziert mit dem Backend über HTTP-Anfragen.

2. **Backend (Express)**: Verarbeitet Anfragen, implementiert die Geschäftslogik und kommuniziert mit der Datenbank.

3. **Datenbank (MongoDB)**: Speichert alle Daten dauerhaft.

Diese drei Teile laufen in separaten Docker-Containern und kommunizieren über ein Netzwerk miteinander. Docker Compose orchestriert diese Container und sorgt dafür, dass alles richtig zusammenarbeitet.

Wenn du die Anwendung startest, richtet Docker Compose alles ein und du kannst sofort loslegen, ohne dich um die komplexe Infrastruktur kümmern zu müssen.

# Schritt-für-Schritt-Anleitung zum Starten der Anwendung

## Voraussetzungen

1. **Docker installieren**:
   - Für Windows/Mac: Docker Desktop herunterladen und installieren von [docker.com](https://www.docker.com/products/docker-desktop)
   - Für Linux: Docker Engine und Docker Compose installieren

2. **Projektdateien erstellen**:
   - Erstelle die Ordnerstruktur wie in der Projektstruktur beschrieben
   - Kopiere alle Dateien in die entsprechenden Ordner

## Anwendung starten

1. **Terminal/Kommandozeile öffnen**:
   - Navigiere zum Hauptverzeichnis des Projekts (wo die `docker-compose.yml` liegt)

2. **Docker Compose starten**:
   ```bash
   docker-compose up
   ```
   
   Was passiert nun:
   - Docker lädt benötigte Images herunter (falls noch nicht vorhanden)
   - Docker baut die Container für Frontend und Backend
   - Docker startet alle drei Container (MongoDB, Backend, Frontend)
   - Du siehst die Logs aller Container im Terminal

3. **Anwendung öffnen**:
   - Öffne deinen Browser
   - Gehe zu `http://localhost:3000`
   - Du solltest jetzt die Task-Manager-Anwendung sehen

## Was passiert im Hintergrund?

1. **Reihenfolge des Starts**:
   - Zuerst startet MongoDB auf Port 27017
   - Wenn MongoDB bereit ist, startet das Backend auf Port 5000
   - Wenn das Backend bereit ist, startet das Frontend auf Port 3000

2. **Kommunikation**:
   - Das Frontend sendet API-Anfragen an `http://localhost:5000/api`
   - Das Backend verbindet sich mit MongoDB über `mongodb://mongo:27017/taskdb`
   - Alle Container befinden sich im selben Docker-Netzwerk und können miteinander kommunizieren

## Änderungen vornehmen

1. **Code ändern**:
   - Ändere eine Datei im Frontend oder Backend
   - Die Änderung wird automatisch erkannt (dank Volumes und Hot-Reloading)
   - Die Anwendung wird automatisch neu geladen

2. **Container stoppen**:
   - Drücke `Ctrl+C` im Terminal, um alle Container zu stoppen
   - Oder führe `docker-compose down` in einem anderen Terminal aus

3. **Daten**:
   - Deine in MongoDB gespeicherten Daten bleiben erhalten, auch wenn du die Container stoppst
   - Um alle Daten zu löschen: `docker-compose down -v` (löscht auch Volumes)

## Fehlersuche

Wenn etwas nicht funktioniert:

1. **Logs überprüfen**:
   - Die Container-Logs im Terminal zeigen Fehler an
   - Du kannst auch `docker-compose logs -f [service-name]` ausführen, um nur die Logs eines bestimmten Services zu sehen

2. **Container-Status prüfen**:
   - `docker-compose ps` zeigt den Status aller Container an

3. **Container neu starten**:
   - `docker-compose restart [service-name]` startet einen bestimmten Service neu
   - Oder `docker-compose down && docker-compose up` für einen kompletten Neustart

4. **Container neu bauen**:
   - Wenn du größere Änderungen vorgenommen hast (z.B. neue Abhängigkeiten hinzugefügt):
   - `docker-compose build` baut alle Images neu
   - `docker-compose up --build` baut neu und startet

## Fortgeschrittene Nutzung

1. **Im Hintergrund ausführen**:
   - `docker-compose up -d` startet alle Container im Hintergrund
   - `docker-compose logs -f` zeigt dann die Logs an

2. **In die Container schauen**:
   - `docker-compose exec [service-name] sh` öffnet eine Shell im Container
   - Z.B. `docker-compose exec backend sh` öffnet eine Shell im Backend-Container


# Multi-Tier-Architektur auf einen Blick

## 1. Die drei Schichten

| Schicht | Container | Technologie | Hauptaufgabe | Kommuniziert mit |
|---------|-----------|-------------|--------------|------------------|
| **Frontend** | frontend | React.js | Benutzeroberfläche anzeigen | Backend (HTTP) |
| **Backend** | backend | Express/Node.js | API bereitstellen, Geschäftslogik | Frontend (HTTP) & Datenbank (Mongoose) |
| **Datenbank** | mongo | MongoDB | Daten speichern | Backend |

## 2. Wichtige Dateien und ihre Funktion

### Docker & Orchestrierung
- `docker-compose.yml`: Steuert alle Container und ihr Zusammenspiel
- `backend/Dockerfile`: Anweisungen zum Erstellen des Backend-Containers
- `frontend/Dockerfile`: Anweisungen zum Erstellen des Frontend-Containers

### Backend-Dateien
- `backend/src/index.js`: Startpunkt des Servers, verbindet mit MongoDB
- `backend/src/models/Task.js`: Definiert die Datenstruktur für Tasks
- `backend/src/routes/taskRoutes.js`: Definiert die API-Endpoints

### Frontend-Dateien
- `frontend/src/App.js`: Hauptkomponente, enthält API-Logik
- `frontend/src/components/TaskForm.js`: Formular zum Erstellen neuer Tasks
- `frontend/src/components/TaskList.js`: Zeigt Liste aller Tasks an
- `frontend/src/components/TaskItem.js`: Einzelner Task in der Liste

## 3. Datenfluss (am Beispiel "Task erstellen")

```
[Benutzer] → Gibt Task-Daten ein → [TaskForm]
     ↓
[App.js] → Sendet POST-Request → [Backend: POST /api/tasks]
     ↓
[taskRoutes.js] → Erstellt neues Task-Objekt → [Task.js Model]
     ↓
[MongoDB] → Speichert Daten → Gibt gespeicherten Task zurück
     ↓
[Backend] → Sendet Task-Daten zurück → [Frontend]
     ↓
[App.js] → Aktualisiert Zustand → [TaskList] → Zeigt neuen Task an
```

## 4. Ports und Verbindungen

- **Frontend**: Läuft auf Port 3000
- **Backend**: Läuft auf Port 5000
- **MongoDB**: Läuft auf Port 27017

## 5. Verbindungs-URLs

- Frontend zu Backend: `http://localhost:5000/api`
- Backend zu MongoDB: `mongodb://mongo:27017/taskdb`
- Browser zu Frontend: `http://localhost:3000`

## 6. Entwicklungsvorteile

- **Unabhängige Entwicklung**: Jede Schicht kann separat entwickelt werden
- **Isolierung**: Probleme in einer Schicht betreffen nicht direkt andere
- **Hot-Reloading**: Änderungen werden sofort wirksam durch Volumes
- **Skalierbarkeit**: Einzelne Schichten können unabhängig skaliert werden



# Datenfluss in der Multi-Tier-Anwendung

Um wirklich zu verstehen, wie unsere Anwendung funktioniert, ist es hilfreich, den gesamten Datenfluss an einem konkreten Beispiel zu betrachten. Wir werden den kompletten Prozess durchgehen: vom Erstellen einer neuen Aufgabe bis zum Anzeigen in der Liste.

## Beispiel: Erstellen einer neuen Aufgabe

### 1. Benutzerinteraktion im Frontend

Der Benutzer öffnet die Anwendung in seinem Browser (http://localhost:3000) und sieht das Formular zum Erstellen einer neuen Aufgabe. Er gibt folgende Informationen ein:

- **Titel**: "Einkaufen gehen"
- **Beschreibung**: "Milch, Brot und Eier kaufen"

Dann klickt er auf den "Hinzufügen"-Button.

### 2. Frontend-Verarbeitung

Was passiert jetzt im Code? Schauen wir uns den genauen Ablauf an:

1. **In `TaskForm.js`**:
   ```javascript
   // Der Benutzer klickt auf Submit
   const handleSubmit = (e) => {
     e.preventDefault();
     
     // Form-Daten werden an die Parent-Komponente (App.js) übergeben
     onAddTask({ title, description });
     
     // Form wird zurückgesetzt
     setTitle('');
     setDescription('');
   };
   ```

2. **In `App.js`**:
   ```javascript
   // Die addTask Funktion wird aufgerufen
   const addTask = async (task) => {
     try {
       // POST-Request wird an das Backend gesendet
       const response = await axios.post(`${API_URL}/tasks`, task);
       
       // Neuer Task wird zur Liste hinzugefügt
       setTasks([response.data, ...tasks]);
     } catch (err) {
       console.error('fehler beim erstellen des tasks:', err);
       setError('fehler beim erstellen des tasks');
     }
   };
   ```

### 3. HTTP-Anfrage zum Backend

Der Frontend-Code sendet nun eine HTTP-POST-Anfrage an die URL `http://localhost:5000/api/tasks`. 

Die Anfrage enthält einen JSON-Body mit diesen Daten:
```json
{
  "title": "Einkaufen gehen",
  "description": "Milch, Brot und Eier kaufen"
}
```

Diese Anfrage geht über das Docker-Netzwerk vom Frontend-Container zum Backend-Container.

### 4. Backend-Verarbeitung

Im Backend-Container nimmt der Express-Server die Anfrage entgegen:

1. **In `index.js`**:
   - Die Anfrage kommt beim Server an
   - `app.use('/api/tasks', taskRoutes);` leitet sie an die Task-Routen weiter

2. **In `taskRoutes.js`**:
   ```javascript
   // POST /api/tasks - Route wird aufgerufen
   router.post('/', async (req, res) => {
     try {
       // Aus dem Request-Body wird ein neues Task-Objekt erstellt
       const newTask = new Task(req.body);
       
       // Task wird in der Datenbank gespeichert
       const savedTask = await newTask.save();
       
       // Gespeicherter Task wird zurückgegeben
       res.status(201).json(savedTask);
     } catch (err) {
       // Fehlerbehandlung...
     }
   });
   ```

3. **In `Task.js` (indirekt aufgerufen)**:
   - Das Mongoose-Model validiert die Daten anhand des Schemas
   - Der Task bekommt automatisch Werte für nicht angegebene Felder:
     - `completed: false` (Standard-Wert)
     - `createdAt: [aktuelles Datum]` (automatisch gesetzt)

### 5. Kommunikation mit der Datenbank

Jetzt kommuniziert das Backend mit der MongoDB:

1. **Mongoose erstellt ein Dokument**:
   - Die Task-Daten werden in ein MongoDB-Dokument umgewandelt
   - Eine eindeutige ID (`_id`) wird automatisch generiert

2. **Dokument wird gespeichert**:
   - `newTask.save()` sendet eine Anfrage an MongoDB
   - MongoDB speichert das Dokument in der `tasks`-Collection der `taskdb`-Datenbank

3. **Ergebnis zurück an Mongoose**:
   - MongoDB sendet das gespeicherte Dokument zurück
   - Mongoose wandelt es in ein JavaScript-Objekt um

Das gespeicherte Task-Objekt sieht jetzt etwa so aus:
```json
{
  "_id": "60d21b4667d0d8992e610c85",
  "title": "Einkaufen gehen",
  "description": "Milch, Brot und Eier kaufen",
  "completed": false,
  "createdAt": "2025-04-29T14:53:12.123Z"
}
```

### 6. Antwort vom Backend an das Frontend

Das Backend sendet nun eine HTTP-Antwort zurück an das Frontend:

1. **In `taskRoutes.js`**:
   ```javascript
   // Der gespeicherte Task wird als JSON zurückgesendet
   res.status(201).json(savedTask);
   ```

2. **HTTP-Antwort**:
   - Status-Code: 201 (Created)
   - Body: Das gespeicherte Task-Objekt als JSON

### 7. Frontend verarbeitet die Antwort

Das Frontend erhält die Antwort und verarbeitet sie:

1. **In `App.js`**:
   ```javascript
   // Die Response kommt zurück im addTask-Function
   const response = await axios.post(`${API_URL}/tasks`, task);
       
   // Der neue Task wird zur Liste hinzugefügt (am Anfang der Liste)
   setTasks([response.data, ...tasks]);
   ```

2. **React-State wird aktualisiert**:
   - Der neue Task wird zum `tasks`-Array hinzugefügt
   - React erkennt die State-Änderung
   - Die Komponenten werden neu gerendert

### 8. Benutzeroberfläche wird aktualisiert

Schließlich wird die Benutzeroberfläche aktualisiert:

1. **In `TaskList.js`**:
   - Die Liste wird mit dem aktualisierten `tasks`-Array neu gerendert
   - Ein neues `TaskItem`-Element wird für den neuen Task erstellt

2. **In `TaskItem.js`**:
   - Die Details des neuen Tasks werden angezeigt:
     - Titel: "Einkaufen gehen"
     - Beschreibung: "Milch, Brot und Eier kaufen"
     - Status: Nicht erledigt (Checkbox nicht angekreuzt)
     - Erstellungsdatum: Das aktuelle Datum und Uhrzeit

### Zusammenfassung des Datenflusses

Der komplette Datenfluss in einem Diagramm:

```
[Browser]
    ↓ Benutzer füllt Formular aus und klickt "Hinzufügen"
[Frontend: TaskForm]
    ↓ Ruft onAddTask({title, description}) auf
[Frontend: App.js]
    ↓ Sendet POST-Request mit axios
[HTTP-Anfrage]
    ↓ Geht über das Docker-Netzwerk
[Backend: Express Server]
    ↓ Route leitet an taskRoutes.js weiter
[Backend: taskRoutes.js]
    ↓ Erstellt neues Task-Objekt
[Backend: Task.js Model]
    ↓ Validiert Daten gemäß Schema
[Mongoose]
    ↓ Wandelt in MongoDB-Dokument um
[MongoDB]
    ↓ Speichert in der Datenbank
    ↑ Gibt gespeichertes Dokument zurück
[Backend: taskRoutes.js]
    ↑ Sendet HTTP-Antwort (201 Created)
[Frontend: App.js]
    ↑ Aktualisiert tasks-State
[Frontend: TaskList & TaskItem]
    ↑ Rendert die aktualisierte Liste
[Browser]
    ↑ Benutzer sieht den neuen Task in der Liste
```

Dieser Fluss wiederholt sich für jede Aktion in der Anwendung - sei es das Anzeigen, Löschen oder Aktualisieren von Tasks. Der Unterschied liegt nur in den spezifischen Routen, HTTP-Methoden und der jeweiligen Verarbeitung.

## Weitere Datenflüsse

Die anderen Hauptoperationen funktionieren ähnlich:

### Tasks laden (GET)

- Frontend sendet GET-Anfrage an `/api/tasks`
- Backend holt alle Tasks aus der Datenbank
- Frontend zeigt die Tasks in der Liste an

### Task-Status ändern (PUT)

- Benutzer klickt auf die Checkbox eines Tasks
- Frontend sendet PUT-Anfrage an `/api/tasks/:id`
- Backend aktualisiert den Task in der Datenbank
- Frontend aktualisiert die Anzeige des Tasks

### Task löschen (DELETE)

- Benutzer klickt auf den Lösch-Button eines Tasks
- Frontend sendet DELETE-Anfrage an `/api/tasks/:id`
- Backend löscht den Task aus der Datenbank
- Frontend entfernt den Task aus der Liste

## Was macht Docker in diesem Prozess?

Docker sorgt dafür, dass:

1. Alle benötigten Dienste laufen (Frontend, Backend, MongoDB)
2. Sie in einer kontrollierten Umgebung laufen
3. Sie miteinander kommunizieren können
4. Die Ports korrekt nach außen (zum Host-System) geleitet werden

Die Container kommunizieren über das interne Docker-Netzwerk, das von Docker Compose erstellt wird. Dabei können sie sich über ihre Service-Namen ansprechen (z.B. "mongo" statt "localhost").