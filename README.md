# Campaign Events Tracker MVP

## Task

Build a small app that allows:

- Storing a list of ad campaigns
- Receiving campaign events
- Showing simple campaign statistics

Required API:

- `POST /api/campaigns` - create campaign
- `GET /api/campaigns` - list campaigns
- `POST /api/events` - store event for campaign
- `GET /api/stats` - get campaign statistics

Event payload example:

```json
{
  "campaign_id": 1,
  "type": "click"
}
```

Supported event types: `click`, `impression`.

Frontend (React) includes:

- Campaign list
- Add campaign form
- Send event form
- Stats block with clicks, impressions, CTR (`clicks / impressions * 100`)

## Technologies Used

- Laravel 13
- PHP 8.3+
- React 19 + TypeScript
- Inertia.js
- Tailwind CSS 4
- MySQL
- PHPUnit

## Quick Start

Add to hosts file:

```text
127.0.0.1 campaign-events-tracker.test
```

Run commands in order:

```bash
composer install
npm install

cp .env.example .env
cp .env.testing.example .env.testing
php artisan key:generate

php artisan migrate:fresh --seed
composer dev
```

http://campaign-events-tracker.test/
