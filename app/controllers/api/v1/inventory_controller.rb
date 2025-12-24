# frozen_string_literal: true

module Api
  module V1
    class InventoryController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_item, except: [ :index ]

      # GET /api/v1/inventory
      def index
        items = FlexcarPromotions::Item.all.order(:name)

        render json: {
          items: items.map { |item| serialize_item(item) }
        }
      end

      # GET /api/v1/inventory/:id
      def show
        render json: {
          item: serialize_item(@item)
        }
      end

      # PATCH /api/v1/inventory/:id
      def update
        if @item.update(item_params)
          render json: {
            item: serialize_item(@item),
            message: "Inventory updated successfully"
          }
        else
          render json: { error: @item.errors.full_messages.join(", ") }, status: :unprocessable_entity
        end
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # PATCH /api/v1/inventory/:id/adjust_stock
      def adjust_stock
        adjustment = params[:adjustment].to_i

        if adjustment == 0 && params[:adjustment].present?
          render json: { error: "Adjustment cannot be zero" }, status: :unprocessable_entity
          return
        end

        new_stock = (@item.stock_quantity || 0) + adjustment

        if new_stock < 0
          render json: { error: "Stock cannot be negative. Current stock: #{@item.stock_quantity || 0}" }, status: :unprocessable_entity
          return
        end

        if @item.update(stock_quantity: new_stock)
          render json: {
            item: serialize_item(@item),
            message: "Stock adjusted by #{adjustment}"
          }
        else
          render json: { error: @item.errors.full_messages.join(", ") }, status: :unprocessable_entity
        end
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      private

      def set_item
        @item = FlexcarPromotions::Item.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Item not found" }, status: :not_found
      end

      def item_params
        params.require(:item).permit(:stock_quantity)
      end

      def serialize_item(item)
        {
          id: item.id,
          name: item.name,
          price: item.price.to_f,
          sale_unit: item.sale_unit,
          stock_quantity: item.stock_quantity || 0,
          category: item.category&.name,
          brand: item.brand&.name,
          in_stock: item.in_stock?,
          created_at: item.created_at,
          updated_at: item.updated_at
        }
      end
    end
  end
end
