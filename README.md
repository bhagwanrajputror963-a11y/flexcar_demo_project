# Flexcar Demo Project

This is a full-stack demonstration application showcasing the integration of the **Flexcar Promotions Engine** - a modular Rails engine for managing e-commerce inventory and promotional pricing.

## About This Project

This demo application integrates the `flexcar_promotions` engine to provide a complete example of:
- Item and inventory management with stock tracking
- Flexible promotional pricing (flat discounts, percentages, buy X get Y, weight-based)
- Shopping cart functionality with automatic best-price calculations
- Category and brand-based promotions
- Real-time inventory adjustment with validation
- Promo code application system

## Tech Stack

### Backend
- **Ruby**: 3.3.6
- **Rails**: 8.1.1 (API mode)
- **Database**: PostgreSQL
- **Background Jobs**: Solid Queue
- **Cache**: Solid Cache
- **WebSocket**: Solid Cable

### Frontend
- **Next.js**: 15.1.4
- **React**: 19
- **TypeScript**: Latest
- **Tailwind CSS**: For styling
- **Headless UI**: For components
- **Node.js**: 20.19.6 (required)

## Prerequisites

- **Ruby** 3.3.6 or higher
- **Node.js** 20.19.6 (use nvm for version management)
- **PostgreSQL** 9.3 or higher
- **Bundler**
- **npm** or **yarn**

## Installation & Setup

### Quick Start (Recommended)

Use the automated setup script:

```bash
chmod +x start.sh
./start.sh
```

This script will:
- Check prerequisites (Ruby, Node.js 20.19.6, PostgreSQL)
- Install dependencies (gems and npm packages)
- Setup database and run migrations
- Seed sample data
- Optionally start both servers

### Manual Setup

If you prefer manual setup:

#### 1. Backend Setup

```bash
# Install Ruby dependencies
bundle install

# Configure database credentials (if needed)
export FLEXCAR_DEMO_PROJECT_DATABASE_USERNAME="postgres"
export FLEXCAR_DEMO_PROJECT_DATABASE_PASSWORD="postgres"

# Create and setup database
rails db:create
rails db:migrate
rails db:seed
```

#### 2. Frontend Setup

```bash
cd frontend

# Use Node.js 20.19.6
nvm use 20.19.6  # or nvm install 20.19.6

# Install npm dependencies
npm install

# Create environment file (if needed)
cp .env.local.example .env.local
```

#### 3. Engine Gem

The `flexcar_promotions` engine is loaded from GitHub:

```ruby
gem 'flexcar_promotions',
  git: 'https://github.com/bhagwanrajputror963-a11y/flexcar_promotions.git',
  branch: 'main'
```

Engine migrations are automatically loaded and run with the demo project migrations.

## Running the Application

### Option 1: Automated Start (Recommended)

```bash
./start.sh
```

Choose "yes" when prompted to start servers automatically.

### Option 2: Manual Start

**Terminal 1 - Rails Backend:**
```bash
rails server
```
Backend API runs at `http://localhost:3000`

**Terminal 2 - Next.js Frontend:**
```bash
cd frontend
nvm use 20.19.6
npm run dev
```
Frontend UI runs at `http://localhost:3001`

### Accessing the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/up

### Using Docker

```bash
docker build -t flexcar-demo .
docker run -p 3000:3000 flexcar-demo
```

## Testing

### Backend Tests

Run the engine test suite:

```bash
cd ../flexcar_promotions
bundle exec rspec
```

Expected output: 97 examples, 0 failures

### Frontend Tests

```bash
cd frontend
npm run lint          # ESLint validation
npm run build        # Production build test
npm run test         # Jest tests (if configured)
```

### Code Quality

```bash
# Ruby code quality
bin/rubocop

# Security scanning
bin/brakeman
bin/bundler-audit
```

## API Endpoints

The backend provides RESTful APIs at `http://localhost:3000/api/v1`:

### Items
- `GET /api/v1/items` - List all items with stock info
- `GET /api/v1/items/:id` - Get item details

### Cart
- `GET /api/v1/carts/:id` - Get cart details
- `POST /api/v1/carts` - Create new cart
- `POST /api/v1/carts/:id/add_item` - Add item (with stock validation)
- `PATCH /api/v1/carts/:id/update_item` - Update quantity/weight
- `DELETE /api/v1/carts/:id/remove_item/:item_id` - Remove item
- `DELETE /api/v1/carts/:id/clear` - Clear cart
- `POST /api/v1/carts/:id/apply_promo` - Apply promo code

### Inventory
- `GET /api/v1/inventory` - List all inventory
- `POST /api/v1/inventory/:id/adjust_stock` - Adjust stock levels

### Promotions
- `GET /api/v1/promotions` - List active promotions

## Flexcar Promotions Engine

This demo integrates the Flexcar Promotions engine from GitHub:

```ruby
gem 'flexcar_promotions',
  git: 'https://github.com/bhagwanrajputror963-a11y/flexcar_promotions.git',
  branch: 'main'
```

### Features
- **Multiple Item Types**: Products sold by quantity or weight
- **Inventory Management**: Real-time stock tracking with validation
- **4 Promotion Types**:
  - Flat discount (e.g., $20 off)
  - Percentage discount (e.g., 10% off)
  - Buy X Get Y (e.g., Buy 2 get 1 free)
  - Weight threshold (e.g., 50% off when buying 100+ grams)
- **Smart Pricing**: Automatically calculates best available price
- **Time-based Promotions**: Start and end times for campaigns
- **Category & Brand Support**: Organize products and apply group promotions
- **Promo Codes**: Apply promotional discounts via codes
- **Stock Validation**: Prevents overselling with real-time stock checks

### Quick Engine Demo

Run the standalone engine demo:

```bash
cd ../flexcar_promotions
bundle exec rails runner demo.rb
```

### Engine Documentation

For detailed engine documentation, see:
- `../flexcar_promotions/README.md` - Full documentation
- `../flexcar_promotions/QUICKSTART.md` - Quick start guide
- `../flexcar_promotions/INTEGRATION.md` - Integration guide
- `../flexcar_promotions/SUBMISSION.md` - Architecture overview

## Key Files & Directories

```
flexcar_demo_project/
├── app/
│   ├── controllers/
│   │   └── api/v1/          # API controllers (carts, items, inventory, promotions)
│   └── models/              # Application models (extends engine models)
├── frontend/                # Next.js 15 + React 19 frontend
│   ├── app/                 # Next.js app directory
│   │   ├── page.tsx        # Items list page
│   │   ├── cart/           # Cart page
│   │   └── inventory/      # Inventory management page
│   ├── components/          # React components
│   │   ├── CartView.tsx    # Cart display
│   │   ├── PromoCodeInput.tsx
│   │   └── Toast.tsx       # Notifications
│   ├── lib/
│   │   └── api.ts          # API client
│   └── types/              # TypeScript definitions
├── config/
│   ├── routes.rb           # API routes
│   └── database.yml        # Database configuration
├── db/
│   ├── migrate/            # Database migrations
│   └── seeds.rb            # Sample data
├── start.sh                # Quick start script
└── Gemfile                 # Ruby dependencies
```

## Configuration

### Database

Edit `config/database.yml` or use environment variables:
- `FLEXCAR_DEMO_PROJECT_DATABASE_USERNAME`
- `FLEXCAR_DEMO_PROJECT_DATABASE_PASSWORD`

### Rails Environment

Standard Rails environments are available:
- `development` - Local development (default)
- `test` - Test suite execution
- `production` - Production deployment

## Deployment

This application is configured for deployment with:

- **Kamal**: Docker-based deployment tool
- **Thruster**: HTTP asset caching and X-Sendfile acceleration

See `config/deploy.yml` for Kamal configuration.

## Development Tools

- **Brakeman**: Security vulnerability scanning (`bin/brakeman`)
- **Bundler Audit**: Gem security auditing (`bin/bundler-audit`)
- **RuboCop**: Ruby code style checking (`bin/rubocop`)

## Project Structure

This workspace contains two main components:

1. **flexcar_demo_project/** (this directory) - Rails application demonstrating engine integration
2. **flexcar_promotions/** - Reusable Rails engine for promotions

## Support & Documentation

For issues or questions about:
- The demo application: Check this README
- The promotions engine: See `../flexcar_promotions/README.md`
- Integration: See `../flexcar_promotions/INTEGRATION.md`

## License

This project is part of the Flexcar assessment.
