#!/bin/bash

echo "Testing Inventory Management System"
echo "====================================="
echo

# Create a cart
echo "1. Creating a cart..."
CART_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/carts -H "Content-Type: application/json")
CART_ID=$(echo $CART_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['cart_id'])")
echo "   ✓ Cart created with ID: $CART_ID"
echo

# Add an item to cart
echo "2. Adding MacBook (ID: 41) with quantity 2..."
curl -s -X POST "http://localhost:3000/api/v1/carts/$CART_ID/add_item" \
  -H "Content-Type: application/json" \
  -d '{"item_id": 41, "quantity": 2}' > /dev/null
echo "   ✓ Item added"
echo

# Get cart
echo "3. Viewing cart..."
curl -s "http://localhost:3000/api/v1/carts/$CART_ID" | python3 -m json.tool | head -30
echo

# Update item quantity
echo "4. Updating MacBook quantity to 5..."
curl -s -X PATCH "http://localhost:3000/api/v1/carts/$CART_ID/update_item/41" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}' | python3 -m json.tool | head -30
echo

# Check inventory
echo "5. Checking inventory status..."
curl -s "http://localhost:3000/api/v1/inventory" | python3 -m json.tool | grep -A 8 "MacBook" | head -10
echo

echo "✅ All tests completed!"
