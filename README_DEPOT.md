# EcoSignal CI - Projet final React + Laravel

EcoSignal CI est une plateforme web de signalement et de gestion des dépôts de déchets urbains.

## Technologies utilisées

- Frontend : React
- Backend : Laravel
- Base de données : MySQL
- API : Laravel REST API

## Fonctionnalités principales

- Ajout d’un signalement
- Affichage des signalements
- Modification du statut : En attente, En cours, Résolu
- Suppression d’un signalement
- Affichage des conseils écologiques
- Tableau de bord administrateur avec statistiques
- Tests Laravel de l’API

## Base de données

Le fichier SQL de la base de données est inclus dans le projet :

ecosignal_db.sql

## Installation du backend Laravel

composer install
cp .env.example .env
php artisan key:generate

Configurer la base de données dans le fichier .env :

DB_CONNECTION=mysql
DB_DATABASE=ecosignal_db
DB_USERNAME=root
DB_PASSWORD=

Importer ensuite le fichier SQL ecosignal_db.sql dans MySQL.

Lancer le serveur Laravel :

php artisan serve

## Installation du frontend React

cd frontend
npm install
npm start

## Tests Laravel

php artisan test --filter=EcoSignalApiTest
