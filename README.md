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
MySQL en production / SQLite en mémoire pour les tests
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
