# This migration comes from flexcar_promotions (originally 20251214170000)
class CreateFlexcarPromotionsBrands < ActiveRecord::Migration[7.1]
  def change
    create_table :flexcar_promotions_brands do |t|
      t.string :name, null: false
      t.timestamps
    end

    add_index :flexcar_promotions_brands, :name, unique: true
  end
end
