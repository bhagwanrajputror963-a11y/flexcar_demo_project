# frozen_string_literal: true

module Api
  module V1
    class PromotionsController < ApplicationController
      skip_before_action :verify_authenticity_token

      # GET /api/v1/promotions
      def index
        @promotions = FlexcarPromotions::Promotion.active

        render json: {
          promotions: @promotions.map { |promotion| serialize_promotion(promotion) }
        }
      end

      # GET /api/v1/promotions/:id
      def show
        @promotion = FlexcarPromotions::Promotion.find(params[:id])

        render json: {
          promotion: serialize_promotion(@promotion)
        }
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Promotion not found" }, status: :not_found
      end

      private

      def serialize_promotion(promotion)
        {
          id: promotion.id,
          name: promotion.name,
          promotion_type: promotion.promotion_type,
          value: promotion.value&.to_f,
          target_type: promotion.target_type,
          target_id: promotion.target_id,
          target_name: promotion.target&.name,
          start_time: promotion.start_time,
          end_time: promotion.end_time,
          config: promotion.config,
          active: promotion.active?,
          created_at: promotion.created_at,
          updated_at: promotion.updated_at
        }
      end
    end
  end
end
