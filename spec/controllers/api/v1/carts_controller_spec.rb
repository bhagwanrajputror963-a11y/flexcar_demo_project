require 'rails_helper'

RSpec.describe Api::V1::CartsController, type: :controller do
  describe 'POST #create' do
    it 'creates a new cart' do
      expect { post :create }.to change(FlexcarPromotions::Cart, :count).by(1)
      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json).to have_key('cart_id')
      expect(json['message']).to eq('Cart created successfully')
    end

    it 'returns error on failure' do
      allow(FlexcarPromotions::Cart).to receive(:create!).and_raise(StandardError.new('Database error'))
      post :create
      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Database error')
    end
  end

  describe 'GET #show' do
    let(:cart) { create(:cart) }
    let(:item) { create(:item, price: 10.0) }

    before do
      cart.add_item(item, quantity: 2)
    end

    it 'returns cart details' do
      get :show, params: { id: cart.id }
      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json['cart']['id']).to eq(cart.id)
      expect(json['cart']['items'].size).to eq(1)
      expect(json['cart']['subtotal']).to eq(20.0)
    end

    it 'returns 404 for non-existent cart' do
      get :show, params: { id: 99999 }
      expect(response).to have_http_status(:not_found)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Cart not found')
    end
  end

  describe 'POST #add_item' do
    let(:cart) { create(:cart) }
    let(:item) { create(:item, price: 15.0) }

    it 'adds item with quantity to cart' do
      post :add_item, params: { id: cart.id, item_id: item.id, quantity: 3 }
      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json['message']).to eq("#{item.name} added to cart")
      expect(json['cart']['items'].size).to eq(1)
    end

    it 'adds item with weight to cart' do
      weight_item = create(:item, :sold_by_weight, price: 5.0)
      post :add_item, params: { id: cart.id, item_id: weight_item.id, weight: 250 }
      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json['message']).to eq("#{weight_item.name} added to cart")
    end

    it 'returns 404 for non-existent item' do
      post :add_item, params: { id: cart.id, item_id: 99999, quantity: 1 }
      expect(response).to have_http_status(:not_found)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Item not found')
    end

    it 'returns error for missing required parameters' do
      post :add_item, params: { id: cart.id, item_id: item.id }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'DELETE #remove_item' do
    let(:cart) { create(:cart) }
    let(:item) { create(:item) }

    before do
      cart.add_item(item, quantity: 2)
    end

    it 'removes item from cart' do
      delete :remove_item, params: { id: cart.id, item_id: item.id }
      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json['message']).to eq("#{item.name} removed from cart")
      expect(json['cart']['items']).to be_empty
    end

    it 'returns 404 for non-existent item' do
      delete :remove_item, params: { id: cart.id, item_id: 99999 }
      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'DELETE #clear' do
    let(:cart) { create(:cart) }
    let(:item) { create(:item) }

    before do
      cart.add_item(item, quantity: 2)
    end

    it 'clears all items from cart' do
      delete :clear, params: { id: cart.id }
      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json['message']).to eq('Cart cleared successfully')
      expect(json['cart']['items']).to be_empty
    end
  end

  describe 'POST #apply_promo' do
    let(:cart) { create(:cart) }
    let(:item) { create(:item, price: 50.0) }
    let(:promotion) { create(:promotion, :with_promo_code, target_type: 'Item', target_id: item.id) }

    before do
      cart.add_item(item, quantity: 1)
    end

    it 'applies valid promo code' do
      post :apply_promo, params: { id: cart.id, promo_code: promotion.promo_code }
      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json['message']).to include("Promo code '#{promotion.promo_code}' applied successfully")
    end

    it 'returns error for invalid promo code' do
      post :apply_promo, params: { id: cart.id, promo_code: 'INVALID' }
      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Invalid promo code')
    end

    it 'returns error for empty cart' do
      empty_cart = create(:cart)
      post :apply_promo, params: { id: empty_cart.id, promo_code: promotion.promo_code }
      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Cannot apply a promo code to an empty cart')
    end
  end

  describe 'POST #remove_promo' do
    let(:cart) { create(:cart) }
    let(:item) { create(:item, price: 50.0) }
    let(:promotion) { create(:promotion, :with_promo_code, target_type: 'Item', target_id: item.id) }

    before do
      cart.add_item(item, quantity: 1)
      cart.apply_promo_code(promotion.promo_code)
    end

    it 'removes promo code' do
      post :remove_promo, params: { id: cart.id, promo_code: promotion.promo_code }
      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json['message']).to eq("Promo code '#{promotion.promo_code}' removed successfully")
    end

    it 'returns error for invalid promo code' do
      post :remove_promo, params: { id: cart.id, promo_code: 'INVALID' }
      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json['error']).to eq('Invalid promo code')
    end
  end
end
