Mobile Projekt 5. Semester
======

# Backend Infos
## Vor erstem Laufen (lokal)
Module installieren:
```
npm install express (Express framework)
npm install pg (Postgress module)
npm install socket.io (Websockets module)
```

## SQL Zeugs
PostgreSQL Studio im Heroku:
https://us-east1.postgresqlstudio.com/pgstudio/Heroku.jsp?app=thawing-stream-4939&addon=pgstudio

Postgres installieren. Im Git Bash:
```
heroku pg:psql (verbindet mit Heroku PSQL)

Lokal (vor jedem Laufen?):
export DATABASE_URL=postgres:///$(whoami)
PGUSER=postgres PGPASSWORD={ausgesuchtesPW} psql
```

## Lokal laufen lassen
```
cd mobile (ins richtige dir wechseln)
foreman start web
```

Nützliche Postgres Befehle:
```
Serverdaten kopieren (funktioniert nicht?):
PGUSER=postgres PGPASSWORD={ausgesuchtesPW} heroku pg:pull HEROKU_POSTGRESQL_AMBER localDB --app thawing-stream-4939

Lokal Tabellen erstellen:
PGUSER=postgres PGPASSWORD={ausgesuchtesPW} psql -d "{Datenbankname}" -a -f tableCreation.sql 

\list [Liste Datenbanken]
\c "{Datenbankname}"" [Verbinde mit Datenbank]
\dt [Liste Tabellen in Datenbank]
```

# Andere Infos 
## ER Modell
https://drive.draw.io/#G0B6C1YWgoE658bjFZQTh2b3ZOejQ

## Google Docs Sammlung von Ideen:
https://docs.google.com/document/d/1wqhUEl61v_4DUfruozFuAm6QYn54y0OggV536aWGpmk/edit#

## Frontend Github Repo
https://github.com/ofrendo/Mobile-fe

## Mockups
https://www.fluidui.com/editor/live/preview/p_zW5eZMINKgiua1atXO9TQJ4MfGmnfQoR.1416922721797

## Git Guide
https://github.com/ofrendo/Mobile/docs/GIT.md

## API Calls
https://github.com/ofrendo/Mobile/docs/API.md