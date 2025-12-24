# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

puts "Seeding database..."

# Clean existing data
puts "Cleaning existing data..."
FlexcarPromotions::CartItem.destroy_all
FlexcarPromotions::Cart.destroy_all
FlexcarPromotions::Promotion.destroy_all
FlexcarPromotions::Item.destroy_all
FlexcarPromotions::Brand.destroy_all
FlexcarPromotions::Category.destroy_all

# Create Brands
puts "Creating brands..."
apple = FlexcarPromotions::Brand.create!(name: 'Apple')
logitech = FlexcarPromotions::Brand.create!(name: 'Logitech')
corsair = FlexcarPromotions::Brand.create!(name: 'Corsair')
starbucks = FlexcarPromotions::Brand.create!(name: 'Starbucks')
dell = FlexcarPromotions::Brand.create!(name: 'Dell')
hp = FlexcarPromotions::Brand.create!(name: 'HP')
lenovo = FlexcarPromotions::Brand.create!(name: 'Lenovo')
razer = FlexcarPromotions::Brand.create!(name: 'Razer')
samsung = FlexcarPromotions::Brand.create!(name: 'Samsung')
sony = FlexcarPromotions::Brand.create!(name: 'Sony')

# Create Categories
puts "Creating categories..."
electronics = FlexcarPromotions::Category.create!(name: 'Electronics')
accessories = FlexcarPromotions::Category.create!(name: 'Accessories')
food = FlexcarPromotions::Category.create!(name: 'Food')

# Create Items
puts "Creating items..."

# Quantity-based items
laptop = FlexcarPromotions::Item.create!(
  name: 'MacBook Pro',
  price: 2000.00,
  sale_unit: 'quantity',
  brand: apple,
  category: electronics,
  stock_quantity: 15
)

dell_laptop = FlexcarPromotions::Item.create!(
  name: 'Dell XPS 13',
  price: 1500.00,
  sale_unit: 'quantity',
  brand: dell,
  category: electronics,
  stock_quantity: 20
)

mouse = FlexcarPromotions::Item.create!(
  name: 'Logitech MX Master 3',
  price: 99.99,
  sale_unit: 'quantity',
  brand: logitech,
  category: accessories,
  stock_quantity: 50
)

keyboard = FlexcarPromotions::Item.create!(
  name: 'Corsair K95 RGB',
  price: 199.99,
  sale_unit: 'quantity',
  brand: corsair,
  category: accessories,
  stock_quantity: 30
)

# Weight-based items
coffee = FlexcarPromotions::Item.create!(
  name: 'Starbucks Coffee Beans',
  price: 0.05,
  sale_unit: 'weight',
  brand: starbucks,
  category: food,
  stock_quantity: 5000
)

premium_coffee = FlexcarPromotions::Item.create!(
  name: 'Premium Espresso Beans',
  price: 0.08,
  sale_unit: 'weight',
  brand: starbucks,
  category: food,
  stock_quantity: 3000
)

# Additional Electronics
FlexcarPromotions::Item.create!(
  name: 'HP Pavilion 15',
  price: 899.99,
  sale_unit: 'quantity',
  brand: hp,
  category: electronics,
  stock_quantity: 25
)

FlexcarPromotions::Item.create!(
  name: 'Lenovo ThinkPad X1',
  price: 1299.99,
  sale_unit: 'quantity',
  brand: lenovo,
  category: electronics,
  stock_quantity: 18
)

FlexcarPromotions::Item.create!(
  name: 'Samsung Galaxy Book',
  price: 799.99,
  sale_unit: 'quantity',
  brand: samsung,
  category: electronics,
  stock_quantity: 22
)

FlexcarPromotions::Item.create!(
  name: 'iPad Pro 12.9"',
  price: 1099.00,
  sale_unit: 'quantity',
  brand: apple,
  category: electronics,
  stock_quantity: 12
)

# Additional Accessories
FlexcarPromotions::Item.create!(
  name: 'Razer DeathAdder Mouse',
  price: 69.99,
  sale_unit: 'quantity',
  brand: razer,
  category: accessories,
  stock_quantity: 45
)

FlexcarPromotions::Item.create!(
  name: 'Logitech C920 Webcam',
  price: 79.99,
  sale_unit: 'quantity',
  brand: logitech,
  category: accessories,
  stock_quantity: 35
)

FlexcarPromotions::Item.create!(
  name: 'Sony WH-1000XM4 Headphones',
  price: 349.99,
  sale_unit: 'quantity',
  brand: sony,
  category: accessories,
  stock_quantity: 28
)

FlexcarPromotions::Item.create!(
  name: 'Apple Magic Keyboard',
  price: 129.00,
  sale_unit: 'quantity',
  brand: apple,
  category: accessories
)

FlexcarPromotions::Item.create!(
  name: 'Razer Kraken Headset',
  price: 79.99,
  sale_unit: 'quantity',
  brand: razer,
  category: accessories
)

FlexcarPromotions::Item.create!(
  name: 'Logitech G Pro Keyboard',
  price: 149.99,
  sale_unit: 'quantity',
  brand: logitech,
  category: accessories
)

FlexcarPromotions::Item.create!(
  name: 'Samsung 27" Monitor',
  price: 299.99,
  sale_unit: 'quantity',
  brand: samsung,
  category: electronics
)

FlexcarPromotions::Item.create!(
  name: 'Dell UltraSharp Monitor',
  price: 449.99,
  sale_unit: 'quantity',
  brand: dell,
  category: electronics
)

# Additional Food Items
FlexcarPromotions::Item.create!(
  name: 'Organic Green Tea',
  price: 0.04,
  sale_unit: 'weight',
  brand: starbucks,
  category: food
)

FlexcarPromotions::Item.create!(
  name: 'Dark Roast Coffee',
  price: 0.06,
  sale_unit: 'weight',
  brand: starbucks,
  category: food
)

# Create Promotions
puts "Creating promotions..."

# Flat discount on MacBook
FlexcarPromotions::Promotion.create!(
  name: '$200 off MacBook Pro',
  promotion_type: 'flat_discount',
  value: 200.00,
  target: laptop,
  promo_code: 'MACBOOK200',
  start_time: Time.current,
  end_time: 2.weeks.from_now
)

# Percentage discount on Dell
FlexcarPromotions::Promotion.create!(
  name: '15% off Dell Laptops',
  promotion_type: 'percentage_discount',
  value: 15,
  target: dell_laptop,
  promo_code: 'DELL15',
  start_time: Time.current,
  end_time: 1.week.from_now
)

# Buy X Get Y on Mouse
FlexcarPromotions::Promotion.create!(
  name: 'Buy 2 Mice Get 1 Free',
  promotion_type: 'buy_x_get_y',
  target: mouse,
  promo_code: 'MOUSE2FOR1',
  start_time: Time.current,
  config: {
    'buy_quantity' => 2,
    'get_quantity' => 1,
    'discount_percent' => 100
  }
)

# Weight threshold on Coffee
FlexcarPromotions::Promotion.create!(
  name: '50% off 200g+ Coffee',
  promotion_type: 'weight_threshold',
  value: 50,
  target: coffee,
  promo_code: 'COFFEE50',
  start_time: Time.current,
  config: {
    'threshold_weight' => 200
  }
)

# Category-level promotion on Accessories
FlexcarPromotions::Promotion.create!(
  name: '10% off All Accessories',
  promotion_type: 'percentage_discount',
  value: 10,
  target: accessories,
  promo_code: 'ACCESSORIES10',
  start_time: Time.current,
  end_time: 1.month.from_now
)

# Weight threshold on Premium Coffee
FlexcarPromotions::Promotion.create!(
  name: '30% off 150g+ Premium Coffee',
  promotion_type: 'weight_threshold',
  value: 30,
  target: premium_coffee,
  promo_code: 'PREMIUM30',
  start_time: Time.current,
  config: {
    'threshold_weight' => 150
  }
)

puts "✓ Seeding completed successfully!"
puts ""
puts "Created:"
puts "  - #{FlexcarPromotions::Brand.count} brands"
puts "  - #{FlexcarPromotions::Category.count} categories"
puts "  - #{FlexcarPromotions::Item.count} items"
puts "  - #{FlexcarPromotions::Promotion.count} promotions"
puts ""
puts "Sample items:"
puts "  - MacBook Pro ($2000) - with $200 flat discount"
puts "  - Dell XPS 13 ($1500) - with 15% discount"
puts "  - Logitech MX Master 3 ($99.99) - Buy 2 Get 1 Free"
puts "  - Corsair K95 RGB ($199.99) - 10% category discount"
puts "  - Coffee Beans ($0.05/g) - 50% off when buying 200g+"
puts "  - Premium Coffee ($0.08/g) - 30% off when buying 150g+"
