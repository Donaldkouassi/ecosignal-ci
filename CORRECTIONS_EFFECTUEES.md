# Corrections effectuées

## Backend Laravel

- ajout des routes d’inscription, connexion, profil et déconnexion ;
- protection des routes privées par `auth:sanctum` ;
- protection des actions administratives par le middleware `admin` ;
- suppression de l’utilisateur fictif utilisé pour créer les signalements ;
- association automatique du signalement à l’utilisateur connecté ;
- isolation des signalements et notifications par utilisateur ;
- ajout des routes de collectes et de notifications ;
- création automatique d’une notification lors de la planification d’une collecte ;
- passage automatique du signalement à `en_cours`, puis à `resolu` à la fin d’une collecte ;
- prévention de plusieurs collectes pour un même signalement ;
- ajout de Form Requests pour les validations ;
- ajout de la photo et de la géolocalisation facultatives ;
- correction de `UserFactory` ;
- ajout de casts aux modèles ;
- amélioration du seeder et création de comptes de démonstration ;
- configuration SQLite en mémoire pour les tests.

## Frontend React

- remplacement de la connexion simulée par une authentification réelle ;
- ajout de l’inscription et de la déconnexion ;
- stockage et transmission du jeton Sanctum ;
- protection de la navigation selon le rôle ;
- séparation de `App.js` en pages, composants et service API ;
- gestion centralisée des erreurs HTTP ;
- ajout de messages d’erreur et d’états vides ;
- ajout de la photo et de la position GPS ;
- ajout de la page des notifications ;
- ajout de la planification des collectes dans l’administration ;
- remplacement du test React par défaut.

## Documentation et tests

- nouveau README complet ;
- rapport technique avec conception, architecture, modèle de données et stratégie de tests ;
- tests d’authentification, de signalement, de collecte et de notification ;
- documentation des principales routes API.

## Vérifications réalisées dans l’environnement de correction

- validation syntaxique de tous les fichiers PHP avec `php -l` ;
- validation JSON des fichiers `composer.json` et `frontend/package.json` ;
- vérification de la présence et du contenu des nouveaux composants et tests.

Les suites PHPUnit et React n’ont pas pu être exécutées dans cet environnement, car Composer n’y est pas installé et l’accès réseau nécessaire au téléchargement des dépendances est indisponible. Les commandes à exécuter localement sont indiquées dans le README.
