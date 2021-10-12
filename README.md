# BotIUT v3.0.2

Bot Discord en TypeScript pour le serveur Discord de l'IUT Informatique du Limousin

## Installation

Ce dépôt contient un Dockerfile pouvant être build. Pour se faire, clonez le dépôt puis ajouter un fichier `.env` à la racine du projet comportant ces lignes :

```sh
TOKEN=Token de votre bot Discord
LOGS=id Discord du channel textuel de logs
```

Puis, procédez à l'installation ainsi qu'au lancement :

```sh
docker build . -t botiut
docker run -d --name BotIUT botiut
```
