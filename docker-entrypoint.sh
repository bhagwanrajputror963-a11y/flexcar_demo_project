#!/bin/bash
set -e

# Remove a potentially pre-existing server.pid for Rails
rm -f /rails/tmp/pids/server.pid

echo "� Installing/updating gems..."
bundle install

echo "�🔧 Setting up database..."

# Wait for database to be ready
until PGPASSWORD=$POSTGRES_PASSWORD psql -h "db" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "✓ Postgres is up"

# Check if database exists and setup
if ! bundle exec rails db:version &> /dev/null; then
    echo "📦 Creating database and running migrations..."
    bundle exec rails db:create
    bundle exec rails db:migrate
    echo "🌱 Seeding sample data..."
    bundle exec rails db:seed
    echo "✓ Database setup complete!"
else
    echo "📦 Database exists, running migrations..."
    bundle exec rails db:migrate
    echo "🌱 Seeding sample data..."
    bundle exec rails db:seed
    echo "✓ Database ready!"
fi

# Then exec the container's main process (what's set as CMD in Dockerfile or docker-compose)
exec "$@"
