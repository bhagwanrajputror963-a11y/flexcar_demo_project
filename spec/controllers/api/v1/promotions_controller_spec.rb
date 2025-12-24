require 'rails_helper'

RSpec.describe Api::V1::PromotionsController, type: :controller do
  describe 'GET #index' do
    it 'returns all active promotions' do
      active_promotions = create_list(:promotion, 2)
      expired_promotion = create(:promotion, :expired)
      get :index
      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json['promotions'].size).to eq(2)
      expect(json['promotions'].first).to have_key('id')
      expect(json['promotions'].first).to have_key('name')
      expect(json['promotions'].first).to have_key('promotion_type')
    end

    it 'returns empty array when no active promotions exist' do
      create(:promotion, :expired)
      get :index
      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json['promotions']).to eq([])
    end

    it 'includes promotion details in response' do
      promotion = create(:promotion, name: 'Test Promo', promotion_type: 'flat_discount')
      get :index
      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json['promotions'].first['name']).to eq('Test Promo')
      expect(json['promotions'].first['promotion_type']).to eq('flat_discount')
    end
  end
end
