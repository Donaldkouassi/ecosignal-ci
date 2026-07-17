FROM php:8.2-fpm-bookworm

ENV APP_ENV=production \
    APP_DEBUG=false \
    DB_CONNECTION=pgsql

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gettext-base \
        libcurl4-openssl-dev \
        libicu-dev \
        libonig-dev \
        libpq-dev \
        libxml2-dev \
        libzip-dev \
        nginx \
        unzip \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        curl \
        dom \
        intl \
        mbstring \
        opcache \
        pcntl \
        pdo_pgsql \
        xml \
        zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --no-scripts \
    --prefer-dist

COPY . .

RUN composer dump-autoload --no-dev --classmap-authoritative --no-interaction \
    && php artisan package:discover --ansi \
    && chmod +x docker/start.sh

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 10000

CMD ["docker/start.sh"]
