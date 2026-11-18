FROM php:8.4-apache

RUN apt-get update && apt-get install -y \
    unzip \
    git \
    default-mysql-client \
    libicu-dev \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install \
    gd \
    intl \
    mysqli \
    pdo_mysql \
    zip \
    opcache \
    curl \
 && a2enmod rewrite

WORKDIR /var/www/html