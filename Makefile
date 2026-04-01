# Usage:
# make setup

.PHONY: setup up down test build-assets dev

setup:
	@echo "Starting complete project setup..."
	@echo "Stopping and removing existing containers..."
	@./vendor/bin/sail down -v 2>/dev/null || echo "No containers to stop"
	@echo "Copying environment files..."
	@cp .env.example .env 2>/dev/null || echo ".env already exists"
	@cp .env.testing.example .env.testing 2>/dev/null || echo ".env.testing already exists"
	@echo "Installing PHP dependencies..."
	@composer install
	@chmod +x vendor/bin/sail vendor/laravel/sail/bin/sail 2>/dev/null || true
	@echo "Starting Docker containers..."
	@./vendor/bin/sail up -d
	@echo "Waiting for database to be ready..."
	@sleep 10
	@echo "Installing Node dependencies..."
	@./vendor/bin/sail npm install
	@echo "Building frontend assets..."
	@./vendor/bin/sail npm run build
	@echo "Generating application keys..."
	@./vendor/bin/sail artisan key:generate --force
	@./vendor/bin/sail artisan key:generate --env=testing --force
	@echo "Running database migrations..."
	@./vendor/bin/sail artisan migrate --seed --force
	@./vendor/bin/sail artisan migrate --env=testing --force
	@echo "Application URL: http://campaign-events-tracker.test/"

up:
	@./vendor/bin/sail up -d

down:
	@./vendor/bin/sail down

test:
	@./vendor/bin/sail artisan test --env=testing

build-assets:
	@./vendor/bin/sail npm install
	@./vendor/bin/sail npm run build

dev:
	@./vendor/bin/sail npm run dev
