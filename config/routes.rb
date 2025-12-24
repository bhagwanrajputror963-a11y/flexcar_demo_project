Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # API routes
  namespace :api do
    namespace :v1 do
      resources :items, only: [ :index, :show ]
      resources :promotions, only: [ :index, :show ]

      resources :inventory, only: [ :index, :show, :update ] do
        member do
          patch :adjust_stock
        end
      end

      resources :carts, only: [ :create, :show ] do
        member do
          post :add_item
          patch "update_item/:item_id", action: :update_item, as: :update_item
          delete "remove_item/:item_id", action: :remove_item, as: :remove_item
          delete :clear
          post :apply_promo
          delete :remove_promo
        end
      end
    end
  end

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
