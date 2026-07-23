#!/bin/sh
set -eu

export PORT="${PORT:-10000}"

mkdir -p \
    storage/app/public \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwX storage bootstrap/cache

php artisan config:cache
php artisan migrate --force
php artisan storage:link || true

envsubst '${PORT}' \
    < /etc/nginx/templates/default.conf.template \
    > /etc/nginx/conf.d/default.conf

php-fpm -D
exec nginx -g 'daemon off;'
