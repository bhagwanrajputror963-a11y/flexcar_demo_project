# 🎨 UI Component Showcase

This document showcases the visual design and components of the Flexcar Promotions frontend.

## Color Scheme

### Primary Colors
- **Indigo 600** (`#4F46E5`) - Primary buttons, links, accents
- **Indigo 700** (`#4338CA`) - Hover states
- **Indigo 500** (`#6366F1`) - Lighter accents

### Success/Promotion Colors
- **Green 100** (`#D1FAE5`) - Promotion badge background
- **Green 800** (`#065F46`) - Promotion badge text
- **Green 600** (`#059669`) - Success messages

### Error Colors
- **Red 50** (`#FEF2F2`) - Error background
- **Red 800** (`#991B1B`) - Error text
- **Red 600** (`#DC2626`) - Error accents

### Neutral Colors
- **Gray 50** (`#F9FAFB`) - Page background
- **Gray 100-900** - Various UI elements

## Components

### 1. Header
```
┌─────────────────────────────────────────────────────┐
│ Flexcar Promotions Store              🛒 3         │
│ Smart promotions automatically applied to your cart │
└─────────────────────────────────────────────────────┘
```

**Features:**
- App title and tagline
- Shopping cart icon with item count
- Clean white background with shadow

---

### 2. Item Card

```
┌────────────────────────────────────────────────┐
│ MacBook Pro        [Electronics]               │
│ Brand: Apple                                   │
│ $2000.00                                       │
│                              Qty: [1] [+ Add]  │
└────────────────────────────────────────────────┘
```

**Features:**
- Item name and category badge (blue)
- Brand information
- Price display (bold)
- Quantity/Weight input
- Add to cart button (indigo)
- Hover effect (light gray background)

---

### 3. Cart View

```
┌────────────────────────────────────────────────┐
│ Shopping Cart                     Clear All    │
├────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────┐  │
│ │ MacBook Pro                          [×] │  │
│ │ Qty: 1 × $2000.00                        │  │
│ │ ✓ $200 off MacBook Pro                   │  │
│ │ Subtotal:    $2000.00                    │  │
│ │ Discount:    -$200.00                    │  │
│ │ Total:       $1800.00                    │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ Subtotal:           $2000.00                   │
│ Total Savings:      -$200.00                   │
│ Total:              $1800.00                   │
│                                                │
│        [Proceed to Checkout]                   │
└────────────────────────────────────────────────┘
```

**Features:**
- Cart header with clear all option
- Individual item cards with borders
- Remove button (X icon)
- Applied promotion badge (green)
- Price breakdown
- Cart summary with totals
- Checkout button (full width, indigo)

---

### 4. Promotions List

```
┌────────────────────────────────────────────────┐
│ 🏷️ Active Promotions                           │
│ Automatically applied to eligible items        │
├────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────┐  │
│ │ [Flat Discount]                          │  │
│ │ $200 off MacBook Pro                     │  │
│ │ $200.00 off MacBook Pro                  │  │
│ │ Ends: Dec 31, 2025                       │  │
│ └──────────────────────────────────────────┘  │
│                                                │
│ ┌──────────────────────────────────────────┐  │
│ │ [Percentage Discount]                    │  │
│ │ 15% off Dell Laptops                     │  │
│ │ 15% off Dell XPS 13                      │  │
│ └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

**Features:**
- Tag icon in header
- Promotion type badges (color-coded)
  - Blue: Flat Discount
  - Purple: Percentage Discount
  - Pink: Buy X Get Y
  - Yellow: Weight Threshold
- Promotion name and description
- End date if applicable
- Hover effect on cards

---

### 5. Error Alert

```
┌────────────────────────────────────────────────┐
│ ⚠️ Error                                  [×]  │
│ Failed to add item to cart                     │
└────────────────────────────────────────────────┘
```

**Features:**
- Red background
- Error icon
- Clear error message
- Dismiss button

---

### 6. Success Notification

```
┌────────────────────────────────────────────────┐
│ ✓ MacBook Pro added to cart                   │
└────────────────────────────────────────────────┘
```

**Features:**
- Green background
- Checkmark icon
- Success message
- Auto-dismiss after 3 seconds

---

### 7. Loading State

```
        ⭕ (spinning)
        Loading...
```

**Features:**
- Centered spinner animation
- Loading text
- Appears during data fetch

---

### 8. Empty States

**Empty Cart:**
```
┌────────────────────────────────────────────────┐
│ Shopping Cart                                  │
├────────────────────────────────────────────────┤
│                                                │
│              Your cart is empty                │
│           Add items to get started             │
│                                                │
└────────────────────────────────────────────────┘
```

**No Promotions:**
```
┌────────────────────────────────────────────────┐
│ 🏷️ Active Promotions                           │
├────────────────────────────────────────────────┤
│                                                │
│           No active promotions                 │
│                                                │
└────────────────────────────────────────────────┘
```

---

## Layout Structure

### Desktop (3-Column Layout)

```
┌─────────────────────────────────────────────────────────────┐
│                         HEADER                              │
├──────────────────────────────┬──────────────────────────────┤
│                              │                              │
│                              │    ┌──────────────────┐      │
│                              │    │  Shopping Cart   │      │
│                              │    │                  │      │
│     Item List                │    └──────────────────┘      │
│     (2/3 width)              │                              │
│                              │    ┌──────────────────┐      │
│                              │    │  Promotions      │      │
│                              │    │                  │      │
│                              │    └──────────────────┘      │
│                              │    (1/3 width)               │
└──────────────────────────────┴──────────────────────────────┘
```

### Mobile (Stacked Layout)

```
┌──────────────────────┐
│      HEADER          │
├──────────────────────┤
│                      │
│    Shopping Cart     │
│                      │
├──────────────────────┤
│                      │
│    Promotions        │
│                      │
├──────────────────────┤
│                      │
│    Item List         │
│                      │
└──────────────────────┘
```

---

## Typography

- **Headings**: Inter font family
- **Title (h1)**: 3xl, bold
- **Section (h2)**: xl, semibold
- **Item Name**: lg, medium
- **Body**: sm/base, regular
- **Labels**: sm, medium

---

## Spacing

- **Container padding**: 6 (24px)
- **Component gaps**: 8 (32px)
- **Card padding**: 4 (16px)
- **Button padding**: x-4 y-2

---

## Shadows

- **Cards**: sm shadow
- **Buttons**: sm shadow on hover
- **Modals/Alerts**: lg shadow

---

## Buttons

### Primary Button (Add to Cart, Checkout)
```
┌─────────────────┐
│   + Add         │  (Indigo 600)
└─────────────────┘
```

**States:**
- Default: Indigo 600
- Hover: Indigo 700
- Focus: Ring offset

### Secondary Button (Remove, Clear)
```
┌─────────────────┐
│   Clear All     │  (Red 600 text)
└─────────────────┘
```

**States:**
- Default: Red 600
- Hover: Red 800

---

## Icons

Using Heroicons (24px outline/solid):

- **Shopping Cart**: ShoppingCartIcon
- **Tag**: TagIcon
- **Plus**: PlusIcon
- **X Mark**: XMarkIcon
- **Trash**: TrashIcon
- **Check Circle**: CheckCircleIcon

---

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Responsive Behavior

**Mobile:**
- Single column layout
- Full-width cards
- Stacked components
- Larger touch targets

**Tablet:**
- 2-column where appropriate
- Optimized spacing
- Adjusted font sizes

**Desktop:**
- 3-column layout
- Maximum width container
- Optimal reading width

---

## Accessibility Features

✓ Semantic HTML elements
✓ ARIA labels on interactive elements
✓ Keyboard navigation support
✓ Focus indicators
✓ Color contrast compliance
✓ Screen reader friendly

---

## Animation & Transitions

- **Hover effects**: 200ms ease
- **Notifications**: Fade in/out
- **Loading spinner**: Continuous rotation
- **Button states**: Smooth color transition

---

## Best Practices Applied

1. **Consistent spacing** using Tailwind's spacing scale
2. **Color palette** limited to primary, success, error, neutral
3. **Typography hierarchy** clear and scannable
4. **Interactive elements** have clear hover/focus states
5. **Loading states** prevent user confusion
6. **Error messages** are clear and actionable
7. **Success feedback** confirms user actions
8. **Responsive design** works on all devices

---

This UI design creates a professional, modern, and user-friendly shopping experience while clearly displaying promotion benefits and maintaining excellent usability.
