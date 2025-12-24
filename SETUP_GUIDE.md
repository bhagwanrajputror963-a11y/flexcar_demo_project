# Flexcar Promotions - Full Stack Setup Guide

This guide will help you set up both the Rails API backend and Next.js frontend for the Flexcar Promotions demo project.

## Prerequisites

- Ruby 3.3.6+
- Rails 8.1.1+
- PostgreSQL 9.3+
- Node.js 18+
- npm or yarn

## Part 1: Rails Backend Setup

### 1. Install Dependencies

```bash
cd flexcar_demo_project
bundle install
```

### 2. Configure Database

Set environment variables or edit `config/database.yml`:

```bash
export FLEXCAR_DEMO_PROJECT_DATABASE_USERNAME="postgres"
export FLEXCAR_DEMO_PROJECT_DATABASE_PASSWORD="postgres"
```

### 3. Create and Migrate Database

```bash
rails db:create
rails db:migrate
```

### 4. Seed Sample Data (Recommended)

Create a seed file with sample items and promotions:

```bash
rails db:seed
```

Or manually create data using Rails console:

```bash
rails console
```

Then run:

```ruby
# Create categories and brands
electronics = FlexcarPromotions::Category.create!(name: 'Electronics')
food = FlexcarPromotions::Category.create!(name: 'Food')
apple = FlexcarPromotions::Brand.create!(name: 'Apple')
starbucks = FlexcarPromotions::Brand.create!(name: 'Starbucks')

# Create items
laptop = FlexcarPromotions::Item.create!(
  name: 'MacBook Pro',
  price: 2000,
  sale_unit: 'quantity',
  brand: apple,
  category: electronics
)

coffee = FlexcarPromotions::Item.create!(
  name: 'Coffee Beans',
  price: 0.05,
  sale_unit: 'weight',
  brand: starbucks,
  category: food
)

# Create promotions
FlexcarPromotions::Promotion.create!(
  name: '$200 off MacBook',
  promotion_type: 'flat_discount',
  value: 200,
  target: laptop,
  start_time: Time.current,
  end_time: 1.week.from_now
)

FlexcarPromotions::Promotion.create!(
  name: '50% off 200g+ Coffee',
  promotion_type: 'weight_threshold',
  value: 50,
  target: coffee,
  start_time: Time.current,
  config: { 'threshold_weight' => 200 }
)
```

### 5. Start Rails Server

```bash
rails server
# or
bin/dev
```

The API will be available at http://localhost:3000

### 6. Test API Endpoints

```bash
# Get all items
curl http://localhost:3000/api/v1/items

# Get all promotions
curl http://localhost:3000/api/v1/promotions

# Create a cart
curl -X POST http://localhost:3000/api/v1/carts

# Add item to cart (replace {cart_id} and {item_id})
curl -X POST http://localhost:3000/api/v1/carts/{cart_id}/add_item \
  -H "Content-Type: application/json" \
  -d '{"item_id": {item_id}, "quantity": 1}'
```

## Part 2: Next.js Frontend Setup

### 1. Navigate to Frontend Directory

```bash
cd flexcar_demo_project/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` if needed (default is correct):

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### 4. Start Development Server

```bash
npm run dev
```

The frontend will be available at http://localhost:3001

## Part 3: Using the Application

### 1. Open Frontend

Navigate to http://localhost:3001 in your browser.

### 2. Browse Items

- View available items in the left panel
- See item details: name, price, category, brand
- Note which items are sold by quantity vs. weight

### 3. Add Items to Cart

**For Quantity-based Items:**
- Set desired quantity (default is 1)
- Click "Add" button

**For Weight-based Items:**
- Enter desired weight in grams
- Click "Add" button

### 4. View Cart

- Cart displays in the right panel
- See individual item totals
- View applied promotions (green badges)
- See discount amounts
- View total savings

### 5. Manage Cart

- **Remove Item**: Click the X icon on any cart item
- **Clear Cart**: Click "Clear All" button at top of cart

### 6. View Promotions

- Active promotions shown in bottom right panel
- Color-coded by promotion type
- Shows promotion details and benefits

## API Endpoints Reference

### Items

```
GET /api/v1/items
GET /api/v1/items/:id
```

### Promotions

```
GET /api/v1/promotions
GET /api/v1/promotions/:id
```

### Carts

```
POST   /api/v1/carts
GET    /api/v1/carts/:id
POST   /api/v1/carts/:id/add_item
DELETE /api/v1/carts/:id/remove_item/:item_id
DELETE /api/v1/carts/:id/clear
```

## Features Implemented

### ✅ List Items
- Display all available items
- Show item details (name, price, category, brand)
- Support for quantity and weight-based items

### ✅ Add Items to Cart
- Add quantity-based items
- Add weight-based items
- Real-time cart updates
- Success notifications

### ✅ Remove Items from Cart
- Remove individual items
- Clear entire cart
- Instant UI updates

### ✅ Apply Promotions
- Automatic promotion application
- Best price guarantee
- Support for all promotion types:
  - Flat discount
  - Percentage discount
  - Buy X Get Y
  - Weight threshold

### ✅ Show Benefits
- Visual promotion indicators
- Discount breakdown per item
- Total savings display
- Promotion details

### ✅ Error Handling
- API connection errors
- Invalid item errors
- Cart not found errors
- User-friendly error messages
- Dismissible error alerts

## Troubleshooting

### Backend Issues

**Database Connection Error:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify credentials
psql -U postgres
```

**Migration Errors:**
```bash
# Reset database
rails db:drop db:create db:migrate db:seed
```

**CORS Errors:**
- Ensure `rack-cors` gem is installed: `bundle install`
- Check `config/initializers/cors.rb` exists

### Frontend Issues

**API Connection Failed:**
- Verify Rails server is running on port 3000
- Check `.env.local` has correct API URL
- Ensure CORS is configured in Rails

**Blank Page:**
- Check browser console for errors
- Verify all npm dependencies installed
- Try clearing Next.js cache: `rm -rf .next`

**Styling Not Loading:**
```bash
# Rebuild Tailwind
npm run dev
```

## Development Tips

### Adding More Sample Data

```ruby
# In Rails console
rails console

# Add more items
laptop = FlexcarPromotions::Item.create!(
  name: 'Dell XPS',
  price: 1500,
  sale_unit: 'quantity',
  category: 'Electronics',
  brand: 'Dell'
)

# Add buy X get Y promotion
FlexcarPromotions::Promotion.create!(
  name: 'Buy 2 Get 1 Free',
  promotion_type: 'buy_x_get_y',
  target: laptop,
  start_time: Time.current,
  config: {
    'buy_quantity' => 2,
    'get_quantity' => 1,
    'discount_percent' => 100
  }
)
```

### Debugging

**Rails Logs:**
```bash
tail -f log/development.log
```

**Frontend Console:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

## Production Deployment

### Rails

```bash
# Build assets
rails assets:precompile

# Run with production settings
RAILS_ENV=production rails server
```

### Next.js

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

## License

Part of the Flexcar assessment project.
