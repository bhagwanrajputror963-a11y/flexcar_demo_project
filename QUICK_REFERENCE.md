# 🚀 Quick Reference

## One-Minute Setup

```bash
cd flexcar_demo_project
./start.sh
```

Open: http://localhost:3001

## Manual Setup (2 minutes)

### Terminal 1: Backend
```bash
cd flexcar_demo_project
bundle install
rails db:create db:migrate db:seed
rails server
```

### Terminal 2: Frontend
```bash
cd flexcar_demo_project/frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## URLs

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api/v1
- **Health Check**: http://localhost:3000/up

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/v1/items` | List items |
| GET | `/api/v1/promotions` | List promotions |
| POST | `/api/v1/carts` | Create cart |
| GET | `/api/v1/carts/:id` | Get cart |
| POST | `/api/v1/carts/:id/add_item` | Add item |
| DELETE | `/api/v1/carts/:id/remove_item/:item_id` | Remove item |
| DELETE | `/api/v1/carts/:id/clear` | Clear cart |

## Sample Data

### Items
- MacBook Pro: $2000
- Dell XPS 13: $1500
- Mouse: $99.99
- Keyboard: $199.99
- Coffee: $0.05/g
- Premium Coffee: $0.08/g

### Promotions
- $200 off MacBook
- 15% off Dell
- Buy 2 Mice Get 1 Free
- 50% off 200g+ Coffee
- 10% off Accessories
- 30% off 150g+ Premium Coffee

## Features

✅ List items
✅ Add to cart
✅ Remove from cart
✅ Apply promotions (automatic)
✅ Show benefits
✅ Error handling

## Tech Stack

**Backend:**
- Rails 8.1.1
- PostgreSQL
- Flexcar Promotions Engine

**Frontend:**
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

## File Locations

```
flexcar_demo_project/
├── app/controllers/api/v1/     # API endpoints
├── config/routes.rb            # API routes
├── db/seeds.rb                 # Sample data
└── frontend/
    ├── app/page.tsx            # Main page
    ├── components/             # UI components
    ├── lib/api.ts              # API client
    └── types/index.ts          # TypeScript types
```

## Common Commands

### Backend
```bash
rails console              # Open Rails console
rails db:reset            # Reset database
rails routes              # Show all routes
rails server              # Start server
```

### Frontend
```bash
npm run dev               # Start dev server
npm run build             # Build for production
npm start                 # Start production server
npm run lint              # Run linter
```

## Troubleshooting

### Backend won't start
```bash
sudo systemctl start postgresql
rails db:create db:migrate
```

### Frontend can't connect
- Check Rails is on port 3000
- Verify `.env.local` exists
- Check CORS is enabled

### No items showing
```bash
rails db:seed
```

### Promotions not working
```ruby
# In rails console
FlexcarPromotions::Promotion.active.count
```

## Test Cases

1. **Add MacBook** → See $200 discount
2. **Add 3 Mice** → Get 1 free
3. **Add 250g Coffee** → Get 50% off
4. **Add Dell** → Get 15% off

## Documentation

- `SETUP_GUIDE.md` - Full setup
- `FRONTEND_README.md` - Overview
- `PROJECT_SUMMARY.md` - Summary
- `IMPLEMENTATION_CHECKLIST.md` - Checklist

## Support

All requirements completed ✅
Production-ready code ✅
Full documentation ✅

**Status: Ready to use!**
