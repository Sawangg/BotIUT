# BotIUT v3.0.5

Bot Discord en TypeScript pour le serveur Discord de l'IUT Informatique du Limousin

## Installation

Ce dépôt contient un Dockerfile pouvant être build. Pour se faire, clonez le dépôt puis ajouter un fichier `.env` à la racine du projet comportant ces lignes :

```sh
TOKEN=Token de votre bot Discord
LOGS=id Discord du channel textuel de logs
BACKURL=L url backend contenant les edt
A1=id du role A1
A2=id du role A2
A3=id du role A3
```

Puis, procédez à l'installation ainsi qu'au lancement :

```sh
docker-compose -f "docker-compose.yml" up -d --build
```
