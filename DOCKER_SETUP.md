# Docker Setup Guide

## Quick Start

Run the entire application stack with Docker (no system dependencies needed):

```bash
docker compose up
```

This will start:
- PostgreSQL database on port 5432
- Redis cache on port 6379
- Rails backend API on port 3000
- Next.js frontend on port 3001

Access the application at: **http://localhost:3001**

## First Time Setup

1. **Clone the repository**
   ```bash
   cd flexcar_demo_project
   ```

2. **Start all services**
   ```bash
   docker compose up -d
   ```

3. **The database will be automatically prepared** with migrations and seed data

4. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000

## Useful Commands

### Start all services
```bash
docker compose up
```

### Start in detached mode (background)
```bash
docker compose up -d
```

### Stop all services
```bash
docker compose down
```

### View logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

### Rebuild containers (after Gemfile/package.json changes)
```bash
docker compose build
docker compose up
```

### Reset database
```bash
docker compose exec backend rails db:reset
```

### Run Rails console
```bash
docker compose exec backend rails console
```

### Run backend tests
```bash
docker compose exec backend bundle exec rspec
```

### Run frontend tests
```bash
docker compose exec frontend npm test
```

### Clean up everything (including volumes)
```bash
docker compose down -v
```

## Environment Variables

The docker compose.yml file contains all necessary environment variables:

### Backend
- `DATABASE_URL`: PostgreSQL connection string
- `RAILS_ENV`: development
- `REDIS_URL`: Redis connection string

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL (http://localhost:3000)
- `NODE_ENV`: development

## Troubleshooting

### Port already in use
If you get a port conflict error, either:
1. Stop the conflicting service
2. Or modify the ports in docker compose.yml

### Database connection issues
```bash
# Restart the database
docker compose restart db

# Check database status
docker compose exec db pg_isready -U flexcar
```

### Clear everything and start fresh
```bash
docker compose down -v
docker compose build --no-cache
docker compose up
```

## Development Workflow

1. Make code changes in your editor (files are mounted as volumes)
2. Changes are automatically reflected:
   - Rails: Hot reload with Spring
   - Next.js: Fast refresh enabled
3. No need to restart containers for code changes

## System Requirements

- Docker 20.10 or higher
- Docker Compose 2.0 or higher
- At least 4GB RAM available for Docker
- No Ruby, Node.js, or PostgreSQL installation required!
