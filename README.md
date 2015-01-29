Mobile Projekt 5. Semester: Backend repository
======

## Inhaltsverzeichnis
- [Backend Infos](#backendInfos)
    - [Dateistruktur](#dateistruktur)
    - [Vor erstem Laufen (lokal)](#vorErstemLaufen)
    - [Datenbank (PostgreSQL)](#datenbank)
    - [Lokal laufen lassen](#lokalLaufenLassen)
- [Andere Infos](#andereInfos)
    - [API Calls](#apiCalls)
    - [Frontend Github Repo](#frontendGithubRepo)
    - [ER Modell](#erModell)
    - [Google Docs Sammlung von Ideen](#ideen)
    - [Mockups](#mockups)
    - [Git Guide](#gitGuide)

# <a name="backendInfos"></a>Backend Infos
## <a name="dateistruktur"></a>Dateistruktur
root
- docs
    - API.md: Liste der verfügbaren Backend Calls
    - Git.md: Git Guide
- js
    - crud
        - crud.js: Modul zur einheitlichen Datenbankabfrage. Für POST/GET/PUT/DELETE Anfragen
        - cityMgt.js: City API Calls
        - locationMgt.js: Location API Calls
        - tripMgt.js: Trip API Calls
        - userMgt.js: User API Calls
    - chat.js: [socket.io](http://socket.io/) für eine Chat Implementierung
    - db.js: Modul für die Verbindung mit dem PostgreSQL Backend
    - route.js: Verbindung der verschiedenen Routen (API Calls) mit JavaScript Funktionen
    - server.js: Starten und Verwaltung des Servers
    - sessionMgt.js: Verwaltung von Nutzersessions
    - utils.js: Utility Methoden
- test
    - index.html: HTML Datei zum Testen der API Calls (benutzt [QUnit](http://qunitjs.com/) Framework)
    - script.js: Unit tests, die ausgeführt werden

## <a name="vorErstemLaufen"></a>Vor erstem Laufen (lokal)
Node Module installieren:
```
cd mobile
npm install
```

## <a name="datenbank"></a>Datenbank (PostgreSQL)
PostgreSQL Studio im Heroku:
https://us-east1.postgresqlstudio.com/pgstudio/Heroku.jsp?app=thawing-stream-4939&addon=pgstudio

Postgres installieren. Im Git Bash:
```
heroku pg:psql (verbindet mit Heroku PSQL)

Lokal (vor jedem Laufen):
export DATABASE_URL=postgres:///$(whoami)
PGUSER=postgres PGPASSWORD={ausgesuchtesPW} psql

Einmal im PostgreSQL:
CREATION EXTENSION pgcrypto
```

## <a name="lokalLaufenLassen"></a>Lokal laufen lassen
```
cd mobile
node index.js
```

Nützliche Postgres Befehle:
```
Serverdaten kopieren:
PGUSER=postgres PGPASSWORD={ausgesuchtesPW} heroku pg:pull HEROKU_POSTGRESQL_AMBER localDB --app thawing-stream-4939

Lokal Tabellen erstellen:
PGUSER=postgres PGPASSWORD={ausgesuchtesPW} psql -d "{Datenbankname}" -a -f tableCreation.sql 

\list [Liste Datenbanken]
\c "{Datenbankname}"" [Verbinde mit Datenbank]
\dt [Liste Tabellen in Datenbank]
```

# <a name="andereInfos"></a>Andere Infos 
## <a name="apiCalls"></a>API Calls
https://github.com/ofrendo/Mobile/blob/master/docs/API.md

## <a name="frontendGithubRepo"></a>Frontend GitHub Repository
https://github.com/ofrendo/Mobile-fe

## <a name="erModell"></a>ER Modell
https://drive.draw.io/#G0B6C1YWgoE658bjFZQTh2b3ZOejQ

## <a name="ideen"></a>Google Docs Sammlung von Ideen
https://docs.google.com/document/d/1wqhUEl61v_4DUfruozFuAm6QYn54y0OggV536aWGpmk/edit#

## <a name="mockups"></a>Mockups
https://www.fluidui.com/editor/live/preview/p_zW5eZMINKgiua1atXO9TQJ4MfGmnfQoR.1416922721797

## <a name="gitGuide"></a>Git Guide
https://github.com/ofrendo/Mobile/blob/master/docs/GIT.md
