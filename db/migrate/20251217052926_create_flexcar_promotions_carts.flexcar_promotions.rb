# This migration comes from flexcar_promotions (originally 20251212085124)
class CreateFlexcarPromotionsCarts < ActiveRecord::Migration[8.1]
  def change
    create_table :flexcar_promotions_carts do |t|
      t.timestamps
    end
  end
end
