require 'rails_helper'

RSpec.describe Api::V1::ItemsController, type: :controller do
  describe 'GET #index' do
    it 'returns all items' do
      items = create_list(:item, 3)
      get :index
      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json['items'].size).to eq(3)
      expect(json['items'].first).to have_key('id')
      expect(json['items'].first).to have_key('name')
      expect(json['items'].first).to have_key('price')
    end

    it 'returns empty array when no items exist' do
      get :index
      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json['items']).to eq([])
    end

    it 'includes sale_unit in response' do
      item = create(:item, sale_unit: 'quantity')
      get :index
      expect(response).to be_successful
      json = JSON.parse(response.body)
      expect(json['items'].first['sale_unit']).to eq('quantity')
    end
  end
end
