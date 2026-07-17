# Sécurité et déploiement d’EcoSignal CI

Ce document complète le rapport technique. Il décrit les précautions minimales à appliquer avant toute démonstration publique ou mise en production.

## Protections intégrées

- authentification par jetons Laravel Sanctum ;
- séparation des droits citoyen et administrateur ;
- contrôle de propriété des signalements et notifications ;
- validation serveur de toutes les données sensibles ;
- limitation des tentatives de connexion, des inscriptions et des téléversements ;
- limite de 4 Mo et formats contrôlés pour les photos ;
- en-têtes HTTP contre le détournement d’interface et la détection incorrecte des contenus ;
- transactions SQL lors de la planification des collectes ;
- pagination et limites sur les listes ;
- erreurs détaillées désactivables en production ;
- tests automatisés des autorisations et protections principales.

## Configuration obligatoire

Créer le fichier de production à partir de `.env.production.example`, puis :

1. définir les URL HTTPS réelles dans `APP_URL` et `FRONTEND_URL` ;
2. générer une clé avec `php artisan key:generate` ;
3. utiliser un utilisateur MySQL dédié, jamais `root` ;
4. choisir un mot de passe de base long et unique ;
5. conserver `APP_DEBUG=false` et `APP_ENV=production` ;
6. ne jamais publier le fichier `.env` ni les journaux Laravel ;
7. limiter les permissions d’écriture à `storage` et `bootstrap/cache`.

## Commandes de déploiement

```bash
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Le frontend doit être compilé avec son URL API HTTPS :

```bash
REACT_APP_API_URL=https://api.example.ci/api npm run build
```

## Infrastructure recommandée

- certificat TLS valide et redirection HTTP vers HTTPS ;
- serveur Nginx ou Apache configuré pour exposer uniquement le dossier `public` ;
- utilisateur système non privilégié pour PHP ;
- pare-feu limitant MySQL au réseau privé ;
- sauvegarde quotidienne chiffrée de la base et des photos ;
- rotation des journaux et surveillance des erreurs HTTP 401, 403, 429 et 500 ;
- mises à jour régulières de PHP, Laravel, Composer et npm.

## Vérifications avant présentation

```bash
php artisan test
php artisan route:list
cd frontend
npm test -- --watchAll=false
npm run build
```

Tester manuellement les parcours citoyen et administrateur sur un compte de démonstration distinct. Ne jamais présenter avec des données personnelles réelles.

## Gestion d’incident

En cas de fuite présumée :

1. mettre l’application en maintenance ;
2. révoquer les jetons dans `personal_access_tokens` ;
3. renouveler `APP_KEY` uniquement après analyse de l’impact sur les données chiffrées ;
4. changer les mots de passe de base et d’administration ;
5. restaurer une sauvegarde vérifiée si nécessaire ;
6. documenter l’incident et les actions correctives.
