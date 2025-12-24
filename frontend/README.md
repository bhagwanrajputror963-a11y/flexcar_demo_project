# Flexcar Promotions Frontend

A modern Next.js frontend application for the Flexcar Promotions e-commerce platform. Built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

✨ **Complete E-commerce Experience**
- Browse items with category and brand information
- Add items to cart (supports both quantity and weight-based items)
- Remove items from cart
- Clear entire cart
- Real-time cart updates

🎁 **Smart Promotions**
- Automatic promotion application
- Visual display of active promotions
- Promotion benefits shown in cart
- Support for multiple promotion types:
  - Flat discount
  - Percentage discount
  - Buy X Get Y
  - Weight threshold

🎨 **Modern UI**
- Beautiful Tailwind CSS design
- Responsive layout
- Error handling with user-friendly alerts
- Success notifications
- Loading states
- Heroicons for consistent iconography

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Running Flexcar Demo Project Rails API (default: http://localhost:3000)

## Installation

1. **Install dependencies:**

```bash
cd frontend
npm install
```

2. **Configure environment:**

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` if your Rails API is running on a different URL:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at http://localhost:3001

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx            # Root layout component
│   └── page.tsx              # Main page component
├── components/
│   ├── CartView.tsx          # Shopping cart display
│   ├── ErrorAlert.tsx        # Error notification component
│   ├── ItemList.tsx          # Product listing
│   └── PromotionsList.tsx    # Active promotions display
├── lib/
│   └── api.ts                # API client and endpoints
├── types/
│   └── index.ts              # TypeScript type definitions
├── .env.local.example        # Environment variables template
├── next.config.js            # Next.js configuration
├── package.json              # Dependencies and scripts
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## API Integration

The frontend connects to the Rails API backend with the following endpoints:

### Items
- `GET /api/v1/items` - List all items
- `GET /api/v1/items/:id` - Get item details

### Promotions
- `GET /api/v1/promotions` - List active promotions
- `GET /api/v1/promotions/:id` - Get promotion details

### Cart
- `POST /api/v1/carts` - Create a new cart
- `GET /api/v1/carts/:id` - Get cart details
- `POST /api/v1/carts/:id/add_item` - Add item to cart
- `DELETE /api/v1/carts/:id/remove_item/:item_id` - Remove item from cart
- `DELETE /api/v1/carts/:id/clear` - Clear all items from cart

## Features in Detail

### Item Management

- **Browse Items**: View all available products with prices, categories, and brands
- **Quantity-based Items**: Use number input to select quantity
- **Weight-based Items**: Enter weight in grams for items sold by weight
- **Add to Cart**: Single-click add to cart with quantity/weight selection

### Cart Management

- **Persistent Cart**: Cart ID stored in localStorage
- **Real-time Updates**: Cart automatically refreshes after each action
- **Item Details**: Shows quantity/weight, unit price, and totals
- **Remove Items**: One-click removal of individual items
- **Clear Cart**: Clear all items at once

### Promotions Display

- **Active Promotions**: Only shows currently active promotions
- **Visual Categories**: Color-coded badges for promotion types
- **Detailed Information**: Clear description of each promotion benefit
- **Expiration Dates**: Shows when promotions end

### Applied Promotions in Cart

- **Automatic Application**: Best promotion automatically selected
- **Visual Indicators**: Green badges show applied promotions
- **Discount Breakdown**: Shows original price, discount, and final price
- **Total Savings**: Displays cumulative savings at checkout

### Error Handling

- **User-friendly Messages**: Clear error descriptions
- **Dismissible Alerts**: Errors can be manually dismissed
- **Network Error Handling**: Graceful handling of API failures
- **Validation**: Input validation for quantities and weights

## Technologies Used

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons**: Beautiful hand-crafted SVG icons
- **Axios**: HTTP client for API requests
- **Headless UI**: Unstyled, accessible UI components

## Development

### Code Style

- TypeScript for type safety
- Functional React components with hooks
- Client-side rendering for interactive features
- Responsive design mobile-first approach

### State Management

- React useState for local component state
- useEffect for side effects and data fetching
- localStorage for cart persistence

## Troubleshooting

### API Connection Issues

If you see "Failed to load data" errors:

1. Ensure Rails API is running on http://localhost:3000
2. Check CORS configuration in Rails
3. Verify `.env.local` has correct API URL

### Cart Not Persisting

If cart resets on page refresh:

1. Check browser localStorage is enabled
2. Verify cart_id is being stored
3. Check Rails cart endpoint is accessible

### Promotions Not Showing

If promotions aren't displaying:

1. Ensure promotions exist in Rails database
2. Check promotion start_time and end_time
3. Verify promotions are marked as active

## Future Enhancements

- [ ] User authentication
- [ ] Order history
- [ ] Payment integration
- [ ] Product search and filtering
- [ ] Product images
- [ ] Wishlist functionality
- [ ] Promotional codes input
- [ ] Multiple cart support
- [ ] Dark mode

## License

Part of the Flexcar assessment project.
