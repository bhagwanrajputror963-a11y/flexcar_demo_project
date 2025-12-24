# frozen_string_literal: true

module Api
  module V1
    class CartsController < ApplicationController
      skip_before_action :verify_authenticity_token
      before_action :set_cart, except: [:create]

      # POST /api/v1/carts
      def create
        @cart = FlexcarPromotions::Cart.create!

        render json: {
          cart_id: @cart.id,
          message: 'Cart created successfully'
        }, status: :created
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # GET /api/v1/carts/:id
      def show
        pricing = @cart.calculate_total

        render json: {
          cart: serialize_cart(@cart, pricing)
        }
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # POST /api/v1/carts/:id/add_item
      def add_item
        item = FlexcarPromotions::Item.find(params[:item_id])

        # Check stock availability
        if item.sold_by_quantity?
          requested_qty = params[:quantity].to_i
          available_stock = item.stock_quantity || 0

          if available_stock == 0
            render json: { error: "#{item.name} is out of stock" }, status: :unprocessable_entity
            return
          end

          # Check if item already exists in cart
          existing_cart_item = @cart.cart_items.find_by(item: item)
          existing_qty = existing_cart_item&.quantity&.to_i || 0
          total_qty = existing_qty + requested_qty

          if total_qty > available_stock
            render json: { error: "Only #{available_stock} units of #{item.name} available in stock. You already have #{existing_qty} in your cart." }, status: :unprocessable_entity
            return
          end

          @cart.add_item(item, quantity: requested_qty)
        else
          requested_weight = params[:weight].to_f
          available_stock = item.stock_quantity || 0

          if available_stock == 0
            render json: { error: "#{item.name} is out of stock" }, status: :unprocessable_entity
            return
          end

          # Check if item already exists in cart
          existing_cart_item = @cart.cart_items.find_by(item: item)
          existing_weight = existing_cart_item&.weight&.to_f || 0
          total_weight = existing_weight + requested_weight

          if total_weight > available_stock
            render json: { error: "Only #{available_stock}g of #{item.name} available in stock. You already have #{existing_weight}g in your cart." }, status: :unprocessable_entity
            return
          end

          @cart.add_item(item, weight: requested_weight)
        end

        pricing = @cart.calculate_total

        render json: {
          cart: serialize_cart(@cart, pricing),
          message: "#{item.name} added to cart"
        }
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Item not found' }, status: :not_found
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # PATCH /api/v1/carts/:id/update_item/:item_id
      def update_item
        item = FlexcarPromotions::Item.find(params[:item_id])
        cart_item = @cart.cart_items.find_by(item: item)

        unless cart_item
          render json: { error: 'Item not in cart' }, status: :not_found
          return
        end

        # Check stock availability
        if item.sold_by_quantity?
          requested_qty = params[:quantity].to_i
          available_stock = item.stock_quantity || 0

          if available_stock == 0
            render json: { error: "#{item.name} is out of stock" }, status: :unprocessable_entity
            return
          end

          if requested_qty > available_stock
            render json: { error: "Only #{available_stock} units of #{item.name} available in stock" }, status: :unprocessable_entity
            return
          end

          cart_item.update!(quantity: requested_qty, weight: nil)
        else
          requested_weight = params[:weight].to_f
          available_stock = item.stock_quantity || 0

          if available_stock == 0
            render json: { error: "#{item.name} is out of stock" }, status: :unprocessable_entity
            return
          end

          if requested_weight > available_stock
            render json: { error: "Only #{available_stock}g of #{item.name} available in stock" }, status: :unprocessable_entity
            return
          end

          cart_item.update!(weight: requested_weight, quantity: nil)
        end

        pricing = @cart.calculate_total

        render json: {
          cart: serialize_cart(@cart, pricing),
          message: "#{item.name} quantity updated"
        }
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Item not found' }, status: :not_found
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # DELETE /api/v1/carts/:id/remove_item/:item_id
      def remove_item
        item = FlexcarPromotions::Item.find(params[:item_id])
        @cart.remove_item(item)

        pricing = @cart.calculate_total

        render json: {
          cart: serialize_cart(@cart, pricing),
          message: "#{item.name} removed from cart"
        }
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Item not found' }, status: :not_found
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # DELETE /api/v1/carts/:id/clear
      def clear
        @cart.clear

        render json: {
          cart: serialize_cart(@cart, @cart.calculate_total),
          message: 'Cart cleared successfully'
        }
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # POST /api/v1/carts/:id/apply_promo
      def apply_promo
        result = @cart.apply_promo_code(params[:promo_code])

        if result[:success]
          pricing = @cart.calculate_total
          render json: {
            cart: serialize_cart(@cart, pricing),
            message: "Promo code '#{params[:promo_code]}' applied successfully"
          }
        else
          render json: { error: result[:error] }, status: :unprocessable_entity
        end
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # DELETE /api/v1/carts/:id/remove_promo
      def remove_promo
        result = @cart.remove_promo_code(params[:promo_code])

        if result[:success]
          pricing = @cart.calculate_total
          render json: {
            cart: serialize_cart(@cart, pricing),
            message: "Promo code '#{params[:promo_code]}' removed successfully"
          }
        else
          render json: { error: result[:error] }, status: :unprocessable_entity
        end
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      private

      def set_cart
        @cart = FlexcarPromotions::Cart.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Cart not found' }, status: :not_found
      end

      def serialize_cart(cart, pricing)
        {
          id: cart.id,
          items: pricing[:items].map { |item_pricing| serialize_cart_item(item_pricing) },
          subtotal: pricing[:subtotal].to_f,
          total_discount: pricing[:total_discount].to_f,
          total: pricing[:total].to_f,
          applied_promotion_ids: cart.applied_promotion_ids,
          created_at: cart.created_at,
          updated_at: cart.updated_at
        }
      end

      def serialize_cart_item(item_pricing)
        cart_item = @cart.cart_items.find_by(item_id: item_pricing[:item_id])
        unit_price = cart_item ? cart_item.item.price.to_f : 0.0

        {
          item_id: item_pricing[:item_id],
          item_name: item_pricing[:item_name],
          quantity: item_pricing[:quantity]&.to_f,
          weight: item_pricing[:weight]&.to_f,
          unit_price: unit_price,
          subtotal: item_pricing[:base_price].to_f,
          discount: item_pricing[:discount].to_f,
          total: item_pricing[:final_price].to_f,
          applied_promotion: item_pricing[:promotion] ? {
            name: item_pricing[:promotion],
            discount_amount: item_pricing[:discount].to_f
          } : nil
        }
      end
    end
  end
end
