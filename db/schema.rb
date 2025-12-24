# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_12_17_052931) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "flexcar_promotions_brands", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_flexcar_promotions_brands_on_name", unique: true
  end

  create_table "flexcar_promotions_cart_items", force: :cascade do |t|
    t.bigint "cart_id", null: false
    t.datetime "created_at", null: false
    t.bigint "item_id", null: false
    t.decimal "quantity", precision: 10, scale: 2
    t.datetime "updated_at", null: false
    t.decimal "weight", precision: 10, scale: 2
    t.index ["cart_id", "item_id"], name: "index_cart_items_on_cart_and_item", unique: true
    t.index ["cart_id"], name: "index_flexcar_promotions_cart_items_on_cart_id"
    t.index ["item_id"], name: "index_flexcar_promotions_cart_items_on_item_id"
    t.check_constraint "NOT (quantity IS NOT NULL AND weight IS NOT NULL)", name: "quantity_or_weight_exclusive"
    t.check_constraint "quantity > 0::numeric OR weight > 0::numeric", name: "quantity_or_weight_positive"
  end

  create_table "flexcar_promotions_carts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "flexcar_promotions_categories", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_flexcar_promotions_categories_on_name", unique: true
  end

  create_table "flexcar_promotions_items", force: :cascade do |t|
    t.bigint "brand_id"
    t.bigint "category_id"
    t.datetime "created_at", null: false
    t.string "name", limit: 255, null: false
    t.decimal "price", precision: 10, scale: 2, null: false
    t.string "sale_unit", limit: 20, null: false
    t.datetime "updated_at", null: false
    t.index ["brand_id"], name: "index_flexcar_promotions_items_on_brand_id"
    t.index ["category_id"], name: "index_flexcar_promotions_items_on_category_id"
    t.index ["sale_unit"], name: "index_flexcar_promotions_items_on_sale_unit"
    t.check_constraint "price > 0::numeric", name: "price_positive"
    t.check_constraint "sale_unit::text = ANY (ARRAY['quantity'::character varying::text, 'weight'::character varying::text])", name: "valid_sale_unit"
  end

  create_table "flexcar_promotions_promotions", force: :cascade do |t|
    t.text "config"
    t.datetime "created_at", null: false
    t.datetime "end_time"
    t.string "name", limit: 255, null: false
    t.string "promotion_type", limit: 50, null: false
    t.datetime "start_time", null: false
    t.integer "target_id"
    t.string "target_type", limit: 50, null: false
    t.datetime "updated_at", null: false
    t.decimal "value", precision: 10, scale: 2
    t.index ["end_time"], name: "index_flexcar_promotions_promotions_on_end_time"
    t.index ["promotion_type"], name: "index_flexcar_promotions_promotions_on_promotion_type"
    t.index ["start_time", "end_time"], name: "index_promotions_on_time_range"
    t.index ["start_time"], name: "index_flexcar_promotions_promotions_on_start_time"
    t.index ["target_type", "target_id"], name: "index_promotions_on_target"
    t.check_constraint "end_time IS NULL OR end_time > start_time", name: "valid_time_range"
    t.check_constraint "promotion_type::text = ANY (ARRAY['flat_discount'::character varying::text, 'percentage_discount'::character varying::text, 'buy_x_get_y'::character varying::text, 'weight_threshold'::character varying::text])", name: "valid_promotion_type"
    t.check_constraint "target_type::text = ANY (ARRAY['Item'::character varying::text, 'Category'::character varying::text])", name: "valid_target_type"
    t.check_constraint "value >= 0::numeric", name: "value_non_negative"
  end

  add_foreign_key "flexcar_promotions_cart_items", "flexcar_promotions_carts", column: "cart_id", on_delete: :cascade
  add_foreign_key "flexcar_promotions_cart_items", "flexcar_promotions_items", column: "item_id", on_delete: :restrict
  add_foreign_key "flexcar_promotions_items", "flexcar_promotions_brands", column: "brand_id"
  add_foreign_key "flexcar_promotions_items", "flexcar_promotions_categories", column: "category_id"
end
