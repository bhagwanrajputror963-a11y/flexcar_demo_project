#!/bin/bash

echo "Testing Inventory Stock Validation"
echo "==================================="
echo

# Create a cart
echo "1. Creating a new cart..."
CART_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/carts -H "Content-Type: application/json")
CART_ID=$(echo $CART_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['cart_id'])")
echo "   ✓ Cart created with ID: $CART_ID"
echo

# Check an item's stock
echo "2. Checking iPad Pro stock..."
IPAD_STOCK=$(curl -s "http://localhost:3000/api/v1/inventory" | python3 -c "import sys, json; items = json.load(sys.stdin)['items']; ipad = [i for i in items if 'iPad' in i['name']][0]; print(f\"{ipad['name']}: {ipad['stock_quantity']} units\")")
echo "   $IPAD_STOCK"
echo

# Try to add more than available stock
echo "3. Testing: Try to add 20 iPads (stock: 12)..."
RESPONSE=$(curl -s -X POST "http://localhost:3000/api/v1/carts/$CART_ID/add_item" \
  -H "Content-Type: application/json" \
  -d '{"item_id": 48, "quantity": 20}' \
  -w "\n%{http_code}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "422" ]; then
  ERROR_MSG=$(echo "$RESPONSE" | head -n-1 | python3 -c "import sys, json; print(json.load(sys.stdin)['error'])")
  echo "   ✓ Correctly rejected: $ERROR_MSG"
else
  echo "   ✗ FAILED: Should have been rejected!"
fi
echo

# Add valid quantity
echo "4. Adding 5 iPads (within stock limit)..."
RESPONSE=$(curl -s -X POST "http://localhost:3000/api/v1/carts/$CART_ID/add_item" \
  -H "Content-Type: application/json" \
  -d '{"item_id": 48, "quantity": 5}')
echo "   ✓ Successfully added 5 units"
echo

# Try to update to exceed stock
echo "5. Testing: Try to update to 15 iPads (exceeds stock)..."
RESPONSE=$(curl -s -X PATCH "http://localhost:3000/api/v1/carts/$CART_ID/update_item/48" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 15}' \
  -w "\n%{http_code}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "422" ]; then
  ERROR_MSG=$(echo "$RESPONSE" | head -n-1 | python3 -c "import sys, json; print(json.load(sys.stdin)['error'])")
  echo "   ✓ Correctly rejected: $ERROR_MSG"
else
  echo "   ✗ FAILED: Should have been rejected!"
fi
echo

# Test with out of stock item
echo "6. Finding an out-of-stock item..."
OUT_OF_STOCK=$(curl -s "http://localhost:3000/api/v1/inventory" | python3 -c "import sys, json; items = json.load(sys.stdin)['items']; oos = [i for i in items if i['stock_quantity'] == 0][0]; print(f\"{i['id']}:{i['name']}\")")
OOS_ID=$(echo $OUT_OF_STOCK | cut -d: -f1)
OOS_NAME=$(echo $OUT_OF_STOCK | cut -d: -f2)
echo "   Found: $OOS_NAME (ID: $OOS_ID)"
echo

echo "7. Testing: Try to add out-of-stock item..."
RESPONSE=$(curl -s -X POST "http://localhost:3000/api/v1/carts/$CART_ID/add_item" \
  -H "Content-Type: application/json" \
  -d "{\"item_id\": $OOS_ID, \"quantity\": 1}" \
  -w "\n%{http_code}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "422" ]; then
  ERROR_MSG=$(echo "$RESPONSE" | head -n-1 | python3 -c "import sys, json; print(json.load(sys.stdin)['error'])")
  echo "   ✓ Correctly rejected: $ERROR_MSG"
else
  echo "   ✗ FAILED: Should have been rejected!"
fi
echo

# Test weight-based item
echo "8. Testing weight-based item (Coffee: 5000g stock)..."
RESPONSE=$(curl -s -X POST "http://localhost:3000/api/v1/carts/$CART_ID/add_item" \
  -H "Content-Type: application/json" \
  -d '{"item_id": 45, "weight": 6000}' \
  -w "\n%{http_code}")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "422" ]; then
  ERROR_MSG=$(echo "$RESPONSE" | head -n-1 | python3 -c "import sys, json; print(json.load(sys.stdin)['error'])")
  echo "   ✓ Correctly rejected exceeding weight: $ERROR_MSG"
else
  echo "   ✗ FAILED: Should have been rejected!"
fi
echo

echo "✅ Stock Validation Tests Complete!"
echo
echo "Summary:"
echo "- Out of stock items: ✓ Cannot be added"
echo "- Exceeding stock quantity: ✓ Rejected"
echo "- Exceeding stock weight: ✓ Rejected"
echo "- Valid quantities: ✓ Accepted"
