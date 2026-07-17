# EcoSignal CI

EcoSignal CI est une application web de signalement et de suivi des dépôts de déchets urbains en Côte d’Ivoire. Elle repose sur une API Laravel sécurisée par Laravel Sanctum et une interface React.

## Fonctionnalités

### Citoyen

- création d’un compte et connexion sécurisée ;
- création d’un signalement avec commune, catégorie, description, photo et position facultatives ;
- consultation exclusive de ses propres signalements ;
- suivi du statut et de la collecte planifiée ;
- consultation de ses notifications ;
- consultation des conseils écologiques.

### Administrateur

- consultation de tous les signalements ;
- mise à jour des statuts ;
- suppression d’un signalement ;
- planification et gestion des collectes ;
- création de conseils écologiques ;
- consultation des statistiques globales.

## Architecture

```text
React (frontend)
      |
      | HTTP / JSON + Bearer Token
      v
Laravel REST API + Sanctum
      |
      v
PostgreSQL sur Render / SQLite en mémoire pour les tests
```

Le frontend est organisé en `pages`, `components` et `services`. Le backend sépare les contrôleurs, les Form Requests, les modèles, les middlewares, les migrations et les tests.

## Installation du backend

Prérequis : PHP 8.1+, Composer et MySQL.

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Configurer ensuite les variables de base de données dans `.env`, puis exécuter :

```bash
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve
```

Comptes de démonstration créés par le seeder :

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | `admin@ecosignal.ci` | `password123` |
| Citoyen | `citoyen@ecosignal.ci` | `password123` |

## Installation du frontend

Prérequis : Node.js 18+ et npm.

```bash
cd frontend
cp .env.example .env
npm install
npm start
```

Par défaut, le frontend utilise `http://127.0.0.1:8000/api`. Cette adresse peut être modifiée dans `frontend/.env` :

```env
REACT_APP_API_URL=http://127.0.0.1:8000/api
```

## Tests

### Backend

Les tests utilisent SQLite en mémoire et n’altèrent pas la base MySQL locale.

```bash
php artisan test
```

Ils couvrent notamment :

- inscription et connexion ;
- unicité de l’adresse email ;
- accès non authentifié ;
- propriété des signalements ;
- droits administrateur ;
- planification unique d’une collecte ;
- création automatique d’une notification ;
- isolation des notifications entre utilisateurs.

### Frontend

```bash
cd frontend
npm test -- --watchAll=false
```

## Routes principales

| Méthode | Route | Accès |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/profile` | Authentifié |
| POST | `/api/auth/logout` | Authentifié |
| GET | `/api/signalements` | Authentifié |
| POST | `/api/signalements` | Authentifié |
| PATCH | `/api/signalements/{id}/statut` | Administrateur |
| DELETE | `/api/signalements/{id}` | Administrateur |
| GET | `/api/collectes` | Administrateur |
| POST | `/api/collectes` | Administrateur |
| GET | `/api/notifications` | Authentifié |
| GET | `/api/conseils` | Public |
| GET | `/api/statistiques` | Public |

## Documentation

Le dossier `docs` contient le rapport technique détaillant la conception, les choix techniques, le modèle de données et la stratégie de tests.

## Déploiement sur Render

### 1. Base PostgreSQL

Créer une base **Render Postgres**. Conserver ses identifiants dans les variables
d’environnement Render uniquement : aucune valeur secrète ne doit être ajoutée au
dépôt.

### 2. Backend Laravel

Créer un **Web Service** Render depuis ce dépôt avec les réglages suivants :

- environnement : `Docker` ;
- Root Directory : laisser vide (racine du dépôt) ;
- Dockerfile Path : `./Dockerfile`.

Associer la base PostgreSQL au service et définir les variables d’environnement :

```env
APP_NAME=EcoSignal CI
APP_ENV=production
APP_DEBUG=false
APP_KEY=<clé générée localement avec php artisan key:generate --show>
APP_URL=<URL publique réelle du backend>
FRONTEND_URL=<URL publique réelle du frontend>
DB_CONNECTION=pgsql
DATABASE_URL=<Internal Database URL fournie par Render>
DB_SSLMODE=require
LOG_CHANNEL=stderr
LOG_LEVEL=warning
```

`DATABASE_URL` suffit pour fournir à Laravel l’hôte, le port, le nom de base,
l’utilisateur et le mot de passe. Si l’intégration choisie expose plutôt des
variables séparées, définir `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME` et
`DB_PASSWORD` avec les valeurs fournies par Render, sans les enregistrer dans un
fichier versionné.

Le conteneur écoute automatiquement le `PORT` fourni par Render. À chaque
démarrage, il prépare les répertoires Laravel, met la configuration en cache et
exécute uniquement les migrations en attente avec `php artisan migrate --force`.
Il n’exécute ni `migrate:fresh` ni les seeders.

Après le premier déploiement, vérifier au minimum l’URL publique de l’API et les
logs de migration du service.

### 3. Frontend React

Créer un **Static Site** Render depuis le même dépôt :

- Root Directory : `frontend` ;
- Build Command : `npm ci && npm run build` ;
- Publish Directory : `build`.

Ajouter la variable d’environnement de build suivante avec l’URL publique réelle
du backend, suffixée par `/api` :

```env
REACT_APP_API_URL=<URL publique réelle du backend>/api
```

Le code du frontend utilise `REACT_APP_API_URL` dans
`frontend/src/services/api.js`. Aucune URL Render fictive n’est enregistrée dans
le dépôt.

Dans **Redirects/Rewrites**, ajouter une règle de type `Rewrite` :

```text
Source:      /*
Destination: /index.html
Action:      Rewrite
```

Cette réécriture permet aux routes côté client React de fonctionner lors d’un
accès direct ou d’un rafraîchissement de page.
