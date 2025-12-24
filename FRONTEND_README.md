# 🛒 Flexcar Promotions - Full Stack E-commerce Demo

A complete full-stack e-commerce application showcasing a smart promotions engine. Built with Ruby on Rails (API backend) and Next.js (React frontend).

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## ✨ Features

### 🎁 Smart Promotions System

- **4 Promotion Types:**
  - 💰 Flat Discount (e.g., $200 off)
  - 📊 Percentage Discount (e.g., 15% off)
  - 🎯 Buy X Get Y (e.g., Buy 2 Get 1 Free)
  - ⚖️ Weight Threshold (e.g., 50% off 200g+)

### 🛍️ Shopping Experience

- ✅ Browse products by category and brand
- ✅ Add items to cart (quantity or weight-based)
- ✅ Remove items from cart
- ✅ Clear entire cart
- ✅ Automatic promotion application
- ✅ Real-time cart updates
- ✅ Visual promotion benefits display

### 💻 Modern UI

- 🎨 Beautiful Tailwind CSS design
- 📱 Fully responsive layout
- 🔔 Toast notifications
- ⚠️ Comprehensive error handling
- 🎭 Loading states
- 🎯 Accessible UI components

## 🚀 Tech Stack

### Backend (Rails API)

- **Ruby** 3.3.6
- **Rails** 8.1.1
- **PostgreSQL** 9.3+
- **Flexcar Promotions Engine** (Custom Rails Engine)
- **Rack CORS** for cross-origin requests

### Frontend (Next.js)

- **Next.js** 15.1.4 (App Router)
- **React** 19
- **TypeScript** 5
- **Tailwind CSS** 3.4
- **Axios** for API calls
- **Heroicons** for icons
- **Headless UI** for accessible components

## 📁 Project Structure

```
flexcar_demo_project/
├── app/
│   └── controllers/
│       └── api/
│           └── v1/
│               ├── items_controller.rb      # Items API
│               ├── carts_controller.rb      # Cart management API
│               └── promotions_controller.rb # Promotions API
├── config/
│   ├── routes.rb                           # API routes
│   └── initializers/
│       └── cors.rb                         # CORS configuration
├── db/
│   └── seeds.rb                            # Sample data
├── frontend/                               # Next.js application
│   ├── app/
│   │   ├── page.tsx                        # Main page
│   │   ├── layout.tsx                      # Root layout
│   │   └── globals.css                     # Global styles
│   ├── components/
│   │   ├── ItemList.tsx                    # Product listing
│   │   ├── CartView.tsx                    # Shopping cart
│   │   ├── PromotionsList.tsx              # Active promotions
│   │   └── ErrorAlert.tsx                  # Error notifications
│   ├── lib/
│   │   └── api.ts                          # API client
│   ├── types/
│   │   └── index.ts                        # TypeScript types
│   └── package.json                        # Frontend dependencies
├── Gemfile                                 # Backend dependencies
└── SETUP_GUIDE.md                          # Detailed setup instructions
```

## ⚡ Quick Start

### Prerequisites

- Ruby 3.3.6+
- Node.js 18+
- PostgreSQL
- Bundler and npm/yarn

### 1. Clone and Setup Backend

```bash
cd flexcar_demo_project

# Install dependencies
bundle install

# Setup database
rails db:create db:migrate db:seed

# Start Rails server
rails server
```

Backend will run at http://localhost:3000

### 2. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Start Next.js dev server
npm run dev
```

Frontend will run at http://localhost:3001

### 3. Open Application

Visit http://localhost:3001 in your browser!

## 📖 Detailed Setup

For complete setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)

## 🔌 API Documentation

### Items API

```http
GET /api/v1/items
```

Returns all available items.

**Response:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "MacBook Pro",
      "price": 2000.0,
      "sale_unit": "quantity",
      "category": "Electronics",
      "brand": "Apple"
    }
  ]
}
```

### Promotions API

```http
GET /api/v1/promotions
```

Returns all active promotions.

**Response:**
```json
{
  "promotions": [
    {
      "id": 1,
      "name": "$200 off MacBook Pro",
      "promotion_type": "flat_discount",
      "value": 200.0,
      "target_name": "MacBook Pro",
      "active": true
    }
  ]
}
```

### Cart API

#### Create Cart

```http
POST /api/v1/carts
```

**Response:**
```json
{
  "cart_id": 1,
  "message": "Cart created successfully"
}
```

#### Get Cart

```http
GET /api/v1/carts/:id
```

**Response:**
```json
{
  "cart": {
    "id": 1,
    "items": [...],
    "subtotal": 2000.0,
    "total_discount": 200.0,
    "total": 1800.0
  }
}
```

#### Add Item to Cart

```http
POST /api/v1/carts/:id/add_item
Content-Type: application/json

{
  "item_id": 1,
  "quantity": 1
}
```

For weight-based items:
```json
{
  "item_id": 2,
  "weight": 250
}
```

#### Remove Item from Cart

```http
DELETE /api/v1/carts/:id/remove_item/:item_id
```

#### Clear Cart

```http
DELETE /api/v1/carts/:id/clear
```

## 🎯 Usage Examples

### Adding a Laptop to Cart

1. Browse items in the left panel
2. Find "MacBook Pro" 
3. Set quantity to 1 (or desired amount)
4. Click "Add" button
5. See item appear in cart with $200 discount applied!

### Adding Coffee by Weight

1. Find "Starbucks Coffee Beans" (sold by weight)
2. Enter weight: 250 (grams)
3. Click "Add" button
4. Since 250g > 200g threshold, 50% discount applies!
5. See savings in cart

### Viewing Promotions

- Check the "Active Promotions" panel on the right
- See all current deals
- Color-coded by promotion type
- Shows which items qualify

## 🎨 Features Showcase

### Cart Intelligence

- **Best Price Guarantee**: Automatically selects best available promotion
- **Clear Breakdown**: Shows subtotal, discount, and final price
- **Visual Indicators**: Green badges for applied promotions

### Error Handling

- Network errors
- Invalid items
- Cart not found
- User-friendly messages
- Dismissible alerts

### Responsive Design

- Works on desktop, tablet, and mobile
- Touch-friendly controls
- Optimized layouts for all screen sizes

## 🧪 Testing the Promotions

### Test Case 1: Flat Discount

1. Add 1 MacBook Pro ($2000)
2. See $200 flat discount applied
3. Final price: $1800

### Test Case 2: Buy X Get Y

1. Add 3 Logitech Mice
2. Buy 2 Get 1 Free promotion applies
3. Pay for 2, get the 3rd free!

### Test Case 3: Weight Threshold

1. Add 250g of Coffee Beans
2. Exceeds 200g threshold
3. Get 50% discount on total

### Test Case 4: Percentage Discount

1. Add Dell XPS 13 ($1500)
2. 15% discount applies
3. Save $225!

## 🔧 Configuration

### Backend Environment Variables

```bash
FLEXCAR_DEMO_PROJECT_DATABASE_USERNAME=postgres
FLEXCAR_DEMO_PROJECT_DATABASE_PASSWORD=postgres
```

### Frontend Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## 📝 Development Notes

### Adding New Items

```ruby
rails console

FlexcarPromotions::Item.create!(
  name: 'New Product',
  price: 99.99,
  sale_unit: 'quantity',
  category: 'Electronics',
  brand: 'BrandName'
)
```

### Creating New Promotions

```ruby
FlexcarPromotions::Promotion.create!(
  name: '20% off New Product',
  promotion_type: 'percentage_discount',
  value: 20,
  target: item,
  start_time: Time.current,
  end_time: 1.week.from_now
)
```

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Reset database
rails db:drop db:create db:migrate db:seed
```

### Frontend can't connect to API

1. Verify Rails is running on port 3000
2. Check CORS is enabled
3. Verify `.env.local` settings

### Promotions not showing

1. Check promotions exist: `rails console` → `FlexcarPromotions::Promotion.count`
2. Verify `start_time` is in the past
3. Check `end_time` hasn't passed

## 📚 Additional Resources

- **Flexcar Promotions Engine**: See `../flexcar_promotions/README.md`
- **Integration Guide**: See `../flexcar_promotions/INTEGRATION.md`
- **Frontend Documentation**: See `frontend/README.md`
- **Setup Guide**: See `SETUP_GUIDE.md`

## 🎓 Learning Outcomes

This project demonstrates:

- RESTful API design
- Rails Engine integration
- React/Next.js best practices
- TypeScript type safety
- Modern CSS with Tailwind
- State management in React
- Error handling patterns
- Responsive design
- API consumption

## 📄 License

Part of the Flexcar assessment project.

## 🙏 Acknowledgments

Built as a demonstration of the Flexcar Promotions Engine capabilities.

---

**Happy Shopping! 🛍️**

For questions or issues, please refer to the [SETUP_GUIDE.md](./SETUP_GUIDE.md) or check the individual component READMEs.
