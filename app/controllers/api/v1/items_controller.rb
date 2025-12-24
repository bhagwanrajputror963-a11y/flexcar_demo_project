# frozen_string_literal: true

module Api
  module V1
    class ItemsController < ApplicationController
      skip_before_action :verify_authenticity_token

      # GET /api/v1/items
      def index
        @items = FlexcarPromotions::Item.includes(:category, :brand).all
        
        render json: {
          items: @items.map { |item| serialize_item(item) }
        }
      end

      # GET /api/v1/items/:id
      def show
        @item = FlexcarPromotions::Item.find(params[:id])
        
        render json: {
          item: serialize_item(@item)
        }
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Item not found' }, status: :not_found
      end

      private

      def serialize_item(item)
        {
          id: item.id,
          name: item.name,
          price: item.price.to_f,
          sale_unit: item.sale_unit,
          category: item.category&.name,
          brand: item.brand&.name,
          created_at: item.created_at,
          updated_at: item.updated_at
        }
      end
    end
  end
end
