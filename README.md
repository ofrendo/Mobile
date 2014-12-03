Mobile Projekt 5. Semester
======

# Backend Infos
## Vor erstem Laufen (lokal)
Module installieren:
```
npm install express (Express framework)
npm install pg (Postgress module)
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

# Git Einrichtung

Prüfen, ob Git installiert ist. Falls nicht ist [hier](http://git-scm.com/downloads) der Download, oder [hier](https://windows.github.com/) falls ihr das GUI wollt.

## User Variablen einstellen
```
git config --global user.name="NAME"
git config --global user.email="GithubEmailadresse"
```

## SSH Key erzeugen
```
Git Bash öffnen (Rechtsklick im Windows Explorer und dann "Git Bash" wählen).
```
```
ssh-keygen -t rsa -C "GithubEmailadresse"
Filename wählen, z.B. "work_laptop"
Passwort wählen
```
```
eval $(ssh-agent)
```
```
ssh-add ~/.ssh/work_laptop (Filename anpassen!)
```

Danach muss Git noch gesagt werden, dass dieser Key wirklich benutzt werden soll. Dazu eine Datei "config" (ohne Endung) in `Benutzername/.ssh` erstellen mit folgendem Inhalt. Dabei auf das Leerzeichen auf der zweiten Zeile achten und den Filenamen anpassen:
```
Host github.com
 IdentityFile ~/.ssh/work_laptop
 
Host heroku.com
 IdentityFile ~/.ssh/work_laptop
```

Bei Problemen ist [hier](https://help.github.com/articles/generating-ssh-keys/) die Guide.

## SSH Key zu GitHub Account hinzufügen
[Siehe Schritt 3](https://help.github.com/articles/generating-ssh-keys/)

Zum Testen kann im Git Bash folgendes verwendet werden:
```
ssh -T git@github.com
```

## Repo lokal hinzufügen
CMD öffnen. Danach in den Ordner wechseln, in das man arbeiten möchte. Es wird dabei ein neuer Unterordner von Git erzeugt):
```
cd "DeinOrdner"
git clone "git@github.com:ofrendo/Mobile.git"
```

## Etwas pushen
Wichtig: Davor in CMD in den Ordner wechseln, in der das Projekt liegt.

Status überprüfen:
```
git status
```

Commit:
```
git commit -m "Sinnvolle Nachricht für Commit"
```

Push: Davor einmal lokal überprüfen, ob irgendwas auf dem Server verändert wurde (bei beiden Befehlen wird das Passwort vom SSH Key benötigt).
```
git pull
git push
```
